import { Habit, TreeSpecies } from '../types';
import { calculateStreaks, COLOR_MAP, getLocalDateString } from '../utils';
import { Trash2, Edit2, Flame, Award, Calendar, Check, Play, Trees, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import TreeGraphic from './TreeGraphic';
import { motion, AnimatePresence } from 'motion/react';

// Safe dynamic icon rendering helper
import {
  Terminal,
  Droplet,
  Dumbbell,
  BookOpen,
  Wind,
  Target,
  Brain,
  Coffee,
  Heart,
  Sparkles,
  CheckCircle2,
  Zap,
  Flame as FlameIcon, // Avoid conflict with existing Flame import
  Moon,
  Sun,
  Sprout,
  Briefcase,
  Music,
  Apple,
  Scroll,
  Leaf
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Terminal,
  Droplet,
  Dumbbell,
  BookOpen,
  Wind,
  Target,
  Brain,
  Coffee,
  Heart,
  Sparkles,
  CheckCircle2,
  Zap,
  Flame: FlameIcon,
  Moon,
  Sun,
  Sprout,
  Briefcase,
  Music,
  Apple,
  Scroll,
  Leaf
};

export function HabitIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = iconMap[name] || Terminal;
  return <IconComponent className={className} />;
}

interface HabitCardProps {
  isDark: boolean;
  key?: string;
  habit: Habit;
  onToggleDate: (habitId: string, dateStr: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onSelect: (habit: Habit) => void;
  gridStyle?: 'classic_strip' | 'mini_heatmap';
}

export default function HabitCard({ 
  isDark, 
  habit, 
  onToggleDate, 
  onEdit, 
  onDelete, 
  onSelect,
  gridStyle = 'classic_strip'
}: HabitCardProps) {
  const colors = COLOR_MAP[habit.color] || COLOR_MAP.lime;
  const todayStr = getLocalDateString(0);
  const isCompletedToday = habit.history.includes(todayStr);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { currentStreak, maxStreak } = calculateStreaks(habit.history);
  
  // Days of the current calendar month (aligned with real calendar)
  const d = new Date();
  const currentYear = d.getFullYear();
  const currentMonthIdx = d.getMonth();
  const currentMonthName = d.toLocaleString('en-US', { month: 'long' });
  const totalDaysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();

  const gridDays: { dateStr: string; label: string; dayNum: number; shortLabel: string; done: boolean; isToday: boolean }[] = [];
  const daysAbbrev = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  for (let i = 1; i <= totalDaysInMonth; i++) {
    const dayDate = new Date(currentYear, currentMonthIdx, i);
    const yState = dayDate.getFullYear();
    const mState = String(dayDate.getMonth() + 1).padStart(2, '0');
    const dState = String(dayDate.getDate()).padStart(2, '0');
    const dateStr = `${yState}-${mState}-${dState}`;

    gridDays.push({
      dateStr,
      label: dayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      dayNum: i,
      shortLabel: daysAbbrev[dayDate.getDay()],
      done: habit.history.includes(dateStr),
      isToday: dateStr === todayStr
    });
  }

  const heatmapScrollRef = React.useRef<HTMLDivElement>(null);

  // Generate 3 months of historical data for heatmap
  const heatmapMonths: { monthIdx: number; year: number; label: string }[] = [];
  for (let i = 2; i >= 0; i--) {
    let m = currentMonthIdx - i;
    let y = currentYear;
    if (m < 0) {
      m += 12;
      y -= 1;
    }
    const tempMonthDate = new Date(y, m, 1);
    const label = tempMonthDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    heatmapMonths.push({ monthIdx: m, year: y, label });
  }

  const renderMiniHeatmapMonth = (monthIdx: number, year: number) => {
    const firstDay = new Date(year, monthIdx, 1);
    const offset = firstDay.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
    const totalDays = new Date(year, monthIdx + 1, 0).getDate();
    
    interface HeatmapCell {
      isEmpty: boolean;
      id: string;
      dateStr?: string;
      dayNum?: number;
      done?: boolean;
      isToday?: boolean;
    }

    const items: HeatmapCell[] = [];
    // Offsets
    for (let i = 0; i < offset; i++) {
      items.push({ isEmpty: true, id: `offset-${monthIdx}-${i}` });
    }
    // Days
    for (let dNum = 1; dNum <= totalDays; dNum++) {
      const dateObj = new Date(year, monthIdx, dNum);
      const yStr = dateObj.getFullYear();
      const mStr = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dStr = String(dateObj.getDate()).padStart(2, '0');
      const dateStr = `${yStr}-${mStr}-${dStr}`;
      
      items.push({
        isEmpty: false,
        id: dateStr,
        dateStr,
        dayNum: dNum,
        done: habit.history.includes(dateStr),
        isToday: dateStr === todayStr
      });
    }

    return (
      <div key={`heatmap-month-${monthIdx}-${year}`} className={`flex-shrink-0 w-[184px] flex flex-col p-2.5 rounded-xl border select-none transition-colors ${
        isDark 
          ? 'bg-[#12110F] border-white/5 text-[#ECE9E0]' 
          : 'bg-[#FAF8F5] border-[#E8E2D9]/50 text-[#2C2925] shadow-inner'
      }`}>
        {/* Month Name */}
        <span className={`text-[10px] font-mono font-bold tracking-wider mb-2 text-center uppercase ${
          isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'
        }`}>
          {firstDay.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </span>

        {/* Calendar Week Headers */}
        <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((wd) => (
            <span key={`wd-${wd}`} className={`text-[8.5px] font-mono font-bold tracking-wider ${
              isDark ? 'text-[#9D9A90]/40' : 'text-[#706B63]/65'
            }`}>
              {wd}
            </span>
          ))}
        </div>

        {/* Grid of Days */}
        <div className="grid grid-cols-7 gap-1.5">
          {items.map((item) => {
            if (item.isEmpty) {
              return <div key={item.id} className="aspect-square w-[19px] h-[19px]" />;
            }
            
            return (
              <button
                id={`grid-cell-${habit.id}-${item.dateStr}`}
                key={item.id}
                onClick={(e) => { e.stopPropagation(); onToggleDate(habit.id, item.dateStr!); }}
                className={`
                  aspect-square w-[19px] h-[19px] rounded flex items-center justify-center transition-all duration-300 cursor-pointer border select-none text-[8px] font-mono font-extrabold p-0 m-0
                  ${item.done 
                    ? 'text-white border-transparent' 
                    : isDark 
                      ? 'bg-white/5 hover:bg-white/10 border-transparent text-[#9D9A90]/35' 
                      : 'bg-[#EFEAE2] hover:bg-[#E4DDD2] border-[#E8E2D9]/40 text-[#706B63]/60'
                  }
                  ${item.isToday && !item.done ? 'border-[#4E7D5B] ring-1 ring-[#4E7D5B]/30 scale-105' : ''}
                  ${item.isToday && item.done ? 'ring-1 ring-white scale-105 shadow-sm' : ''}
                `}
                style={{
                  backgroundColor: item.done ? colors.accent : undefined,
                  borderColor: item.done ? colors.accent : undefined,
                }}
                disabled={isConfirmingDelete}
                title={`${item.dateStr} - ${item.done ? 'Completed' : 'Tap to toggle'}`}
              >
                {item.dayNum}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Smooth scroll center to today's active cell when card is expanded
  React.useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        if (gridStyle === 'mini_heatmap') {
          if (heatmapScrollRef.current) {
            heatmapScrollRef.current.scrollLeft = heatmapScrollRef.current.scrollWidth;
          }
        } else {
          const activeCell = document.getElementById(`grid-cell-${habit.id}-${todayStr}`);
          if (activeCell) {
            activeCell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      }, 100);
    }
  }, [isExpanded, habit.id, todayStr, gridStyle]);

  // Calculate 30-day completion rate
  const last30DaysCount = 30;
  let completionsLast30 = 0;
  for (let i = 0; i < last30DaysCount; i++) {
    const tempD = new Date();
    tempD.setDate(tempD.getDate() - i);
    const dateStr = `${tempD.getFullYear()}-${String(tempD.getMonth() + 1).padStart(2, '0')}-${String(tempD.getDate()).padStart(2, '0')}`;
    if (habit.history.includes(dateStr)) {
      completionsLast30++;
    }
  }
  const completionRate = Math.round((completionsLast30 / last30DaysCount) * 100);

  return (
    <div 
      id={`habit-card-${habit.id}`}
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative border rounded-2xl p-5 transition-[background-color,border-color,box-shadow] duration-300 flex flex-col justify-between cursor-pointer select-none overflow-hidden ${
        isDark 
          ? 'bg-[#1C1A18] hover:bg-[#22201D] border-white/5 shadow-2xl' 
          : 'bg-[#FFFFFF] hover:bg-[#FAF9F5] border-[#E8E2D9] shadow-sm'
      } hover:shadow-md`}
    >
      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {isConfirmingDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent expansion trigger
            className={`absolute inset-0 rounded-2xl backdrop-blur-md z-30 flex flex-col items-center justify-center p-5 ${
              isDark ? 'bg-[#181112]/96' : 'bg-[#FAF3F3]/96'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2.5 ${
              isDark ? 'bg-[#B04C5A]/15 text-[#B04C5A]' : 'bg-[#B04C5A]/10 text-[#B04C5A]'
            }`}>
              <Trash2 className="w-4.5 h-4.5" />
            </div>

            <p className={`text-xs font-semibold tracking-tight text-center ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
              Permanently delete "{habit.name}"?
            </p>

            <div className="flex items-center gap-2.5 w-full max-w-[210px] mt-4">
              <button
                id={`cancel-del-btn-${habit.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmingDelete(false);
                }}
                className={`flex-1 py-1.8 text-[11px] font-mono uppercase tracking-wider font-bold rounded-xl transition-all cursor-pointer border ${
                  isDark 
                    ? 'bg-transparent border-[#FAF8F5]/10 hover:bg-[#FAF8F5]/5 text-[#9D9A90]' 
                    : 'bg-transparent border-[#E8E2D9] hover:bg-[#FAF6F0] text-[#706B63]'
                }`}
              >
                Keep
              </button>
              <button
                id={`confirm-del-btn-${habit.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(habit.id);
                }}
                className="flex-1 py-1.8 text-[11px] font-mono uppercase tracking-wider font-bold rounded-xl bg-[#B04C5A] hover:bg-[#C05D6B] text-white transition-all cursor-pointer shadow-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top section: Icon, Name, and Quick Controls */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Styled Icon Avatar */}
            <div className={`p-2.5 rounded-xl border ${colors.bg} ${colors.text} ${colors.border}`}>
              <HabitIcon name={habit.icon} className="w-5 h-5" />
            </div>
            
            <div className="text-left">
              <h3 className={`font-sans font-medium transition-colors tracking-tight text-base flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
                <span>{habit.name}</span>
                <span className="flex items-center gap-0.5 text-xs text-[#C56B48] font-mono font-bold">
                  <Flame className="w-3.5 h-3.5 fill-current" /> {currentStreak}d
                </span>
              </h3>
              <p className={`text-xs line-clamp-1 mt-0.5 ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>
                {habit.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
            <button 
              id={`edit-btn-${habit.id}`}
              onClick={(e) => { e.stopPropagation(); onEdit(habit); }}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-[#C59B8E]' : 'hover:bg-[#FAF6F0] text-[#706B63] hover:text-[#4E7D5B]'
              }`}
              title="Edit Habit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button 
              id={`delete-btn-${habit.id}`}
              onClick={(e) => { e.stopPropagation(); setIsConfirmingDelete(true); }}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-red-400' : 'hover:bg-[#FAF6F0] text-[#706B63] hover:text-red-500'
              }`}
              title="Delete Habit"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button 
              id={`expand-btn-${habit.id}`}
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-[#FAF6F0] text-[#706B63] hover:text-[#2C2925]'
              }`}
              title={isExpanded ? "Collapse Details" : "Expand Details"}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Dynamic Expandable Frame */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Prevent clicking inside metrics/grids from collapsing parent card
        >
          {/* Mid section: Grid metrics and growing habitree visual */}
          <div className="grid grid-cols-12 gap-4 mt-6 items-center">
            
            {/* Tree growth stage visual */}
            <div 
              onClick={(e) => { e.stopPropagation(); onSelect(habit); }}
              className={`col-span-4 flex flex-col items-center justify-center cursor-pointer p-2 rounded-xl border transition-colors ${
                isDark 
                  ? 'bg-[#12110F] border-white/5 hover:bg-[#12110F]/80' 
                  : 'bg-[#FAF8F5] border-[#E8E2D9] hover:bg-[#FFFFFF] shadow-inner'
              }`}
              title="Click to view detailed tree & statistics"
            >
              <TreeGraphic species={habit.treeSpecies} streak={currentStreak} size={76} isDark={isDark} />
            </div>

            {/* Core Numerical Stats */}
            <div className="col-span-8 flex flex-col justify-around h-full space-y-2">
              <div className="flex items-center justify-between text-xs px-1">
                <div className={`flex items-center gap-1.5 ${isDark ? 'text-[#9D9A90]' : 'text-[#5C615C]'}`}>
                  <Flame className="w-4 h-4 text-[#C56B48]" />
                  <span>Streak</span>
                </div>
                <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-0.5 border ${
                  isDark 
                    ? 'text-[#C56B48] bg-[#C56B48]/10 border-[#C56B48]/20' 
                    : 'text-[#C56B48] bg-[#FAF8F5] border-[#E8E2D9]'
                }`}>
                  {currentStreak}d
                </span>
              </div>

              <div className="flex items-center justify-between text-xs px-1">
                <div className={`flex items-center gap-1.5 ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>
                  <Award className="w-4 h-4 text-[#C9BCA9]" />
                  <span>Max Streak</span>
                </div>
                <span className={`font-mono ${isDark ? 'text-white/80' : 'text-[#2C2925]/80'}`}>
                  {maxStreak}d
                </span>
              </div>

              <div className="flex items-center justify-between text-xs px-1">
                <div className={`flex items-center gap-1.5 ${isDark ? 'text-[#9D9A90]' : 'text-[#5C615C]'}`}>
                  <Calendar className="w-4 h-4 text-[#4E7D5B]" />
                  <span>Activity (30d)</span>
                </div>
                <span className={`font-mono font-medium ${isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'}`}>
                  {completionRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic HabitKit calendar-like list, horizontal-scrollable with hidden scrollbars */}
          <div className="mt-5">
            <div className={`flex items-center justify-between text-[10px] uppercase tracking-widest mb-2 font-mono ${
              isDark ? 'text-[#9D9A90]/60' : 'text-[#706B63]/60'
            }`}>
              <span>{gridStyle === 'mini_heatmap' ? '90-Day Heatmap Grid' : `${currentMonthName} Calendar Grid`}</span>
              <span className={`text-[9.5px] lowercase hover:underline cursor-pointer ${
                isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B] font-bold'
              }`} onClick={(e) => { e.stopPropagation(); onSelect(habit); }}>
                view analytics
              </span>
            </div>

            {/* Horizontal Scrollable Row */}
            <div className="relative">
              {gridStyle === 'mini_heatmap' ? (
                /* HEATMAP GRID VIEW: 3-month real-calendar Contribution Grid, horizontally scrollable */
                <div 
                  ref={heatmapScrollRef}
                  className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth p-1"
                >
                  {heatmapMonths.map((m) => renderMiniHeatmapMonth(m.monthIdx, m.year))}
                </div>
              ) : (
                /* CLASSIC STRIP VIEW: Horizontal capsules of daily tracking list */
                <div className={`flex gap-2 p-2.5 rounded-xl border overflow-x-auto scrollbar-none scroll-smooth ${
                  isDark 
                    ? 'bg-[#12110F] border-white/5' 
                    : 'bg-[#FAF8F5] border-[#E8E2D9]/50 shadow-inner'
                }`}>
                  {gridDays.map((day) => (
                    <button
                      id={`grid-cell-${habit.id}-${day.dateStr}`}
                      key={day.dateStr}
                      onClick={(e) => { e.stopPropagation(); onToggleDate(habit.id, day.dateStr); }}
                      className={`
                        flex-shrink-0 w-11 h-14 rounded-xl flex flex-col items-center justify-between p-1.5 transition-all duration-300 cursor-pointer border select-none
                        ${day.done 
                          ? 'text-white' 
                          : isDark 
                            ? 'bg-white/5 hover:bg-white/10 border-transparent' 
                            : 'bg-[#EFEAE2] hover:bg-[#E4DDD2] border-[#E8E2D9]/50'
                        }
                        ${day.isToday && !day.done ? 'border-[#4E7D5B] ring-1 ring-[#4E7D5B]/30 scale-105' : ''}
                        ${day.isToday && day.done ? 'ring-2 ring-white scale-105' : ''}
                      `}
                      style={{
                        backgroundColor: day.done ? colors.accent : undefined,
                        borderColor: day.done ? colors.accent : undefined,
                      }}
                      disabled={isConfirmingDelete}
                      title={`${day.label} (${day.shortLabel}) - ${day.done ? 'Completed' : 'Tap to toggle'}`}
                    >
                      {/* Weekday abbreviation */}
                      <span className={`text-[8.5px] font-mono font-bold uppercase tracking-wider ${
                        day.done 
                          ? 'text-[#FAF7F2]/80' 
                          : isDark 
                            ? 'text-[#9D9A90]/50' 
                            : 'text-[#706B63]/60'
                      }`}>
                        {day.shortLabel}
                      </span>
                      {/* Day number */}
                      <span className={`text-xs font-mono font-bold leading-none ${
                        day.done 
                          ? 'text-[#FAF7F2]' 
                          : isDark 
                            ? 'text-[#ECE9E0]' 
                            : 'text-[#2C2925]'
                      }`}>
                        {String(day.dayNum).padStart(2, '0')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Row: Quick Toggle Completion for Today */}
      <div 
        onClick={(e) => e.stopPropagation()} // Prevent quick toggle bar clicks from collapsing/opening parent card
        className={`mt-5 pt-4 border-t flex items-center justify-between ${
          isDark ? 'border-white/5' : 'border-[#E8E2D9]'
        }`}
      >
        <span className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isCompletedToday ? 'bg-[#4E7D5B]' : 'bg-neutral-400'}`} />
          {isCompletedToday ? 'Completed today' : 'Incomplete today'}
        </span>

        <button
          id={`toggle-today-${habit.id}`}
          onClick={(e) => { e.stopPropagation(); onToggleDate(habit.id, todayStr); }}
          disabled={isConfirmingDelete}
          className={`
            px-4 py-1.5 rounded-xl text-xs font-semibold tracking-tight flex items-center gap-1.5 transition-all outline-none select-none border cursor-pointer
            ${isCompletedToday 
              ? isDark 
                ? 'bg-white/5 border-white/5 text-[#4E7D5B] hover:bg-white/10' 
                : 'bg-[#FAF8F5] border-[#E8E2D9] text-[#4E7D5B] hover:bg-[#FFFFFF]'
              : `bg-[#4E7D5B] border-[#4E7D5B] ${isDark ? 'text-black hover:bg-[#5E956D]' : 'text-white hover:bg-[#3D6247]'} shadow-sm active:scale-95`
            }
          `}
        >
          {isCompletedToday ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Done</span>
            </>
          ) : (
            <>
              <span>Mark Done</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
