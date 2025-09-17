import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Copy, Check } from 'lucide-react';

interface TaskStats {
  total: number;
  visible: number;
  completed: number;
  remaining: number;
  totalPoints: number;
  earnedPoints: number;
  remainingPoints: number;
  completionPercentage: number;
  completedByTier: {
    Easy: number;
    Medium: number;
    Hard: number;
    Elite: number;
    Master: number;
  };
  completedByRegion: Record<string, number>;
  totalByRegion: Record<string, number>;
}

interface StatsCardsProps {
  stats: TaskStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyImage = async () => {
    if (!cardRef.current) return;

    setIsCopying(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0A0A0A', // panda-bg color
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error('Failed to copy image:', err);
            // Fallback: download the image
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `catalyst-league-progress-${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }
      }, 'image/png');
    } catch (error) {
      console.error('Failed to capture image:', error);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="mb-6">
      {/* Shareable Progress Dashboard */}
      <div ref={cardRef} className="card overflow-hidden">
            {/* Header with League Branding */}
            <div className="bg-gradient-to-r from-panda-accent/10 to-panda-accent-light/10 p-6 -m-6 mb-6 border-b border-panda-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-panda-text">Catalyst League Progress</h2>
                  <p className="text-panda-text-muted">Task Completion Overview</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleCopyImage}
                    disabled={isCopying}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      copied
                        ? 'bg-panda-success text-panda-bg'
                        : isCopying
                        ? 'bg-panda-surface text-panda-text-muted cursor-not-allowed'
                        : 'bg-panda-accent hover:bg-panda-accent-dark text-panda-bg hover:shadow-lg hover:shadow-panda-accent/25'
                    }`}
                    title={copied ? 'Copied!' : isCopying ? 'Copying...' : 'Copy image to clipboard'}
                  >
                    {copied ? (
                      <Check className="h-5 w-5" />
                    ) : isCopying ? (
                      <div className="h-5 w-5 border-2 border-panda-text-muted border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                  <div className="text-right">
                    <div className="text-5xl font-bold text-panda-accent">{stats.completionPercentage}%</div>
                    <div className="text-panda-text-muted">Complete</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Streamlined Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-panda-surface/50 rounded-lg">
                <div className="text-2xl font-bold text-panda-accent">{stats.completed}</div>
                <div className="text-xs text-panda-text-muted font-medium">COMPLETED</div>
                <div className="text-xs text-panda-accent mt-1">{stats.completionPercentage}%</div>
              </div>
              <div className="text-center p-4 bg-panda-surface/50 rounded-lg">
                <div className="text-2xl font-bold text-panda-text">{stats.remaining}</div>
                <div className="text-xs text-panda-text-muted font-medium">REMAINING</div>
                <div className="text-xs text-panda-text-muted mt-1">tasks left</div>
              </div>
              <div className="text-center p-4 bg-panda-surface/50 rounded-lg">
                <div className="text-2xl font-bold text-panda-accent">{stats.earnedPoints.toLocaleString()}</div>
                <div className="text-xs text-panda-text-muted font-medium">POINTS EARNED</div>
                <div className="text-xs text-panda-text-muted mt-1">of {stats.totalPoints.toLocaleString()}</div>
              </div>
              <div className="text-center p-4 bg-panda-surface/50 rounded-lg">
                <div className="text-2xl font-bold text-panda-warning">{Math.round((stats.earnedPoints / stats.totalPoints) * 100)}%</div>
                <div className="text-xs text-panda-text-muted font-medium">POINTS %</div>
                <div className="text-xs text-panda-text-muted mt-1">completion rate</div>
              </div>
            </div>

        {/* Streamlined Progress Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Difficulty Breakdown - With Progress Bars */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-panda-text text-center">Difficulty Progress</h3>
            <div className="bg-panda-surface/30 rounded-lg p-3">
              <div className="space-y-2">
                {Object.entries(stats.completedByTier).map(([tier, completed]) => {
                  const estimatedTotalPerTier = {
                    Easy: 400,
                    Medium: 300,
                    Hard: 200,
                    Elite: 150,
                    Master: 67
                  };
                  
                  const totalForTier = estimatedTotalPerTier[tier as keyof typeof estimatedTotalPerTier];
                  const completionPercentage = totalForTier > 0 ? Math.round((completed / totalForTier) * 100) : 0;
                  
                  const tierColors = {
                    Easy: {
                      text: 'text-panda-accent',
                      progress: 'from-panda-accent to-panda-accent-light'
                    },
                    Medium: {
                      text: 'text-panda-warning',
                      progress: 'from-panda-warning to-panda-warning/80'
                    },
                    Hard: {
                      text: 'text-panda-error',
                      progress: 'from-panda-error to-panda-error/80'
                    },
                    Elite: {
                      text: 'text-panda-info',
                      progress: 'from-panda-info to-panda-info/80'
                    },
                    Master: {
                      text: 'text-panda-accent-light',
                      progress: 'from-panda-accent-light to-panda-accent'
                    }
                  };

                  const colors = tierColors[tier as keyof typeof tierColors];

                  return (
                    <div key={tier} className="flex items-center space-x-3">
                      <div className="w-10 text-xs font-medium text-panda-text">{tier}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-bold ${colors.text}`}>{completed}</span>
                          <span className="text-xs text-panda-text-muted">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-panda-surface rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${colors.progress} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Region Breakdown - With Progress Bars */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-panda-text text-center">Top Regions</h3>
            <div className="bg-panda-surface/30 rounded-lg p-3">
              <div className="space-y-2">
                {Object.entries(stats.totalByRegion)
                  .map(([region, total]) => {
                    const completed = stats.completedByRegion[region] || 0;
                    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                    return { region, completed, total, completionPercentage };
                  })
                  .sort((a, b) => {
                    // Always put Global at the top
                    if (a.region === 'Global') return -1;
                    if (b.region === 'Global') return 1;
                    // Then sort by completion count
                    return b.completed - a.completed;
                  })
                  .slice(0, 6) // Show top 6 regions for cleaner look
                  .map(({ region, completed, completionPercentage }) => {
                    
                    const getRegionColor = (percentage: number) => {
                      if (percentage >= 50) return { 
                        text: 'text-panda-accent', 
                        progress: 'from-panda-accent to-panda-accent-light' 
                      };
                      if (percentage >= 25) return { 
                        text: 'text-panda-warning', 
                        progress: 'from-panda-warning to-panda-warning/80' 
                      };
                      if (percentage >= 10) return { 
                        text: 'text-panda-error', 
                        progress: 'from-panda-error to-panda-error/80' 
                      };
                      return { 
                        text: 'text-panda-text-muted', 
                        progress: 'from-panda-text-muted to-panda-text-muted/50' 
                      };
                    };

                    const colors = getRegionColor(completionPercentage);

                    return (
                      <div key={region} className="flex items-center space-x-3">
                        <div className="w-16 text-xs font-medium text-panda-text truncate" title={region}>
                          {region}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-bold ${colors.text}`}>{completed}</span>
                            <span className="text-xs text-panda-text-muted">{completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-panda-surface rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${colors.progress} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
