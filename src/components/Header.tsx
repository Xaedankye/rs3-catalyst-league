import React, { useState } from 'react';
import { Search, User, X } from 'lucide-react';

interface HeaderProps {
  loading: boolean;
  onPlayerLookup: (playerName: string) => void;
  currentPlayer?: string | null;
  apiStatus?: 'success' | 'error' | 'fallback' | null;
}

export const Header: React.FC<HeaderProps> = ({
  loading,
  onPlayerLookup,
  currentPlayer,
  apiStatus
}) => {
  const [playerName, setPlayerName] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = playerName.trim();
    if (trimmedName && trimmedName !== currentPlayer) {
      // Only lookup if the name is different from current player and not empty
      onPlayerLookup(trimmedName);
      setPlayerName('');
      setIsSearchOpen(false);
    } else if (trimmedName === currentPlayer) {
      // If same player, just close the search
      setPlayerName('');
      setIsSearchOpen(false);
    }
  };


  const handleIconClick = () => {
    // Just open search, don't clear current player yet
    setIsSearchOpen(true);
  };

  return (
    <header className="bg-gradient-to-r from-panda-surface to-panda-card border-b border-panda-border relative">
      <img 
        src="/foxlayne_logo.svg" 
        alt="Foxlayne Logo" 
        className="absolute -top-4 left-8 w-40 h-40 z-10 object-contain"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-4">
                <div className="ml-12">
                  <h1 className="text-3xl font-bold text-panda-text">Foxlayne</h1>
                <p className="text-panda-text-muted mt-1">
                  Track your progress in the RuneScape Catalyst League
                </p>
                {currentPlayer && (
                  <div className={`mt-2 px-3 py-1.5 text-sm rounded-lg border ${
                    apiStatus === 'success' 
                      ? 'bg-panda-accent/20 text-panda-accent border-panda-accent/30'
                      : apiStatus === 'error'
                      ? 'bg-panda-error/20 text-panda-error border-panda-error/30'
                      : 'bg-panda-warning/20 text-panda-warning border-panda-warning/30'
                  }`}>
                    {apiStatus === 'success' && (
                      <>🤖 <strong>Live Data:</strong> Real completion data from RuneScape API for {currentPlayer}</>
                    )}
                    {apiStatus === 'error' && (
                      <>❌ <strong>API Error:</strong> Could not fetch data for {currentPlayer}. Using manual tracking mode.</>
                    )}
                    {apiStatus === 'fallback' && (
                      <>⚠️ <strong>Fallback Mode:</strong> Using manual tracking for {currentPlayer}. Click tasks to mark complete.</>
                    )}
                    {!apiStatus && (
                      <>📝 <strong>Manual Tracking:</strong> Click tasks to mark them complete for {currentPlayer}</>
                    )}
                  </div>
                )}
                </div>
              </div>
          
          <div className="flex items-center gap-4">
            {/* Player Search - Collapsed or Expanded */}
            {isSearchOpen ? (
              /* Expanded Search Form */
              <div className="flex items-center gap-2">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-panda-text-muted" />
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter player name"
                      className="w-48 pl-10 pr-4 py-2 bg-panda-surface border border-panda-border rounded-lg text-panda-text placeholder-panda-text-muted focus:ring-2 focus:ring-panda-accent focus:border-panda-accent transition-colors duration-200"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !playerName.trim()}
                    className="px-4 py-2 bg-panda-accent hover:bg-panda-accent-dark text-panda-bg rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Looking up...' : 'Look up'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 bg-panda-surface hover:bg-panda-border text-panda-text-muted hover:text-panda-text rounded-lg transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Collapsed Player Indicator */
              <button
                onClick={handleIconClick}
                className="flex items-center gap-2 px-3 py-2 bg-panda-surface hover:bg-panda-border text-panda-text-muted hover:text-panda-text rounded-lg transition-colors duration-200"
                title={currentPlayer ? `Current player: ${currentPlayer}. Click to search for a different player.` : 'Click to search for a player'}
              >
                <User className="h-4 w-4" />
                {currentPlayer && <span className="font-medium">{currentPlayer}</span>}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
