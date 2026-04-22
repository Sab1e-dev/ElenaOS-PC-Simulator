cmake_minimum_required(VERSION 3.10)
project(lvgl C CXX)

# 内存错误检测
# add_compile_options(-fsanitize=address)
# add_link_options(-fsanitize=address)

# 禁用枚举转换警告
if(NOT WIN32)
    add_compile_options(-Wno-enum-enum-conversion)
    add_compile_options(-Wno-error=enum-enum-conversion)
endif()
add_compile_options(-Wno-unterminated-string-initialization)

set(ASSETS_DIR "${CMAKE_CURRENT_SOURCE_DIR}/assets")
add_definitions(-DASSETS_PATH=\"${ASSETS_DIR}/\")

set(FREERTOS_PORT GCC_POSIX CACHE STRING "Port for FreeRTOS on Posix environment")

# Set the correct FreeRTOS port for your system (e.g., Posix for WSL)
set(FREERTOS_PORT GCC_POSIX CACHE STRING "Port for FreeRTOS on Posix environment")

unset(USE_FREERTOS CACHE)

option(USE_FREERTOS "Enable FreeRTOS" OFF) # Turn this on to enable FreeRTOS

if(USE_FREERTOS)
    message(STATUS "FreeRTOS is enabled")

    # FreeRTOS integration when USE_FREERTOS is enabled
    add_library(freertos_config INTERFACE)
    target_include_directories(freertos_config SYSTEM INTERFACE ${PROJECT_SOURCE_DIR}/config)
    target_compile_definitions(freertos_config INTERFACE projCOVERAGE_TEST=0)

    # Add FreeRTOS as a subdirectory
    add_subdirectory(FreeRTOS)

    # FreeRTOS-specific include directories
    include_directories(${PROJECT_SOURCE_DIR}/FreeRTOS/include)
    include_directories(${PROJECT_SOURCE_DIR}/FreeRTOS/portable/ThirdParty/GCC/Posix)
    include_directories(${PROJECT_SOURCE_DIR}/config)

    # Add FreeRTOS sources
    file(GLOB FREERTOS_SOURCES
        "${PROJECT_SOURCE_DIR}/FreeRTOS/*.c"
        "${PROJECT_SOURCE_DIR}/FreeRTOS/portable/MemMang/heap_4.c"
        "${PROJECT_SOURCE_DIR}/FreeRTOS/portable/ThirdParty/GCC/Posix/*.c"
    )
else()
    message(STATUS "FreeRTOS is disabled")
    set(FREERTOS_SOURCES "") # No FreeRTOS sources if FreeRTOS is disabled
endif()

# Main include files of the project
include_directories(${PROJECT_SOURCE_DIR}/main/inc)
include_directories(${PROJECT_SOURCE_DIR}/debugger_box)

# Define options for LVGL with default values (OFF)
option(LV_USE_DRAW_SDL "Use SDL draw unit" OFF)
option(LV_USE_LIBPNG "Use libpng to decode PNG" OFF)
option(LV_USE_LIBJPEG_TURBO "Use libjpeg turbo to decode JPEG" OFF)
option(LV_USE_FFMPEG "Use libffmpeg to display video using lv_ffmpeg" OFF)
option(LV_USE_FREETYPE "Use freetype library" OFF)

# Set C and C++ standards
set(CMAKE_C_STANDARD 99)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set the output path for the executable
set(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)
set(WORKING_DIRECTORY ${PROJECT_SOURCE_DIR})

# Find and include SDL2 library
find_package(SDL2 REQUIRED)

# Remove ARM-specific compile and linker options
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -march=native")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -march=native")

# Add compile definitions based on the selected options
add_compile_definitions($<$<BOOL:${LV_USE_DRAW_SDL}>:LV_USE_DRAW_SDL=1>)
add_compile_definitions($<$<BOOL:${LV_USE_LIBPNG}>:LV_USE_LIBPNG=1>)
add_compile_definitions($<$<BOOL:${LV_USE_LIBJPEG_TURBO}>:LV_USE_LIBJPEG_TURBO=1>)
add_compile_definitions($<$<BOOL:${LV_USE_FFMPEG}>:LV_USE_FFMPEG=1>)

# Add LVGL subdirectory
add_subdirectory(lvgl)
target_include_directories(lvgl PUBLIC ${PROJECT_SOURCE_DIR} ${SDL2_INCLUDE_DIRS} ${PROJECT_SOURCE_DIR}/lvgl/src ${PROJECT_SOURCE_DIR}/ElenaOS/third_party/jerryscript/jerry-core/include)

# Keep third-party LVGL sources untouched: provide fixed-width integer types for ThorVG via compiler forced-include.
if(TARGET lvgl_thorvg)
    if(MSVC)
        target_compile_options(lvgl_thorvg PRIVATE /FIstdint.h)
    else()
        target_compile_options(lvgl_thorvg PRIVATE -include stdint.h)
    endif()
endif()

# Create the main executable, depending on the FreeRTOS option
if(USE_FREERTOS)
    add_executable(main
        ${PROJECT_SOURCE_DIR}/main/src/main.c
        ${PROJECT_SOURCE_DIR}/debugger_box/debug_var.c
        ${PROJECT_SOURCE_DIR}/debugger_box/debug_ui.c
        ${PROJECT_SOURCE_DIR}/main/src/eos_port.c
        ${PROJECT_SOURCE_DIR}/main/src/jerry_port.c
        ${PROJECT_SOURCE_DIR}/main/src/mac_api.c
        ${PROJECT_SOURCE_DIR}/main/src/freertos_main.cpp
        ${PROJECT_SOURCE_DIR}/main/src/mouse_cursor_icon.c
        ${PROJECT_SOURCE_DIR}/main/src/FreeRTOS_Posix_Port.c
        ${FREERTOS_SOURCES} # Add only if USE_FREERTOS is enabled
    )
    # Link FreeRTOS libraries
    target_link_libraries(main freertos_config FreeRTOS)
else()
    add_executable(main
        ${PROJECT_SOURCE_DIR}/main/src/main.c
        ${PROJECT_SOURCE_DIR}/debugger_box/debug_var.c
        ${PROJECT_SOURCE_DIR}/debugger_box/debug_ui.c
        ${PROJECT_SOURCE_DIR}/main/src/eos_port.c
        ${PROJECT_SOURCE_DIR}/main/src/jerry_port.c
        ${PROJECT_SOURCE_DIR}/main/src/mac_api.c
        ${PROJECT_SOURCE_DIR}/main/src/mouse_cursor_icon.c
    )
endif()

add_subdirectory(${PROJECT_SOURCE_DIR}/ElenaOS)

# Define LVGL configuration as a simple include
target_compile_definitions(main PRIVATE LV_CONF_INCLUDE_SIMPLE)
if(MSVC)
    target_link_options(main PRIVATE "/WHOLEARCHIVE:$<TARGET_FILE:elenaos_lib>")
elseif(APPLE)
    target_link_options(main PRIVATE "-Wl,-force_load,$<TARGET_FILE:elenaos_lib>")
else()
    target_link_options(main PRIVATE
        "-Wl,--whole-archive"
        "$<TARGET_FILE:elenaos_lib>"
        "-Wl,--no-whole-archive"
    )
endif()

target_link_libraries(main
    elenaos_lib
    lvgl lvgl::examples lvgl::demos lvgl::thorvg ${SDL2_LIBRARIES} m pthread)

if(WIN32 AND MINGW)
    # Copy MinGW runtime and SDL2 DLLs next to main.exe for direct launch.
    get_filename_component(MINGW_BIN_DIR ${CMAKE_C_COMPILER} DIRECTORY)
    set(WIN_RUNTIME_DLLS
        libgcc_s_seh-1.dll
        libstdc++-6.dll
        libwinpthread-1.dll
        SDL2.dll
    )

    foreach(RUNTIME_DLL ${WIN_RUNTIME_DLLS})
        add_custom_command(TARGET main POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_if_different
            "${MINGW_BIN_DIR}/${RUNTIME_DLL}"
            "$<TARGET_FILE_DIR:main>"
        )
    endforeach()
endif()

# Only link freertos_config if the FreeRTOS directory exists
if(USE_FREERTOS)
    target_link_libraries(main freertos_config)
endif()

# Custom target to run the executable
add_custom_target(run COMMAND ${EXECUTABLE_OUTPUT_PATH}/main DEPENDS main)

# Conditionally include and link SDL2_image if LV_USE_DRAW_SDL is enabled
if(LV_USE_DRAW_SDL)
    set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake")
    find_package(SDL2_image REQUIRED)
    target_include_directories(lvgl PUBLIC ${SDL2_IMAGE_INCLUDE_DIRS})
    target_link_libraries(main ${SDL2_IMAGE_LIBRARIES})
endif()

# Conditionally include and link libpng if LV_USE_LIBPNG is enabled
if(LV_USE_LIBPNG)
    find_package(PNG REQUIRED)
    target_include_directories(lvgl PUBLIC ${PNG_INCLUDE_DIRS})
    target_link_libraries(main ${PNG_LIBRARIES})
endif()

# Conditionally include and link libjpeg-turbo if LV_USE_LIBJPEG_TURBO is enabled
if(LV_USE_LIBJPEG_TURBO)
    find_package(JPEG REQUIRED)
    target_include_directories(lvgl PUBLIC ${JPEG_INCLUDE_DIRS})
    target_link_libraries(main ${JPEG_LIBRARIES})
endif()

# Conditionally include and link FFmpeg libraries if LV_USE_FFMPEG is enabled
if(LV_USE_FFMPEG)
    target_link_libraries(main avformat avcodec avutil swscale z)
endif()

# Conditionally include and link FreeType if LV_USE_FREETYPE is enabled
if(LV_USE_FREETYPE)
    find_package(Freetype REQUIRED)
    target_include_directories(lvgl PUBLIC ${FREETYPE_INCLUDE_DIRS})
    target_link_libraries(main ${FREETYPE_LIBRARIES})
endif()

# --- Add macOS frameworks ---
if(APPLE)
    message(STATUS "Building on macOS: linking CoreAudio and AudioToolbox frameworks")
    target_link_libraries(main
        "-framework CoreAudio"
        "-framework AudioToolbox"
        "-framework IOKit"
        "-framework CoreFoundation"
    )
endif()

# Apply additional compile options if the build type is Debug
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    message(STATUS "Debug mode enabled")

    target_compile_options(lvgl PRIVATE
        -pedantic-errors
        -Wall
        -Wclobbered
        -Wdeprecated
        -Wdouble-promotion
        -Wempty-body
        -Wextra
        -Wformat-security
        -Wmaybe-uninitialized
        # -Wmissing-prototypes
        -Wpointer-arith
        -Wmultichar
        -Wno-pedantic # ignored for now, we convert functions to pointers for properties table.
        -Wreturn-type
        -Wshadow
        -Wshift-negative-value
        -Wsizeof-pointer-memaccess
        -Wtype-limits
        -Wundef
        -Wuninitialized
        -Wunreachable-code
        -Wfloat-conversion
        -Wstrict-aliasing
    )

    if(ASAN)
        message(STATUS "AddressSanitizer enabled")

        # Add AddressSanitizer flags
        set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fsanitize=address -fno-omit-frame-pointer")
        set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fsanitize=address -fno-omit-frame-pointer")
        set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -fsanitize=address")
        set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -fsanitize=address")
    else()
        message(STATUS "AddressSanitizer disabled")
    endif()
endif()
