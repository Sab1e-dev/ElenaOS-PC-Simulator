#!/usr/bin/env python3

import os
import subprocess
import sys
import shutil
import platform

# ===================================================================
# 配置路径
# ===================================================================
CWD = os.getcwd()
GenJSONPath = os.path.join(CWD, 'lvgl', 'scripts', 'gen_json')
OutputPath = os.path.join(GenJSONPath, 'output')
LVBindingsPath = os.path.join(CWD, 'ElenixOS', 'src', 'script_engine', 'lv', 'bindings')
GenLVGLBindingPyPath = os.path.join(CWD, 'ElenixOS', 'scripts', 'gen_lvgl_binding.py')
ConfigPath = os.path.join(CWD, 'ElenixOS', 'examples', 'ElenixOS')
GenSNILVTypesPyPath = os.path.join(CWD, 'ElenixOS', 'scripts', 'sni', 'gen_sni_lv_types.py')
SNITypesPath = os.path.join(CWD, 'ElenixOS', 'src', 'script_engine', 'sni', 'sni_types.h')
SNILVTypesOutputPath = os.path.join(CWD, 'ElenixOS', 'scripts', 'sni', 'config')
SNIGenPath = os.path.join(CWD, 'ElenixOS', 'src', 'script_engine', 'sni', 'sni_gen')

# ===================================================================
# 检查并提取 Python 3.10 路径
# ===================================================================
import sys
import subprocess

def find_python(required_version="3.10"):
    """
    跨平台查找 Python 可执行文件，优先使用当前环境。
    required_version: 字符串形式，例如 "3.10"
    返回匹配的 Python 可执行路径或 None
    """
    candidates = [
        sys.executable,        # 当前 Python
        f"python{required_version}",  # python3.10
        "python3",
        "python"
    ]

    for exe in candidates:
        try:
            result = subprocess.run(
                [exe, "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )
            if result.returncode == 0:
                version_str = result.stdout.strip() or result.stderr.strip()
                if version_str.startswith("Python"):
                    ver = version_str.split()[1]
                    if ver.startswith(required_version):
                        return exe
        except FileNotFoundError:
            continue
    return None

python_exe = find_python()
if not python_exe:
    print("❌ 未找到 Python 3.10，请安装并确保已注册到 py 启动器。")
    sys.exit(1)

print(f"✅ 已检测到 Python 3.10\n使用解释器: {python_exe}")

# 创建虚拟环境
venv_path = os.path.join(CWD, ".venv")
print(f"正在创建虚拟环境到: {venv_path}")
subprocess.run([python_exe, "-m", "venv", venv_path], check=True)

# 根据平台选择虚拟环境的 Python 可执行文件
if sys.platform == "win32":
    virtual_python_exe = os.path.join(venv_path, "Scripts", "python.exe")
else:  # macOS 或 Linux
    virtual_python_exe = os.path.join(venv_path, "bin", "python3")

if not os.path.exists(virtual_python_exe):
    print("❌ 虚拟 Python 环境创建失败")
    sys.exit(1)

print(f"✅ 虚拟环境 Python 路径: {virtual_python_exe}")

# ===================================================================
# 检查 cmake 是否安装
# ===================================================================
def check_cmake():
    try:
        result = subprocess.run(["cmake", "--version"], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode == 0:
            print(f"✅ 检测到 cmake: {result.stdout.splitlines()[0]}")
        else:
            raise FileNotFoundError("cmake not found")
    except FileNotFoundError:
        print("❌ 未检测到 cmake，请先安装并确保已加入 PATH")
        sys.exit(1)

check_cmake()

# ===================================================================
# 主菜单
# ===================================================================
def show_menu():
    print("==============================")
    print("请选择要执行的流程:")
    print("1. Generate lvgl.json")
    print("2. Generate lv_bindings.c")
    print("3. Generate sni_lv_types.c")
    print("0. 退出")
    print("==============================")
    choice = input("请输入选项编号: ")
    return choice

def run_command(command, cwd=None):
    print(f"\n正在执行: {' '.join(command)}")
    if cwd:
        print(f"工作目录: {cwd}")
    try:
        subprocess.run(command, check=True, cwd=cwd)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 命令执行失败: {e}")
        return False

# ===================================================================
# Generate lvgl.json
# ===================================================================

def check_doxygen_installed():
    """
    检测系统中是否安装了 doxygen。
    返回:
        True  - 已安装
        False - 未安装
    """
    # 先用 shutil 查找可执行文件
    doxygen_path = shutil.which("doxygen")
    if doxygen_path:
        return True

    # 如果 which 没找到，尝试用 subprocess 调用 'doxygen --version'
    try:
        subprocess.run(["doxygen", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def print_doxygen_install_info():
    system = platform.system()
    print("❌ 未检测到 doxygen，请先安装并确保已加入 PATH")
    print("[Doxygen 官网] https://doxygen.nl/download.html")

    if system == "Darwin":  # macOS
        print("[MacOS] 使用 Homebrew 安装: brew install doxygen")
    elif system == "Linux":
        print("[Linux] 使用包管理器安装:")
        print(" - Ubuntu/Debian: sudo apt install doxygen graphviz")
        print(" - Fedora: sudo dnf install doxygen graphviz")
        print(" - Arch/Manjaro: sudo pacman -S doxygen graphviz")
    elif system == "Windows":
        print("[Windows] 可用方法:")
        print(" - 官方安装包: 下载 doxygen-<version>-setup.exe 并安装")
        print(" - Chocolatey: choco install doxygen")
        print(" - Scoop: scoop install doxygen")
    else:
        print("[其他系统] 请参考 Doxygen 官网安装指南")

def generate_lvgl_json():
    print("==============================")
    print("Generating lvgl.json...")
    print("==============================")

    if not os.path.exists(os.path.join(GenJSONPath, 'gen_json.py')):
        print(f"❌ JSON生成脚本不存在: {os.path.join(GenJSONPath, 'gen_json.py')}")
        sys.exit(1)

    if not os.path.exists(OutputPath):
        os.makedirs(OutputPath, exist_ok=True)

    if not run_command([virtual_python_exe, "-m", "pip", "install", "-r", os.path.join(GenJSONPath, "requirements.txt")]):
        sys.exit(1)

    if not check_doxygen_installed():
        print_doxygen_install_info()
        sys.exit(1)

    if not run_command([virtual_python_exe, os.path.join(GenJSONPath, 'gen_json.py'), "--output-path", OutputPath]):
        sys.exit(1)

    json_file = os.path.join(OutputPath, 'lvgl.json')
    if os.path.exists(json_file):
        print(f"✅ 生成的 JSON 文件位于: {json_file}")
    else:
        print("❌ 生成失败")
        sys.exit(1)

# ===================================================================
# Generate lv_bindings.c
# ===================================================================
def generate_lv_bindings_c():
    print("==============================")
    print("Generating lv_bindings.c...")
    print("==============================")

    if not os.path.exists(GenLVGLBindingPyPath):
        print(f"❌ 绑定生成脚本不存在: {GenLVGLBindingPyPath}")
        sys.exit(1)

    if not os.path.exists(os.path.join(OutputPath, "lvgl.json")):
        print(f"❌ lvgl.json 文件不存在: {os.path.join(OutputPath, 'lvgl.json')}")
        sys.exit(1)

    if not run_command([virtual_python_exe, "-m", "pip", "install", "-r", os.path.join(CWD, "ElenixOS", "scripts", "requirements.txt")]):
        sys.exit(1)
    lvgl_json_path = os.path.join(OutputPath, "lvgl.json")
    if not run_command([virtual_python_exe, GenLVGLBindingPyPath, f"--json-file={lvgl_json_path}",
                 f"--output-c-path={LVBindingsPath}", f"--cfg-path={ConfigPath}"]):
        sys.exit(1)

# ===================================================================
# Generate sni_lv_types.c
# ===================================================================
def generate_sni_lv_types():
    print("==============================")
    print("Generating sni_lv_types.c...")
    print("==============================")

    if not os.path.exists(GenSNILVTypesPyPath):
        print(f"❌ 类型生成脚本不存在: {GenSNILVTypesPyPath}")
        sys.exit(1)

    if not os.path.exists(os.path.join(OutputPath, "lvgl.json")):
        print(f"❌ lvgl.json 文件不存在: {os.path.join(OutputPath, 'lvgl.json')}")
        sys.exit(1)

    if not os.path.exists(SNITypesPath):
        print(f"❌ sni_types.h 文件不存在: {SNITypesPath}")
        sys.exit(1)

    # 创建输出目录
    if not os.path.exists(SNILVTypesOutputPath):
        os.makedirs(SNILVTypesOutputPath, exist_ok=True)

    if not os.path.exists(SNIGenPath):
        os.makedirs(SNIGenPath, exist_ok=True)

    # 构建命令参数
    lv_types_output_json = os.path.join(SNILVTypesOutputPath, "lv_types.json")
    lvgl_json = os.path.join(OutputPath, "lvgl.json")
    output_file = os.path.join(SNIGenPath, "sni_lv_types.c")

    # 执行命令
    if not run_command([virtual_python_exe, GenSNILVTypesPyPath, lv_types_output_json, lvgl_json, SNITypesPath, output_file]):
        sys.exit(1)

# ===================================================================
# 主程序
# ===================================================================
if __name__ == "__main__":
    while True:
        choice = show_menu()
        if choice == "1":
            generate_lvgl_json()
        elif choice == "2":
            generate_lv_bindings_c()
        elif choice == "3":
            generate_sni_lv_types()
        elif choice == "0":
            print("退出程序")
            sys.exit(0)
        else:
            print("❌ 无效选项，请重新输入")
