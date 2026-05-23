import React, { useState, useEffect } from 'react';
import { Habit, TreeSpecies } from '../types';
import { ColorPreset } from '../utils';
import { COLOR_MAP } from '../utils';
import {
  X,
  Check,
  Eye,
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
  Zap,
  Flame,
  Moon,
  Sun,
  Sprout,
  Briefcase,
  Music,
  Apple,
  Scroll,
  Leaf,
  Bell,
  BellOff
} from 'lucide-react';
import TreeGraphic from './TreeGraphic';

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
  Zap,
  Flame,
  Moon,
  Sun,
  Sprout,
  Briefcase,
  Music,
  Apple,
  Scroll,
  Leaf
};

// Preset icon choices
const ICON_CHOICES = [
  { name: 'Terminal', label: 'Tech & Code' },
  { name: 'Droplet', label: 'Water & Fluid' },
  { name: 'Dumbbell', label: 'Gym & Sports' },
  { name: 'BookOpen', label: 'Study & Reading' },
  { name: 'Wind', label: 'Zen & Breath' },
  { name: 'Target', label: 'Focus & Goals' },
  { name: 'Brain', label: 'Mental Health' },
  { name: 'Coffee', label: 'Energy & Drink' },
  { name: 'Heart', label: 'Care & Cardio' },
  { name: 'Sparkles', label: 'Creativity' },
  { name: 'Sprout', label: 'Growth & Nature' },
  { name: 'Flame', label: 'Passion & Drive' },
  { name: 'Zap', label: 'Quick Habits' },
  { name: 'Moon', label: 'Night & Sleep' },
  { name: 'Sun', label: 'Day & Focus' },
  { name: 'Briefcase', label: 'Work & Biz' },
  { name: 'Music', label: 'Arts & Melody' },
  { name: 'Apple', label: 'Diet & Wellness' },
  { name: 'Scroll', label: 'Journaling' },
  { name: 'Leaf', label: 'Ecosystem' },
];

const TREE_CHOICES: { value: TreeSpecies; label: string; desc: string }[] = [
  { value: 'cherry', label: 'Cherry Blossom', desc: 'Sways with beautiful pink petals' },
  { value: 'pine', label: 'Evergreen Pine', desc: 'Thrives in snowy heights' },
  { value: 'oak', label: 'Golden Oak', desc: 'Grand majestic crown' },
  { value: 'palm', label: 'Windy Palm', desc: 'Tropical relaxation design' },
  { value: 'bonsai', label: 'Zen Bonsai', desc: 'Artistic twisted branches' },
];

interface HabitFormProps {
  isDark: boolean;
  editHabit?: Habit | null;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt' | 'history'>) => void;
  onClose: () => void;
}

export default function HabitForm({ isDark, editHabit, onSave, onClose }: HabitFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Terminal');
  const [color, setColor] = useState<'lime' | 'blue' | 'purple' | 'orange' | 'rose'>('lime');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'days'>('daily');
  const [targetDaysCount, setTargetDaysCount] = useState(3);
  const [weeklyDays, setWeeklyDays] = useState<number[]>([1, 3, 5]); // Default Mon, Wed, Fri
  const [treeSpecies, setTreeSpecies] = useState<TreeSpecies>('cherry');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderActive, setReminderActive] = useState(false);

  // Load existing habit info if editing
  useEffect(() => {
    if (editHabit) {
      setName(editHabit.name);
      setDescription(editHabit.description);
      setIcon(editHabit.icon);
      setColor(editHabit.color);
      setFrequency(editHabit.frequency);
      if (editHabit.targetDaysCount) setTargetDaysCount(editHabit.targetDaysCount);
      if (editHabit.weeklyDays) setWeeklyDays(editHabit.weeklyDays);
      setTreeSpecies(editHabit.treeSpecies);
      setReminderTime(editHabit.reminderTime || '');
      setReminderActive(!!editHabit.reminderActive);
    }
  }, [editHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      frequency,
      targetDaysCount: frequency === 'weekly' ? targetDaysCount : undefined,
      weeklyDays: frequency === 'days' ? weeklyDays : undefined,
      treeSpecies,
      reminderTime: reminderActive && reminderTime ? reminderTime : undefined,
      reminderActive: reminderActive && !!reminderTime,
    });
  };

  const toggleWeeklyDay = (dayIndex: number) => {
    if (weeklyDays.includes(dayIndex)) {
      if (weeklyDays.length > 1) {
        setWeeklyDays(weeklyDays.filter(d => d !== dayIndex));
      }
    } else {
      setWeeklyDays([...weeklyDays, dayIndex].sort());
    }
  };

  const selectedColorMap = COLOR_MAP[color] || COLOR_MAP.lime;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        id="habit-form-modal"
        className={`w-full max-w-xl border rounded-2xl p-6 sm:p-8 relative shadow-2xl my-8 text-left max-h-[90vh] overflow-y-auto ${
          isDark 
            ? 'bg-[#1C1A18] border-white/5 text-white' 
            : 'bg-[#FFFFFF] border-[#E4E7E4] text-[#1C1E1C]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-sans font-semibold ${isDark ? 'text-white' : 'text-[#1C1E1C]'}`}>
              {editHabit ? 'Refine Habitree' : 'Plant New Habitree'}
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-[#5C615C]'}`}>
              {editHabit ? 'Modify parameters and watch your tree thrive.' : 'Define your parameters to spawn a digital seedling.'}
            </p>
          </div>
          <button
            id="close-form-btn"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'hover:bg-white/5 text-white/40 hover:text-white' : 'hover:bg-[#F5F6F5] text-[#5C615C] hover:text-[#1C1E1C]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Name & Notes */}
          <div className="space-y-4">
            <div>
              <label htmlFor="habit-name" className={`block text-xs font-mono uppercase tracking-wider mb-2 ${
                isDark ? 'text-white/40' : 'text-[#5C615C]'
              }`}>
                Habit Title *
              </label>
              <input
                id="habit-name"
                type="text"
                required
                placeholder="e.g. Meditate daily, Workout"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4E7D5B] focus:ring-1 focus:ring-[#4E7D5B] transition-colors ${
                  isDark 
                    ? 'bg-[#12110F] border-white/5 text-white placeholder:text-white/20' 
                    : 'bg-[#F5F6F5] border-[#E4E7E4] text-[#1C1E1C] placeholder:text-neutral-400'
                }`}
              />
            </div>

            <div>
              <label htmlFor="habit-desc" className={`block text-xs font-mono uppercase tracking-wider mb-2 ${
                isDark ? 'text-white/40' : 'text-[#5C615C]'
              }`}>
                Description / Purpose
              </label>
              <textarea
                id="habit-desc"
                placeholder="Why is this habit critical to your growth?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4E7D5B] focus:ring-1 focus:ring-[#4E7D5B] transition-colors resize-none ${
                  isDark 
                    ? 'bg-[#12110F] border-white/5 text-white placeholder:text-white/20' 
                    : 'bg-[#F5F6F5] border-[#E4E7E4] text-[#1C1E1C] placeholder:text-neutral-400'
                }`}
              />
            </div>
          </div>

          {/* Section: Icon Selection */}
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-2.5 ${
              isDark ? 'text-white/40' : 'text-[#5C615C]'
            }`}>
              Select Icon
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {ICON_CHOICES.map((item) => {
                const isSelected = icon === item.name;
                const IconComp = iconMap[item.name || 'Terminal'];
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIcon(item.name)}
                    title={item.label}
                    className={`
                      aspect-square rounded-xl flex items-center justify-center border transition-all duration-200 outline-none cursor-pointer
                      ${isSelected 
                        ? isDark 
                          ? 'bg-[#4E7D5B]/15 border-[#4E7D5B] text-[#4E7D5B]' 
                          : 'bg-[#4E7D5B]/15 border-[#4E7D5B] text-[#4E7D5B]'
                        : isDark 
                          ? 'bg-[#12110F] border-white/5 text-white/40 hover:border-white/10 hover:text-white'
                          : 'bg-[#F5F6F5] border-[#E4E7E4] text-[#5C615C]/60 hover:text-[#1C1E1C]'
                      }
                    `}
                  >
                    {IconComp ? <IconComp className="w-5 h-5" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Palette Selection */}
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-3 ${
              isDark ? 'text-white/40' : 'text-[#5C615C]'
            }`}>
              Ecosystem Tone Palette
            </label>
            <div className="flex items-center gap-3">
              {(Object.keys(COLOR_MAP) as ColorPreset[]).map((preset) => {
                const config = COLOR_MAP[preset];
                const isSelected = color === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setColor(preset)}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 aspect-square cursor-pointer
                      ${isSelected ? 'ring-2 ring-neutral-400 scale-105' : 'hover:scale-105'}
                    `}
                    style={{ backgroundColor: config.accent }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-black" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Tree Species Selector */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#12110F] border-white/5' : 'bg-[#F5F6F5] border-[#E4E7E4]'
          }`}>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-3 ${
              isDark ? 'text-white/40' : 'text-[#5C615C]'
            }`}>
              Select Tree Species (Your Habit Seed)
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Tree Species List */}
              <div className="md:col-span-8 space-y-2">
                {TREE_CHOICES.map((t) => {
                  const isSelected = treeSpecies === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setSetTreeSpecies(t.value)}
                      className={`
                        w-full flex items-center justify-between text-left p-2.5 rounded-xl border transition-all duration-200 cursor-pointer
                        ${isSelected 
                          ? isDark 
                            ? 'bg-white/5 border-[#4E7D5B]/30 text-white font-semibold' 
                            : 'bg-[#F1F3F1] border-[#4E7D5B] text-[#1C1E1C] font-semibold'
                          : isDark 
                            ? 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white'
                            : 'bg-transparent border-transparent text-[#5C615C] hover:bg-[#F1F3F1]/50'
                        }
                      `}
                    >
                      <div>
                        <div className={`text-xs font-medium ${isSelected ? 'text-[#4E7D5B]' : isDark ? 'text-white' : 'text-[#1C1E1C]'}`}>{t.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? 'text-white/30' : 'text-[#5C615C]/70'}`}>{t.desc}</div>
                      </div>
                      
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected 
                          ? 'border-[#4E7D5B] bg-[#4E7D5B]' 
                          : isDark ? 'border-white/15' : 'border-[#E4E7E4]'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-black" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Preview */}
              <div className={`md:col-span-4 flex flex-col items-center justify-center py-4 px-3 rounded-xl border ${
                isDark ? 'bg-black/20 border-white/5' : 'bg-[#F5F6F5] border-[#E4E7E4]'
              }`}>
                <span className={`text-[9px] font-mono uppercase tracking-widest mb-1.5 flex items-center gap-1 ${
                  isDark ? 'text-white/40' : 'text-[#5C615C]'
                }`}>
                  <Eye className="w-3 h-3 text-[#4E7D5B]" /> Mature stage preview
                </span>
                <div className="w-[84px] h-[84px]">
                  <TreeGraphic species={treeSpecies} streak={24} size={84} isDark={isDark} />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Frequency Definition */}
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-3 ${
              isDark ? 'text-white/40' : 'text-[#5C615C]'
            }`}>
              Repeat Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'daily', label: 'Everyday' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'days', label: 'Specific Days' },
              ].map((freq) => {
                const isSelected = frequency === freq.value;
                return (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => setFrequency(freq.value as any)}
                    className={`
                      py-2.5 rounded-xl text-xs font-medium border text-center transition-all duration-200 cursor-pointer
                      ${isSelected 
                        ? 'bg-[#4E7D5B] border-[#4E7D5B] text-white font-semibold' 
                        : isDark 
                          ? 'bg-[#12110F] border-white/5 text-white/40 hover:border-white/10 hover:text-white'
                          : 'bg-[#F5F6F5] border-[#E4E7E4] text-[#5C615C] hover:border-[#4E7D5B]/50 hover:text-[#1C1E1C]'
                      }
                    `}
                  >
                    {freq.label}
                  </button>
                );
              })}
            </div>

            {/* Custom fields depending on frequency */}
            {frequency === 'weekly' && (
              <div className={`mt-4 p-4 rounded-xl border space-y-2 ${
                isDark ? 'bg-[#12110F] border-white/5' : 'bg-[#F5F6F5] border-[#E4E7E4]'
              }`}>
                <span className={`text-xs block font-sans ${isDark ? 'text-white/40' : 'text-[#5C615C]'}`}>
                  Target count of days per week:
                </span>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTargetDaysCount(num)}
                      className={`
                        w-8 h-8 rounded-lg font-mono text-xs flex items-center justify-center transition-colors cursor-pointer
                        ${targetDaysCount === num 
                          ? 'bg-[#4E7D5B] text-white font-bold' 
                          : isDark ? 'bg-white/5 text-white/40 hover:bg-white/10' : 'bg-[#FAF7F2] text-[#1C1E1C] hover:bg-[#EBECEB]'
                        }
                      `}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {frequency === 'days' && (
              <div className={`mt-4 p-4 rounded-xl border space-y-2 ${
                isDark ? 'bg-[#12110F] border-white/5' : 'bg-[#F5F6F5] border-[#E4E7E4]'
              }`}>
                <span className={`text-xs block mb-2 font-sans ${isDark ? 'text-white/40' : 'text-[#5C615C]'}`}>
                  Select eligible calendar days:
                </span>
                <div className="flex gap-1.5 justify-between">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayAbbrev, isSundayZeroIndex) => {
                    const isSelected = weeklyDays.includes(isSundayZeroIndex);
                    return (
                      <button
                        key={dayAbbrev}
                        type="button"
                        onClick={() => toggleWeeklyDay(isSundayZeroIndex)}
                        className={`
                          w-8 h-8 rounded-lg font-mono text-xs flex items-center justify-center transition-colors select-none cursor-pointer
                          ${isSelected 
                            ? 'bg-[#4E7D5B] text-white font-bold' 
                            : isDark ? 'bg-white/5 text-white/40 hover:bg-white/10' : 'bg-[#FAF7F2] text-[#1C1E1C] hover:bg-[#EBECEB]'
                          }
                        `}
                      >
                        {dayAbbrev}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section: Reminders & Notifications */}
          <div className="pt-4 border-t border-dashed border-[#E4E7E4]/50 dark:border-white/5">
            <div className="flex items-center justify-between mb-3">
              <label className={`text-xs font-mono uppercase tracking-wider flex items-center gap-2 ${
                isDark ? 'text-white/40' : 'text-[#5C615C]'
              }`}>
                <Bell className="w-3.5 h-3.5 text-[#4E7D5B]" />
                Daily Reminder
              </label>
              <button
                type="button"
                onClick={() => {
                  setReminderActive(!reminderActive);
                  if (!reminderActive && !reminderTime) {
                    setReminderTime('08:00');
                  }
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  reminderActive
                    ? 'bg-[#4E7D5B]/20 text-[#4E7D5B] border border-[#4E7D5B]/40'
                    : isDark 
                      ? 'bg-white/5 border border-transparent text-white/40 hover:text-white' 
                      : 'bg-[#F5F6F5] border border-transparent text-[#5C615C] hover:text-[#1C1E1C]'
                }`}
              >
                {reminderActive ? 'Active' : 'Inactive'}
              </button>
            </div>

            {reminderActive && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="w-full sm:w-auto flex-1">
                    <span className={`text-xs block mb-1.5 font-sans ${isDark ? 'text-white/40' : 'text-[#5C615C]'}`}>
                      Remind me daily at:
                    </span>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      required={reminderActive}
                      className={`w-full max-w-[140px] px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                        isDark 
                          ? 'bg-[#12110F] border-white/5 text-white focus:border-[#4E7D5B]' 
                          : 'bg-[#FAF8F5] border-[#E8E2D9] text-[#2C2925] focus:border-[#4E7D5B]'
                      }`}
                    />
                  </div>

                  {/* Permission Status */}
                  {typeof Notification !== 'undefined' && Notification.permission !== 'granted' && (
                    <div className={`p-3 rounded-xl border flex-1 w-full text-xs space-y-2 ${
                      isDark ? 'bg-[#251A15] border-amber-950/20 text-[#E1CEB5]' : 'bg-[#FFF9F2] border-[#F2E5D3] text-[#785C3A]'
                    }`}>
                      <div className="flex items-center gap-2 font-medium">
                        <BellOff className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Notifications Blocked or Unset</span>
                      </div>
                      <p className="text-[10px] leading-relaxed opacity-95">
                        Enable browser desktop notifications to receive real-time gentle nudges.
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await Notification.requestPermission();
                            // force component re-render by resetting state triggers
                            setReminderActive(true);
                          } catch (err) {
                            console.error('Error requesting notification permission:', err);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#4E7D5B] hover:bg-[#3D6247] text-white font-semibold text-[10px] w-full text-center transition-all cursor-pointer shadow-sm"
                      >
                        🔔 Enable Desktop Notifications
                      </button>
                    </div>
                  )}

                  {typeof Notification !== 'undefined' && Notification.permission === 'granted' && (
                    <div className={`p-3 rounded-xl border flex-1 w-full text-xs flex items-center gap-2.5 ${
                      isDark ? 'bg-[#15231A] border-emerald-950/20 text-[#CBE1D2]' : 'bg-[#F2FAF5] border-[#D3EFE0] text-[#3A7854]'
                    }`}>
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[11px]">System Notifications Enabled</div>
                        <p className="text-[9px] opacity-80">You will receive reminders when this app is open.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className={`pt-4 border-t flex items-center justify-end gap-3.5 ${
            isDark ? 'border-white/5' : 'border-[#E4E7E4]'
          }`}>
            <button
              id="cancel-form-btn"
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer ${
                isDark ? 'text-white/40 hover:text-white' : 'text-[#5C615C] hover:bg-[#F5F6F5]'
              }`}
            >
              Cancel
            </button>
            <button
              id="submit-form-btn"
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#4E7D5B] text-white hover:bg-[#5E956D]' 
                  : 'bg-[#4E7D5B] hover:bg-[#3D6247] text-white'
              }`}
            >
              {editHabit ? 'Save Parameters' : 'Plant Seed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  function setSetTreeSpecies(val: TreeSpecies) {
    setTreeSpecies(val);
  }
}
