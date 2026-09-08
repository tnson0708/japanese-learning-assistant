#!/usr/bin/env python3
import os
import glob
import subprocess
import sys

capture_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../public/capture"))

if not os.path.exists(capture_dir):
    print(f"Directory not found: {capture_dir}")
    sys.exit(1)

heic_files = sorted(glob.glob(os.path.join(capture_dir, "*.HEIC")) + glob.glob(os.path.join(capture_dir, "*.heic")))

if not heic_files:
    print(f"No HEIC files found in {capture_dir}")
    sys.exit(0)

print(f"Found {len(heic_files)} HEIC files in {capture_dir}. Converting to JPG...")

converted_count = 0
for filepath in heic_files:
    filename = os.path.basename(filepath)
    base_name = os.path.splitext(filename)[0]
    out_filepath = os.path.join(capture_dir, f"{base_name}.jpg")
    
    cmd = ["sips", "-s", "format", "jpeg", filepath, "--out", out_filepath]
    result = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    
    if result.returncode == 0:
        converted_count += 1
        print(f"[{converted_count}/{len(heic_files)}] Converted {filename} -> {base_name}.jpg")
        # Optionally remove old HEIC file after conversion:
        # os.remove(filepath)
    else:
        print(f"Failed to convert {filename}: {result.stderr.decode('utf-8')}")

print(f"\nDone! Successfully converted {converted_count} files to JPG in {capture_dir}.")
