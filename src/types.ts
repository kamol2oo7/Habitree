export type TreeSpecies = 'cherry' | 'pine' | 'oak' | 'palm' | 'bonsai';

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: 'lime' | 'blue' | 'purple' | 'orange' | 'rose'; // Neon color schemes matching the UI picture
  createdAt: string;
  frequency: 'daily' | 'weekly' | 'days';
  targetDaysCount?: number; // e.g. 3 times a week (for frequency: 'weekly')
  weeklyDays?: number[]; // e.g. [1, 3, 5] for Mon, Wed, Fri (for frequency: 'days', Sunday = 0)
  history: string[]; // List of completed dates in 'YYYY-MM-DD' format
  treeSpecies: TreeSpecies;
  reminderTime?: string; // "HH:MM" 24h format
  reminderActive?: boolean;
}

export type ViewType = 'dashboard' | 'forest' | 'analytics' | 'settings';

export interface HabitStats {
  id: string;
  name: string;
  color: string;
  totalCompletions: number;
  currentStreak: number;
  maxStreak: number;
  completionRate: number; // Percentage
  history60Days: { date: string; completed: boolean }[];
}

export interface GlobalStats {
  totalHabits: number;
  totalCompletions: number;
  activeStreaksCount: number;
  maxStreakOverall: number;
  averageCompletionRate: number;
}
