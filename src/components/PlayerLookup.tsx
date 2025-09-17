import React, { useState } from 'react';
import { Search, User, X } from 'lucide-react';

interface PlayerLookupProps {
  onPlayerLookup: (playerName: string) => void;
  onClearLookup?: () => void;
  loading: boolean;
  currentPlayer?: string;
}

export const PlayerLookup: React.FC<PlayerLookupProps> = ({
  onPlayerLookup,
  onClearLookup,
  loading,
  currentPlayer
}) => {
  const [playerName, setPlayerName] = useState(currentPlayer || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onPlayerLookup(playerName.trim());
    }
  };

  const handleClear = () => {
    setPlayerName('');
    if (onClearLookup) {
      onClearLookup();
    } else {
      onPlayerLookup('');
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-panda-accent" />
        <h3 className="text-lg font-semibold text-panda-text">Player Lookup</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-panda-text-muted" />
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name (e.g., Xaedankye)"
            className="input-field pl-10"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !playerName.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Looking up...' : 'Look up'}
        </button>
        
        {currentPlayer && (
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary px-4"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>
      
      {currentPlayer && (
        <div className="mt-3">
          <div className="text-sm text-panda-text-muted">
            Currently viewing: <span className="font-medium text-panda-accent">{currentPlayer}</span>
          </div>
        </div>
      )}
    </div>
  );
};
