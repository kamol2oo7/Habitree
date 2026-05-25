/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Habit, ViewType, TreeSpecies } from './types';
import { SEED_HABITS, getLocalDateString, calculateStreaks, COLOR_MAP } from './utils';
import { 
  LayoutGrid, 
  Trees, 
  AreaChart, 
  Sliders, 
  Flame, 
  Calendar, 
  Award, 
  Plus, 
  X, 
  Sparkles,
  Info,
  CalendarDays,
  Target,
  Sun,
  Moon,
  Bell,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import DashboardView from './components/DashboardView';
import ForestView from './components/ForestView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import HabitForm from './components/HabitForm';
import { HabitIcon } from './components/HabitCard';
import TreeGraphic from './components/TreeGraphic';
import AppLogo from './components/AppLogo';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  // Touch swipe states
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStart.x;
    const diffY = touch.clientY - touchStart.y;

    // Ensure horizontal gesture is primary and over threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
      const viewOrder: ViewType[] = ['dashboard', 'forest', 'analytics', 'settings'];
      const currentIndex = viewOrder.indexOf(currentView);

      if (diffX < 0) {
        // swipe left -> next view
        if (currentIndex < viewOrder.length - 1) {
          setCurrentView(viewOrder[currentIndex + 1]);
        }
      } else {
        // swipe right -> previous view
        if (currentIndex > 0) {
          setCurrentView(viewOrder[currentIndex - 1]);
        }
      }
    }
    setTouchStart(null);
  };
  
  // Theme Toggle: beige and creamy light theme vs warm dark clay theme
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const cached = localStorage.getItem('habitree:theme');
    return cached === 'light' ? 'light' : 'dark';
  });

  const isDark = theme === 'dark';

  // Toggle Theme helper
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('habitree:theme', theme);
  }, [theme]);

  // Tracking grid layout style: classic horizontal strip vs real-calendar aligned mini-heatmap
  const [gridStyle, setGridStyle] = useState<'classic_strip' | 'mini_heatmap'>(() => {
    const cached = localStorage.getItem('habitree:gridStyle');
    return cached === 'mini_heatmap' ? 'mini_heatmap' : 'classic_strip';
  });

  useEffect(() => {
    localStorage.setItem('habitree:gridStyle', gridStyle);
  }, [gridStyle]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [inspectingHabit, setInspectingHabit] = useState<Habit | null>(null);

  // Initialize data
  useEffect(() => {
    const cached = localStorage.getItem('habitree:habits');
    if (cached) {
      try {
        setHabits(JSON.parse(cached));
      } catch (err) {
        setHabits([]);
      }
    } else {
      // First load: start completely clean with zero active habits
      setHabits([]);
      localStorage.setItem('habitree:habits', JSON.stringify([]));
    }
  }, []);

  // Save data helper
  const saveHabitsToStateAndCache = (updatedList: Habit[]) => {
    setHabits(updatedList);
    localStorage.setItem('habitree:habits', JSON.stringify(updatedList));
  };

  // Reminders and Notification state
  const [triggeredReminders, setTriggeredReminders] = useState<Record<string, boolean>>(() => {
    const cached = localStorage.getItem('habitree:triggeredReminders');
    return cached ? JSON.parse(cached) : {};
  });
  
  const [inAppNotifications, setInAppNotifications] = useState<{
    id: string;
    habitId: string;
    title: string;
    body: string;
    time: string;
    color: string;
  }[]>([]);

  // Subtle clean vector synth chime
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      gain2.gain.setValueAtTime(0.06, ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.25);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 1.0);
      osc2.start(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 1.25);
    } catch (err) {
      console.warn('Audio play request not interactive yet:', err);
    }
  };

  // Sync triggered reminders to cache
  useEffect(() => {
    localStorage.setItem('habitree:triggeredReminders', JSON.stringify(triggeredReminders));
  }, [triggeredReminders]);

  // Clean triggered state daily
  useEffect(() => {
    const todayStr = getLocalDateString(0);
    const activeKeys = Object.keys(triggeredReminders);
    const staleKeys = activeKeys.filter(k => !k.endsWith(`_${todayStr}`));
    if (staleKeys.length > 0) {
      setTriggeredReminders(prev => {
        const next = { ...prev };
        staleKeys.forEach(k => delete next[k]);
        return next;
      });
    }
  }, [habits]);

  // Listen for custom test notification events triggered by HabitForm.tsx
  useEffect(() => {
    const handleTestReminder = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { habitId, title, body, time, color } = customEvent.detail;
        
        // Play vector synth chime sound
        playChime();

        // Push new gorgeous toast alert to stack
        setInAppNotifications((prev) => [
          ...prev.filter(x => x.habitId !== habitId),
          {
            id: `test-notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            habitId: habitId || 'temp-test-id',
            title: title || 'Nurture Habit',
            body: body || 'Time for consistency nudge!',
            time: time || '08:00',
            color: color || 'lime'
          }
        ]);
      }
    };

    window.addEventListener('habitree-test-reminder', handleTestReminder);
    return () => window.removeEventListener('habitree-test-reminder', handleTestReminder);
  }, [habits]);

  // Active loop checker (scans every 10 seconds for user reminders)
  useEffect(() => {
    const checkTimer = setInterval(() => {
      const now = new Date();
      const todayStr = getLocalDateString(0);
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const timeString = `${currentHours}:${currentMinutes}`;

      habits.forEach((habit) => {
        if (habit.reminderActive && habit.reminderTime === timeString) {
          const triggerKey = `${habit.id}_${todayStr}`;
          
          if (!triggeredReminders[triggerKey]) {
            // Check frequency eligibility for today
            let shouldNotify = true;
            const todayDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.

            if (habit.frequency === 'days' && habit.weeklyDays) {
              shouldNotify = habit.weeklyDays.includes(todayDayOfWeek);
            }

            if (shouldNotify) {
              // Trigger Browser Desktop Notification (if granted)
              if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                try {
                  const imageUri = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"%3E%3Crect x="36" y="78" width="28" height="8" rx="1.5" fill="%234E7D5B"/%3E%3Cpath d="M50 73C47.5 52 42 39 48 17" stroke="%234E7D5B" stroke-width="7.5" stroke-linecap="round"/%3E%3C/svg%3E';
                  const n = new Notification(`Nurture Habit: ${habit.name}`, {
                    body: habit.description ? habit.description : `It is ${habit.reminderTime}! Time to grow your ${habit.treeSpecies} species! 🌳`,
                    icon: imageUri
                  });
                  n.onclick = () => window.focus();
                } catch (err) {
                  console.warn('Silent fallback for notification permission', err);
                }
              }

              // Trigger In-App Notification Overlay banner with sound
              playChime();
              setInAppNotifications((prev) => [
                ...prev.filter(x => x.habitId !== habit.id),
                {
                  id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                  habitId: habit.id,
                  title: `Time for ${habit.name}`,
                  body: habit.description || `Maintain your ${habit.treeSpecies} tree growing sequence today!`,
                  time: habit.reminderTime,
                  color: habit.color
                }
              ]);

              // Prevent repeating trigger
              setTriggeredReminders((prev) => ({
                ...prev,
                [triggerKey]: true,
              }));
            }
          }
        }
      });
    }, 10000);

    return () => clearInterval(checkTimer);
  }, [habits, triggeredReminders]);

  const handleCompleteFromNotification = (habitId: string, notifId: string) => {
    const todayStr = getLocalDateString(0);
    const targetHabit = habits.find(h => h.id === habitId);
    if (targetHabit && !targetHabit.history.includes(todayStr)) {
      handleToggleDate(habitId, todayStr);
    }
    setInAppNotifications(prev => prev.filter(x => x.id !== notifId));
  };

  // Toggle completion dates
  const handleToggleDate = (habitId: string, dateStr: string) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const index = h.history.indexOf(dateStr);
        let newHistory = [...h.history];
        if (index !== -1) {
          // Remove from completion log
          newHistory.splice(index, 1);
        } else {
          // Add to completion log
          newHistory.push(dateStr);
        }
        return { ...h, history: newHistory };
      }
      return h;
    });

    saveHabitsToStateAndCache(updated);
    
    // Update live inspection modal context if open
    if (inspectingHabit && inspectingHabit.id === habitId) {
      const match = updated.find(h => h.id === habitId);
      if (match) setInspectingHabit(match);
    }
  };

  // Save new/edited habits
  const handleSaveHabit = (formData: Omit<Habit, 'id' | 'createdAt' | 'history'>) => {
    if (editingHabit) {
      // Update existing
      const updated = habits.map(h => {
        if (h.id === editingHabit.id) {
          return {
            ...h,
            ...formData
          };
        }
        return h;
      });
      saveHabitsToStateAndCache(updated);
    } else {
      // Create new
      const newHabit: Habit = {
        id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: getLocalDateString(0),
        history: [],
        ...formData
      };
      saveHabitsToStateAndCache([...habits, newHabit]);
    }

    setIsFormOpen(false);
    setEditingHabit(null);
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    const filtered = habits.filter(h => h.id !== habitId);
    saveHabitsToStateAndCache(filtered);
    if (inspectingHabit?.id === habitId) {
      setInspectingHabit(null);
    }
  };

  // Clear database
  const handleClearAll = () => {
    saveHabitsToStateAndCache([]);
  };

  // Import JSON backup text
  const handleImportJSON = (jsonStr: string): boolean => {
    try {
      const arr = JSON.parse(jsonStr);
      if (Array.isArray(arr)) {
        // Simple assertion to confirm presence of core parameters
        const isValid = arr.every(x => x.id && x.name && Array.isArray(x.history));
        if (isValid) {
          saveHabitsToStateAndCache(arr);
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Open creation modal
  const handleOpenAddForm = () => {
    setEditingHabit(null);
    setIsFormOpen(true);
  };

  // Open edit modal directly
  const handleOpenEditForm = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  // Navigation tabs matching the bottom bar icons of picture
  const navTabs = [
    { value: 'dashboard' as ViewType, label: 'Workspace', Icon: LayoutGrid },
    { value: 'forest' as ViewType, label: 'Forest', Icon: Trees },
    { value: 'analytics' as ViewType, label: 'Analytics', Icon: AreaChart },
    { value: 'settings' as ViewType, label: 'Settings', Icon: Sliders },
  ];

  return (
    <div 
      onTouchStart={handleTouchStart} 
      onTouchEnd={handleTouchEnd} 
      className={`min-h-screen ${isDark ? 'bg-[#141210] text-[#ECE9E0]' : 'bg-[#FAF6F0] text-[#2C2925]'} flex flex-col items-center justify-between font-sans subpixel-antialiased selection:bg-[#4E7D5B]/30 selection:text-[#4E7D5B] w-full transition-colors duration-200 overflow-x-hidden`}
    >
      
      {/* Absolute Overlay Container for Reminders toasts (Apple-style push notices) */}
      <div 
        id="in-app-notifications-overlay" 
        className="fixed top-5 right-4 left-4 sm:left-auto sm:right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none select-none"
      >
        <AnimatePresence>
          {inAppNotifications.map((notif) => {
            const h = habits.find((x) => x.id === notif.habitId);
            const accentColor = h ? COLOR_MAP[h.color]?.accent || '#4E7D5B' : '#4E7D5B';
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: -24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`pointer-events-auto flex flex-col p-4 sm:p-5 rounded-2xl border shadow-xl backdrop-blur-md relative overflow-hidden transition-all ${
                  isDark 
                    ? 'bg-[#1C1A18]/95 border-white/5 shadow-black/40 text-[#FAF7F2]' 
                    : 'bg-[#FFFFFF]/95 border-[#E8E2D9] shadow-neutral-200/50 text-[#2C2925]'
                }`}
              >
                {/* Visual Accent Pill Marker */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: accentColor }} 
                />

                <div className="flex items-start gap-3.5 mt-1">
                  {/* Icon Avatar */}
                  <div 
                    className="p-2 sm:p-2.5 rounded-xl flex items-center justify-center shrink-0"
                    style={{ 
                      backgroundColor: `${accentColor}15`, 
                      color: accentColor,
                      border: `1px solid ${accentColor}30` 
                    }}
                  >
                    {h ? (
                      <HabitIcon name={h.icon} className="w-4.5 h-4.5" />
                    ) : (
                      <Bell className="w-4.5 h-4.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-neutral-400">
                        🔔 Nudge Reminder ({notif.time})
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold tracking-tight mt-0.5 truncate ${isDark ? 'text-white' : 'text-[#1C1E1C]'}`}>
                      {notif.title}
                    </h4>
                    <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${isDark ? 'text-white/50' : 'text-[#706B63]'}`}>
                      {notif.body}
                    </p>
                  </div>

                  {/* Close Dismiss */}
                  <button
                    onClick={() => setInAppNotifications((prev) => prev.filter((x) => x.id !== notif.id))}
                    className={`absolute top-3.5 right-3.5 p-1 rounded-lg transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-white/5 text-neutral-500 hover:text-white' : 'hover:bg-black/5 text-neutral-400 hover:text-neutral-800'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Instant Actions */}
                <div className="flex items-center justify-end gap-2.5 mt-4 pt-3.5 border-t border-dashed border-neutral-500/10 dark:border-white/5">
                  <button
                    onClick={() => setInAppNotifications((prev) => prev.filter((x) => x.id !== notif.id))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-colors cursor-pointer ${
                      isDark 
                        ? 'hover:bg-white/5 text-[#9D9A90]' 
                        : 'hover:bg-[#FAF8F5] text-[#706B63]'
                    }`}
                  >
                    Later
                  </button>
                  <button
                    onClick={() => handleCompleteFromNotification(notif.habitId, notif.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#4E7D5B] hover:bg-[#3D6247] text-white text-xs font-bold tracking-tight transition-all active:scale-95 shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Done</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Elegant Floating Top Navigation */}
      <div className="sticky top-3 z-40 w-full max-w-7xl px-4 sm:px-6 mt-3 select-none">
        <header className={`w-full h-15 sm:h-16 border rounded-2xl flex items-center justify-between px-5 sm:px-6 shadow-md backdrop-blur-md transition-all duration-350 ${
          isDark 
            ? 'border-white/5 bg-[#1C1A18]/90 shadow-black/20' 
            : 'border-[#E8E2D9] bg-[#FFFFFF]/90 shadow-gray-200/50'
        }`}>
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setCurrentView('dashboard')}>
            <div className={`w-8.5 h-8.5 ${isDark ? 'bg-[#4E7D5B]/20 border-[#4E7D5B]/30' : 'bg-[#4E7D5B]/10 border-[#4E7D5B]/45'} border rounded-xl flex items-center justify-center`}>
              <AppLogo size={20} color="#4E7D5B" />
            </div>
            <div className="text-left">
              <h1 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>Habitree</h1>
              <p className={`text-[9px] ${isDark ? 'text-white/40' : 'text-[#706B63]/60'} uppercase tracking-widest leading-none mt-0.5`}>Consistency is growth</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-xs sm:text-sm font-medium h-full">
            {navTabs.map(({ value, label, Icon }) => {
              const isActive = currentView === value;
              return (
                <button
                  id={`top-nav-${value}`}
                  key={value}
                  onClick={() => setCurrentView(value)}
                  className={`
                    transition-colors select-none cursor-pointer duration-200 flex items-center gap-1.5 py-1.5 border-b-2 h-full
                    ${isActive 
                      ? `${isDark ? 'text-[#FAF7F2] border-[#4E7D5B]' : 'text-[#4E7D5B] border-[#4E7D5B]'} font-bold` 
                      : `${isDark ? 'text-white/60 hover:text-white' : 'text-[#706B63]/60 hover:text-[#2C2925]'} border-transparent`
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Dark & Creamy Light Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                isDark 
                  ? 'bg-[#1C1A18]/5 border-white/5 text-[#E5E2D9] hover:bg-white/10' 
                  : 'bg-[#FFFFFF] border-[#E8E2D9] text-[#706B63] hover:bg-[#FAF6F0]'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#DFD3C3]" />
              ) : (
                <Moon className="w-4 h-4 text-[#706B63]" />
              )}
            </button>
          </div>
        </header>
      </div>

      {/* Main Container Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-24 md:pb-8 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full"
          >
            {currentView === 'dashboard' && (
              <DashboardView
                isDark={isDark}
                habits={habits}
                onToggleDate={handleToggleDate}
                onEditHabit={handleOpenEditForm}
                onDeleteHabit={handleDeleteHabit}
                onSelectHabit={setInspectingHabit}
                onOpenAddModal={handleOpenAddForm}
                gridStyle={gridStyle}
              />
            )}

            {currentView === 'forest' && (
              <ForestView
                isDark={isDark}
                habits={habits}
                onToggleDate={handleToggleDate}
                onOpenAddModal={handleOpenAddForm}
              />
            )}

            {currentView === 'analytics' && (
              <AnalyticsView isDark={isDark} habits={habits} />
            )}

            {currentView === 'settings' && (
              <SettingsView
                isDark={isDark}
                onClearAll={handleClearAll}
                onImportJSON={handleImportJSON}
                habits={habits}
                gridStyle={gridStyle}
                onToggleGridStyle={setGridStyle}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Sticky Action/Dock Bar */}
      <footer className={`sm:hidden fixed bottom-3 inset-x-4 h-15 sm:h-16 ${isDark ? 'bg-[#1C1A18]/95 border-white/5 shadow-2xl' : 'bg-[#FFFFFF]/95 border-[#E8E2D9] shadow-sm shadow-[#FAF6F0]'} backdrop-blur-md rounded-2xl border flex items-center justify-around px-3 z-40`}>
        {navTabs.map(({ value, label, Icon }) => {
          const isActive = currentView === value;
          return (
            <button
              id={`mob-dock-${value}`}
              key={value}
              onClick={() => setCurrentView(value)}
              className={`
                flex flex-col items-center justify-center p-1 rounded-xl transition-all select-none cursor-pointer
                ${isActive 
                  ? `${isDark ? 'text-[#FAF7F2] scale-105 font-bold' : 'text-[#4E7D5B] scale-105 font-bold'}` 
                  : `${isDark ? 'text-white/40 hover:text-white' : 'text-[#706B63]/60 hover:text-[#2C2925]'}`
                }
              `}
              title={label}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              <span className="text-[8.5px] font-mono tracking-wider mt-0.5">{label}</span>
            </button>
          );
        })}
      </footer>

      {/* MODAL 1: ADD / EDIT DIALOG */}
      {isFormOpen && (
        <HabitForm
          isDark={isDark}
          editHabit={editingHabit}
          onSave={handleSaveHabit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* MODAL 2: FULL-YEAR 365-DAY HISTORICAL MATRIX DETAILS */}
      {inspectingHabit && (
        (() => {
          const h = inspectingHabit;
          const colors = COLOR_MAP[h.color];
          const { currentStreak, maxStreak } = calculateStreaks(h.history);
          
          // Generate 365 days of year 2026 to render a high-fidelity contribution grid
          const currentYear = 2026;
          const monthsIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
          const daysInYear: { dateStr: string; done: boolean; monthIdx: number; dayNum: number }[] = [];

          monthsIndex.forEach(m => {
            const tempDate = new Date(currentYear, m, 1);
            while (tempDate.getMonth() === m) {
              const formatted = `${currentYear}-${String(m + 1).padStart(2, '0')}-${String(tempDate.getDate()).padStart(2, '0')}`;
              daysInYear.push({
                dateStr: formatted,
                done: h.history.includes(formatted),
                monthIdx: m,
                dayNum: tempDate.getDate()
              });
              tempDate.setDate(tempDate.getDate() + 1);
            }
          });

          // Completion stats for year
          const yearCompletions = daysInYear.filter(d => d.done).length;
          const totalDaysPassed = daysInYear.length;
          const annualConsistency = totalDaysPassed > 0 ? Math.round((yearCompletions / totalDaysPassed) * 100) : 0;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
              <div 
                id="habit-detail-modal"
                className={`w-full max-w-4xl border rounded-3xl p-6 sm:p-8 relative shadow-2xl my-8 text-left max-h-[92vh] overflow-y-auto ${
                  isDark 
                    ? 'bg-[#1C1A18] border-white/5 text-white' 
                    : 'bg-[#FFFFFF] border-[#E8E2D9] text-[#2C2925]'
                }`}
              >
                
                {/* Close trigger */}
                <button
                  id="close-hud-btn"
                  onClick={() => setInspectingHabit(null)}
                  className={`absolute top-5 right-5 p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-[#FAF6F0] text-[#706B63] hover:text-[#2C2925]'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Grid details header */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left: Tree avatar inside HUD */}
                  <div className={`md:col-span-3 flex flex-col items-center justify-center py-6 px-4 rounded-2xl border ${
                    isDark ? 'bg-[#12110F] border-white/5' : 'bg-[#FAF8F5] border-[#E8E2D9] shadow-inner'
                  }`}>
                    <TreeGraphic species={h.treeSpecies} streak={currentStreak} size={110} isDark={isDark} />
                    <span className={`font-sans text-sm font-semibold tracking-tight mt-6 capitalize ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
                      {h.treeSpecies} Species
                    </span>
                    <span className={`text-[10px] font-mono mt-1 ${isDark ? 'text-neutral-500' : 'text-[#706B63]'}`}>
                      Growth: Stage {currentStreak >= 40 ? '5' : currentStreak >= 15 ? '4' : currentStreak >= 6 ? '3' : currentStreak >= 2 ? '2' : '1'}
                    </span>
                  </div>

                  {/* Right: Details content */}
                  <div className="md:col-span-9 space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className={`p-1.5 rounded-lg border ${colors.bg} ${colors.text} ${colors.border}`}>
                          <HabitIcon name={h.icon} />
                        </div>
                        <h2 className={`text-xl sm:text-2xl font-sans font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
                          {h.name}
                        </h2>
                      </div>
                      <p className={`text-sm mt-2 ${isDark ? 'text-neutral-400' : 'text-[#706B63]'}`}>
                        {h.description || 'Watch your streak nurture this seed.'}
                      </p>
                    </div>

                    {/* Numerical Stats Badge Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#12110F] border-white/5' : 'bg-[#FAF8F5] border-[#E8E2D9] shadow-sm'}`}>
                        <span className={`block text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-[#706B63]'}`}>CURRENT STREAK</span>
                        <div className="text-lg font-bold font-mono text-[#C56B48] mt-1 flex items-center gap-1">
                          <Flame className="w-4 h-4 fill-current text-[#C56B48]" /> {currentStreak} d
                        </div>
                      </div>

                      <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#12110F] border-white/5' : 'bg-[#FAF8F5] border-[#E8E2D9] shadow-sm'}`}>
                        <span className={`block text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-[#706B63]'}`}>MAX STREAK</span>
                        <div className={`text-lg font-bold font-mono mt-1 flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
                          <Award className="w-4 h-4 text-[#C9BCA9]" /> {maxStreak} d
                        </div>
                      </div>

                      <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#12110F] border-white/5' : 'bg-[#FAF8F5] border-[#E8E2D9] shadow-sm'}`}>
                        <span className={`block text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-[#706B63]'}`}>WATERINGS</span>
                        <div className={`text-lg font-bold font-mono mt-1 flex items-center gap-1.5 ${isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'}`}>
                          <Calendar className="w-4 h-4" /> {h.history.length}
                        </div>
                      </div>

                      <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#12110F] border-white/5' : 'bg-[#FAF8F5] border-[#E8E2D9] shadow-sm'}`}>
                        <span className={`block text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-[#706B63]'}`}>CONSISTENCY</span>
                        <div className={`text-lg font-bold font-mono mt-1 flex items-center gap-1.5 ${isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'}`}>
                          <Target className="w-4 h-4 text-[#4E7D5B]" /> {annualConsistency}%
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* THE 12-MONTH BIG HEATMAP MATRIX (CORE HABITKIT LANDMARK) */}
                <div className={`mt-8 pt-6 border-t pb-2 ${isDark ? 'border-white/5' : 'border-[#E8E2D9]'}`}>
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest mb-4">
                    <span className={isDark ? 'text-neutral-500' : 'text-[#706B63]'}>365-Day Year Heatmap Calendar (2026)</span>
                  </div>

                  {/* Calendar view organized by 12 month cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {monthsIndex.map(m => {
                      const monthName = new Date(currentYear, m, 1).toLocaleString('en-US', { month: 'short' });
                      const monthDays = daysInYear.filter(d => d.monthIdx === m);

                      return (
                        <div key={m} className={`p-3 rounded-xl border flex flex-col justify-between ${
                          isDark ? 'bg-[#12110F] border-white/5' : 'bg-[#FAF8F5] border-[#E8E2D9]'
                        }`}>
                          <span className={`block text-[10px] font-mono tracking-widest uppercase mb-2 text-center border-b pb-1 font-bold ${
                            isDark ? 'text-[#4E7D5B] border-white/5' : 'text-[#4E7D5B] border-[#E8E2D9]'
                          }`}>
                            {monthName}
                          </span>

                          {/* Grid layout for day cells */}
                          <div className="grid grid-cols-7 gap-1">
                            {monthDays.map(cell => (
                              <button
                                key={cell.dateStr}
                                onClick={() => handleToggleDate(h.id, cell.dateStr)}
                                style={{
                                  backgroundColor: cell.done ? colors.accent : undefined
                                }}
                                className={`
                                  aspect-square rounded-sm text-[6px] font-mono flex items-center justify-center transition-colors select-none cursor-pointer
                                  ${cell.done 
                                    ? 'text-[#141210] font-bold' 
                                    : isDark 
                                      ? 'bg-white/5 hover:bg-white/10 text-white/20' 
                                      : 'bg-[#EFEAE2] hover:bg-[#E4DDD2] text-[#706B63]/40'
                                  }
                                `}
                                title={`${cell.dateStr} - ${cell.done ? 'Completed' : 'Tap to toggle'}`}
                              >
                                {cell.dayNum}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          );
        })()
      )}

    </div>
  );
}
