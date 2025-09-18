#!/bin/bash

# Foxlayne One-Click Installer for macOS
# This script handles everything: download, install, and fix Gatekeeper issues

set -e  # Exit on any error

echo "🦊 Foxlayne - RuneScape Catalyst League Tracker"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This installer is for macOS only."
    print_status "For other platforms, please visit: https://github.com/Xaedankye/rs3-catalyst-league/releases"
    exit 1
fi

# Get the latest release URL
print_status "Fetching latest release information..."
LATEST_RELEASE=$(curl -s https://api.github.com/repos/Xaedankye/rs3-catalyst-league/releases/latest)
DOWNLOAD_URL=$(echo "$LATEST_RELEASE" | grep "browser_download_url.*dmg" | cut -d '"' -f 4 | head -1)
VERSION=$(echo "$LATEST_RELEASE" | grep "tag_name" | cut -d '"' -f 4)

if [ -z "$DOWNLOAD_URL" ]; then
    print_error "Could not find download URL. Please check your internet connection."
    exit 1
fi

print_success "Found latest version: $VERSION"

# Create temporary directory
TEMP_DIR=$(mktemp -d)
DMG_FILE="$TEMP_DIR/Foxlayne.dmg"

print_status "Downloading Foxlayne $VERSION..."
curl -L -o "$DMG_FILE" "$DOWNLOAD_URL"

if [ ! -f "$DMG_FILE" ]; then
    print_error "Download failed. Please check your internet connection."
    exit 1
fi

print_success "Download completed!"

# Mount the DMG
print_status "Mounting installer..."
MOUNT_POINT=$(hdiutil attach "$DMG_FILE" | grep "Volumes" | awk '{print $3}')
APP_PATH="$MOUNT_POINT/Foxlayne.app"

if [ ! -d "$APP_PATH" ]; then
    print_error "Could not find Foxlayne.app in the installer."
    hdiutil detach "$MOUNT_POINT" 2>/dev/null || true
    exit 1
fi

# Remove existing installation if it exists
if [ -d "/Applications/Foxlayne.app" ]; then
    print_warning "Existing Foxlayne installation found. Removing..."
    rm -rf "/Applications/Foxlayne.app"
fi

# Install the app
print_status "Installing Foxlayne to Applications folder..."
cp -R "$APP_PATH" "/Applications/"

# Unmount the DMG
hdiutil detach "$MOUNT_POINT" 2>/dev/null || true

# Fix Gatekeeper issues
print_status "Fixing macOS security settings..."
xattr -d com.apple.quarantine "/Applications/Foxlayne.app" 2>/dev/null || true

# Clean up
rm -rf "$TEMP_DIR"

print_success "Installation completed successfully!"
echo ""
echo "🎉 Foxlayne has been installed and is ready to use!"
echo ""
echo "You can now:"
echo "  • Launch Foxlayne from your Applications folder"
echo "  • Or run: open /Applications/Foxlayne.app"
echo ""
echo "For support, visit: https://github.com/Xaedankye/rs3-catalyst-league"
echo ""

# Ask if user wants to launch the app
read -p "Would you like to launch Foxlayne now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Launching Foxlayne..."
    open "/Applications/Foxlayne.app"
fi

print_success "Installation complete! Enjoy tracking your Catalyst League progress! 🦊"
