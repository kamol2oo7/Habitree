import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TimelineProgressProps {
  isDark: boolean;
}

export default function TimelineProgress({ isDark }: TimelineProgressProps) {
  const [time, setTime] = useState(new Date());

  // Keep progress indicators precise to the minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 45000); // refresh every 45s
    return () => clearInterval(interval);
  }, []);

  const year = time.getFullYear();
  const currentMonthIdx = time.getMonth();
  const currentDateNum = time.getDate();
  const currentHourNum = time.getHours();

  // 1. Year Calculations
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);
  const yearProgressPct = Math.min(100, Math.max(0, Math.round(((time.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime())) * 100)));

  // 2. Month Calculations
  const currentMonthName = time.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const startOfMonth = new Date(year, currentMonthIdx, 1);
  const endOfMonth = new Date(year, currentMonthIdx + 1, 1);
  const monthProgressPct = Math.min(100, Math.max(0, Math.round(((time.getTime() - startOfMonth.getTime()) / (endOfMonth.getTime() - startOfMonth.getTime())) * 100)));
  const totalDaysInMonth = new Date(year, currentMonthIdx + 1, 0).getDate();

  // 3. Day Calculations
  const startOfDay = new Date(year, currentMonthIdx, currentDateNum, 0, 0, 0);
  const dayProgressPct = Math.min(100, Math.max(0, Math.round(((time.getTime() - startOfDay.getTime()) / (24 * 60 * 60 * 1000)) * 100)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`p-6 rounded-3xl border transition-all duration-300 ${
        isDark 
          ? 'bg-[#1C1A18] border-white/5 shadow-2xl text-white' 
          : 'bg-[#FFFFFF] border-[#E8E2D9] shadow-sm text-[#2C2925]'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-500/10 dark:border-white/5">
        <span className="text-[12px] font-mono uppercase tracking-widest font-extrabold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B04C5A] animate-pulse shadow-[0_0_8px_rgba(176,76,90,0.85)]" />
          Eco-Timeline Synchronizer
        </span>
        <span className={`text-[9px] font-mono tracking-widest uppercase font-bold px-2.5 py-1 rounded-full ${
          isDark ? 'bg-white/5 text-[#9D9A90]' : 'bg-[#FAF8F5] text-[#706B63] border border-[#E8E2D9]'
        }`}>
          Solar Interval
        </span>
      </div>

      {/* Progress Timelines Rows */}
      <div className="mt-6 space-y-6">
        
        {/* ROW 1: YEAR PROGRESS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider font-mono">
            <span className={isDark ? 'text-white/60' : 'text-[#706B63]'}>{year}</span>
            <span className="text-[#B04C5A] font-bold">{yearProgressPct}%</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 min-h-[16px] py-0.5">
            {Array.from({ length: 12 }).map((_, mIdx) => {
              const isPast = mIdx < currentMonthIdx;
              const isCurrent = mIdx === currentMonthIdx;
              const monthLabel = new Date(year, mIdx, 1).toLocaleString('en-US', { month: 'narrow' });
              
              return (
                <div
                  key={`month-${mIdx}`}
                  title={`${new Date(year, mIdx, 1).toLocaleString('en-US', { month: 'long' })}`}
                  className="relative group flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold transition-all duration-300 ${
                      isPast
                        ? isDark ? 'bg-[#FAF7F2] text-[#1C1A18]' : 'bg-[#1C1E1C] text-white'
                        : isCurrent
                          ? 'bg-[#B04C5A] text-white shadow-[0_0_12px_rgba(176,76,90,0.6)]'
                          : isDark ? 'bg-transparent border border-white/15 text-white/30' : 'bg-transparent border border-[#E8E2D9] text-neutral-400'
                    }`}
                  >
                    <span>{monthLabel}</span>
                    {isCurrent && (
                      <span className="absolute -inset-1 rounded-full border border-[#B04C5A]/50 animate-ping opacity-60 pointer-events-none" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 2: MONTH PROGRESS (Days of Month) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider font-mono">
            <span className={isDark ? 'text-white/60' : 'text-[#706B63]'}>{currentMonthName}</span>
            <span className="text-[#B04C5A] font-bold">{monthProgressPct}%</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 py-1 max-w-full">
            {Array.from({ length: totalDaysInMonth }).map((_, dIdx) => {
              const dayNum = dIdx + 1;
              const isPast = dayNum < currentDateNum;
              const isCurrent = dayNum === currentDateNum;

              return (
                <div
                  key={`day-${dayNum}`}
                  title={`${currentMonthName} ${dayNum}`}
                  className="relative cursor-pointer shrink-0"
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isPast
                        ? isDark ? 'w-3 h-3 bg-[#FAF7F2]/90' : 'w-3 h-3 bg-[#1C1E1C]'
                        : isCurrent
                          ? 'w-4.5 h-4.5 bg-[#B04C5A] shadow-[0_0_12px_rgba(176,76,90,0.7)]'
                          : isDark ? 'w-3 h-3 border border-white/10 bg-transparent' : 'w-3 h-3 border border-[#E8E2D9] bg-transparent'
                    }`}
                  />
                  {isCurrent && (
                    <>
                      <span className="absolute -inset-1.5 rounded-full border border-[#B04C5A]/45 animate-pulse pointer-events-none" />
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] text-white font-mono font-bold leading-none select-none">
                        {dayNum}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 3: DAY PROGRESS (Hours of Day) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider font-mono">
            <span className={isDark ? 'text-white/60' : 'text-[#706B63]'}>DAY {currentDateNum}</span>
            <span className="text-[#B04C5A] font-bold">{dayProgressPct}%</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 py-1 max-w-full">
            {Array.from({ length: 24 }).map((_, hIdx) => {
              const isPast = hIdx < currentHourNum;
              const isCurrent = hIdx === currentHourNum;
              const hourLabel = hIdx.toString().padStart(2, '0');

              return (
                <div
                  key={`hour-${hIdx}`}
                  title={`${hourLabel}:00`}
                  className="relative cursor-pointer shrink-0"
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isPast
                        ? isDark ? 'w-2.5 h-2.5 bg-[#FAF7F2]/80' : 'w-2.5 h-2.5 bg-[#1C1E1C]/90'
                        : isCurrent
                          ? 'w-4 h-4 bg-[#B04C5A] shadow-[0_0_12px_rgba(176,76,90,0.7)]'
                          : isDark ? 'w-2.5 h-2.5 border border-white/5 bg-transparent' : 'w-2.5 h-2.5 border border-[#E8E2D9] bg-transparent'
                    }`}
                  />
                  {isCurrent && (
                    <>
                      <span className="absolute -inset-1 rounded-full border border-[#B04C5A]/35 animate-ping opacity-70 pointer-events-none" />
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[6px] text-white font-mono font-bold select-none leading-none">
                        {hIdx}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
