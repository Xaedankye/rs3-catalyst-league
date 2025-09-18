# Foxlayne Installation Guide

Welcome to Foxlayne, the desktop application for tracking your RuneScape Catalyst League progress! This guide will walk you through installing Foxlayne on your system.

## What's New in v1.0.0

- **League Clan Progress**: Live clan leaderboard with member progress tracking
- **Pinned User Component**: Smart navigation for large clan lists
- **Live Grid Updates**: See results as they load, no waiting for complete data
- **Background Updates**: Automatic refresh every 10 minutes
- **Rate Limiting**: Intelligent API request spacing to prevent errors
- **Smart Caching**: Optimized performance with 1-hour cache for league progress

## System Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 200MB free space
- **Internet**: Required for real-time data updates

## Installation Methods

### 📦 Pre-built Packages (Recommended)
Download ready-to-install packages for your platform below.

### 🔨 Build from Source
If you prefer to build the application yourself, see our [Building Guide](building.md) for detailed instructions.

---

### 🪟 Windows Installation

#### Method 1: Direct Download (Recommended)
1. **Download the installer**
   - Go to the [Releases page](https://github.com/yourusername/foxlayne/releases)
   - Download `Foxlayne-Setup-1.0.0.exe` (or latest version)

2. **Run the installer**
   - Double-click the downloaded `.exe` file
   - If Windows shows a security warning, click "More info" → "Run anyway"
   - Follow the installation wizard
   - Choose your preferred installation directory (default: `C:\Program Files\Foxlayne`)

3. **Launch Foxlayne**
   - The app will be added to your Start Menu
   - You can also find it on your desktop if you chose that option

#### Method 2: Portable Version
1. Download `Foxlayne-1.0.0-win.zip`
2. Extract to any folder on your computer
3. Run `Foxlayne.exe` from the extracted folder

#### Method 3: Build from Source
```bash
# Prerequisites: Node.js 18+, Git, Visual Studio Build Tools
git clone https://github.com/yourusername/foxlayne.git
cd foxlayne
npm install
npm run dist-win
```

### 🍎 macOS Installation

#### Method 1: DMG Installer (Recommended)
1. **Download the DMG**
   - Go to the [Releases page](https://github.com/yourusername/foxlayne/releases)
   - Download `Foxlayne-1.0.0.dmg`

2. **Install the application**
   - Open the downloaded DMG file
   - Drag the Foxlayne app to your Applications folder
   - Eject the DMG when done

3. **First launch**
   - Go to Applications folder and double-click Foxlayne
   - If macOS shows a security warning:
     - Go to System Preferences → Security & Privacy
     - Click "Open Anyway" next to the Foxlayne message

#### Method 2: Homebrew (For developers)
```bash
# Add the tap (when available)
brew tap yourusername/foxlayne

# Install Foxlayne
brew install --cask foxlayne
```

#### Method 3: Build from Source
```bash
# Prerequisites: Node.js 18+, Git, Xcode Command Line Tools
git clone https://github.com/yourusername/foxlayne.git
cd foxlayne
npm install
npm run dist-mac
```

### 🐧 Linux Installation

#### Method 1: AppImage (Universal)
1. **Download the AppImage**
   - Go to the [Releases page](https://github.com/yourusername/foxlayne/releases)
   - Download `Foxlayne-1.0.0.AppImage`

2. **Make it executable**
   ```bash
   chmod +x Foxlayne-1.0.0.AppImage
   ```

3. **Run the application**
   ```bash
   ./Foxlayne-1.0.0.AppImage
   ```

4. **Optional: Install system-wide**
   ```bash
   # Move to /opt for system-wide installation
   sudo mv Foxlayne-1.0.0.AppImage /opt/foxlayne.AppImage
   sudo chmod +x /opt/foxlayne.AppImage
   
   # Create desktop entry
   cat > ~/.local/share/applications/foxlayne.desktop << EOF
   [Desktop Entry]
   Name=Foxlayne
   Comment=RuneScape Catalyst League Tracker
   Exec=/opt/foxlayne.AppImage
   Icon=foxlayne
   Type=Application
   Categories=Game;
   EOF
   ```

#### Method 2: DEB Package (Debian/Ubuntu)
1. **Download the DEB package**
   - Download `foxlayne_1.0.0_amd64.deb`

2. **Install using package manager**
   ```bash
   # Using dpkg
   sudo dpkg -i foxlayne_1.0.0_amd64.deb
   
   # Or using apt
   sudo apt install ./foxlayne_1.0.0_amd64.deb
   ```

3. **Launch from applications menu**
   - Search for "Foxlayne" in your applications menu

#### Method 3: Snap Package (When available)
```bash
sudo snap install foxlayne
```

#### Method 4: Build from Source
```bash
# Prerequisites: Node.js 18+, Git, build dependencies
git clone https://github.com/yourusername/foxlayne.git
cd foxlayne
npm install
npm run dist-linux
```

## Post-Installation Setup

### First Launch
1. **Open Foxlayne** using any of the methods above
2. **Enter your RuneScape username** in the search box
3. **Wait for data to load** - this may take a few seconds
4. **Start tracking your progress!**

### Updating Foxlayne
- **Windows**: The app will check for updates automatically, or download from releases page
- **macOS**: Download the latest DMG and replace the app in Applications
- **Linux**: Download the latest AppImage/DEB and replace the old version

## Troubleshooting

### Common Issues

#### "App can't be opened because it's from an unidentified developer" (macOS)
1. Right-click the app in Applications
2. Select "Open"
3. Click "Open" in the dialog that appears

#### "Windows protected your PC" (Windows)
1. Click "More info"
2. Click "Run anyway"

#### App won't start (Linux)
1. Make sure the AppImage is executable: `chmod +x Foxlayne-*.AppImage`
2. Check if you have required libraries:
   ```bash
   # Install FUSE if missing
   sudo apt install fuse libfuse2
   ```

#### No internet connection error
1. Check your internet connection
2. Ensure RuneScape API is accessible
3. Try restarting the application

### Getting Help

If you encounter issues not covered here:

1. **Check the [Issues page](https://github.com/yourusername/foxlayne/issues)**
2. **Create a new issue** with:
   - Your operating system and version
   - Steps to reproduce the problem
   - Any error messages you see

## Uninstallation

### Windows
1. Go to Settings → Apps → Apps & features
2. Find "Foxlayne" and click "Uninstall"
3. Or use Control Panel → Programs and Features

### macOS
1. Drag Foxlayne from Applications to Trash
2. Empty Trash to complete removal

### Linux
```bash
# For AppImage
rm /opt/foxlayne.AppImage
rm ~/.local/share/applications/foxlayne.desktop

# For DEB package
sudo apt remove foxlayne

# For Snap
sudo snap remove foxlayne
```

## Security Notes

- Foxlayne only connects to official RuneScape APIs
- No personal data is stored or transmitted
- The app is open source and can be audited
- All downloads are signed and verified

---

**Need more help?** Check out our [FAQ](faq.md) or [User Guide](user-guide.md).
