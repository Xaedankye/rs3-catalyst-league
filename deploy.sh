#!/bin/bash

# Foxlayne - Web Deployment Script
# Note: This script is for web deployment. For desktop apps, use the Electron build scripts.

echo "🚀 Building Foxlayne for web deployment..."

# Build the application
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📦 Built files are in the 'dist' directory"
    echo ""
    echo "🌐 To deploy:"
    echo "   1. Upload the contents of the 'dist' directory to your web server"
    echo "   2. Ensure your server supports client-side routing (SPA)"
    echo "   3. Configure CORS if needed for the wiki API"
    echo ""
    echo "🔧 For local preview:"
    echo "   npm run preview"
else
    echo "❌ Build failed!"
    exit 1
fi
