/**
 * @file main.c
 * @author Sab1e
 * @date 2025-09-30
 */

// Includes
#define _DEFAULT_SOURCE /* needed for usleep() */
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>
#include "lvgl/lvgl.h"
#include "lvgl/examples/lv_examples.h"
#include "lvgl/demos/lv_demos.h"
#define DEBUG_VAR_DEFS_IMPLEMENTATION
#include "debug_var_defs.h"
#include "debug_ui.h"
#if LV_USE_OS == LV_OS_ELENAOS
#include "elenix_os.h"
#include "eos_img.h"
#endif

// Macros and Definitions
#define DEBUG_PANEL_ENABLE 0

#define SIMULATOR_CONTAINER_WIDTH 500
#define SIMULATOR_CONTAINER_HEIGHT 520
#define DEBUGGER_WIDTH 420
#define DEBUGGER_HEIGHT SIMULATOR_CONTAINER_HEIGHT
#if DEBUG_PANEL_ENABLE
#define WINDOW_WIDTH SIMULATOR_CONTAINER_WIDTH + DEBUGGER_WIDTH
#else
#define WINDOW_WIDTH SIMULATOR_CONTAINER_WIDTH
#endif
#define WINDOW_HEIGHT SIMULATOR_CONTAINER_HEIGHT
#define LV_USE_MOUSE_CURSOR_IMAGE 0

#define _RIGHT_FRAME_X 470

#define CROWN_SRC "A:" ASSETS_PATH "SimulatorCrown.png"
#define CROWN_POS_X _RIGHT_FRAME_X - 3
#define CROWN_POS_Y 130
#define CROWN_WIDTH 25
#define CROWN_HEIGHT 65

#define SIDE_BUTTON_SRC "A:" ASSETS_PATH "SimulatorSideButton.png"
#define SIDE_BUTTON_POS_X _RIGHT_FRAME_X
#define SIDE_BUTTON_POS_Y 290
#define SIDE_BUTTON_WIDTH 13
#define SIDE_BUTTON_HEIGHT 99

#ifndef ASSETS_PATH
#define ASSETS_PATH "/"
#endif

// Variables
lv_obj_t *brightness_mask = NULL;

#if DEBUG_PANEL_ENABLE
static void _debug_ui_refresh_timer_cb(lv_timer_t *timer)
{
  (void)timer;
  debug_ui_refresh();
}
#endif

// Function Implementations
static lv_display_t *hal_init(int32_t w, int32_t h);

extern void freertos_main(void);

#ifdef _WIN32
#define main SDL_main
#endif

int main(int argc, char **argv)
{
  (void)argc; /*Unused*/
  (void)argv; /*Unused*/

  /*Initialize LVGL*/
  lv_init();
  lv_lodepng_init();
#if DEBUG_PANEL_ENABLE
  debug_var_defs_init();
#endif

  /*Initialize the HAL (display, input devices, tick) for LVGL*/
  hal_init(WINDOW_WIDTH, WINDOW_HEIGHT);

  eos_logo_play(false);
  eos_sensor_register(EOS_SENSOR_TYPE_ACCE);
  eos_sensor_register(EOS_SENSOR_TYPE_BAT);
  eos_run();
  while (1)
  {
    uint32_t d = lv_timer_handler();
    usleep(d * 1000);
  }
  return 0;
}

static void _crown_clicked_cb(lv_event_t *e)
{
  eos_crown_button_report(EOS_BUTTON_STATE_CLICKED);
}

static void _side_button_clicked_cb(lv_event_t *e)
{
  eos_side_button_report(EOS_BUTTON_STATE_CLICKED);
}

typedef struct
{
  int16_t diff;
  lv_indev_state_t state;
} lv_sdl_mousewheel_t;

static void _mouse_wheel_read_cb(lv_indev_t *indev, lv_indev_data_t *data)
{
  lv_sdl_mousewheel_t *dsc = lv_indev_get_driver_data(indev);

  eos_crown_encoder_report(dsc->diff);
  if (dsc->state == LV_INDEV_STATE_PRESSED)
    eos_crown_button_report(EOS_BUTTON_STATE_CLICKED);
  dsc->diff = 0;
}

/**
 * Initialize the Hardware Abstraction Layer (HAL) for the LVGL graphics
 * library
 */
static lv_display_t *hal_init(int32_t w, int32_t h)
{
  lv_group_set_default(lv_group_create());

  lv_display_t *disp = lv_sdl_window_create(w, h);
  lv_sdl_window_set_resizeable(disp, false);
  lv_sdl_window_set_title(disp, "ElenixOS PC Simulator");

  lv_indev_t *mouse = lv_sdl_mouse_create();
  lv_indev_set_group(mouse, lv_group_get_default());
  lv_indev_set_display(mouse, disp);
  lv_display_set_default(disp);

#if LV_USE_MOUSE_CURSOR_IMAGE
  LV_IMAGE_DECLARE(mouse_cursor_icon); /*Declare the image file.*/
  lv_obj_t *cursor_obj;
  cursor_obj = lv_image_create(lv_screen_active()); /*Create an image object for the cursor */
  lv_image_set_src(cursor_obj, &mouse_cursor_icon); /*Set the image source*/
  lv_indev_set_cursor(mouse, cursor_obj);           /*Connect the image  object to the driver*/
#endif

  lv_indev_t *mousewheel = lv_sdl_mousewheel_create();
  // lv_indev_set_display(mousewheel, disp);
  // lv_indev_set_group(mousewheel, lv_group_get_default());
  lv_indev_set_read_cb(mousewheel, _mouse_wheel_read_cb);

  lv_indev_t *kb = lv_sdl_keyboard_create();
  lv_indev_set_display(kb, disp);
  lv_indev_set_group(kb, lv_group_get_default());

  lv_obj_t *scr = lv_screen_active();
  lv_obj_t *simulator_container = lv_obj_create(scr);
  lv_obj_remove_style_all(simulator_container);
  lv_obj_set_size(simulator_container, SIMULATOR_CONTAINER_WIDTH, SIMULATOR_CONTAINER_HEIGHT);
  lv_obj_remove_flag(simulator_container, LV_OBJ_FLAG_SCROLLABLE);

  const uint8_t layer1 = 1;

  // 内层显示器
  disp = eos_virtual_display_create(simulator_container, EOS_DISPLAY_WIDTH, EOS_DISPLAY_HEIGHT);
  LV_ASSERT(disp != NULL);
  lv_display_set_default(disp);
#if LV_USE_PERF_MONITOR
  lv_sysmon_hide_performance(disp);
  lv_sysmon_hide_memory(disp);
#endif /* LV_USE_PERF_MONITOR */

  lv_obj_t *mask = lv_image_create(simulator_container);
  printf("Assets: %s\n", ASSETS_PATH);
  lv_image_set_src(mask, "A:" ASSETS_PATH "SimulatorMask.png");
  lv_obj_center(mask);
  lv_obj_remove_flag(mask, LV_OBJ_FLAG_CLICKABLE);
  lv_obj_move_to_index(mask, layer1);

  brightness_mask = lv_obj_create(lv_layer_top());
  lv_obj_set_size(brightness_mask, EOS_DISPLAY_WIDTH, EOS_DISPLAY_HEIGHT);
  lv_obj_set_style_bg_color(brightness_mask, lv_color_black(), 0);
  lv_obj_set_style_border_width(brightness_mask, 0, 0);
  lv_obj_set_style_opa(brightness_mask, LV_OPA_TRANSP, 0);
  lv_obj_remove_flag(brightness_mask, LV_OBJ_FLAG_CLICKABLE);
  lv_obj_move_foreground(brightness_mask);
  lv_obj_center(brightness_mask);

  lv_obj_t *crown = lv_imagebutton_create(simulator_container);
  lv_obj_set_pos(crown, CROWN_POS_X, CROWN_POS_Y);
  lv_imagebutton_set_src(crown, LV_IMAGEBUTTON_STATE_RELEASED, CROWN_SRC, CROWN_SRC, CROWN_SRC);
  lv_obj_set_size(crown, CROWN_WIDTH, CROWN_HEIGHT);

  static lv_style_t style_pressed;
  lv_style_init(&style_pressed);
  lv_style_set_image_recolor_opa(&style_pressed, LV_OPA_20);
  lv_style_set_image_recolor(&style_pressed, lv_color_white());
  static lv_style_transition_dsc_t tr;
  static lv_style_prop_t props[] = {LV_STYLE_IMAGE_RECOLOR_OPA, 0};
  lv_style_transition_dsc_init(&tr, props, lv_anim_path_linear, 100, 0, NULL);
  lv_style_set_transition(&style_pressed, &tr);
  lv_obj_add_event_cb(crown, _crown_clicked_cb, LV_EVENT_CLICKED, NULL);

  lv_obj_add_style(crown, &style_pressed, LV_STATE_PRESSED);

  lv_obj_t *side_btn = lv_imagebutton_create(simulator_container);
  lv_obj_set_pos(side_btn, SIDE_BUTTON_POS_X, SIDE_BUTTON_POS_Y);
  lv_obj_set_size(side_btn, SIDE_BUTTON_WIDTH, SIDE_BUTTON_HEIGHT);
  lv_imagebutton_set_src(side_btn, LV_IMAGEBUTTON_STATE_RELEASED, SIDE_BUTTON_SRC, SIDE_BUTTON_SRC, SIDE_BUTTON_SRC);
  lv_obj_add_style(side_btn, &style_pressed, LV_STATE_PRESSED);
  lv_obj_add_event_cb(side_btn, _side_button_clicked_cb, LV_EVENT_CLICKED, NULL);

#if DEBUG_PANEL_ENABLE
  lv_obj_t *debugger_container = lv_obj_create(scr);
  lv_obj_remove_style_all(debugger_container);
  lv_obj_set_pos(debugger_container, SIMULATOR_CONTAINER_WIDTH, 0);
  lv_obj_set_size(debugger_container, DEBUGGER_WIDTH, DEBUGGER_HEIGHT);
  lv_obj_remove_flag(debugger_container, LV_OBJ_FLAG_SCROLLABLE);
  lv_obj_set_style_bg_color(debugger_container, lv_color_white(), 0);
  lv_obj_set_style_bg_opa(debugger_container, LV_OPA_COVER, 0);

  lv_obj_t *debugger_box = lv_obj_create(debugger_container);
  lv_obj_remove_style_all(debugger_box);
  lv_obj_center(debugger_box);
  lv_obj_set_style_bg_color(debugger_box, lv_color_hex(0xf7f7f7), 0);
  lv_obj_set_style_bg_opa(debugger_box, LV_OPA_COVER, 0);
  lv_obj_set_size(debugger_box, DEBUGGER_WIDTH - 20, DEBUGGER_HEIGHT - 20);
  lv_obj_set_style_radius(debugger_box, 50, 0);
  lv_obj_add_flag(debugger_box, LV_OBJ_FLAG_SCROLLABLE);
  lv_obj_set_scroll_dir(debugger_box, LV_DIR_VER);

  debug_ui_create(debugger_box);
  lv_timer_create(_debug_ui_refresh_timer_cb, 100, NULL);
#endif

  return disp;
}
