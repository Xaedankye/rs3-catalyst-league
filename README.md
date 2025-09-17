# Catalyst League Task Tracker

A modern React TypeScript web application that scrapes and displays RuneScape Catalyst League tasks from the official wiki, with comprehensive filtering and sorting capabilities.

## Features

- **Live Data Sync**: Automatically fetches and updates task data from the RuneScape wiki
- **Comprehensive Filtering**: Filter tasks by:
  - Locality (Anachronia, Ardougne, Asgarnia, etc.)
  - Tier (Easy, Medium, Hard, Elite, Master)
  - Skill requirements
  - Search query across task descriptions
- **Advanced Sorting**: Sort by any column (locality, task, points, completion percentage)
- **Progress Tracking**: Visual progress bars and completion statistics
- **Auto-refresh**: Data automatically refreshes every 5 minutes
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Stats**: Track total tasks, completion percentage, and points earned

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Web Scraping**: Axios + Cheerio
- **State Management**: Custom React hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leagues
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Filtering Tasks

- **Search**: Use the search box to find tasks by name, description, or requirements
- **Locality**: Filter by specific game areas (e.g., Anachronia, Wilderness)
- **Tier**: Filter by difficulty tier (Easy, Medium, Hard, Elite, Master)
- **Skill**: Filter by required skills (e.g., Mining, Fishing, Combat)

### Sorting

Click on any column header to sort tasks by that column. Click again to reverse the sort order.

### Auto-refresh

The application automatically refreshes data every 5 minutes to stay synchronized with the wiki. You can also manually refresh using the refresh button in the header.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header with refresh controls
│   ├── StatsCard.tsx   # Statistics display cards
│   ├── TaskFilters.tsx # Filter controls
│   └── TaskTable.tsx   # Main task table
├── hooks/              # Custom React hooks
│   └── useTasks.ts     # Task data management
├── services/           # External service integrations
│   └── wikiService.ts  # Wiki scraping service
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── App.tsx             # Main application component
└── index.css           # Global styles
```

## Data Source

This application scrapes data from the official RuneScape wiki:
- **URL**: https://runescape.wiki/w/Catalyst_League/Tasks
- **Update Frequency**: Every 5 minutes (configurable)
- **Caching**: 5-minute cache to reduce server load

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Filters**: Add filter options in `src/types/index.ts` and update `TaskFilters.tsx`
2. **New Columns**: Add columns in `TaskTable.tsx` and update the `Task` interface
3. **New Stats**: Add statistics in `StatsCard.tsx` and update the stats calculation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This application is not affiliated with Jagex Ltd. or RuneScape. All game content is property of Jagex Ltd.# rs3-catalyst-league
