import React, { useState, useEffect } from 'react';
import { clanService } from '../services/clanService';
import { clanBackgroundService } from '../services/clanBackgroundService';
import { Users, Trophy, Star, Target, RefreshCw, TrendingUp, Award, Clock, Wifi, WifiOff } from 'lucide-react';

// Inline types to avoid import issues
interface LeagueMemberStats {
  name: string;
  rank: string;
  totalTasks: number;
  completedTasks: number;
  totalPoints: number;
  earnedPoints: number;
  completionRate: number;
  loading: boolean;
  error?: string;
}

interface LeagueClanInfo {
  name: string;
  members: LeagueMemberStats[];
  totalMembers: number;
  lastUpdated: Date;
  totalClanPoints: number;
  averageCompletionRate: number;
}

interface LeagueClanLeaderboardProps {
  currentPlayer: string | null;
}

type SortColumn = 'earnedPoints' | 'completionRate' | 'completedTasks' | 'name';
type SortDirection = 'asc' | 'desc';

export const LeagueClanLeaderboard: React.FC<LeagueClanLeaderboardProps> = ({ currentPlayer }) => {
  const clanName = currentPlayer ? clanService.getClanFromPlayer(currentPlayer) : null;
  
  // Check cache immediately on component mount
  const hasValidCache = clanName ? clanService.hasValidCachedLeagueProgress(clanName) : false;
  const initialCachedData = hasValidCache ? clanService.getCachedLeagueProgress(clanName!) : null;
  
  console.log(`🎯 LeagueClanLeaderboard render for ${clanName}, hasValidCache: ${hasValidCache}, cached: ${!!initialCachedData}`);
  
  const [clanInfo, setClanInfo] = useState<LeagueClanInfo | null>(initialCachedData);
  // Removed loading state - we always show the grid now
  const [error, setError] = useState<string | null>(null);
  const [backgroundUpdateState, setBackgroundUpdateState] = useState(clanBackgroundService.getUpdateState());
  const [sortConfig, setSortConfig] = useState<{ column: SortColumn; direction: SortDirection }>({
    column: 'earnedPoints',
    direction: 'desc',
  });
  const [isCurrentPlayerVisible, setIsCurrentPlayerVisible] = useState(true);

  const fetchClanData = async (forceRefresh: boolean = false) => {
    if (!clanName) {
      setError('No clan selected or player not associated with a clan.');
      return;
    }

    setError(null);
    
    // If we don't have cached data, initialize with loading members immediately
    if (!clanInfo || forceRefresh) {
      try {
        // First get the basic clan member list to show the grid structure
        const basicClanInfo = await clanService.fetchClanMembers(clanName);
        
        // Create initial league stats with loading state
        const initialMembers: LeagueMemberStats[] = basicClanInfo.members.map(member => ({
          name: member.name,
          rank: member.rank,
          totalTasks: 0,
          completedTasks: 0,
          totalPoints: 0,
          earnedPoints: 0,
          completionRate: 0,
          loading: true
        }));

        const initialLeagueClanInfo: LeagueClanInfo = {
          name: clanName,
          members: initialMembers,
          totalMembers: initialMembers.length,
          lastUpdated: new Date(),
          totalClanPoints: 0,
          averageCompletionRate: 0
        };

        // Show the grid immediately with loading members
        setClanInfo(initialLeagueClanInfo);
        console.log(`📊 Initialized grid with ${initialMembers.length} loading members`);
      } catch (err) {
        console.error('Failed to fetch basic clan info:', err);
        setError('Failed to fetch clan member list.');
        return;
      }
    }

    try {
      const data = await clanService.fetchClanLeagueProgress(
        clanName, 
        forceRefresh,
        (updatedData) => {
          // Live update the UI as data comes in
          console.log(`🔄 Live update: ${updatedData.members.filter(m => !m.loading).length}/${updatedData.totalMembers} members loaded`);
          setClanInfo(updatedData);
        }
      );
      setClanInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clan data.');
    }
  };

  useEffect(() => {
    if (clanName) {
      console.log(`🚀 Setting up clan leaderboard for ${clanName}`);
      
      // Start background updates for this clan
      clanBackgroundService.startUpdates(clanName);
      
      // Subscribe to background update state changes
      const unsubscribe = clanBackgroundService.subscribe((state) => {
        setBackgroundUpdateState(state);
        
        // If we have fresh data from background update, refresh our local state
        if (state.lastUpdate) {
          const freshCachedData = clanService.getCachedLeagueProgress(clanName);
          if (freshCachedData) {
            console.log(`🔄 Background update completed, refreshing UI for ${clanName}`);
            setClanInfo(freshCachedData);
          }
        }
      });
      
      // Always fetch data to ensure we have the latest information
      // If we have cached data, it will be used by the service, but we still want to refresh
      console.log(`🔄 Fetching clan data for ${clanName}...`);
      fetchClanData(false);
      
      return () => {
        unsubscribe();
        clanBackgroundService.stopUpdates();
      };
    }
  }, [clanName, initialCachedData]);

  const sortedMembers = React.useMemo(() => {
    if (!clanInfo?.members) return [];
    const sortableItems = [...clanInfo.members];
    sortableItems.sort((a, b) => {
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    return sortableItems;
  }, [clanInfo, sortConfig]);

  // Track visibility of current player's row
  useEffect(() => {
    if (!currentPlayer || !clanInfo) {
      setIsCurrentPlayerVisible(true);
      return;
    }

    const currentPlayerRow = document.querySelector(`tr[data-player="${currentPlayer}"]`);
    if (!currentPlayerRow) {
      setIsCurrentPlayerVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCurrentPlayerVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of the row is visible
        rootMargin: '0px 0px -100px 0px' // Account for any fixed headers
      }
    );

    observer.observe(currentPlayerRow);

    return () => {
      observer.disconnect();
    };
  }, [currentPlayer, clanInfo, sortedMembers]);

  const requestSort = (column: SortColumn) => {
    let direction: SortDirection = 'desc';
    if (sortConfig.column === column && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ column, direction });
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortConfig.column !== column) {
      return <span className="text-panda-text-muted">↕</span>;
    }
    return sortConfig.direction === 'asc' ? <span className="text-panda-accent">↑</span> : <span className="text-panda-accent">↓</span>;
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const getRankIcon = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'leader':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'general':
        return <Star className="h-4 w-4 text-blue-400" />;
      case 'captain':
        return <Target className="h-4 w-4 text-red-400" />;
      default:
        return <Users className="h-4 w-4 text-gray-400" />;
    }
  };

  if (!currentPlayer) {
    return (
      <div className="card p-8 text-center">
        <div className="text-panda-text-muted text-lg">Please select a player to view clan league progress.</div>
      </div>
    );
  }

  // Removed loading check - we always show the grid now

  if (error) {
    return (
      <div className="card p-8 text-center">
        <div className="text-panda-error text-lg">Error: {error}</div>
        <button
          onClick={() => fetchClanData(false)}
          className="mt-4 px-4 py-2 bg-panda-accent hover:bg-panda-accent-dark text-panda-bg rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!clanInfo || clanInfo.members.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-panda-text-muted text-lg">No clan members found for {clanName}.</div>
        <div className="text-panda-text-muted text-sm mt-2">Ensure the clan name is correct and public.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Clan Stats */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="h-8 w-8 text-panda-accent" />
            <div>
              <h2 className="text-2xl font-bold text-panda-text">
                {clanInfo.name} - League Progress
              </h2>
              <p className="text-panda-text-muted">
                {clanInfo.totalMembers} members • {formatNumber(clanInfo.totalClanPoints)} total points
                {clanInfo.members.some(m => m.loading) && (
                  <span className="ml-2 text-panda-accent">
                    • Loading: {clanInfo.members.filter(m => !m.loading).length}/{clanInfo.totalMembers} members
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchClanData(true)}
              className="flex items-center gap-2 px-4 py-2 bg-panda-accent hover:bg-panda-accent-dark text-panda-bg rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Force Refresh
            </button>
            
            {/* Background update indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-panda-surface/50 rounded-lg">
              {backgroundUpdateState.isRunning ? (
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-green-500" />
                  <RefreshCw className="h-3 w-3 text-green-500 animate-spin" />
                </div>
              ) : (
                <WifiOff className="h-4 w-4 text-panda-text-muted" />
              )}
              <span className="text-xs text-panda-text-muted">
                {backgroundUpdateState.isRunning ? 'Auto-updating' : 'Manual only'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Loading Progress Bar */}
        {clanInfo && clanInfo.members.some(m => m.loading) && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-panda-text-muted mb-2">
              <span>Loading clan members...</span>
              <span>{clanInfo.members.filter(m => !m.loading).length}/{clanInfo.totalMembers} loaded</span>
            </div>
            <div className="w-full bg-panda-border rounded-full h-2">
              <div 
                className="bg-panda-accent h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(clanInfo.members.filter(m => !m.loading).length / clanInfo.totalMembers) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Clan Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-panda-surface/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-panda-accent" />
              <span className="text-sm font-medium text-panda-text">Total Clan Points</span>
            </div>
            <div className="text-2xl font-bold text-panda-text">{formatNumber(clanInfo.totalClanPoints)}</div>
          </div>
          
          <div className="bg-panda-surface/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-panda-accent" />
              <span className="text-sm font-medium text-panda-text">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold text-panda-text">{clanInfo.averageCompletionRate.toFixed(1)}%</div>
          </div>
          
          <div className="bg-panda-surface/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-panda-accent" />
              <span className="text-sm font-medium text-panda-text">Last Updated</span>
            </div>
            <div className="text-sm text-panda-text">{clanInfo.lastUpdated.toLocaleTimeString()}</div>
            {backgroundUpdateState.nextUpdate && (
              <div className="text-xs text-panda-text-muted mt-1">
                Next update: {backgroundUpdateState.nextUpdate.toLocaleTimeString()}
              </div>
            )}
            {hasValidCache && (
              <div className="text-xs text-green-500 mt-1">
                ✓ Cached data loaded instantly
              </div>
            )}
          </div>
        </div>
      </div>

      {/* League Members Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-panda-border bg-panda-surface">
          <h3 className="text-xl font-semibold text-panda-text">League Progress Leaderboard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-panda-border">
            <thead className="bg-panda-surface">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider">
                  Rank
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider cursor-pointer hover:bg-panda-border transition-colors"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Member {getSortIcon('name')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider">
                  Clan Rank
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider cursor-pointer hover:bg-panda-border transition-colors"
                  onClick={() => requestSort('earnedPoints')}
                >
                  <div className="flex items-center gap-1">
                    League Points {getSortIcon('earnedPoints')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider cursor-pointer hover:bg-panda-border transition-colors"
                  onClick={() => requestSort('completedTasks')}
                >
                  <div className="flex items-center gap-1">
                    Tasks Done {getSortIcon('completedTasks')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider cursor-pointer hover:bg-panda-border transition-colors"
                  onClick={() => requestSort('completionRate')}
                >
                  <div className="flex items-center gap-1">
                    Progress {getSortIcon('completionRate')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-panda-card divide-y divide-panda-border">
              {sortedMembers.map((member, index) => (
                <tr 
                  key={member.name}
                  data-player={member.name}
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
                      {member.loading && (
                        <RefreshCw className="h-3 w-3 animate-spin text-panda-text-muted" />
                      )}
                      {member.error && (
                        <span className="text-xs text-panda-error" title={member.error}>⚠️</span>
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
                    {member.loading ? (
                      <span className="text-panda-text-muted">Loading...</span>
                    ) : member.error ? (
                      <span className="text-panda-error">Error</span>
                    ) : (
                      <span className="font-medium">{formatNumber(member.earnedPoints)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-panda-text">
                    {member.loading ? (
                      <span className="text-panda-text-muted">Loading...</span>
                    ) : member.error ? (
                      <span className="text-panda-error">Error</span>
                    ) : (
                      <span>{member.completedTasks} / {member.totalTasks}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-panda-text">
                    {member.loading ? (
                      <span className="text-panda-text-muted">Loading...</span>
                    ) : member.error ? (
                      <span className="text-panda-error">Error</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-panda-border rounded-full h-2">
                          <div 
                            className="bg-panda-accent h-2 rounded-full transition-all duration-300"
                            style={{ width: `${member.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-panda-text-muted w-12">
                          {member.completionRate.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pinned User Component - Shows current player's rank when not visible */}
        {currentPlayer && clanInfo && !isCurrentPlayerVisible && (() => {
          const currentPlayerMember = clanInfo.members.find(m => m.name === currentPlayer);
          const currentPlayerIndex = sortedMembers.findIndex(m => m.name === currentPlayer);
          
          if (!currentPlayerMember || currentPlayerIndex === -1) {
            return null; // Don't show if player not found in clan or not in sorted list
          }
          
          return (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 duration-300">
              <div className="bg-panda-card border border-panda-accent rounded-lg shadow-lg p-4 max-w-md backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-panda-accent rounded-full flex items-center justify-center">
                      <span className="text-panda-bg font-bold text-sm">
                        #{currentPlayerIndex + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-panda-text truncate">
                        {currentPlayer}
                      </span>
                      <span className="px-2 py-1 text-xs bg-panda-accent text-panda-bg rounded-full">
                        You
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-panda-text-muted mt-1">
                      <span>{formatNumber(currentPlayerMember.earnedPoints)} points</span>
                      <span>{currentPlayerMember.completedTasks}/{currentPlayerMember.totalTasks} tasks</span>
                      <span>{currentPlayerMember.completionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        // Scroll to the current player in the table
                        const playerRow = document.querySelector(`tr[data-player="${currentPlayer}"]`);
                        if (playerRow) {
                          playerRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="flex-shrink-0 p-1 text-panda-text-muted hover:text-panda-accent transition-colors"
                      title="Scroll to your position"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsCurrentPlayerVisible(true)} // Temporarily hide the pinned component
                      className="flex-shrink-0 p-1 text-panda-text-muted hover:text-panda-accent transition-colors"
                      title="Dismiss"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
