#!/bin/bash

# Foxlayne One-Click Installer for Linux
# This script handles everything: download, install, and setup
#
# Usage: ./install-foxlayne-linux.sh [version]
# Example: ./install-foxlayne-linux.sh v1.0.5
# If no version is specified, it will install the latest release

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
        print_warning "Unsupported architecture for DEB. Will use AppImage instead."
        PACKAGE_MANAGER="appimage"
        PACKAGE_EXT="AppImage"
    fi
elif command -v dnf &> /dev/null; then
    print_warning "RPM packages not available. Will use AppImage instead."
    PACKAGE_MANAGER="appimage"
    PACKAGE_EXT="AppImage"
elif command -v pacman &> /dev/null; then
    print_warning "Arch packages not available. Will use AppImage instead."
    PACKAGE_MANAGER="appimage"
    PACKAGE_EXT="AppImage"
else
    print_warning "Package manager not detected. Will use AppImage installation."
    PACKAGE_MANAGER="appimage"
    PACKAGE_EXT="AppImage"
fi

print_status "Detected package manager: $PACKAGE_MANAGER"

# Handle version parameter
if [ -n "$1" ]; then
    VERSION="$1"
    print_status "Installing specific version: $VERSION"
    RELEASE_URL="https://api.github.com/repos/Xaedankye/rs3-catalyst-league/releases/tags/$VERSION"
else
    print_status "Installing latest version..."
    RELEASE_URL="https://api.github.com/repos/Xaedankye/rs3-catalyst-league/releases/latest"
fi

# Get the release information
print_status "Fetching release information..."
RELEASE_DATA=$(curl -s "$RELEASE_URL")

if [ "$PACKAGE_MANAGER" = "appimage" ]; then
    DOWNLOAD_URL=$(echo "$RELEASE_DATA" | grep "browser_download_url.*AppImage" | cut -d '"' -f 4 | head -1)
else
    DOWNLOAD_URL=$(echo "$RELEASE_DATA" | grep "browser_download_url.*$PACKAGE_EXT" | cut -d '"' -f 4 | head -1)
fi

if [ -z "$1" ]; then
    VERSION=$(echo "$RELEASE_DATA" | grep "tag_name" | cut -d '"' -f 4)
fi

PACKAGE_FILENAME=$(echo "$DOWNLOAD_URL" | sed 's/.*\///')

if [ -z "$DOWNLOAD_URL" ]; then
    print_error "Could not find download URL for your system. Please check your internet connection."
    exit 1
fi

print_success "Found version: $VERSION"
print_status "Package file: $PACKAGE_FILENAME"
print_status "Download URL: $DOWNLOAD_URL"

# Create temporary directory
TEMP_DIR=$(mktemp -d)
PACKAGE_FILE="$TEMP_DIR/$PACKAGE_FILENAME"

print_status "Downloading Foxlayne $VERSION..."
print_status "Saving to: $PACKAGE_FILE"
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
        
        # Copy and make executable
        cp "$PACKAGE_FILE" "$INSTALL_DIR/foxlayne.AppImage"
        chmod +x "$INSTALL_DIR/foxlayne.AppImage"
        
        # Verify the AppImage is executable
        if [ -x "$INSTALL_DIR/foxlayne.AppImage" ]; then
            print_success "AppImage is executable and ready to run"
        else
            print_error "Failed to make AppImage executable"
            exit 1
        fi
        
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
        print_status "Desktop entry created"
        
        # Check if ~/.local/bin is in PATH
        if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
            print_warning "~/.local/bin is not in your PATH"
            print_status "Add this to your ~/.bashrc or ~/.zshrc:"
            echo "export PATH=\"\$HOME/.local/bin:\$PATH\""
        else
            print_success "~/.local/bin is already in your PATH"
        fi
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