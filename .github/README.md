# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated building and releasing of Foxlayne.

## Workflows

### 🚀 Build and Release (`build-and-release.yml`)

**Triggers:**
- When a new tag is pushed (e.g., `v1.0.1`)
- Manual trigger via GitHub UI

**What it does:**
1. **Builds on all platforms** (Linux, Windows, macOS)
2. **Creates installers** for each platform:
   - Linux: AppImage and DEB packages
   - Windows: NSIS installer (.exe)
   - macOS: DMG disk image
3. **Automatically creates a GitHub release** with all installers
4. **Generates release notes** automatically

**Usage:**
```bash
# Create a new release
git tag v1.0.1
git push origin v1.0.1
```

### 🧪 Build Test (`build-test.yml`)

**Triggers:**
- Manual trigger only
- Choose which platform(s) to build

**What it does:**
- Tests the build process on selected platforms
- Uploads artifacts for download
- Useful for testing before creating a release

**Usage:**
1. Go to Actions tab in GitHub
2. Select "Build Test" workflow
3. Click "Run workflow"
4. Choose platform(s) to build

## Platform Support

| Platform | Runner | Installer | Status |
|----------|--------|-----------|--------|
| Linux | `ubuntu-latest` | AppImage, DEB | ✅ |
| Windows | `windows-latest` | NSIS (.exe) | ✅ |
| macOS | `macos-latest` | DMG | ✅ |

## Free Tier Benefits

Since this is a **public repository**, you get:
- ✅ **Unlimited GitHub Actions minutes**
- ✅ **Free macOS runners** (normally 10x cost)
- ✅ **Free Windows runners**
- ✅ **Free Linux runners**

## Manual Release Process

If you prefer to create releases manually:

1. **Build locally:**
   ```bash
   npm run dist        # All platforms
   npm run dist-linux  # Linux only
   npm run dist-win    # Windows only
   npm run dist-mac    # macOS only (requires macOS)
   ```

2. **Create release:**
   ```bash
   gh release create v1.0.1 \
     --title "Foxlayne v1.0.1" \
     --notes "Release notes here" \
     dist-electron/*.AppImage \
     dist-electron/*.deb \
     dist-electron/*.exe
   ```

## Troubleshooting

### Build Failures
- Check the Actions tab for detailed logs
- Ensure all dependencies are properly listed in `package.json`
- Verify Node.js version compatibility

### Missing Artifacts
- Check file paths in the workflow
- Ensure build commands complete successfully
- Verify artifact upload paths

### Release Issues
- Ensure you have push permissions to the repository
- Check that the tag format is correct (`v*`)
- Verify the release doesn't already exist

## Customization

### Adding New Platforms
1. Add the platform to the matrix in the workflow
2. Add build steps for the new platform
3. Update artifact upload paths

### Modifying Build Process
1. Edit the build commands in the workflow
2. Update artifact paths as needed
3. Test with the Build Test workflow first

### Release Notes
- Automatic release notes are generated
- You can customize the format in the workflow
- Or disable auto-generation and write manually
