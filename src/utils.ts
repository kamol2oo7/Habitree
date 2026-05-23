import { Habit, TreeSpecies } from './types';

// Helper to get today's date in local TimeZone formatted as YYYY-MM-DD
export function getLocalDateString(offsetDays = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate an array of date strings for the last N days
export function getLastNDays(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    dates.push(getLocalDateString(-i));
  }
  return dates;
}

// Check if a date is completed for a habit
export function isDateCompleted(habit: Habit, dateStr: string): boolean {
  return habit.history.includes(dateStr);
}

// Calculate Current Streak and Max Streak for a habit
export function calculateStreaks(history: string[]): { currentStreak: number; maxStreak: number } {
  if (history.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Sort dates descending to calculate current streak
  const sortedDates = [...new Set(history)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  // Calculate current streak
  const todayStr = getLocalDateString(0);
  const yesterdayStr = getLocalDateString(-1);
  
  let currentStreak = 0;
  let expectedDate = todayStr;
  let firstIdx = 0;

  // If today isn't completed, check if yesterday was. If neither, current streak might be active if they already completed yesterday.
  if (sortedDates[0] === todayStr) {
    currentStreak = 1;
    expectedDate = getLocalDateString(-1);
    firstIdx = 1;
  } else if (sortedDates[0] === yesterdayStr) {
    currentStreak = 1;
    expectedDate = getLocalDateString(-2);
    firstIdx = 1;
  } else {
    // Streak is broken or 0
    currentStreak = 0;
  }

  if (currentStreak > 0) {
    for (let i = firstIdx; i < sortedDates.length; i++) {
      if (sortedDates[i] === expectedDate) {
        currentStreak++;
        // Set expected date to previous day
        const prev = new Date(expectedDate);
        prev.setDate(prev.getDate() - 1);
        const y = prev.getFullYear();
        const m = String(prev.getMonth() + 1).padStart(2, '0');
        const d = String(prev.getDate()).padStart(2, '0');
        expectedDate = `${y}-${m}-${d}`;
      } else {
        break; // Streak interrupted
      }
    }
  }

  // Calculate max streak (using ascending sorted dates)
  const ascDates = [...sortedDates].reverse();
  let maxStreak = 0;
  let tempStreak = 0;
  let lastCheckedTime: number | null = null;

  for (const dateStr of ascDates) {
    const currentDateTime = new Date(dateStr).getTime();
    if (lastCheckedTime === null) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((currentDateTime - lastCheckedTime) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        if (tempStreak > maxStreak) {
          maxStreak = tempStreak;
        }
        tempStreak = 1;
      }
    }
    lastCheckedTime = currentDateTime;
  }
  
  if (tempStreak > maxStreak) {
    maxStreak = tempStreak;
  }

  return { currentStreak, maxStreak };
}

// Generate realistic mock history for high fidelity presentation
function generateMockHistory(completionRate: number, daysAgo: number): string[] {
  const history: string[] = [];
  const today = new Date();
  
  for (let i = daysAgo; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay();
    
    // We want high consistency to build robust streaks:
    // Some day patterns for higher fidelity
    let probability = completionRate;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // higher completions on weekends for some, lower for others
      probability = Math.min(0.95, completionRate * 1.1);
    }
    
    // Ensure the last 5 days have solid streak completions to show beautiful active trees!
    if (i <= 5) {
      probability = 0.9;
    }

    if (Math.random() < probability) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      history.push(`${y}-${m}-${day}`);
    }
  }
  return history;
}

export const SEED_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Mindful Coding',
    description: 'Code with extreme focus and maintain proper posture. No social media tabs or context switching.',
    icon: 'Terminal',
    color: 'lime',
    createdAt: getLocalDateString(-90),
    frequency: 'daily',
    history: generateMockHistory(0.78, 80),
    treeSpecies: 'cherry',
  },
  {
    id: 'habit-2',
    name: 'Hydration Intake',
    description: 'Drink at least 3 liters of purified water throughout the day.',
    icon: 'Droplet',
    color: 'blue',
    createdAt: getLocalDateString(-90),
    frequency: 'daily',
    history: generateMockHistory(0.85, 80),
    treeSpecies: 'pine',
  },
  {
    id: 'habit-3',
    name: 'Morning Gym Session',
    description: 'Strength training or active cardiovascular workout at 6:30 AM.',
    icon: 'Dumbbell',
    color: 'orange',
    createdAt: getLocalDateString(-90),
    frequency: 'days',
    weeklyDays: [1, 3, 5], // Mon, Wed, Fri
    history: generateMockHistory(0.65, 80),
    treeSpecies: 'oak',
  },
  {
    id: 'habit-4',
    name: 'Read Technical Book',
    description: 'Read 20 pages of standard books or academic papers on algorithms and systems architecture.',
    icon: 'BookOpen',
    color: 'purple',
    createdAt: getLocalDateString(-90),
    frequency: 'daily',
    history: generateMockHistory(0.72, 80),
    treeSpecies: 'bonsai',
  },
  {
    id: 'habit-5',
    name: 'Deep Breathing/Zen Meditation',
    description: '15-minute mindfulness breathing exercise to clear cognitive fatigue.',
    icon: 'Wind',
    color: 'rose',
    createdAt: getLocalDateString(-90),
    frequency: 'daily',
    history: generateMockHistory(0.68, 80),
    treeSpecies: 'palm',
  },
];

// Color palette mapping to keep things beautiful and responsive to the preset name
export const COLOR_MAP = {
  lime: {
    accent: '#4E7D5B', // Sage Leaf (Rich organic soft green)
    bg: 'bg-[#4E7D5B]/10',
    border: 'border-[#4E7D5B]/25',
    hoverBorder: 'hover:border-[#4E7D5B]/50',
    text: 'text-[#4E7D5B]',
    textMuted: 'text-[#4E7D5B]/70',
    fill: '#4E7D5B',
    shadow: 'shadow-none',
  },
  blue: {
    accent: '#39789C', // Deep Oceanic Slate-Blue
    bg: 'bg-[#39789C]/10',
    border: 'border-[#39789C]/25',
    hoverBorder: 'hover:border-[#39789C]/50',
    text: 'text-[#39789C]',
    textMuted: 'text-[#39789C]/70',
    fill: '#39789C',
    shadow: 'shadow-none',
  },
  purple: {
    accent: '#7E619E', // Lavender Amethyst Dusty Purple
    bg: 'bg-[#7E619E]/10',
    border: 'border-[#7E619E]/25',
    hoverBorder: 'hover:border-[#7E619E]/50',
    text: 'text-[#7E619E]',
    textMuted: 'text-[#7E619E]/70',
    fill: '#7E619E',
    shadow: 'shadow-none',
  },
  orange: {
    accent: '#C56B48', // Warm Terracotta Sand Orange
    bg: 'bg-[#C56B48]/10',
    border: 'border-[#C56B48]/25',
    hoverBorder: 'hover:border-[#C56B48]/50',
    text: 'text-[#C56B48]',
    textMuted: 'text-[#C56B48]/70',
    fill: '#C56B48',
    shadow: 'shadow-none',
  },
  rose: {
    accent: '#B04C5A', // Crimson Organic Rose Red
    bg: 'bg-[#B04C5A]/10',
    border: 'border-[#B04C5A]/25',
    hoverBorder: 'hover:border-[#B04C5A]/50',
    text: 'text-[#B04C5A]',
    textMuted: 'text-[#B04C5A]/70',
    fill: '#B04C5A',
    shadow: 'shadow-none',
  },
};
export type ColorPreset = keyof typeof COLOR_MAP;
