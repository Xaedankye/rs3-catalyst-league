#!/bin/bash

# Fix for macOS Gatekeeper blocking unsigned applications
# Run this script if you get "damaged and can't be opened" error

echo "🔧 Fixing macOS Gatekeeper issue for Foxlayne..."
echo ""

# Find the Foxlayne app
APP_PATH=""
if [ -d "/Applications/Foxlayne.app" ]; then
    APP_PATH="/Applications/Foxlayne.app"
    echo "📱 Found Foxlayne in Applications folder"
elif [ -d "Foxlayne.app" ]; then
    APP_PATH="./Foxlayne.app"
    echo "📱 Found Foxlayne in current directory"
else
    echo "❌ Foxlayne.app not found. Please make sure you've installed Foxlayne first."
    echo "   You can find it in your Downloads folder or Applications folder."
    exit 1
fi

echo "🔓 Removing quarantine attribute from Foxlayne..."
xattr -d com.apple.quarantine "$APP_PATH" 2>/dev/null || echo "   (No quarantine attribute found)"

echo "✅ Done! You should now be able to open Foxlayne."
echo ""
echo "If you still get an error:"
echo "1. Right-click on Foxlayne.app"
echo "2. Select 'Open'"
echo "3. Click 'Open' in the dialog that appears"
echo ""
echo "This is a one-time process. Future updates should work normally."