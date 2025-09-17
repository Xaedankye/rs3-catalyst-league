#!/bin/bash

# Build script for Foxlayne Electron app
# This script builds the app for all platforms

echo "🦊 Building Foxlayne for all platforms..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist-electron
rm -rf dist

# Build the React app
echo "⚛️  Building React app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ React build failed"
    exit 1
fi

# Build for Linux
echo "🐧 Building for Linux..."
npm run dist-linux

if [ $? -ne 0 ]; then
    echo "❌ Linux build failed"
    exit 1
fi

# Build for Windows (if on Linux with Wine or cross-compilation)
echo "🪟 Building for Windows..."
npm run dist-win

if [ $? -ne 0 ]; then
    echo "⚠️  Windows build failed (this is normal if not on Windows or without Wine)"
fi

# Build for macOS (if on macOS)
echo "🍎 Building for macOS..."
npm run dist-mac

if [ $? -ne 0 ]; then
    echo "⚠️  macOS build failed (this is normal if not on macOS)"
fi

echo "✅ Build process completed!"
echo "📦 Check the dist-electron folder for built packages"


