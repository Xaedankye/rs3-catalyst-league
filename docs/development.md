# Foxlayne Development Guide

This guide is for developers who want to contribute to Foxlayne or build it from source.

## Prerequisites

- **Node.js 18+** (Vite requires Node.js 20.19+ or 22.12+ for production builds)
- **npm** or **yarn**
- **Git**

### Platform-specific requirements

#### Windows
- **Visual Studio Build Tools** (for native dependencies)
- **Python 2.7** (for node-gyp)

#### macOS
- **Xcode Command Line Tools**: `xcode-select --install`
- **Python 2.7** (for node-gyp)

#### Linux
- **Build dependencies**:
  ```bash
  # Ubuntu/Debian
  sudo apt install build-essential libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2

  # Fedora/RHEL
  sudo dnf install gcc-c++ nss-devel atk-devel libdrm libXcomposite libXdamage libXrandr mesa-libgbm libXScrnSaver alsa-lib-devel
  ```

## Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Xaedankye/rs3-catalyst-league.git
cd rs3-catalyst-league
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run in Development Mode
```bash
# Start the development server and Electron app
npm run electron-dev
```

This will:
- Start the Vite development server on `http://localhost:5173`
- Launch the Electron app in development mode
- Enable hot reloading for both React and Electron

### 4. Development Commands

```bash
# Run web version only (for browser testing)
npm run dev

# Build the React app only
npm run build

# Run Electron in development mode
npm run electron-dev

# Package Electron app for current platform
npm run electron-pack
```

## Building for Production

### Build All Platforms
```bash
npm run dist
```

### Build Specific Platforms

#### Linux
```bash
npm run dist-linux
```
Creates:
- `dist-electron/Foxlayne-1.0.0.AppImage` (universal)
- `dist-electron/foxlayne_1.0.0_amd64.deb` (Debian/Ubuntu)

#### Windows
```bash
npm run dist-win
```
Creates:
- `dist-electron/Foxlayne Setup 1.0.0.exe` (NSIS installer)

#### macOS
```bash
npm run dist-mac
```
Creates:
- `dist-electron/Foxlayne-1.0.0.dmg` (Intel)
- `dist-electron/Foxlayne-1.0.0-arm64.dmg` (Apple Silicon)

## Project Structure

```
src/
├── components/           # React components
│   ├── LeagueClanLeaderboard.tsx
│   └── ...
├── services/            # API services and business logic
│   ├── clanService.ts
│   ├── clanBackgroundService.ts
│   └── wikiService.ts
├── hooks/               # Custom React hooks
│   └── useTasks.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── App.tsx              # Main application component

electron/
└── main.cjs             # Electron main process

public/
├── foxlayne_logo.svg    # Application icon
└── foxlayne_logo.ico    # Windows icon
```

## Architecture

### Frontend (React + TypeScript)
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling and dev server

### Desktop (Electron)
- **Electron** for cross-platform desktop app
- **electron-builder** for packaging and distribution

### Data Layer
- **RuneScape API** integration for player data
- **Wiki API** integration for task data
- **Caching** with configurable TTL
- **Rate limiting** to prevent API abuse

## Key Features Implementation

### League Clan Progress
- **Real-time updates**: Background service polls every 10 minutes
- **Live grid updates**: UI updates as individual member data loads
- **Smart caching**: Different TTL for clan members (30 min) vs league progress (1 hour)
- **Rate limiting**: Sequential batch processing with delays

### Task Tracking
- **Real-time data**: Direct API integration with RuneScape
- **Filtering**: Client-side filtering by category, completion status
- **Caching**: Local storage for performance

## Development Workflow

### 1. Feature Development
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Test with npm run electron-dev

# Commit your changes
git add .
git commit -m "Add your feature"
```

### 2. Testing
```bash
# Test the web version
npm run dev

# Test the Electron app
npm run electron-dev

# Build and test production version
npm run build
npm run electron-pack
```

### 3. Code Quality
- **TypeScript**: All code should be properly typed
- **ESLint**: Follow the project's linting rules
- **Prettier**: Code formatting is enforced
- **Testing**: Add tests for new features

## API Integration

### RuneScape API
- **Player data**: `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player={username}`
- **Clan data**: `https://secure.runescape.com/m=clan-hiscores/members_lite.ws?clanName={clanName}`

### Wiki API
- **Task data**: RuneScape Wiki API for task information
- **Rate limiting**: 1-second delay between requests

### CORS Handling
- **Vite proxy**: Configured in `vite.config.ts` for development
- **Production**: Electron handles CORS automatically

## Debugging

### Development Tools
- **React DevTools**: Available in development mode
- **Electron DevTools**: Press `F12` or `Ctrl+Shift+I`
- **Console logging**: Extensive logging throughout the application

### Common Issues

#### Build Failures
- **Node.js version**: Ensure you're using Node.js 20.19+ or 22.12+
- **Native dependencies**: Run `npm rebuild` if native modules fail
- **Platform-specific**: Some builds require the target platform

#### API Issues
- **CORS errors**: Check proxy configuration in `vite.config.ts`
- **Rate limiting**: Increase delays in service files
- **Network issues**: Check internet connection and API availability

## Contributing

### Pull Request Process
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Style
- **TypeScript**: Use strict typing
- **React**: Functional components with hooks
- **CSS**: Tailwind CSS classes
- **Naming**: camelCase for variables, PascalCase for components

### Commit Messages
Use conventional commit format:
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
```

## Release Process

### Automated Releases
Releases are automatically created when tags are pushed:

```bash
# Create and push a tag
git tag v1.0.1
git push origin v1.0.1
```

### Manual Releases
If you need to create a release manually:

```bash
# Build all platforms
npm run dist

# Create release with GitHub CLI
gh release create v1.0.1 \
  --title "Foxlayne v1.0.1" \
  --notes "Release notes here" \
  dist-electron/*.AppImage \
  dist-electron/*.deb \
  dist-electron/*.exe \
  dist-electron/*.dmg
```

## Performance Considerations

### Optimization
- **Code splitting**: Dynamic imports for large components
- **Caching**: Aggressive caching for API responses
- **Rate limiting**: Prevent API abuse
- **Lazy loading**: Load data as needed

### Monitoring
- **Console logging**: Extensive logging for debugging
- **Performance metrics**: Monitor API response times
- **Error handling**: Graceful fallbacks for API failures

## Security

### Best Practices
- **No secrets**: No API keys or secrets in the codebase
- **CORS**: Proper CORS handling for web requests
- **Input validation**: Validate all user inputs
- **Error handling**: Don't expose sensitive information in errors

### Code Signing
- **Windows**: Requires code signing certificate
- **macOS**: Requires Apple Developer ID
- **Linux**: No code signing required

---

**Happy coding!** 🦊

For questions or help, create an issue on GitHub or join the discussions.
