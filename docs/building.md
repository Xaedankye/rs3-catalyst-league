# Building Foxlayne Locally

This guide will help you build Foxlayne from source on your local machine. This is useful for developers, contributors, or users who prefer to build the application themselves.

## Prerequisites

### All Platforms
- **Node.js** 18.0 or later ([Download](https://nodejs.org/))
- **npm** 8.0 or later (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Platform-Specific Requirements

#### Windows
- **Visual Studio Build Tools** or **Visual Studio Community**
- **Python** 3.7+ (for native module compilation)
- **Windows SDK** (usually included with Visual Studio)

#### macOS
- **Xcode Command Line Tools**:
  ```bash
  xcode-select --install
  ```
- **Python** 3.7+ (for native module compilation)

#### Linux (Ubuntu/Debian)
```bash
# Install build dependencies
sudo apt update
sudo apt install build-essential libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2
```

#### Linux (Fedora/RHEL)
```bash
# Install build dependencies
sudo dnf install gcc-c++ make libnss3-devel atk-devel libdrm-devel libXcomposite-devel libXdamage-devel libXrandr-devel libgbm-devel libXScrnSaver-devel alsa-lib-devel
```

## Building from Source

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/foxlayne.git
cd foxlayne
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Application

#### Development Build (Run Locally)
```bash
# Start the development server and Electron app
npm run electron-dev
```

#### Production Build (Create Installers)

**Build for Current Platform:**
```bash
npm run dist
```

**Build for Specific Platforms:**

**Windows:**
```bash
npm run dist-win
```

**macOS:**
```bash
npm run dist-mac
```

**Linux:**
```bash
npm run dist-linux
```

**Build for All Platforms:**
```bash
./build-all.sh
```

## Platform-Specific Build Instructions

### 🪟 Windows

#### Using Visual Studio Build Tools
1. **Install Visual Studio Build Tools**:
   - Download from [Microsoft](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
   - Install with "C++ build tools" workload

2. **Set up Python**:
   ```bash
   # Install Python 3.7+ and add to PATH
   # Or use chocolatey
   choco install python
   ```

3. **Build the application**:
   ```bash
   npm run dist-win
   ```

#### Using WSL (Windows Subsystem for Linux)
1. **Install WSL** with Ubuntu
2. **Follow Linux instructions** below
3. **Copy built files** back to Windows

### 🍎 macOS

#### Intel Macs
```bash
# Build for Intel Macs
npm run dist-mac
```

#### Apple Silicon Macs (M1/M2)
```bash
# Build for Apple Silicon
npm run dist-mac
# electron-builder will automatically detect and build for ARM64
```

#### Universal Binary (Intel + Apple Silicon)
```bash
# Build universal binary (requires both architectures)
npm run dist-mac
# The build process will create a universal binary
```

### 🐧 Linux

#### Ubuntu/Debian
```bash
# Install dependencies
sudo apt update
sudo apt install build-essential libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2

# Build the application
npm run dist-linux
```

#### Fedora/RHEL/CentOS
```bash
# Install dependencies
sudo dnf install gcc-c++ make libnss3-devel atk-devel libdrm-devel libXcomposite-devel libXdamage-devel libXrandr-devel libgbm-devel libXScrnSaver-devel alsa-lib-devel

# Build the application
npm run dist-linux
```

#### Arch Linux
```bash
# Install dependencies
sudo pacman -S base-devel libnss atk libdrm libxcomposite libxdamage libxrandr libgbm libxss alsa-lib

# Build the application
npm run dist-linux
```

#### Arch Linux (Detailed Instructions)
```bash
# 1. Install Node.js and npm
sudo pacman -S nodejs npm

# 2. Install build dependencies
sudo pacman -S base-devel nss atk libdrm libxcomposite libxdamage libxrandr mesa libxss alsa-lib

# 3. Clone the repository
git clone https://github.com/yourusername/foxlayne.git
cd foxlayne

# 4. Install dependencies
npm install

# 5. Run in development mode
npm run electron-dev

# 6. Build for production
npm run dist-linux
```

#### Wayland Support (Arch Linux)
If you're running on Wayland (like GNOME on Wayland), you may need additional flags:

```bash
# Run with Wayland support
npm run electron-dev-wayland

# Or use the Wayland launcher script
./run-wayland.sh

# For built AppImage with Wayland
./dist-electron/Foxlayne-*.AppImage --enable-wayland-ime --ozone-platform=wayland
```

## Build Output

After building, you'll find the installers in the `dist-electron/` directory:

### Windows
- `Foxlayne Setup 1.0.0.exe` - NSIS installer
- `win-unpacked/` - Unpacked application files

### macOS
- `Foxlayne-1.0.0.dmg` - Disk image installer
- `mac/Foxlayne.app` - Application bundle

### Linux
- `Foxlayne-1.0.0.AppImage` - Portable AppImage
- `foxlayne_1.0.0_amd64.deb` - Debian package
- `linux-unpacked/` - Unpacked application files

## Troubleshooting Build Issues

### Common Issues

#### "node-gyp" errors (Windows)
```bash
# Install Windows Build Tools
npm install --global windows-build-tools

# Or use Visual Studio Build Tools
npm config set msvs_version 2022
```

#### "Python not found" errors
```bash
# Set Python path
npm config set python /path/to/python

# Or install Python via npm
npm install --global node-gyp
```

#### "Permission denied" errors (Linux/macOS)
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### "Module not found" errors
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Electron build failures
```bash
# Clear Electron cache
rm -rf ~/.cache/electron
rm -rf ~/.cache/electron-builder

# Rebuild native modules
npm run electron-rebuild
```

### Platform-Specific Issues

#### Windows: "MSBuild not found"
1. Install Visual Studio Build Tools
2. Run from Developer Command Prompt
3. Or set environment variables:
   ```cmd
   set VCTargetsPath=C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\MSBuild\Microsoft\VC\v160
   ```

#### macOS: "Code signing" errors
```bash
# Skip code signing for local builds
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run dist-mac
```

#### Linux: "AppImage not executable"
```bash
# Make AppImage executable
chmod +x Foxlayne-*.AppImage
```

## Development Workflow

### Making Changes
1. **Edit source code** in `src/` directory
2. **Test changes** with `npm run electron-dev`
3. **Build for testing** with `npm run dist`
4. **Test the built application**

### Contributing
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## Advanced Build Options

### Custom Build Configuration
Edit `package.json` to customize build settings:

```json
{
  "build": {
    "appId": "com.foxlayne.leagues",
    "productName": "Foxlayne",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "node_modules/**/*"
    ]
  }
}
```

### Environment Variables
```bash
# Set custom build options
export NODE_ENV=production
export ELECTRON_BUILDER_CACHE=/path/to/cache
npm run dist
```

### Cross-Platform Building
```bash
# Build for multiple platforms from one machine
npm run dist-win    # Windows (requires Wine on Linux/macOS)
npm run dist-mac    # macOS (only works on macOS)
npm run dist-linux  # Linux (works on all platforms)
```

## Performance Tips

### Faster Builds
- **Use build cache**: Keep `node_modules` and `dist` folders
- **Parallel builds**: Use `--parallel` flag when available
- **Skip unnecessary steps**: Use `--skip-deps` for faster rebuilds

### Reducing Build Size
- **Exclude dev dependencies**: Only include production dependencies
- **Optimize assets**: Compress images and remove unused code
- **Tree shaking**: Remove unused code from bundles

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Release
on:
  push:
    tags: ['v*']
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run dist
      - uses: actions/upload-artifact@v3
        with:
          name: dist-${{ matrix.os }}
          path: dist-electron/
```

## Getting Help

If you encounter issues building Foxlayne:

1. **Check this guide** for common solutions
2. **Search existing issues** on GitHub
3. **Create a new issue** with:
   - Your operating system and version
   - Node.js and npm versions
   - Complete error messages
   - Steps you've already tried

---

**Happy building!** 🦊

*For more information, see the [Development Setup](development.md) guide.*
