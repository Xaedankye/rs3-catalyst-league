import React from 'react';
import type { Task, TaskFiltersType } from '../types';
import { SKILLS, TIER_INFO } from '../types';
import { Search, Filter, X } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: Partial<TaskFiltersType>) => void;
  onClearFilters: () => void;
  tasks?: Task[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  tasks = []
}) => {
  // Generate dynamic filter options from actual task data
  const regions = React.useMemo(() => {
    const uniqueRegions = Array.from(new Set(tasks.map(task => task.region).filter(Boolean)));
    return uniqueRegions.sort();
  }, [tasks]);

  const areas = React.useMemo(() => {
    const uniqueAreas = Array.from(new Set(tasks.map(task => task.area).filter(Boolean)));
    return uniqueAreas.sort();
  }, [tasks]);
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-panda-accent" />
          <h3 className="text-lg font-semibold text-panda-text">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-panda-text-muted hover:text-panda-text transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Search Query - Full Width Row */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-panda-text-muted mb-1">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-panda-text-muted" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            placeholder="Search tasks, information, requirements..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Filter Dropdowns - Single Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-panda-text-muted mb-1">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => onFiltersChange({ region: e.target.value })}
            className="input-field"
          >
            <option value="">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Area Filter */}
        <div>
          <label className="block text-sm font-medium text-panda-text-muted mb-1">
            Area
          </label>
          <select
            value={filters.area}
            onChange={(e) => onFiltersChange({ area: e.target.value })}
            className="input-field"
          >
            <option value="">All Areas</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Tier Filter */}
        <div>
          <label className="block text-sm font-medium text-panda-text-muted mb-1">
            Tier
          </label>
          <select
            value={filters.tier}
            onChange={(e) => onFiltersChange({ tier: e.target.value })}
            className="input-field"
          >
            <option value="">All Tiers</option>
            {Object.entries(TIER_INFO).map(([tier, info]) => (
              <option key={tier} value={tier}>
                {tier} ({info.points} pts)
              </option>
            ))}
          </select>
        </div>

        {/* Skill Requirement Filter */}
        <div>
          <label className="block text-sm font-medium text-panda-text-muted mb-1">
            Skill
          </label>
          <select
            value={filters.skillRequirement}
            onChange={(e) => onFiltersChange({ skillRequirement: e.target.value })}
            className="input-field"
          >
            <option value="">All Skills</option>
            {SKILLS.map(skill => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-panda-border">
          <div className="flex flex-wrap gap-2">
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-panda-accent/20 text-panda-accent text-sm rounded-full border border-panda-accent/30">
                Search: "{filters.searchQuery}"
                <button
                  onClick={() => onFiltersChange({ searchQuery: '' })}
                  className="ml-1 hover:bg-panda-accent/30 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.region && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-panda-info/20 text-panda-info text-sm rounded-full border border-panda-info/30">
                Region: {filters.region}
                <button
                  onClick={() => onFiltersChange({ region: '' })}
                  className="ml-1 hover:bg-panda-info/30 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.area && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-panda-accent-light/20 text-panda-accent-light text-sm rounded-full border border-panda-accent-light/30">
                Area: {filters.area}
                <button
                  onClick={() => onFiltersChange({ area: '' })}
                  className="ml-1 hover:bg-panda-accent-light/30 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.locality && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-panda-success/20 text-panda-success text-sm rounded-full border border-panda-success/30">
                Locality: {filters.locality}
                <button
                  onClick={() => onFiltersChange({ locality: '' })}
                  className="ml-1 hover:bg-panda-success/30 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.tier && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-panda-warning/20 text-panda-warning text-sm rounded-full border border-panda-warning/30">
                Tier: {filters.tier}
                <button
                  onClick={() => onFiltersChange({ tier: '' })}
                  className="ml-1 hover:bg-panda-warning/30 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.skillRequirement && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-panda-error/20 text-panda-error text-sm rounded-full border border-panda-error/30">
                Skill: {filters.skillRequirement}
                <button
                  onClick={() => onFiltersChange({ skillRequirement: '' })}
                  className="ml-1 hover:bg-panda-error/30 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
