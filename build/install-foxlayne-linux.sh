#!/bin/bash

# Foxlayne One-Click Installer for Linux
# This script handles everything: download, install, and setup

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

# Check if we're on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    print_error "This installer is for Linux only."
    print_status "For other platforms, please visit: https://github.com/Xaedankye/rs3-catalyst-league/releases"
    exit 1
fi

# Detect package manager and architecture
if command -v apt-get &> /dev/null; then
    PACKAGE_MANAGER="apt"
    if [[ $(uname -m) == "x86_64" ]]; then
        PACKAGE_EXT="deb"
    else
        print_error "Unsupported architecture. Please download manually from GitHub releases."
        exit 1
    fi
elif command -v dnf &> /dev/null; then
    PACKAGE_MANAGER="dnf"
    PACKAGE_EXT="rpm"
elif command -v pacman &> /dev/null; then
    PACKAGE_MANAGER="pacman"
    PACKAGE_EXT="tar.xz"
else
    print_warning "Package manager not detected. Will try AppImage installation."
    PACKAGE_MANAGER="appimage"
    PACKAGE_EXT="AppImage"
fi

print_status "Detected package manager: $PACKAGE_MANAGER"

# Get the latest release URL
print_status "Fetching latest release information..."
LATEST_RELEASE=$(curl -s https://api.github.com/repos/Xaedankye/rs3-catalyst-league/releases/latest)

if [ "$PACKAGE_MANAGER" = "appimage" ]; then
    DOWNLOAD_URL=$(echo "$LATEST_RELEASE" | grep "browser_download_url.*AppImage" | cut -d '"' -f 4 | head -1)
else
    DOWNLOAD_URL=$(echo "$LATEST_RELEASE" | grep "browser_download_url.*$PACKAGE_EXT" | cut -d '"' -f 4 | head -1)
fi

VERSION=$(echo "$LATEST_RELEASE" | grep "tag_name" | cut -d '"' -f 4)

if [ -z "$DOWNLOAD_URL" ]; then
    print_error "Could not find download URL for your system. Please check your internet connection."
    exit 1
fi

print_success "Found latest version: $VERSION"

# Create temporary directory
TEMP_DIR=$(mktemp -d)
PACKAGE_FILE="$TEMP_DIR/Foxlayne.$PACKAGE_EXT"

print_status "Downloading Foxlayne $VERSION..."
curl -L -o "$PACKAGE_FILE" "$DOWNLOAD_URL"

if [ ! -f "$PACKAGE_FILE" ]; then
    print_error "Download failed. Please check your internet connection."
    exit 1
fi

print_success "Download completed!"

# Install based on package manager
case $PACKAGE_MANAGER in
    "apt")
        print_status "Installing Foxlayne using apt..."
        sudo dpkg -i "$PACKAGE_FILE" || sudo apt-get install -f
        ;;
    "dnf")
        print_status "Installing Foxlayne using dnf..."
        sudo dnf install -y "$PACKAGE_FILE"
        ;;
    "pacman")
        print_status "Installing Foxlayne using pacman..."
        sudo pacman -U --noconfirm "$PACKAGE_FILE"
        ;;
    "appimage")
        print_status "Installing Foxlayne AppImage..."
        INSTALL_DIR="$HOME/.local/bin"
        mkdir -p "$INSTALL_DIR"
        cp "$PACKAGE_FILE" "$INSTALL_DIR/foxlayne.AppImage"
        chmod +x "$INSTALL_DIR/foxlayne.AppImage"
        
        # Create desktop entry
        DESKTOP_DIR="$HOME/.local/share/applications"
        mkdir -p "$DESKTOP_DIR"
        cat > "$DESKTOP_DIR/foxlayne.desktop" << EOF
[Desktop Entry]
Name=Foxlayne
Comment=RuneScape Catalyst League Tracker
Exec=$INSTALL_DIR/foxlayne.AppImage
Icon=foxlayne
Type=Application
Categories=Game;
EOF
        
        print_status "AppImage installed to $INSTALL_DIR"
        print_warning "You may need to add $INSTALL_DIR to your PATH"
        ;;
esac

# Clean up
rm -rf "$TEMP_DIR"

print_success "Installation completed successfully!"
echo ""
echo "🎉 Foxlayne has been installed and is ready to use!"
echo ""
echo "You can now:"
if [ "$PACKAGE_MANAGER" = "appimage" ]; then
    echo "  • Run: ~/.local/bin/foxlayne.AppImage"
    echo "  • Or find it in your applications menu"
else
    echo "  • Launch Foxlayne from your applications menu"
    echo "  • Or run: foxlayne"
fi
echo ""
echo "For support, visit: https://github.com/Xaedankye/rs3-catalyst-league"
echo ""

# Ask if user wants to launch the app
read -p "Would you like to launch Foxlayne now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Launching Foxlayne..."
    if [ "$PACKAGE_MANAGER" = "appimage" ]; then
        "$HOME/.local/bin/foxlayne.AppImage" &
    else
        foxlayne &
    fi
fi

print_success "Installation complete! Enjoy tracking your Catalyst League progress! 🦊"