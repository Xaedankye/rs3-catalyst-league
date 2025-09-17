import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, TaskFiltersType, SortConfig, TaskTier } from '../types';
import { wikiService } from '../services/wikiService';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]); // Unfiltered tasks for stats
  const [totalTasks, setTotalTasks] = useState<number>(1117); // Default fallback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [apiStatus, setApiStatus] = useState<'success' | 'error' | 'fallback' | null>(null);
  const [filters, setFilters] = useState<TaskFiltersType>({
    locality: '',
    region: '',
    area: '',
    tier: '',
    difficulty: '',
    skillRequirement: '',
    searchQuery: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'points',
    direction: 'desc'
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [fetchedTasks, totalCount] = await Promise.all([
        wikiService.fetchTasks(),
        wikiService.getTotalTaskCount()
      ]);
      setTasks(fetchedTasks);
      setAllTasks(fetchedTasks); // Store unfiltered tasks
      setTotalTasks(totalCount);
      setLastFetch(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTasks = useCallback(() => {
    // Clear both general and player caches for fresh data
    wikiService.clearCache();
    wikiService.clearPlayerCache();
    if (currentPlayer) {
      fetchPlayerTasks(currentPlayer);
    } else {
      fetchTasks();
    }
  }, [fetchTasks, currentPlayer]);

  const fetchPlayerTasks = useCallback(async (playerName: string) => {
    console.log(`🎯 useTasks: Starting fetchPlayerTasks for ${playerName}`);
    setLoading(true);
    setError(null);
    
    try {
      const { tasks: playerTasks, apiStatus } = await wikiService.fetchPlayerTasks(playerName);
      console.log(`📊 useTasks: Received ${playerTasks.length} tasks from wikiService`);
      console.log(`✅ useTasks: Completed tasks: ${playerTasks.filter(t => t.completed).length}`);
      console.log(`🔍 useTasks: API Status: ${apiStatus}`);
      
      setTasks(playerTasks);
      setAllTasks(playerTasks); // Store unfiltered player tasks
      setCurrentPlayer(playerName);
      setLastFetch(new Date());
      setApiStatus(apiStatus);
      
      console.log(`🔄 useTasks: State updated for ${playerName}`);
      
      // Save player to localStorage
      localStorage.setItem('catalyst-league-player', playerName);
    } catch (err) {
      console.error(`❌ useTasks: Error fetching player tasks:`, err);
      setError(err instanceof Error ? err.message : 'Failed to fetch player tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPlayerLookup = useCallback(() => {
    setCurrentPlayer(null);
    setHideCompleted(false);
    wikiService.clearPlayerCache();
    localStorage.removeItem('catalyst-league-player');
    fetchTasks();
  }, [fetchTasks]);

  // Load saved player from localStorage on mount
  useEffect(() => {
    const savedPlayer = localStorage.getItem('catalyst-league-player');
    if (savedPlayer) {
      setCurrentPlayer(savedPlayer);
      fetchPlayerTasks(savedPlayer);
    } else {
      fetchTasks();
    }
  }, []);

  // Auto-refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPlayer) {
        fetchPlayerTasks(currentPlayer);
      } else {
        fetchTasks();
      }
    }, 60 * 1000); // 1 minute

    return () => clearInterval(interval);
  }, [fetchTasks, fetchPlayerTasks, currentPlayer]);

  const getTierFromPoints = (points: number): TaskTier => {
    if (points <= 10) return 'Easy';
    if (points <= 30) return 'Medium';
    if (points <= 80) return 'Hard';
    if (points <= 200) return 'Elite';
    return 'Master';
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      // Locality filter (backward compatibility)
      if (filters.locality && task.locality !== filters.locality) {
        return false;
      }

      // Region filter
      if (filters.region && task.region !== filters.region) {
        return false;
      }

      // Area filter
      if (filters.area && task.area !== filters.area) {
        return false;
      }

      // Tier filter
      if (filters.tier) {
        const taskTier = getTierFromPoints(task.points);
        if (taskTier !== filters.tier) {
          return false;
        }
      }

      // Difficulty filter (points range)
      if (filters.difficulty) {
        const taskTier = getTierFromPoints(task.points);
        if (taskTier !== filters.difficulty) {
          return false;
        }
      }

      // Skill requirement filter
      if (filters.skillRequirement) {
        const requirements = task.requirements.toLowerCase();
        const skill = filters.skillRequirement.toLowerCase();
        if (!requirements.includes(skill)) {
          return false;
        }
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchText = `${task.task} ${task.information} ${task.requirements}`.toLowerCase();
        if (!searchText.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue, bValue;

      // Handle tier sorting specially since it's calculated from points
      if (sortConfig.column === 'tier') {
        aValue = getTierFromPoints(a.points);
        bValue = getTierFromPoints(b.points);
        
        // Custom tier sorting order: Easy -> Medium -> Hard -> Elite -> Master
        const tierOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3, 'Elite': 4, 'Master': 5 };
        const aTierOrder = tierOrder[aValue as TaskTier] || 0;
        const bTierOrder = tierOrder[bValue as TaskTier] || 0;
        
        return sortConfig.direction === 'asc' 
          ? aTierOrder - bTierOrder
          : bTierOrder - aTierOrder;
      } else {
        aValue = a[sortConfig.column];
        bValue = b[sortConfig.column];
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [tasks, filters, sortConfig]);

  // Calculate visible task count (accounts for hideCompleted logic)
  const visibleTaskCount = useMemo(() => {
    if (currentPlayer && hideCompleted) {
      return filteredAndSortedTasks.filter(task => !task.completed).length;
    }
    return filteredAndSortedTasks.length;
  }, [filteredAndSortedTasks, currentPlayer, hideCompleted]);

  const updateFilters = useCallback((newFilters: Partial<TaskFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const updateSortConfig = useCallback((column: keyof Task | 'tier') => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      locality: '',
      region: '',
      area: '',
      tier: '',
      difficulty: '',
      skillRequirement: '',
      searchQuery: ''
    });
  }, []);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      );
      
      // Save to localStorage if we have a current player
      if (currentPlayer) {
        const completedTaskIds = updatedTasks
          .filter(task => task.completed)
          .map(task => task.id);
        localStorage.setItem(`catalyst-league-${currentPlayer}`, JSON.stringify(completedTaskIds));
        console.log(`💾 Saved ${completedTaskIds.length} completed tasks for ${currentPlayer}`);
      }
      
      return updatedTasks;
    });
    
    setAllTasks(prevAllTasks => 
      prevAllTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }, [currentPlayer]);

  const getTaskStats = useMemo(() => {
    // Use allTasks for stats calculation, not the filtered tasks
    const allTasksForStats = allTasks.length > 0 ? allTasks : tasks;
    const visibleTasks = tasks.length;
    const completed = allTasksForStats.filter(task => task.completed).length;
    const totalPoints = allTasksForStats.reduce((sum, task) => sum + task.points, 0);
    const earnedPoints = allTasksForStats
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.points, 0);
    
    console.log(`📈 getTaskStats: allTasks=${allTasksForStats.length}, completed=${completed}, earnedPoints=${earnedPoints}`);

    // Calculate tier breakdown
    const getTierFromPoints = (points: number): 'Easy' | 'Medium' | 'Hard' | 'Elite' | 'Master' => {
      if (points <= 10) return 'Easy';
      if (points <= 30) return 'Medium';
      if (points <= 80) return 'Hard';
      if (points <= 200) return 'Elite';
      return 'Master';
    };

    const completedByTier = allTasksForStats
      .filter(task => task.completed)
      .reduce((acc, task) => {
        const tier = getTierFromPoints(task.points);
        acc[tier]++;
        return acc;
      }, {
        Easy: 0,
        Medium: 0,
        Hard: 0,
        Elite: 0,
        Master: 0
      });

    // Calculate region breakdown
    const completedByRegion = allTasksForStats
      .filter(task => task.completed)
      .reduce((acc, task) => {
        const region = task.region || 'Unknown';
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Get all unique regions for total counts
    const allRegions = [...new Set(allTasksForStats.map(task => task.region || 'Unknown'))];
    const totalByRegion = allRegions.reduce((acc, region) => {
      acc[region] = allTasksForStats.filter(task => (task.region || 'Unknown') === region).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalTasks, // Use the real total from wiki
      visible: visibleTasks, // Tasks currently visible (after filtering)
      completed,
      remaining: totalTasks - completed, // Real remaining count
      totalPoints,
      earnedPoints,
      remainingPoints: totalPoints - earnedPoints,
      completionPercentage: totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0,
      completedByTier,
      completedByRegion,
      totalByRegion
    };
  }, [tasks, allTasks, totalTasks]);

  return {
    tasks: filteredAndSortedTasks,
    allTasks: tasks, // This should be the unfiltered tasks
    visibleTaskCount,
    loading,
    error,
    lastFetch,
    currentPlayer,
    hideCompleted,
    filters,
    sortConfig,
    updateFilters,
    updateSortConfig,
    clearFilters,
    refreshTasks,
    fetchPlayerTasks,
    clearPlayerLookup,
    setHideCompleted,
    toggleTaskCompletion,
    getTaskStats,
    apiStatus
  };
};
