export interface Task {
  id: string;
  locality: string; // Keep for backward compatibility
  region: string;
  area: string;
  task: string;
  information: string;
  requirements: string;
  points: number;
  completionPercentage?: number;
  completed?: boolean;
}

export interface TaskFiltersType {
  locality: string; // Keep for backward compatibility
  region: string;
  area: string;
  tier: string;
  difficulty: string;
  skillRequirement: string;
  searchQuery: string;
}

export interface SortConfig {
  column: keyof Task | 'tier';
  direction: 'asc' | 'desc';
}

export type TaskTier = 'Easy' | 'Medium' | 'Hard' | 'Elite' | 'Master';

export interface TierInfo {
  name: TaskTier;
  points: number;
  color: string;
}

export const TIER_INFO: Record<TaskTier, TierInfo> = {
  Easy: { name: 'Easy', points: 10, color: 'bg-green-100 text-green-800' },
  Medium: { name: 'Medium', points: 30, color: 'bg-yellow-100 text-yellow-800' },
  Hard: { name: 'Hard', points: 80, color: 'bg-orange-100 text-orange-800' },
  Elite: { name: 'Elite', points: 200, color: 'bg-red-100 text-red-800' },
  Master: { name: 'Master', points: 400, color: 'bg-purple-100 text-purple-800' },
};

export const LOCALITIES = [
  'Anachronia',
  'Ardougne',
  'Asgarnia',
  'Desert',
  'Fremennik',
  'Kandarin',
  'Karamja',
  'Kourend',
  'Misthalin',
  'Morytania',
  'Tirannwn',
  'Wilderness',
  'Global'
];

export const SKILLS = [
  'Agility',
  'Archaeology',
  'Attack',
  'Construction',
  'Cooking',
  'Crafting',
  'Defence',
  'Divination',
  'Dungeoneering',
  'Farming',
  'Firemaking',
  'Fishing',
  'Fletching',
  'Herblore',
  'Hunter',
  'Invention',
  'Magic',
  'Mining',
  'Necromancy',
  'Prayer',
  'Ranged',
  'Runecrafting',
  'Slayer',
  'Smithing',
  'Strength',
  'Summoning',
  'Thieving',
  'Woodcutting'
];
