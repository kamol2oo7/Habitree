import { Habit } from '../types';
import HabitCard from './HabitCard';
import React, { useState } from 'react';
import { Plus, Sparkles, CheckSquare, CalendarDays, Sprout } from 'lucide-react';
import { getLocalDateString } from '../utils';
import AppLogo from './AppLogo';

interface DashboardViewProps {
  isDark: boolean;
  habits: Habit[];
  onToggleDate: (habitId: string, dateStr: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onSelectHabit: (habit: Habit) => void;
  onOpenAddModal: () => void;
  gridStyle?: 'classic_strip' | 'mini_heatmap';
}

export default function DashboardView({
  isDark,
  habits,
  onToggleDate,
  onEditHabit,
  onDeleteHabit,
  onSelectHabit,
  onOpenAddModal,
  gridStyle = 'classic_strip'
}: DashboardViewProps) {
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const todayStr = getLocalDateString(0);

  // Filter logic
  const filteredHabits = habits.filter((habit) => {
    const matchesColor = selectedColorFilter === 'all' || habit.color === selectedColorFilter;
    return matchesColor;
  });

  // Calculate today completions
  const completionsTodayCount = habits.filter(h => h.history.includes(todayStr)).length;
  const totalHabitsCount = habits.length;
  const completionPercentage = totalHabitsCount > 0 
    ? Math.round((completionsTodayCount / totalHabitsCount) * 100) 
    : 0;

  // Pretty current local date header string: e.g. "Friday, May 22, 2026"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div id="dashboard-view-container" className="space-y-6 text-left">
      
      {/* Date Header and Plant Seed Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className={`text-xs font-mono uppercase tracking-widest font-bold ${isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'}`}>
            {formattedDate}
          </span>
          <h1 className={`text-2xl sm:text-3xl font-sans font-bold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
            Habitree Workspace
          </h1>
        </div>

        <button
          id="add-habit-workspace-btn"
          onClick={onOpenAddModal}
          className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all select-none border active:scale-95 self-start sm:self-auto cursor-pointer ${
            isDark 
              ? 'bg-[#4E7D5B] border-[#4E7D5B] text-black hover:bg-[#5E956D]' 
              : 'bg-[#4E7D5B] border-[#4E7D5B] text-white hover:bg-[#3D6247] shadow-sm'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Plant New Seed</span>
        </button>
      </div>

      {/* TODAY COMPLETION SUMMARY CARD */}
      {totalHabitsCount > 0 && (
        <div className={`border p-6 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${
          isDark 
            ? 'bg-[#1C1A18] border-white/5' 
            : 'bg-[#FFFFFF] border-[#E8E2D9] shadow-sm'
        }`}>
          <div className="space-y-1 z-10">
            <span className={`text-[10px] font-mono uppercase tracking-widest block font-bold ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>Today Status Checklist</span>
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
              You registered {completionsTodayCount} of {totalHabitsCount} completions
            </h3>
            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#706B63]'}`}>
              {completionPercentage >= 100 
                ? "Perfect score! All your habitrees have been watered and nourished today." 
                : "Water more habit seeds to build compound streaks."
              }
            </p>
          </div>

          <div className="flex items-center gap-4 z-10 w-full sm:w-auto">
            {/* Horizontal progress bar */}
            <div className={`flex-1 sm:w-28 rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-[#EFEAE2]'}`}>
              <div 
                className="bg-[#4E7D5B] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className={`font-mono font-extrabold text-sm whitespace-nowrap ${isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'}`}>
              {completionPercentage}% Done
            </span>
          </div>

          {/* Absolute decorative bg blob */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#4E7D5B]/5 to-transparent pointer-events-none" />
        </div>
      )}

      {/* FILTERS TOOLBAR */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl border transition-colors ${
        isDark 
          ? 'bg-[#1C1A18] border-white/5' 
          : 'bg-[#FFFFFF] border-[#E8E2D9]'
      }`}>
        
        {/* Categories Pills Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none w-full justify-between sm:justify-start">
          <span className={`text-[10px] uppercase font-mono tracking-wider px-2 hidden sm:inline ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>Palette:</span>
          {[
            { value: 'all', label: 'All' },
            { value: 'lime', label: 'Sage', colorCode: '#4E7D5B' },
            { value: 'blue', label: 'Ocean', colorCode: '#39789C' },
            { value: 'purple', label: 'Lavender', colorCode: '#7E619E' },
            { value: 'orange', label: 'Terracotta', colorCode: '#C56B48' },
            { value: 'rose', label: 'Crimson', colorCode: '#B04C5A' },
          ].map((pill) => {
            const isSelected = selectedColorFilter === pill.value;
            return (
              <button
                key={pill.value}
                onClick={() => setSelectedColorFilter(pill.value)}
                className={`
                  px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all duration-200 uppercase flex items-center gap-1.5 select-none cursor-pointer
                  ${isSelected 
                    ? 'bg-[#4E7D5B] text-[#FAF7F2] font-extrabold shadow-sm' 
                    : isDark 
                      ? 'bg-white/5 text-[#ECE9E0]/60 hover:text-white border border-white/5 hover:border-white/10'
                      : 'bg-[#FAF8F5] text-[#706B63] hover:text-[#2C2925] border border-[#E8E2D9] hover:border-[#4E7D5B]'
                  }
                `}
              >
                {pill.colorCode && (
                  <span className="w-1.5 h-1.5 rounded-full animate-none" style={{ backgroundColor: pill.colorCode }} />
                )}
                <span>{pill.label || pill.value}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* HABIT GRID LIST */}
      {filteredHabits.length === 0 ? (
        <div className={`border border-dashed rounded-2xl py-16 px-4 text-center ${
          isDark 
            ? 'border-white/5 bg-[#1C1A18]' 
            : 'border-[#E8E2D9] bg-[#FFFFFF]'
        }`}>
          <div className="max-w-md mx-auto flex flex-col items-center">
            <AppLogo size={56} className="mb-4" color="#4E7D5B" />
            
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
              {habits.length === 0 ? 'No seed tracks yet!' : 'No matching habits found'}
            </h3>
            <p className={`text-xs mt-1 max-w-sm ${isDark ? 'text-white/40' : 'text-[#706B63]'}`}>
              {habits.length === 0 
                ? 'Plant your very first Habitree seed to track consistency and watch gorgeous vector graphics sway.' 
                : 'Try adjusting your search keywords or palette classification and attempt another lookup.'
              }
            </p>

            {habits.length === 0 && (
              <button
                id="workspace-plant-seed-empty"
                onClick={onOpenAddModal}
                className="mt-6 px-4 py-2.5 bg-[#4E7D5B] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all select-none hover:bg-[#3D6247] cursor-pointer"
              >
                Plant a Seed Now
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              isDark={isDark}
              habit={habit}
              onToggleDate={onToggleDate}
              onEdit={onEditHabit}
              onDelete={onDeleteActiveHabit}
              onSelect={onSelectHabit}
              gridStyle={gridStyle}
            />
          ))}
        </div>
      )}

    </div>
  );

  // Wrap delete with standard function
  function onDeleteActiveHabit(id: string) {
    onDeleteHabit(id);
  }
}
