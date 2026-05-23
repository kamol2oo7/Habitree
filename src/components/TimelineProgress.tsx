import React, { useState, useEffect } from 'react';

interface TimelineProgressProps {
  isDark: boolean;
}

export default function TimelineProgress({ isDark }: TimelineProgressProps) {
  const [time, setTime] = useState(new Date());

  // Update time every minute to keep the dots live and accurate
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const year = time.getFullYear();
  const currentMonthIdx = time.getMonth(); // 0 to 11
  const currentDate = time.getDate(); // 1 to 31
  const currentHour = time.getHours(); // 0 to 23

  // 1. Year Progress Calculations
  const yearStart = new Date(year, 0, 1);
  const msInDay = 24 * 60 * 60 * 1000;
  const daysPassedInYear = Math.floor((time.getTime() - yearStart.getTime()) / msInDay) + 1;
  const totalDaysInYear = (year % 4 === 0) ? 366 : 365;
  const yearProgressPct = Math.round((daysPassedInYear / totalDaysInYear) * 100);

  // 2. Month Progress Calculations
  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  const monthLabel = monthNames[currentMonthIdx];
  const totalDaysInMonth = new Date(year, currentMonthIdx + 1, 0).getDate();
  const monthProgressPct = Math.round((currentDate / totalDaysInMonth) * 100);

  // 3. Day Progress Calculations
  const minsPassedInDay = currentHour * 60 + time.getMinutes();
  const dayProgressPct = Math.round((minsPassedInDay / 1440) * 100);

  // Dots renderers
  const renderYearDots = () => {
    const dotsArray = [];
    for (let m = 0; m < 12; m++) {
      const isPassed = m < currentMonthIdx;
      const isCurrent = m === currentMonthIdx;
      dotsArray.push({ index: m, isPassed, isCurrent });
    }
    return dotsArray;
  };

  const renderMonthDots = () => {
    const dotsArray = [];
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const isPassed = d < currentDate;
      const isCurrent = d === currentDate;
      dotsArray.push({ index: d, isPassed, isCurrent });
    }
    return dotsArray;
  };

  const renderDayDots = () => {
    const dotsArray = [];
    for (let h = 0; h < 24; h++) {
      const isPassed = h < currentHour;
      const isCurrent = h === currentHour;
      dotsArray.push({ index: h, isPassed, isCurrent });
    }
    return dotsArray;
  };

  return (
    <div id="chrono-progress-ledger" className={`p-6 rounded-3xl border transition-all duration-300 ${
      isDark 
        ? 'bg-[#1C1A18] border-white/5 shadow-2xl' 
        : 'bg-[#FFFFFF] border-[#E8E2D9] shadow-sm'
    }`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-5 border-[#4E7D5B]/15">
        <span className={`text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 ${
          isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'
        }`}>
          <span className="w-2 h-2 rounded-full bg-[#B04C5A] animate-pulse shadow-[0_0_6px_rgba(176,76,90,1)]" /> Eco-Timeline Synchronizer
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
          isDark ? 'bg-white/5 text-[#9D9A90]' : 'bg-[#FAF8F5] text-[#706B63]'
        }`}>
          Solar Interval
        </span>
      </div>

      <div className="space-y-6">
        
        {/* ROW 1: Year Level */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-12 md:col-span-2 text-left">
            <span className={`text-xs font-mono font-extrabold tracking-widest uppercase block ${
              isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'
            }`}>
              {year}
            </span>
          </div>
          <div className="col-span-10 md:col-span-9 flex flex-wrap gap-2 items-center">
            {renderYearDots().map((dot) => (
              <div
                key={`year-dot-${dot.index}`}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  dot.isCurrent
                    ? 'bg-[#B04C5A] shadow-[0_0_10px_rgba(176,76,90,0.85)] scale-110'
                    : dot.isPassed
                      ? isDark ? 'bg-[#ECE9E0]' : 'bg-[#2C2925]'
                      : isDark ? 'border border-neutral-700 bg-neutral-900/40' : 'border border-[#E8E2D9] bg-[#FAF8F5]'
                }`}
                title={`Month ${dot.index + 1}: ${dot.isCurrent ? 'Current' : dot.isPassed ? 'Passed' : 'Future'}`}
              />
            ))}
          </div>
          <div className="col-span-2 md:col-span-1 text-right">
            <span className={`font-mono text-xs font-bold tracking-tight ${
              isDark ? 'text-[#B04C5A]' : 'text-[#B04C5A]'
            }`}>
              {yearProgressPct}%
            </span>
          </div>
        </div>

        {/* ROW 2: Month Level */}
        <div className="grid grid-cols-12 gap-3 items-start">
          <div className="col-span-12 md:col-span-2 text-left pt-0.5">
            <span className={`text-xs font-mono font-extrabold tracking-widest uppercase block ${
              isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'
            }`}>
              {monthLabel}
            </span>
          </div>
          <div className="col-span-10 md:col-span-9 flex flex-wrap gap-2 items-center max-w-sm sm:max-w-md md:max-w-none">
            {renderMonthDots().map((dot) => (
              <div
                key={`month-dot-${dot.index}`}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  dot.isCurrent
                    ? 'bg-[#B04C5A] shadow-[0_0_10px_rgba(176,76,90,0.85)] scale-110'
                    : dot.isPassed
                      ? isDark ? 'bg-[#ECE9E0]' : 'bg-[#2C2925]'
                      : isDark ? 'border border-neutral-700 bg-neutral-900/40' : 'border border-[#E8E2D9] bg-[#FAF8F5]'
                }`}
                title={`Day ${dot.index}: ${dot.isCurrent ? 'Current' : dot.isPassed ? 'Passed' : 'Future'}`}
              />
            ))}
          </div>
          <div className="col-span-2 md:col-span-1 text-right pt-0.5">
            <span className={`font-mono text-xs font-bold tracking-tight ${
              isDark ? 'text-[#B04C5A]' : 'text-[#B04C5A]'
            }`}>
              {monthProgressPct}%
            </span>
          </div>
        </div>

        {/* ROW 3: Day Level */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-12 md:col-span-2 text-left">
            <span className={`text-xs font-mono font-extrabold tracking-widest uppercase block ${
              isDark ? 'text-[#9D9A90]' : 'text-[#706B63]'
            }`}>
              DAY {currentDate}
            </span>
          </div>
          <div className="col-span-10 md:col-span-9 flex flex-wrap gap-2 items-center">
            {renderDayDots().map((dot) => (
              <div
                key={`day-dot-${dot.index}`}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  dot.isCurrent
                    ? 'bg-[#B04C5A] shadow-[0_0_10px_rgba(176,76,90,0.85)] scale-110'
                    : dot.isPassed
                      ? isDark ? 'bg-[#ECE9E0]' : 'bg-[#2C2925]'
                      : isDark ? 'border border-neutral-700 bg-neutral-900/40' : 'border border-[#E8E2D9] bg-[#FAF8F5]'
                }`}
                title={`Hour ${dot.index}:00 - ${dot.isCurrent ? 'Current' : dot.isPassed ? 'Passed' : 'Future'}`}
              />
            ))}
          </div>
          <div className="col-span-2 md:col-span-1 text-right">
            <span className={`font-mono text-xs font-bold tracking-tight ${
              isDark ? 'text-[#B04C5A]' : 'text-[#B04C5A]'
            }`}>
              {dayProgressPct}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
