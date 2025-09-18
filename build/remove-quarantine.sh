#!/bin/bash

# Remove quarantine attributes from macOS builds
# This prevents "damaged and can't be opened" errors

echo "🔓 Removing quarantine attributes from macOS builds..."

# Find all .app and .dmg files in dist-electron
find dist-electron -name "*.app" -exec xattr -d com.apple.quarantine {} \; 2>/dev/null
find dist-electron -name "*.dmg" -exec xattr -d com.apple.quarantine {} \; 2>/dev/null

echo "✅ Quarantine attributes removed from macOS builds"
echo "   Users should no longer see 'damaged and can't be opened' errors"
