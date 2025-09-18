# Foxlayne - RuneScape Catalyst League Tracker

A desktop application for tracking your progress in the RuneScape Catalyst League with real-time data from the RuneScape API.

## Features

- **Real-time task completion tracking** with live updates
- **Player lookup and progress monitoring** from RuneScape API
- **Comprehensive task filtering** by tier, category, and completion status
- **League Clan Progress** with live leaderboard updates
- **Pinned user component** for easy navigation in large clans
- **Rate limiting and caching** for optimal API performance
- **Dark theme** with modern, responsive UI
- **Cross-platform desktop application** (Windows, macOS, Linux)

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Running in Development

```bash
# Install dependencies
npm install

# Run the Electron app in development mode
npm run electron-dev
```

This will start both the Vite dev server and Electron app.

### Building for Production

```bash
# Build the React app
npm run build

# Build Electron app for current platform
npm run electron-pack

# Build for specific platforms
npm run dist-mac     # macOS (DMG)
npm run dist-win     # Windows (NSIS installer)
npm run dist-linux   # Linux (AppImage and DEB)
```

## Installation

📖 **For detailed installation instructions, see our [Installation Guide](docs/installation.md)**

### Quick Start
1. **Download** the latest release for your platform
2. **Install** using the appropriate method for your OS
3. **Launch** and start tracking your progress!

### Platform Support
- **Windows**: NSIS installer (.exe)
- **macOS**: DMG disk image
- **Linux**: AppImage and DEB packages

## Usage

📖 **For complete usage instructions, see our [User Guide](docs/user-guide.md)**

### Quick Start
1. **Launch** the application
2. **Search** for your RuneScape username
3. **View** your real-time progress in the Catalyst League
4. **Filter** tasks to focus on what you need

### Key Features
- **Task Tracker**: Real-time task completion tracking with filtering
- **League Clan Progress**: Live clan leaderboard with member progress
- **Smart Navigation**: Pinned user component for large clan lists
- **Performance Optimized**: Rate limiting and intelligent caching
- **Modern UI**: Dark theme with responsive design

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Desktop**: Electron
- **Build**: Vite, electron-builder
- **Data**: RuneScape API integration

## Documentation

📚 **Complete documentation is available in the [docs/](docs/) folder:**

- **[Installation Guide](docs/installation.md)** - Detailed installation instructions
- **[User Guide](docs/user-guide.md)** - Complete usage instructions
- **[FAQ](docs/faq.md)** - Frequently asked questions
- **[Documentation Index](docs/README.md)** - Full documentation overview

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details