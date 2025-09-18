// Background service for managing clan data updates
import { clanService } from './clanService';

interface BackgroundUpdateState {
  isRunning: boolean;
  lastUpdate: Date | null;
  nextUpdate: Date | null;
  currentClan: string | null;
  updateInterval: number; // in milliseconds
}

class ClanBackgroundService {
  private static instance: ClanBackgroundService;
  private updateState: BackgroundUpdateState = {
    isRunning: false,
    lastUpdate: null,
    nextUpdate: null,
    currentClan: null,
    updateInterval: 10 * 60 * 1000 // 10 minutes (increased to reduce API load)
  };
  
  private updateTimer: NodeJS.Timeout | null = null;
  private listeners: Set<(state: BackgroundUpdateState) => void> = new Set();

  static getInstance(): ClanBackgroundService {
    if (!ClanBackgroundService.instance) {
      ClanBackgroundService.instance = new ClanBackgroundService();
    }
    return ClanBackgroundService.instance;
  }

  /**
   * Start background updates for a specific clan
   */
  startUpdates(clanName: string): void {
    console.log(`🔄 Starting background updates for clan: ${clanName}`);
    
    this.updateState.currentClan = clanName;
    this.updateState.isRunning = true;
    
    // Clear existing timer
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
    
    // Perform initial update
    this.performUpdate();
    
    // Set up recurring updates
    this.updateTimer = setInterval(() => {
      this.performUpdate();
    }, this.updateState.updateInterval);
    
    this.notifyListeners();
  }

  /**
   * Stop background updates
   */
  stopUpdates(): void {
    console.log('⏹️ Stopping background updates');
    
    this.updateState.isRunning = false;
    this.updateState.currentClan = null;
    
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
    
    this.notifyListeners();
  }

  /**
   * Perform a single update cycle
   */
  private async performUpdate(): Promise<void> {
    if (!this.updateState.currentClan) {
      return;
    }

    try {
      console.log(`🔄 Background update for ${this.updateState.currentClan}`);
      
      // Update the next update time
      this.updateState.nextUpdate = new Date(Date.now() + this.updateState.updateInterval);
      this.notifyListeners();
      
      // Perform the actual update with force refresh to bypass cache
      await clanService.fetchClanLeagueProgress(this.updateState.currentClan, true);
      
      this.updateState.lastUpdate = new Date();
      console.log(`✅ Background update completed for ${this.updateState.currentClan}`);
      
    } catch (error) {
      console.error(`❌ Background update failed for ${this.updateState.currentClan}:`, error);
    } finally {
      this.notifyListeners();
    }
  }

  /**
   * Get current update state
   */
  getUpdateState(): BackgroundUpdateState {
    return { ...this.updateState };
  }

  /**
   * Subscribe to update state changes
   */
  subscribe(listener: (state: BackgroundUpdateState) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getUpdateState());
      } catch (error) {
        console.error('Error in background service listener:', error);
      }
    });
  }

  /**
   * Force an immediate update
   */
  async forceUpdate(): Promise<void> {
    if (this.updateState.currentClan) {
      await this.performUpdate();
    }
  }

  /**
   * Update the refresh interval
   */
  setUpdateInterval(intervalMs: number): void {
    this.updateState.updateInterval = intervalMs;
    
    // Restart updates if currently running
    if (this.updateState.isRunning && this.updateState.currentClan) {
      this.stopUpdates();
      this.startUpdates(this.updateState.currentClan);
    }
  }
}

export const clanBackgroundService = ClanBackgroundService.getInstance();
