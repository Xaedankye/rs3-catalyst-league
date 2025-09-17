import { Header } from './components/Header';
import { StatsCards } from './components/StatsCard';
import { TaskFilters } from './components/TaskFilters';
import { TaskTable } from './components/TaskTable';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTasks } from './hooks/useTasks';

function App() {
  const {
    tasks,
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
    setHideCompleted,
    toggleTaskCompletion,
    getTaskStats,
    apiStatus
  } = useTasks();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-panda-bg">
            <Header
              loading={loading}
              onPlayerLookup={fetchPlayerTasks}
              currentPlayer={currentPlayer}
              apiStatus={apiStatus}
            />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status and Refresh */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {error && (
                <div className="flex items-center gap-2 text-sm text-panda-error">
                  <div className="h-2 w-2 bg-panda-error rounded-full"></div>
                  <span>Error: {error}</span>
                </div>
              )}
              <div className="text-sm text-panda-text-muted">
                Last updated: {lastFetch ? new Date(lastFetch).toLocaleTimeString() : 'Never'}
              </div>
            </div>
            <button
              onClick={refreshTasks}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 bg-panda-accent hover:bg-panda-accent-dark text-panda-bg rounded-lg transition-all duration-200 shadow-lg hover:shadow-panda-accent/25 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          <StatsCards stats={getTaskStats} />
          
          <TaskFilters
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
          />
          
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-panda-text">
                      {currentPlayer ? `${currentPlayer}'s Tasks` : 'Tasks'} ({visibleTaskCount})
                    </h2>
                    {currentPlayer && (
                      <button
                        onClick={() => setHideCompleted(!hideCompleted)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          hideCompleted
                            ? 'bg-panda-accent text-panda-bg'
                            : 'bg-panda-surface text-panda-text-muted hover:bg-panda-border hover:text-panda-text'
                        }`}
                      >
                        {hideCompleted ? 'Show All' : 'Hide Completed'}
                      </button>
                    )}
                  </div>
                  {loading && (
                    <div className="text-sm text-panda-text-muted">
                      Loading tasks...
                    </div>
                  )}
                </div>
              </div>
          
          <TaskTable
            tasks={tasks}
            sortConfig={sortConfig}
            onSort={updateSortConfig}
            onToggleCompletion={toggleTaskCompletion}
            hideCompleted={hideCompleted}
            currentPlayer={currentPlayer}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;