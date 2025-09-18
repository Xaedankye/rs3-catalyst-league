import React, { useState, useEffect } from 'react';
import { clanService } from '../services/clanService';
import { Users, Trophy, Star, Target, RefreshCw } from 'lucide-react';

// Inline types to avoid import issues
interface ClanMember {
  name: string;
  rank: string;
  experience: number;
  kills: number;
}

interface ClanInfo {
  name: string;
  members: ClanMember[];
  totalMembers: number;
  lastUpdated: Date;
}

interface ClanLeaderboardProps {
  currentPlayer: string | null;
}

export const ClanLeaderboard: React.FC<ClanLeaderboardProps> = ({ currentPlayer }) => {
  const [clanInfo, setClanInfo] = useState<ClanInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'experience' | 'kills' | 'name'>('experience');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchClanData = async () => {
    if (!currentPlayer) {
      setError('No player selected');
      return;
    }

    const clanName = clanService.getClanFromPlayer(currentPlayer);
    if (!clanName) {
      setError(`No clan found for player "${currentPlayer}". Please add clan mapping in clanService.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await clanService.fetchClanMembers(clanName);
      setClanInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clan data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPlayer) {
      fetchClanData();
    }
  }, [currentPlayer]);

  const handleSort = (column: 'experience' | 'kills' | 'name') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const sortedMembers = clanInfo?.members ? [...clanInfo.members].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'experience':
        aValue = a.experience;
        bValue = b.experience;
        break;
      case 'kills':
        aValue = a.kills;
        bValue = b.kills;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }

    return 0;
  }) : [];

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const getRankIcon = (rank: string) => {
    const rankLower = rank.toLowerCase();
    if (rankLower.includes('leader') || rankLower.includes('owner')) {
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    } else if (rankLower.includes('admin') || rankLower.includes('deputy')) {
      return <Star className="h-4 w-4 text-blue-500" />;
    } else if (rankLower.includes('general') || rankLower.includes('captain')) {
      return <Target className="h-4 w-4 text-green-500" />;
    }
    return <Users className="h-4 w-4 text-gray-500" />;
  };

  if (!currentPlayer) {
    return (
      <div className="card p-8 text-center">
        <Users className="h-12 w-12 text-panda-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-panda-text mb-2">No Player Selected</h3>
        <p className="text-panda-text-muted">Select a player to view their clan leaderboard</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <div className="text-panda-error mb-4">
          <Users className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Error Loading Clan Data</h3>
        </div>
        <p className="text-panda-text-muted mb-4">{error}</p>
        <button
          onClick={fetchClanData}
          className="px-4 py-2 bg-panda-accent hover:bg-panda-accent-dark text-panda-bg rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-panda-accent" />
            <div>
              <h2 className="text-2xl font-bold text-panda-text">
                {clanInfo?.name || 'Clan Leaderboard'}
              </h2>
              <p className="text-panda-text-muted">
                {clanInfo ? `${clanInfo.totalMembers} members` : 'Loading...'}
              </p>
            </div>
          </div>
          <button
            onClick={fetchClanData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-panda-accent hover:bg-panda-accent-dark text-panda-bg rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {clanInfo && (
          <div className="mt-4 space-y-2">
            <div className="text-sm text-panda-text-muted">
              Last updated: {clanInfo.lastUpdated.toLocaleString()}
            </div>
            <div className="text-sm text-panda-text-muted bg-panda-surface/50 p-3 rounded-lg">
              <strong>Note:</strong> This shows general RuneScape stats (total XP and kills) from the official clan API. 
              League-specific points are not available through the clan API and would need to be tracked separately.
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card p-8 text-center">
          <RefreshCw className="h-8 w-8 text-panda-accent animate-spin mx-auto mb-4" />
          <p className="text-panda-text-muted">Loading clan data...</p>
        </div>
      )}

      {/* Clan Members Table */}
      {clanInfo && !loading && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-panda-border">
              <thead className="bg-panda-surface">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider">
                    Rank
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider cursor-pointer hover:bg-panda-border transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Player
                      {sortBy === 'name' && (
                        <span className="text-panda-accent">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider">
                    Clan Rank
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider cursor-pointer hover:bg-panda-border transition-colors"
                    onClick={() => handleSort('experience')}
                  >
                    <div className="flex items-center gap-1">
                      Total XP
                      {sortBy === 'experience' && (
                        <span className="text-panda-accent">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider cursor-pointer hover:bg-panda-border transition-colors"
                    onClick={() => handleSort('kills')}
                  >
                    <div className="flex items-center gap-1">
                      Total Kills
                      {sortBy === 'kills' && (
                        <span className="text-panda-accent">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-panda-card divide-y divide-panda-border">
                {sortedMembers.map((member, index) => (
                  <tr 
                    key={member.name}
                    className={`hover:bg-panda-accent/5 transition-colors ${
                      member.name === currentPlayer ? 'bg-panda-accent/10 border-l-4 border-panda-accent' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-panda-text">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-panda-text">
                          {member.name}
                        </span>
                        {member.name === currentPlayer && (
                          <span className="px-2 py-1 text-xs bg-panda-accent text-panda-bg rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRankIcon(member.rank)}
                        <span className="text-sm text-panda-text">
                          {member.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-panda-text">
                      {formatNumber(member.experience)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-panda-text">
                      {formatNumber(member.kills)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
