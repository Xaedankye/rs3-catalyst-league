import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Task } from '../types';

// Use direct URL in Electron, proxy URL in development
const WIKI_URL = window.location.protocol === 'file:' 
  ? 'https://runescape.wiki/w/Catalyst_League/Tasks'
  : '/api/wiki/w/Catalyst_League/Tasks';

export class WikiService {
  private static instance: WikiService;
  private cache: { data: Task[]; timestamp: number } | null = null;
  private playerCache: Map<string, { data: Task[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

  static getInstance(): WikiService {
    if (!WikiService.instance) {
      WikiService.instance = new WikiService();
    }
    return WikiService.instance;
  }

  /**
   * Rate limiting to prevent 429 errors
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`⏳ Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  async fetchTasks(): Promise<Task[]> {
    // Check cache first
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      return this.cache.data;
    }

    // Apply rate limiting
    await this.rateLimit();

    try {
      const response = await axios.get(WIKI_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const tasks: Task[] = [];

      // Find all tables with task data - there might be multiple tables
      // Look for tables with the right headers: Locality, Task, Information, Requirements, Pts, Comp%
      const taskTables = $('table.wikitable').filter((_i, table) => {
        const $table = $(table);
        const headers = $table.find('th').map((_i, th) => $(th).text().trim()).get();
        return headers.includes('Locality') && headers.includes('Task') && headers.includes('Pts');
      });
      
      console.log('Found', taskTables.length, 'tables with task data');
      
      if (taskTables.length === 0) {
        throw new Error('No task tables found');
      }

      // Parse all task tables
      taskTables.each((tableIndex, table) => {
        const $table = $(table);
        const rows = $table.find('tbody tr');
        console.log(`Table ${tableIndex + 1} has ${rows.length} rows`);
        
        rows.each((index, row) => {
          const $row = $(row);
          const cells = $row.find('td');
        
          if (cells.length >= 6) {
            // Extract locality - handle the case where it might be an image with title
            let locality = $(cells[0]).text().trim();
            if (!locality) {
              // Try to get the title attribute from the image
              locality = $(cells[0]).find('img').attr('title') || $(cells[0]).find('span[title]').attr('title') || '';
            }
            
            const task = $(cells[1]).text().trim();
            const information = $(cells[2]).text().trim();
            const requirements = $(cells[3]).text().trim();
            const pointsText = $(cells[4]).text().trim();
            const completionText = $(cells[5]).text().trim();

            // Parse points - extract number from text that might contain images
            const pointsMatch = pointsText.match(/(\d+)/);
            const points = pointsMatch ? parseInt(pointsMatch[1]) : 0;
            
            // Parse completion percentage from the Comp% column
            const completionMatch = completionText.match(/(\d+(?:\.\d+)?)%/);
            const completionPercentage = completionMatch ? parseFloat(completionMatch[1]) : 0;
            
            // Parse locality into region and area
            const { region, area } = this.parseLocality(locality);
            
            // This is the general completion percentage from WikiSync crowdsourcing
            // Individual player completion will be handled separately

            // Only require task and points to be valid - region/area can be empty for Global tasks
            if (task && points > 0) {
              // Extract task ID from the row if available
              const dataTaskId = $(row).attr('data-taskid');
              const taskId = dataTaskId || `${region}-${area}-${task}-${index}`;
              
              // Debug: Log task ID generation
              if (tasks.length < 5) {
                console.log(`Task ${tasks.length + 1}: data-taskid="${dataTaskId}", generated="${taskId}"`);
              }
              
              const taskData = {
                id: taskId,
                locality, // Keep original for backward compatibility
                region,
                area,
                task,
                information,
                requirements,
                points,
                completionPercentage, // This is the general completion percentage from the wiki
                completed: false // Will be set based on player-specific data
              };
              
              tasks.push(taskData);
              
              // Debug first few tasks
              if (tasks.length <= 3) {
                console.log('Parsed task:', taskData);
              }
            }
          }
        });
      });
      
      console.log('Parsed', tasks.length, 'tasks from wiki');

      // Cache the results
      this.cache = {
        data: tasks,
        timestamp: Date.now()
      };

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks from wiki:', error);
      throw new Error('Failed to fetch tasks from wiki');
    }
  }


  private parseLocality(locality: string): { region: string; area: string } {
    // Handle empty or invalid locality
    if (!locality || locality.trim() === '') {
      return { region: 'Unknown', area: 'General' };
    }
    
    // Handle Global region (no area)
    if (locality === 'Global') {
      return { region: 'Global', area: '' };
    }
    
    // Handle different locality formats with colon separator
    if (locality.includes(':')) {
      const [region, area] = locality.split(':').map(part => part.trim());
      return { region, area };
    }
    
    // Handle special cases for single-word localities
    const specialCases: { [key: string]: { region: string; area: string } } = {
      'Anachronia': { region: 'Anachronia', area: 'General' },
      'Morytania': { region: 'Morytania', area: 'General' },
      'Kandarin': { region: 'Kandarin', area: 'General' },
      'Asgarnia': { region: 'Asgarnia', area: 'General' },
      'Fremennik': { region: 'Fremennik', area: 'General' },
      'Desert': { region: 'Desert', area: 'General' },
      'Wilderness': { region: 'Wilderness', area: 'General' },
      'Misthalin': { region: 'Misthalin', area: 'General' },
      'Karamja': { region: 'Karamja', area: 'General' },
      'Tirannwn': { region: 'Tirannwn', area: 'General' }
    };
    
    if (specialCases[locality]) {
      return specialCases[locality];
    }
    
    // Default fallback - treat as region with General area
    return { region: locality, area: 'General' };
  }

  clearCache(): void {
    this.cache = null;
  }

  getLastFetchTime(): Date | null {
    return this.cache ? new Date(this.cache.timestamp) : null;
  }

  async getTotalTaskCount(): Promise<number> {
    try {
      const response = await axios.get(WIKI_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      
      // Look for the task tier summary table to get total count
      const summaryTable = $('table.wikitable').first();
      let totalTasks = 0;
      
      summaryTable.find('tbody tr').each((_index, row) => {
        const $row = $(row);
        const cells = $row.find('td');
        
        if (cells.length >= 2) {
          const tierText = $(cells[0]).text().trim();
          const taskCountText = $(cells[1]).text().trim();
          
          if (tierText === 'Total') {
            totalTasks = parseInt(taskCountText) || 0;
            return false; // Break out of loop
          }
        }
      });

      return totalTasks;
    } catch (error) {
      console.error('Error fetching total task count:', error);
      return 1117; // Fallback to known total
    }
  }

  async fetchPlayerTasks(playerName: string): Promise<{ tasks: Task[]; apiStatus: 'success' | 'error' | 'fallback' }> {
    console.log(`🔄 Fetching player tasks for: ${playerName}`);
    
    // Apply rate limiting
    await this.rateLimit();
    
    // Check player cache first
    const cached = this.playerCache.get(playerName);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`📦 Using cached data for ${playerName}`);
      return { tasks: cached.data, apiStatus: 'success' };
    }

    try {
      // Clear general cache to ensure fresh data
      this.clearCache();
      console.log(`🌐 Fetching fresh general tasks...`);
      // Get the real task data from the wiki
      const generalTasks = await this.fetchTasks();
      console.log(`✅ Got ${generalTasks.length} general tasks`);
      
      // Fetch real player completion data from RuneScape API
      console.log(`🌐 Fetching real completion data for player: ${playerName}`);
      
      try {
        const response = await axios.get(`https://sync.runescape.wiki/runescape/player/${encodeURIComponent(playerName)}/LEAGUE_1`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        const { league_tasks: completedTaskIds } = response.data;
        
        // Check if we got valid data
        if (!Array.isArray(completedTaskIds)) {
          throw new Error('Invalid response format from RuneScape API');
        }
        
        console.log(`✅ Got ${completedTaskIds.length} completed tasks from RuneScape API for ${playerName}`);
        
        const playerTasks = generalTasks.map(task => ({
          ...task,
          completed: completedTaskIds.includes(parseInt(task.id))
        }));
        
        const completedCount = playerTasks.filter(task => task.completed).length;
        console.log(`🎯 Player ${playerName}: ${completedCount} completed tasks out of ${playerTasks.length} total tasks`);
        
        // Cache the player data
        this.playerCache.set(playerName, {
          data: playerTasks,
          timestamp: Date.now()
        });
        
        return { tasks: playerTasks, apiStatus: 'success' };
        
      } catch (error) {
        console.error('❌ Error fetching player data from RuneScape API:', error);
        console.log('📝 Falling back to manual tracking mode');
        
        // Fallback to manual tracking with localStorage
        const savedData = localStorage.getItem(`catalyst-league-${playerName}`);
        let completedTaskIds: string[] = [];
        
        if (savedData) {
          try {
            completedTaskIds = JSON.parse(savedData);
            console.log(`📦 Loaded ${completedTaskIds.length} saved completions for ${playerName}`);
          } catch (error) {
            console.log('⚠️  Failed to load saved data, starting fresh');
          }
        }
        
        const playerTasks = generalTasks.map(task => ({
          ...task,
          completed: completedTaskIds.includes(task.id)
        }));
        
        // Cache the player data
        this.playerCache.set(playerName, {
          data: playerTasks,
          timestamp: Date.now()
        });
        
        return { tasks: playerTasks, apiStatus: 'fallback' };
      }
    } catch (error) {
      console.error('Error fetching player tasks:', error);
      // Fall back to general tasks if player lookup fails
      console.log('Falling back to general tasks for:', playerName);
      const generalTasks = await this.fetchTasks();
      return { tasks: generalTasks, apiStatus: 'error' };
    }
  }







  clearPlayerCache(playerName?: string): void {
    if (playerName) {
      this.playerCache.delete(playerName);
    } else {
      this.playerCache.clear();
    }
  }
}

export const wikiService = WikiService.getInstance();
