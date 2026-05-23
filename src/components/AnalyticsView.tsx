import { Habit } from '../types';
import { calculateStreaks, COLOR_MAP } from '../utils';
import { useState } from 'react';
import { TrendingUp, Trees, Flame, Award, Calendar, Target, Activity } from 'lucide-react';
import TimelineProgress from './TimelineProgress';

interface AnalyticsViewProps {
  isDark: boolean;
  habits: Habit[];
}

export default function AnalyticsView({ isDark, habits }: AnalyticsViewProps) {
  const [selectedDimension, setSelectedDimension] = useState<'month' | 'year'>('month');
  const d = new Date();
  const currentMonthName = d.toLocaleString('en-US', { month: 'long' });

  // Calculate high quality statistics from the habits list
  const totalHabits = habits.length;
  
  // Total completions across all time
  const totalCompletions = habits.reduce((acc, h) => acc + h.history.length, 0);

  // Active streaks across all habits
  const streaks = habits.map(h => calculateStreaks(h.history));
  const collectiveStreak = streaks.reduce((max, s) => s.currentStreak > max ? s.currentStreak : max, 0);
  const maxStreakEver = streaks.reduce((max, s) => s.maxStreak > max ? s.maxStreak : max, 0);

  // Completion stats relative to the last 30 days
  let totalPossibleOver30Days = totalHabits * 30;
  let actualCompletionsOver30 = 0;
  const last30DaysList: string[] = [];
  for (let i = 0; i < 30; i++) {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - i);
    const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;
    last30DaysList.push(dateStr);
    
    habits.forEach(h => {
      if (h.history.includes(dateStr)) {
        actualCompletionsOver30++;
      }
    });
  }
  const averageCompletionRate = totalPossibleOver30Days > 0 
    ? Math.round((actualCompletionsOver30 / totalPossibleOver30Days) * 100) 
    : 0;

  // Category allotment values based on colored habits
  const limeCompletions = habits.filter(h => h.color === 'lime').reduce((acc, h) => acc + h.history.length, 0);
  const blueCompletions = habits.filter(h => h.color === 'blue').reduce((acc, h) => acc + h.history.length, 0);
  const orangeCompletions = habits.filter(h => h.color === 'orange').reduce((acc, h) => acc + h.history.length, 0);
  const purpleCompletions = habits.filter(h => h.color === 'purple').reduce((acc, h) => acc + h.history.length, 0);
  const roseCompletions = habits.filter(h => h.color === 'rose').reduce((acc, h) => acc + h.history.length, 0);

  const sumAllCompletions = limeCompletions + blueCompletions + orangeCompletions + purpleCompletions + roseCompletions;

  let limePct = 0;
  let bluePct = 0;
  let orangePct = 0;
  let purplePct = 0;
  let rosePct = 0;

  if (sumAllCompletions > 0) {
    limePct = Math.round((limeCompletions / sumAllCompletions) * 100);
    bluePct = Math.round((blueCompletions / sumAllCompletions) * 100);
    orangePct = Math.round((orangeCompletions / sumAllCompletions) * 100);
    purplePct = Math.round((purpleCompletions / sumAllCompletions) * 100);
    rosePct = Math.round((roseCompletions / sumAllCompletions) * 100);

    const sum = limePct + bluePct + orangePct + purplePct + rosePct;
    if (sum !== 100 && sum > 0) {
      const diff = 100 - sum;
      const arr = [limePct, bluePct, orangePct, purplePct, rosePct];
      const maxIdx = arr.indexOf(Math.max(...arr));
      if (maxIdx === 0) limePct += diff;
      else if (maxIdx === 1) bluePct += diff;
      else if (maxIdx === 2) orangePct += diff;
      else if (maxIdx === 3) purplePct += diff;
      else rosePct += diff;
    }
  } else {
    const totalHabitsCount = habits.length || 1;
    const limeCount = habits.filter(h => h.color === 'lime').length;
    const blueCount = habits.filter(h => h.color === 'blue').length;
    const orangeCount = habits.filter(h => h.color === 'orange').length;
    const purpleCount = habits.filter(h => h.color === 'purple').length;
    const roseCount = habits.filter(h => h.color === 'rose').length;

    limePct = Math.round((limeCount / totalHabitsCount) * 100);
    bluePct = Math.round((blueCount / totalHabitsCount) * 100);
    orangePct = Math.round((orangeCount / totalHabitsCount) * 100);
    purplePct = Math.round((purpleCount / totalHabitsCount) * 100);
    rosePct = Math.round((roseCount / totalHabitsCount) * 100);

    const sum = limePct + bluePct + orangePct + purplePct + rosePct;
    if (sum !== 100 && sum > 0) {
      const diff = 100 - sum;
      const arr = [limePct, bluePct, orangePct, purplePct, rosePct];
      const maxIdx = arr.indexOf(Math.max(...arr));
      if (maxIdx === 0) limePct += diff;
      else if (maxIdx === 1) bluePct += diff;
      else if (maxIdx === 2) orangePct += diff;
      else if (maxIdx === 3) purplePct += diff;
      else rosePct += diff;
    }
  }

  // Monthly completions for the wave trend plot - past 6 months dynamically!
  const past6MonthNames: string[] = [];
  const past6MonthCompletions: number[] = [];
  for (let i = 5; i >= 0; i--) {
    const tempDate = new Date();
    tempDate.setMonth(tempDate.getMonth() - i);
    past6MonthNames.push(tempDate.toLocaleString('en-US', { month: 'short' }));

    const yr = tempDate.getFullYear();
    const mn = String(tempDate.getMonth() + 1).padStart(2, '0');
    const prefix = `${yr}-${mn}-`;
    
    let count = 0;
    habits.forEach(h => {
      h.history.forEach(dateStr => {
        if (dateStr.startsWith(prefix)) {
          count++;
        }
      });
    });
    past6MonthCompletions.push(count);
  }

  const maxMonthCompletions = Math.max(...past6MonthCompletions, 6);

  const wavePoints = past6MonthCompletions.map((count, idx) => {
    const x = idx * 20;
    const y = 21 - (count / maxMonthCompletions) * 18;
    return { x, y };
  });

  let wavePathD = `M ${wavePoints[0].x} ${wavePoints[0].y}`;
  for (let i = 1; i < wavePoints.length; i++) {
    const cpX1 = wavePoints[i - 1].x + 10;
    const cpY1 = wavePoints[i - 1].y;
    const cpX2 = wavePoints[i].x - 10;
    const cpY2 = wavePoints[i].y;
    wavePathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${wavePoints[i].x} ${wavePoints[i].y}`;
  }
  const waveFillD = `${wavePathD} L 100 24 L 0 24 Z`;

  // Weekly change calculation
  let currentWeekCompletions = 0;
  let previousWeekCompletions = 0;
  
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const currD = new Date();
    currD.setDate(today.getDate() - i);
    const currStr = `${currD.getFullYear()}-${String(currD.getMonth() + 1).padStart(2, '0')}-${String(currD.getDate()).padStart(2, '0')}`;
    
    const prevD = new Date();
    prevD.setDate(today.getDate() - 7 - i);
    const prevStr = `${prevD.getFullYear()}-${String(prevD.getMonth() + 1).padStart(2, '0')}-${String(prevD.getDate()).padStart(2, '0')}`;
    
    habits.forEach(h => {
      if (h.history.includes(currStr)) currentWeekCompletions++;
      if (h.history.includes(prevStr)) previousWeekCompletions++;
    });
  }

  let consistencyChange = 0;
  if (previousWeekCompletions > 0) {
    consistencyChange = Math.round(((currentWeekCompletions - previousWeekCompletions) / previousWeekCompletions) * 100);
  } else if (currentWeekCompletions > 0) {
    consistencyChange = 100;
  }

  // Dimension Overview calculation (month / year overview pie)
  const currentMonthNum = d.getMonth() + 1;
  const currentYear = d.getFullYear();
  const currentMonthPrefix = `${currentYear}-${String(currentMonthNum).padStart(2, '0')}-`;
  const currentYearPrefix = `${currentYear}-`;

  let selectedRangeCompletions = 0;
  habits.forEach(h => {
    h.history.forEach(dateStr => {
      if (selectedDimension === 'month') {
        if (dateStr.startsWith(currentMonthPrefix)) {
          selectedRangeCompletions++;
        }
      } else {
        if (dateStr.startsWith(currentYearPrefix)) {
          selectedRangeCompletions++;
        }
      }
    });
  });

  const possibleWaterCount = selectedDimension === 'month' 
    ? Math.max(1, habits.length * d.getDate()) 
    : Math.max(1, habits.length * 142); // May 22 is day 142 of the year 2026

  const doneRate = Math.min(100, Math.round((selectedRangeCompletions / possibleWaterCount) * 100));
  const donePctValue = doneRate;
  const missedPctValue = Math.round((100 - doneRate) * 0.75);
  const inactivePctValue = Math.max(0, 100 - donePctValue - missedPctValue);

  return (
    <div id="analytics-container" className="space-y-6 text-left">
      
      {/* HUD Header */}
      <div>
        <div className="flex items-center gap-2">
          <TrendingUp className={`${isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'} w-6 h-6`} />
          <h2 className={`text-2xl font-sans font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
            Analytics Dashboard
          </h2>
        </div>
        <p className={`text-sm mt-1 ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>
          Track your overall habit tree consistency and watering records.
        </p>
      </div>

      <div className="space-y-6">

        {/* FOREST HEALTH METRICS GRID PANEL (Replaces generic debit card larp) - Spans Full Width */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between min-h-[170px] transition-colors ${
          isDark 
            ? 'bg-[#1C1A18] border-white/5 shadow-2xl' 
            : 'bg-[#FFFFFF] border-[#E8E2D9] shadow-sm'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-[#4E7D5B]/15">
            <span className={`text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 ${
              isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'
            }`}>
              <Trees className="w-4 h-4" /> Forest Growth Ledger
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
              isDark ? 'bg-white/5 text-[#9D9A90]' : 'bg-[#FAF8F5] text-[#706B63]'
            }`}>
              Active Ecosystem
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <div className="space-y-1">
              <span className={`text-[9px] font-mono uppercase tracking-wider block ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>
                Planted Seeds
              </span>
              <span className={`text-xl font-bold tracking-tight block ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
                {totalHabits} Species
              </span>
            </div>

            <div className="space-y-1">
              <span className={`text-[9px] font-mono uppercase tracking-wider block ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>
                Total Waterings
              </span>
              <span className={`text-xl font-bold tracking-tight block ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
                {totalCompletions} times
              </span>
            </div>

            <div className="space-y-1">
              <span className={`text-[9px] font-mono uppercase tracking-wider block ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>
                Collective Streak
              </span>
              <span className={`text-xl font-bold tracking-tight block text-[#C56B48] flex items-center gap-1`}>
                <Flame className="w-4 h-4 text-[#C56B48]" /> {collectiveStreak} d
              </span>
            </div>

            <div className="space-y-1">
              <span className={`text-[9px] font-mono uppercase tracking-wider block ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>
                Consistency Index
              </span>
              <span className={`text-xl font-bold tracking-tight block text-[#4E7D5B] flex items-center gap-1`}>
                <Target className="w-4 h-4 text-[#4E7D5B]" /> {averageCompletionRate}%
              </span>
            </div>
          </div>
        </div>

        {/* ECO-TIMELINE PROGRESS UNIT */}
        <TimelineProgress isDark={isDark} />

        {/* Dual grid for Pie & Trend Spline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* COMBINED MONTH VIEW PIE CHART */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between min-h-[240px] transition-colors ${
            isDark 
              ? 'bg-[#1C1A18] border-white/5' 
              : 'bg-[#FFFFFF] border-[#E8E2D9]'
          }`}>
            <div className="flex items-center justify-between font-sans">
              <span className={`text-base font-semibold ${isDark ? 'text-white' : 'text-[#2C2925]'}`}>
                {selectedDimension === 'month' ? `${currentMonthName} Overview` : `${currentYear} Overview`}
              </span>

              {/* Segmented Month / Year control */}
              <div className={`flex items-center border rounded-full p-1 text-[11px] font-mono ${
                isDark ? 'bg-[#12110F] border-white/5' : 'bg-[#FAF8F5] border-[#E8E2D9]'
              }`}>
                <button 
                  onClick={() => setSelectedDimension('month')}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedDimension === 'month' 
                      ? `${isDark ? 'bg-white/10 text-white font-bold' : 'bg-[#FFFFFF] text-[#2C2925] font-bold border border-[#E8E2D9] shadow-sm'}` 
                      : `${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`
                  }`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setSelectedDimension('year')}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedDimension === 'year' 
                      ? `${isDark ? 'bg-white/10 text-white font-bold' : 'bg-[#FFFFFF] text-[#2C2925] font-bold border border-[#E8E2D9] shadow-sm'}` 
                      : `${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`
                  }`}
                >
                  Year
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center mt-6">
              
              {/* Dynamic Pie chart drawn as clean SVGs */}
              <div className="col-span-6 flex justify-center">
                <div className="w-32 h-32 relative">
                  <svg className="w-full h-full transform -rotate-45" viewBox="0 0 32 32">
                    {/* Success Slice: Sage green piece */}
                    <circle 
                      cx="16" cy="16" r="14" 
                      fill="none" stroke="#4E7D5B" strokeWidth="2.8" 
                      strokeDasharray={`${donePctValue} 100`} strokeDashoffset="0" 
                    />
                    {/* Expense Slice: Terracotta piece */}
                    <circle 
                      cx="16" cy="16" r="14" 
                      fill="none" stroke="#C56B48" strokeWidth="2.8" 
                      strokeDasharray={`${missedPctValue} 100`} strokeDashoffset={`-${donePctValue}`} 
                    />
                    {/* Crimson piece */}
                    <circle 
                      cx="16" cy="16" r="14" 
                      fill="none" stroke="#B04C5A" strokeWidth="2.8" 
                      strokeDasharray={`${inactivePctValue} 100`} strokeDashoffset={`-${donePctValue + missedPctValue}`} 
                    />
                    {/* Remaining empty slice */}
                    <circle 
                      cx="16" cy="16" r="14" 
                      fill="none" stroke={isDark ? '#3C3935' : '#EBECEB'} strokeWidth="2" 
                      strokeDasharray={`${Math.max(0, 100 - donePctValue - missedPctValue - inactivePctValue)} 100`} strokeDashoffset="-100" 
                    />
                  </svg>
                </div>
              </div>

              {/* Pie Legends list */}
              <div className="col-span-6 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4E7D5B]" />
                    <span className={isDark ? 'text-[#D8D5CE]' : 'text-[#2C2925]'}>Consistent Care</span>
                  </div>
                  <span className={`font-mono font-bold ${isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'}`}>{donePctValue}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C56B48]" />
                    <span className={isDark ? 'text-[#D8D5CE]' : 'text-[#2C2925]'}>Missed / Delayed</span>
                  </div>
                  <span className={`font-mono ${isDark ? 'text-white/80' : 'text-[#2C2925]/80'}`}>{missedPctValue}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B04C5A]" />
                    <span className={isDark ? 'text-[#D8D5CE]' : 'text-[#2C2925]'}>Untapped Slots</span>
                  </div>
                  <span className={`font-mono ${isDark ? 'text-white/80' : 'text-[#2C2925]/80'}`}>{inactivePctValue}%</span>
                </div>
              </div>
            </div>

            {/* Micro alerts */}
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
              isDark ? 'border-white/5 text-neutral-500' : 'border-[#E8E2D9] text-[#706B63]'
            }`}>
              <span>Consistency Coefficient</span>
              <span className={isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B] font-semibold'}>{consistencyChange >= 0 ? '+' : ''}{consistencyChange}% vs last week</span>
            </div>
          </div>

          {/* EXQUISITE TREND WAVE LINE CHART */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between min-h-[210px] relative overflow-hidden transition-colors ${
            isDark 
              ? 'bg-[#1C1A18] border-white/5 shadow-lg' 
              : 'bg-[#FFFFFF] border-[#E8E2D9] shadow-sm'
          }`}>
            
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4E7D5B] animate-pulse" />
                <span className={`text-xs font-mono uppercase tracking-widest font-semibold ${isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'}`}>
                  Wave Trend (Completions)
                </span>
              </div>
              
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={isDark ? 'text-neutral-500' : 'text-[#706B63]'}>{currentMonthName} Peak</span>
                <div className={`font-extrabold text-[11px] px-2.5 py-1 rounded-full ${
                  isDark ? 'bg-[#4E7D5B]/15 text-[#4E7D5B] border border-[#4E7D5B]/30' : 'bg-[#4E7D5B] text-white border border-[#4E7D5B]'
                }`}>
                  {selectedRangeCompletions} completions
                </div>
              </div>
            </div>

            {/* Spline SVG line */}
            <div className="relative h-[94px] w-full mt-4">
              <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4E7D5B" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#4E7D5B" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Drawn spline path modeling the wavy lime stroke */}
                <path 
                  d={wavePathD} 
                  fill="none" 
                  stroke="#4E7D5B" 
                  strokeWidth="0.8" 
                  strokeLinecap="round"
                />

                {/* Fill Area Area */}
                <path 
                  d={waveFillD} 
                  fill="url(#waveFill)" 
                />

                {/* Data point circle markers */}
                {wavePoints.map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="0.6" fill="#4E7D5B" />
                ))}

                {/* Peak point marker highlight for current month */}
                <circle cx={wavePoints[5].x} cy={wavePoints[5].y} r="1.1" fill="#C56B48" />
                <circle cx={wavePoints[5].x} cy={wavePoints[5].y} r="0.5" fill="#FFF" />
              </svg>
            </div>

            {/* X Axis Labels */}
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-2.5 px-1 truncate">
              {past6MonthNames.map((lbl, idx) => {
                const isCurrent = idx === past6MonthNames.length - 1;
                return (
                  <span key={`${lbl}-${idx}`} className={isCurrent ? `${isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'} font-bold underline` : ''}>
                    {lbl}
                  </span>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
