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

class ClanService {
  // Separate caches for different data types
  private clanMemberCache = new Map<string, { data: ClanInfo; timestamp: number }>();
  private leagueProgressCache = new Map<string, { data: LeagueClanInfo; timestamp: number }>();
  
  // Different cache durations
  private readonly CLAN_MEMBER_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes (clan members don't change often)
  private readonly LEAGUE_PROGRESS_CACHE_DURATION = 60 * 60 * 1000; // 1 hour (increased to reduce API calls)

  /**
   * Fetch clan members from the official RuneScape API
   * @param clanName - The name of the clan to fetch
   * @returns Promise<ClanInfo>
   */
  async fetchClanMembers(clanName: string): Promise<ClanInfo> {
    // Check cache first
    const cached = this.clanMemberCache.get(clanName);
    if (cached && Date.now() - cached.timestamp < this.CLAN_MEMBER_CACHE_DURATION) {
      console.log(`📦 Using cached clan members for ${clanName}`);
      return cached.data;
    }

    try {
      // Use direct URL in Electron, proxy URL in development
      const clanUrl = window.location.protocol === 'file:' 
        ? `https://secure.runescape.com/m=clan-hiscores/members_lite.ws?clanName=${encodeURIComponent(clanName)}`
        : `/api/clan/members_lite.ws?clanName=${encodeURIComponent(clanName)}`;
      
      const response = await fetch(clanUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch clan data: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      const members = this.parseClanCSV(csvText);

      const clanInfo: ClanInfo = {
        name: clanName,
        members,
        totalMembers: members.length,
        lastUpdated: new Date()
      };

      // Cache the result
      this.clanMemberCache.set(clanName, {
        data: clanInfo,
        timestamp: Date.now()
      });

      return clanInfo;
    } catch (error) {
      console.error('Error fetching clan members:', error);
      throw new Error(`Failed to fetch clan members for "${clanName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse the CSV response from the RuneScape API
   * @param csvText - The CSV text from the API
   * @returns Array of ClanMember objects
   */
  private parseClanCSV(csvText: string): ClanMember[] {
    const lines = csvText.trim().split('\n');
    const members: ClanMember[] = [];

    for (const line of lines) {
      if (line.trim()) {
        const [name, rank, experience, kills] = line.split(',');
        if (name && rank && experience && kills) {
          members.push({
            name: name.trim(),
            rank: rank.trim(),
            experience: parseInt(experience.trim(), 10) || 0,
            kills: parseInt(kills.trim(), 10) || 0
          });
        }
      }
    }

    return members;
  }

  /**
   * Get clan name from a player (this would need to be implemented based on available data)
   * For now, we'll use a simple mapping or allow manual input
   */
  getClanFromPlayer(playerName: string): string | null {
    // This is a placeholder - in a real implementation, you might:
    // 1. Have a database of player->clan mappings
    // 2. Use a reverse lookup API
    // 3. Allow manual configuration
    
    // For now, let's use a simple mapping for known players
    const playerClanMap: Record<string, string> = {
      'Xaedankye': 'Iron Haze',
      // Add more mappings as needed
    };

    return playerClanMap[playerName] || null;
  }

  /**
   * Fetch league progress for all clan members with live updates
   * @param clanName - The name of the clan to fetch
   * @param forceRefresh - Whether to bypass cache and force a fresh fetch
   * @param onProgress - Callback function called as each member's data is fetched
   * @returns Promise<LeagueClanInfo>
   */
  async fetchClanLeagueProgress(
    clanName: string, 
    forceRefresh: boolean = false,
    onProgress?: (updatedData: LeagueClanInfo) => void
  ): Promise<LeagueClanInfo> {
    console.log(`🏆 Fetching league progress for clan: ${clanName}`);
    
    // Check league progress cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = this.leagueProgressCache.get(clanName);
      if (cached && Date.now() - cached.timestamp < this.LEAGUE_PROGRESS_CACHE_DURATION) {
        console.log(`📦 Using cached league progress for ${clanName}`);
        return cached.data;
      }
    }
    
    // First get the basic clan member list (this will use its own cache)
    const clanInfo = await this.fetchClanMembers(clanName);
    
    // Create initial league stats with loading state
    const leagueMembers: LeagueMemberStats[] = clanInfo.members.map(member => ({
      name: member.name,
      rank: member.rank,
      totalTasks: 0,
      completedTasks: 0,
      totalPoints: 0,
      earnedPoints: 0,
      completionRate: 0,
      loading: true
    }));

    // Fetch league data for each member with proper rate limiting
    const batchSize = 3; // Reduced batch size to avoid rate limits
    const batches = [];
    for (let i = 0; i < leagueMembers.length; i += batchSize) {
      batches.push(leagueMembers.slice(i, i + batchSize));
    }

    console.log(`🔄 Processing ${leagueMembers.length} members in ${batches.length} batches of ${batchSize}`);

    // Process batches sequentially to avoid rate limits
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`📦 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} members)`);
      
      const memberPromises = batch.map(async (member) => {
        try {
          console.log(`📊 Fetching league data for: ${member.name}`);
          
          // Import WikiService dynamically to avoid circular dependencies
          const { WikiService } = await import('./wikiService');
          const wikiService = WikiService.getInstance();
          
          const { tasks } = await wikiService.fetchPlayerTasks(member.name);
          
          const totalTasks = tasks.length;
          const completedTasks = tasks.filter(task => task.completed).length;
          const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);
          const earnedPoints = tasks
            .filter(task => task.completed)
            .reduce((sum, task) => sum + task.points, 0);
          const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
          
          return {
            ...member,
            totalTasks,
            completedTasks,
            totalPoints,
            earnedPoints,
            completionRate,
            loading: false
          };
        } catch (error) {
          console.error(`❌ Error fetching league data for ${member.name}:`, error);
          return {
            ...member,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch data'
          };
        }
      });
      
      // Process all members in this batch in parallel
      const batchResults = await Promise.all(memberPromises);
      
      // Update the leagueMembers array with results
      batchResults.forEach((result) => {
        const originalIndex = leagueMembers.findIndex(m => m.name === result.name);
        if (originalIndex !== -1) {
          leagueMembers[originalIndex] = result;
        }
      });
      
      // Calculate current clan totals and notify progress
      const currentTotalClanPoints = leagueMembers.reduce((sum, member) => sum + member.earnedPoints, 0);
      const currentAverageCompletionRate = leagueMembers.length > 0 
        ? leagueMembers.reduce((sum, member) => sum + member.completionRate, 0) / leagueMembers.length 
        : 0;

      const currentLeagueClanInfo: LeagueClanInfo = {
        name: clanName,
        members: [...leagueMembers], // Create a copy to avoid reference issues
        totalMembers: leagueMembers.length,
        lastUpdated: new Date(),
        totalClanPoints: currentTotalClanPoints,
        averageCompletionRate: currentAverageCompletionRate
      };

      // Notify progress callback if provided
      if (onProgress) {
        console.log(`📊 Progress update: ${batchResults.length} members completed in batch ${batchIndex + 1}/${batches.length}`);
        onProgress(currentLeagueClanInfo);
      }
      
      // Longer delay between batches to avoid rate limits
      if (batchIndex < batches.length - 1) {
        console.log(`⏳ Waiting 2 seconds before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      }
    }

    // Calculate clan totals
    const totalClanPoints = leagueMembers.reduce((sum, member) => sum + member.earnedPoints, 0);
    const averageCompletionRate = leagueMembers.length > 0 
      ? leagueMembers.reduce((sum, member) => sum + member.completionRate, 0) / leagueMembers.length 
      : 0;

    const leagueClanInfo: LeagueClanInfo = {
      name: clanName,
      members: leagueMembers,
      totalMembers: leagueMembers.length,
      lastUpdated: new Date(),
      totalClanPoints,
      averageCompletionRate
    };

    // Cache the league progress result
    this.leagueProgressCache.set(clanName, {
      data: leagueClanInfo,
      timestamp: Date.now()
    });

    console.log(`✅ Completed league progress fetch for ${clanName}: ${totalClanPoints} total points, ${averageCompletionRate.toFixed(1)}% avg completion`);
    return leagueClanInfo;
  }

  /**
   * Clear cache for a specific clan or all clans
   */
  clearCache(clanName?: string): void {
    if (clanName) {
      this.clanMemberCache.delete(clanName);
      this.leagueProgressCache.delete(clanName);
    } else {
      this.clanMemberCache.clear();
      this.leagueProgressCache.clear();
    }
  }

  /**
   * Clear only league progress cache (for background updates)
   */
  clearLeagueProgressCache(clanName?: string): void {
    if (clanName) {
      this.leagueProgressCache.delete(clanName);
    } else {
      this.leagueProgressCache.clear();
    }
  }

  /**
   * Check if cached league progress exists and is valid
   */
  hasValidCachedLeagueProgress(clanName: string): boolean {
    const cached = this.leagueProgressCache.get(clanName);
    if (cached && Date.now() - cached.timestamp < this.LEAGUE_PROGRESS_CACHE_DURATION) {
      const age = Date.now() - cached.timestamp;
      const ageMinutes = Math.floor(age / (1000 * 60));
      console.log(`✅ Valid cached league progress exists for ${clanName} (${ageMinutes}m old)`);
      return true;
    }
    console.log(`❌ No valid cached league progress for ${clanName}`);
    return false;
  }

  /**
   * Get cached league progress data without triggering a refresh
   */
  getCachedLeagueProgress(clanName: string): LeagueClanInfo | null {
    const cached = this.leagueProgressCache.get(clanName);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      const ageMinutes = Math.floor(age / (1000 * 60));
      console.log(`📦 Returning cached league progress for ${clanName} (${ageMinutes}m old)`);
      return cached.data;
    }
    console.log(`❌ No cached league progress found for ${clanName}`);
    console.log(`📊 Cache status:`, this.getCacheStatus());
    return null;
  }

  /**
   * Get cache status for debugging
   */
  getCacheStatus(): { clanMembers: number; leagueProgress: number } {
    return {
      clanMembers: this.clanMemberCache.size,
      leagueProgress: this.leagueProgressCache.size
    };
  }

  /**
   * Clear all caches (useful when rate limited)
   */
  clearAllCaches(): void {
    console.log('🧹 Clearing all caches due to rate limiting');
    this.clanMemberCache.clear();
    this.leagueProgressCache.clear();
  }
}

export const clanService = new ClanService();
