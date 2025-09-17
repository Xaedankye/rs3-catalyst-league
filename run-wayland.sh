#!/bin/bash

# Foxlayne Wayland launcher script
# This script runs Foxlayne with proper Wayland support

echo "🦊 Starting Foxlayne with Wayland support..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the foxlayne directory"
    exit 1
fi

# Set Wayland environment variables
export ELECTRON_OZONE_PLATFORM_HINT=wayland
export ELECTRON_DISABLE_SANDBOX=1

# Check if we have a built version
if [ -f "dist-electron/Foxlayne-*.AppImage" ]; then
    echo "🚀 Running built AppImage with Wayland support..."
    chmod +x dist-electron/Foxlayne-*.AppImage
    ./dist-electron/Foxlayne-*.AppImage --enable-wayland-ime --ozone-platform=wayland
elif [ -f "dist-electron/linux-unpacked/foxlayne" ]; then
    echo "🚀 Running unpacked binary with Wayland support..."
    ./dist-electron/linux-unpacked/foxlayne --enable-wayland-ime --ozone-platform=wayland
else
    echo "🔨 No built version found, running in development mode..."
    npm run electron-dev-wayland
fi


