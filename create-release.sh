#!/bin/bash

# Foxlayne v1.0.0 Release Script
# This script helps create a GitHub release with the latest installers

echo "🦊 Creating Foxlayne v1.0.0 Release"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the foxlayne directory"
    exit 1
fi

# Check if installers exist
if [ ! -f "dist-electron/Foxlayne-1.0.0.AppImage" ]; then
    echo "❌ AppImage not found. Run 'npm run dist' first."
    exit 1
fi

if [ ! -f "dist-electron/foxlayne_1.0.0_amd64.deb" ]; then
    echo "❌ DEB package not found. Run 'npm run dist' first."
    exit 1
fi

echo "✅ Installers found:"
echo "   - Foxlayne-1.0.0.AppImage ($(du -h dist-electron/Foxlayne-1.0.0.AppImage | cut -f1))"
echo "   - foxlayne_1.0.0_amd64.deb ($(du -h dist-electron/foxlayne_1.0.0_amd64.deb | cut -f1))"

echo ""
echo "📝 Release Information:"
echo "   - Version: 1.0.0"
echo "   - Tag: v1.0.0"
echo "   - Title: Foxlayne v1.0.0 - League Clan Progress & Live Updates"
echo ""

# Create release notes
cat > release-notes.md << 'EOF'
# 🦊 Foxlayne v1.0.0 - League Clan Progress & Live Updates

## 🎉 Major New Features

### 🏆 League Clan Progress
- **Live clan leaderboard** with real-time member progress tracking
- **Automatic clan detection** when you search for your player
- **Live grid updates** - see results as they load, no waiting for complete data
- **Background updates** every 10 minutes to keep data fresh

### 🎯 Smart Navigation
- **Pinned user component** - your rank stays visible when scrolled out of view
- **Scroll-to functionality** with smooth animations
- **Dismiss option** for the pinned component
- **Smart visibility detection** using intersection observer

### ⚡ Performance Optimizations
- **Rate limiting** - intelligent API request spacing to prevent errors
- **Smart caching** - 1-hour cache for league progress, 30-minute cache for clan members
- **Batch processing** - processes clan members in batches of 3 with 2-second delays
- **Live progress indicators** - see loading progress and completion status

## 🔧 Technical Improvements

### Electron App Fixes
- **Fixed file path resolution** for production builds
- **Configured Vite** to use relative paths for Electron compatibility
- **Resolved CSS/JS loading issues** in packaged apps
- **Improved build process** with proper asset handling

### Code Quality
- **TypeScript build fixes** - resolved all compilation errors
- **Code cleanup** - removed unused files and components
- **Better error handling** - graceful fallback when API is unavailable
- **Enhanced logging** - better debugging and monitoring

## 📦 Installation

### Linux
- **AppImage**: `Foxlayne-1.0.0.AppImage` (123 MB) - Universal Linux installer
- **DEB Package**: `foxlayne_1.0.0_amd64.deb` (83 MB) - Debian/Ubuntu package

### Usage
1. **Download** the installer for your platform
2. **Install** using the appropriate method for your OS
3. **Launch** and search for your RuneScape username
4. **Switch to "League Clan Progress"** tab to see your clan's leaderboard

## 🚀 What's New

- ✅ **Live clan progress updates** with real-time leaderboard
- ✅ **Pinned user component** for easy navigation in large clans
- ✅ **Live grid updates** - no more waiting for complete data loading
- ✅ **Background refresh** every 10 minutes
- ✅ **Rate limiting** to prevent API errors
- ✅ **Smart caching** for optimal performance
- ✅ **Fixed Electron packaging** issues
- ✅ **Improved build process** and asset handling

## 🐛 Bug Fixes

- Fixed white screen issue in Electron production builds
- Resolved CSS/JS file loading errors
- Fixed TypeScript compilation errors
- Improved file path resolution for packaged apps
- Better error handling and user feedback

## 📚 Documentation

- Updated user guide with comprehensive clan progress instructions
- Added FAQ section for clan progress troubleshooting
- Enhanced installation guide with v1.0.0 highlights
- Improved keyboard shortcuts and navigation tips

## 🔗 Links

- **GitHub Repository**: [github.com/Xaedankye/rs3-catalyst-league](https://github.com/Xaedankye/rs3-catalyst-league)
- **Documentation**: See the `docs/` folder for complete guides
- **Issues**: Report bugs or request features on GitHub

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help makes Foxlayne better for everyone.

---

**Happy tracking!** 🦊

*Built with ❤️ for the RuneScape community*
EOF

echo "📄 Release notes created: release-notes.md"
echo ""
echo "🌐 To create the release:"
echo "1. Go to: https://github.com/Xaedankye/rs3-catalyst-league/releases/new"
echo "2. Set tag version: v1.0.0"
echo "3. Set release title: Foxlayne v1.0.0 - League Clan Progress & Live Updates"
echo "4. Copy the contents of release-notes.md into the description"
echo "5. Upload these files:"
echo "   - dist-electron/Foxlayne-1.0.0.AppImage"
echo "   - dist-electron/foxlayne_1.0.0_amd64.deb"
echo "6. Check 'Set as the latest release'"
echo "7. Click 'Publish release'"
echo ""
echo "📋 Release notes preview:"
echo "=========================="
head -20 release-notes.md
echo "..."
echo "=========================="
echo ""
echo "✅ Ready to create release!"
