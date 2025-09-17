#!/bin/bash

# Foxlayne build script for Arch Linux
# This script sets up the environment and builds Foxlayne

echo "🐧 Building Foxlayne on Arch Linux..."

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ Don't run this script as root!"
   echo "Run: ./build-arch.sh"
   exit 1
fi

# Check if pacman is available
if ! command -v pacman &> /dev/null; then
    echo "❌ This script is for Arch Linux only!"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
sudo pacman -S --needed --noconfirm nodejs npm base-devel nss atk libdrm libxcomposite libxdamage libxrandr mesa libxss alsa-lib

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the foxlayne directory"
    exit 1
fi

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Build Electron app
echo "⚡ Building Electron app..."
npm run dist-linux

echo "✅ Build complete!"
echo "📦 Check the dist-electron folder for built packages:"
echo "   - AppImage: dist-electron/Foxlayne-*.AppImage"
echo "   - DEB package: dist-electron/foxlayne_*.deb"

echo ""
echo "🚀 To run the AppImage:"
echo "   chmod +x dist-electron/Foxlayne-*.AppImage"
echo "   ./dist-electron/Foxlayne-*.AppImage"

echo ""
echo "🦊 For Wayland support:"
echo "   ./run-wayland.sh"
echo "   # or manually:"
echo "   ./dist-electron/Foxlayne-*.AppImage --enable-wayland-ime --ozone-platform=wayland"
