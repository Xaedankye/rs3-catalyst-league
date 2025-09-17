import React from 'react';
import type { Task, SortConfig, TaskTier } from '../types';
import { TIER_INFO } from '../types';
import { ChevronUp, ChevronDown, CheckCircle, Circle } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  sortConfig: SortConfig;
  onSort: (column: keyof Task | 'tier') => void;
  onToggleCompletion: (taskId: string) => void;
  hideCompleted?: boolean;
  currentPlayer?: string | null;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  sortConfig,
  onSort,
  onToggleCompletion,
  hideCompleted = false,
  currentPlayer = null
}) => {
  const getTierFromPoints = (points: number): TaskTier => {
    if (points <= 10) return 'Easy';
    if (points <= 30) return 'Medium';
    if (points <= 80) return 'Hard';
    if (points <= 200) return 'Elite';
    return 'Master';
  };

  const getSortIcon = (column: keyof Task | 'tier') => {
    if (sortConfig.column !== column) {
      return <ChevronUp className="h-4 w-4 text-panda-text-muted" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-panda-accent" />
      : <ChevronDown className="h-4 w-4 text-panda-accent" />;
  };

  const SortableHeader: React.FC<{ column: keyof Task | 'tier'; children: React.ReactNode }> = ({ 
    column, 
    children 
  }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider cursor-pointer hover:bg-panda-surface transition-colors"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        {getSortIcon(column)}
      </div>
    </th>
  );

  if (tasks.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-panda-text-muted text-lg">No tasks found matching your filters</div>
        <div className="text-panda-text-muted text-sm mt-2">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-panda-border">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider">
                Information
              </th>
              <SortableHeader column="region">
                Region
              </SortableHeader>
              <SortableHeader column="area">
                Area
              </SortableHeader>
              <SortableHeader column="points">
                Points
              </SortableHeader>
              <SortableHeader column="completionPercentage">
                Comp %
              </SortableHeader>
              <SortableHeader column="tier">
                Tier
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-panda-text-muted uppercase tracking-wider">
                Requirements
              </th>
            </tr>
          </thead>
          <tbody className="bg-panda-card divide-y divide-panda-border">
            {tasks.map((task) => {
              // Hide completed tasks if hideCompleted is true and we're viewing a player
              if (currentPlayer && hideCompleted && task.completed) {
                return null;
              }

              const tier = getTierFromPoints(task.points);
              const tierInfo = TIER_INFO[tier];
              
              return (
                <tr 
                  key={task.id} 
                  className={`table-row transition-colors cursor-pointer hover:bg-panda-accent/5 ${
                    task.completed ? 'table-row-completed' : ''
                  }`}
                  onClick={() => onToggleCompletion(task.id)}
                >
                  <td className="px-6 py-4">
                    <div className="relative">
                      <div className="text-sm text-panda-text max-w-md pl-8" title={task.task}>
                        {task.task}
                      </div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-panda-accent" />
                        ) : (
                          <Circle className="h-5 w-5 text-panda-text-muted" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-panda-text">
                      {task.region}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-panda-text">
                      {task.area}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-panda-accent">
                      {task.points}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-panda-text-muted">
                      {task.completionPercentage ? `${task.completionPercentage}%` : '0%'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${tierInfo.color}`}>
                      {tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-panda-text-muted max-w-sm" title={task.requirements}>
                      {task.requirements}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
