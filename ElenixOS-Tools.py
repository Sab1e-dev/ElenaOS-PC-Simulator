#!/usr/bin/env python3

import os
import platform
import shutil
import subprocess
import sys

# ===================================================================
# Path configuration
# ===================================================================
CWD = os.getcwd()
GenJSONPath = os.path.join(CWD, 'lvgl', 'scripts', 'gen_json')
OutputPath = os.path.join(GenJSONPath, 'output')
GenSNILVTypesPyPath = os.path.join(CWD, 'ElenixOS', 'scripts', 'sni', 'gen_sni_lv_types.py')
SNITypesPath = os.path.join(CWD, 'ElenixOS', 'src', 'script_engine', 'sni', 'sni_types.h')
SNILVTypesOutputPath = os.path.join(CWD, 'ElenixOS', 'scripts', 'sni', 'config')
SNIGenPath = os.path.join(CWD, 'ElenixOS', 'src', 'script_engine', 'sni', 'sni_gen')

# ===================================================================
# Detect and locate Python 3.10
# ===================================================================
def find_python(required_version="3.10"):
    """
    Find a Python executable across platforms, prioritizing the current runtime.
    required_version: string format, e.g. "3.10"
    Return the matching Python executable path, or None.
    """
    candidates = [
        sys.executable,  # Current Python
        f"python{required_version}",
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
    print("ERROR: Python 3.10 was not found. Please install it and ensure it is available in PATH.")
    sys.exit(1)

print(f"OK: Python 3.10 detected\nInterpreter: {python_exe}")

# Create virtual environment
venv_path = os.path.join(CWD, ".venv")
print(f"Creating virtual environment at: {venv_path}")
subprocess.run([python_exe, "-m", "venv", venv_path], check=True)

# Choose virtual environment Python executable by platform
if sys.platform == "win32":
    virtual_python_exe = os.path.join(venv_path, "Scripts", "python.exe")
else:  # macOS or Linux
    virtual_python_exe = os.path.join(venv_path, "bin", "python3")

if not os.path.exists(virtual_python_exe):
    print("ERROR: Failed to create virtual Python environment")
    sys.exit(1)

print(f"OK: Virtual environment Python path: {virtual_python_exe}")

# ===================================================================
# Check whether cmake is installed
# ===================================================================
def check_cmake():
    try:
        result = subprocess.run(["cmake", "--version"], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode == 0:
            print(f"OK: cmake detected: {result.stdout.splitlines()[0]}")
        else:
            raise FileNotFoundError("cmake not found")
    except FileNotFoundError:
        print("ERROR: cmake was not detected. Please install it and ensure it is in PATH.")
        sys.exit(1)

check_cmake()

# ===================================================================
# Main menu
# ===================================================================
def show_menu():
    print("==============================")
    print("Select a workflow to run:")
    print("1. Generate lvgl.json")
    print("2. Generate sni_lv_types.c")
    print("0. Exit")
    print("==============================")
    choice = input("Enter option number: ")
    return choice

def run_command(command, cwd=None):
    print(f"\nRunning: {' '.join(command)}")
    if cwd:
        print(f"Working directory: {cwd}")
    try:
        subprocess.run(command, check=True, cwd=cwd)
        return True
    except subprocess.CalledProcessError as e:
        print(f"ERROR: Command failed: {e}")
        return False

# ===================================================================
# Generate lvgl.json
# ===================================================================

def check_doxygen_installed():
    """
    Check whether doxygen is installed on this system.
    Returns:
        True  - installed
        False - not installed
    """
    # First try locating the executable via shutil.
    doxygen_path = shutil.which("doxygen")
    if doxygen_path:
        return True

    # If not found, try invoking 'doxygen --version'.
    try:
        subprocess.run(["doxygen", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def print_doxygen_install_info():
    system = platform.system()
    print("ERROR: doxygen was not detected. Please install it and ensure it is in PATH.")
    print("[Doxygen official site] https://doxygen.nl/download.html")

    if system == "Darwin":  # macOS
        print("[macOS] Install with Homebrew: brew install doxygen")
    elif system == "Linux":
        print("[Linux] Install with your package manager:")
        print(" - Ubuntu/Debian: sudo apt install doxygen graphviz")
        print(" - Fedora: sudo dnf install doxygen graphviz")
        print(" - Arch/Manjaro: sudo pacman -S doxygen graphviz")
    elif system == "Windows":
        print("[Windows] Available options:")
        print(" - Official installer: download and run doxygen-<version>-setup.exe")
        print(" - Chocolatey: choco install doxygen")
        print(" - Scoop: scoop install doxygen")
    else:
        print("[Other systems] Refer to the Doxygen installation guide")

def generate_lvgl_json():
    print("==============================")
    print("Generating lvgl.json...")
    print("==============================")

    if not os.path.exists(os.path.join(GenJSONPath, 'gen_json.py')):
        print(f"ERROR: JSON generation script does not exist: {os.path.join(GenJSONPath, 'gen_json.py')}")
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
        print(f"OK: Generated JSON file: {json_file}")
    else:
        print("ERROR: Generation failed")
        sys.exit(1)

# ===================================================================
# Generate sni_lv_types.c
# ===================================================================
def generate_sni_lv_types():
    print("==============================")
    print("Generating sni_lv_types.c...")
    print("==============================")

    if not os.path.exists(GenSNILVTypesPyPath):
        print(f"ERROR: Type generation script does not exist: {GenSNILVTypesPyPath}")
        sys.exit(1)

    if not os.path.exists(os.path.join(OutputPath, "lvgl.json")):
        print(f"ERROR: lvgl.json does not exist: {os.path.join(OutputPath, 'lvgl.json')}")
        sys.exit(1)

    if not os.path.exists(SNITypesPath):
        print(f"ERROR: sni_types.h does not exist: {SNITypesPath}")
        sys.exit(1)

    # Create output directories.
    if not os.path.exists(SNILVTypesOutputPath):
        os.makedirs(SNILVTypesOutputPath, exist_ok=True)

    if not os.path.exists(SNIGenPath):
        os.makedirs(SNIGenPath, exist_ok=True)

    # Build command arguments.
    lv_types_output_json = os.path.join(SNILVTypesOutputPath, "lv_types.json")
    lvgl_json = os.path.join(OutputPath, "lvgl.json")
    output_file = os.path.join(SNIGenPath, "sni_lv_types.c")

    # Execute command.
    if not run_command([virtual_python_exe, GenSNILVTypesPyPath, lv_types_output_json, lvgl_json, SNITypesPath, output_file]):
        sys.exit(1)

# ===================================================================
# Main program
# ===================================================================
if __name__ == "__main__":
    while True:
        choice = show_menu()
        if choice == "1":
            generate_lvgl_json()
        elif choice == "2":
            generate_sni_lv_types()
        elif choice == "0":
            print("Exit program")
            sys.exit(0)
        else:
            print("ERROR: Invalid option, please try again")
