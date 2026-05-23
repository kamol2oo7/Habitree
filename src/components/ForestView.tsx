import React from 'react';
import { Habit } from '../types';
import { calculateStreaks, COLOR_MAP, getLocalDateString } from '../utils';
import TreeGraphic from './TreeGraphic';
import AppLogo from './AppLogo';
import { useState } from 'react';
import { Flame, Trees, Check, Sprout, Sparkles } from 'lucide-react';

interface ForestViewProps {
  isDark: boolean;
  habits: Habit[];
  onToggleDate: (habitId: string, dateStr: string) => void;
  onOpenAddModal: () => void;
}

export default function ForestView({ isDark, habits, onToggleDate, onOpenAddModal }: ForestViewProps) {
  const [selectedTree, setSelectedTree] = useState<Habit | null>(habits[0] || null);
  const todayStr = getLocalDateString(0);

  // Atmospheric sky color schemes
  // Dark mode sky: Deep organic warm espresso-cosmic nights
  // Light mode sky: Fresh warm buttermilk-champagne morning hills
  const skyBackground = isDark 
    ? 'from-[#141210] via-[#1E1B18] to-[#25221F]' 
    : 'from-[#F9FAF9] via-[#F1F3F1] to-[#EAECE9]';

  return (
    <div id="forest-view-container" className="flex flex-col h-full text-left space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-sans font-semibold tracking-tight flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-[#1C1E1C]'
          }`}>
            <Trees className={`w-6 h-6 ${isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'}`} /> My Habit Forest
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-[#5C615C]'}`}>
            Every streak nourishes its tree. Complete your daily sessions to watch your forest grow from seeds to elder forest titans.
          </p>
        </div>

        <div className={`flex items-center gap-2 border px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
          isDark ? 'bg-[#1C1A18] border-white/5 text-[#9D9A90]' : 'bg-[#F5F6F5] border-[#E4E7E4] text-[#1C1E1C]'
        }`}>
          <span>Total Trees:</span>
          <span className={`text-sm font-bold ml-1 ${isDark ? 'text-white' : 'text-[#4E7D5B]'}`}>{habits.length}</span>
        </div>
      </div>

      {/* Main Interactive SVG Sandbox Canvas */}
      <div className={`relative h-[420px] rounded-3xl bg-gradient-to-b ${skyBackground} border overflow-hidden shadow-sm transition-all duration-500 ${
        isDark ? 'border-white/5' : 'border-[#E4E7E4]'
      }`}>
        
        {/* Celestial orbs and sky atmospheric nodes */}
        {isDark ? (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Soft dark embers */}
            <div className="absolute top-10 left-[15%] w-1 h-1 bg-amber-200/40 rounded-full animate-pulse" />
            <div className="absolute top-24 left-[45%] w-0.5 h-0.5 bg-wheat rounded-full" />
            <div className="absolute top-16 left-[75%] w-1.5 h-1.5 bg-neutral-300 rounded-full animate-pulse" />
            <div className="absolute top-36 left-[85%] w-1 h-1 bg-amber-100/50 rounded-full" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none opacity-50">
            {/* Sunny dust highlights */}
            <div className="absolute top-12 left-[10%] w-1.5 h-1.5 bg-[#4E7D5B]/10 rounded-full" />
            <div className="absolute top-20 left-[60%] w-2 h-2 bg-amber-400/5 rounded-full" />
          </div>
        )}

        {/* Soft sun/moon light overlay */}
        <div className={`absolute top-8 right-[15%] w-28 h-28 rounded-full blur-3xl pointer-events-none opacity-15 ${
          isDark ? 'bg-[#D4C5B3]' : 'bg-amber-100'
        }`} />
        
        {/* Distant Hills (Layered warm vectors) */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none">
          {/* Distant hill */}
          <svg viewBox="0 0 1000 120" className={`w-full h-[120px] opacity-40 fill-current translate-y-[20px] ${
            isDark ? 'text-[#12110F]' : 'text-[#DAE0DA]'
          }`} preserveAspectRatio="none">
            <path d="M0,80 Q250,20 500,80 T1000,80 L1000,120 L0,120 Z" />
          </svg>
          
          {/* Middle hill */}
          <svg viewBox="0 0 1000 120" className={`w-full h-[100px] opacity-70 fill-current translate-y-[10px] ${
            isDark ? 'text-[#1C1A18]' : 'text-[#C9D1C9]'
          }`} preserveAspectRatio="none">
            <path d="M0,90 Q300,40 600,100 T1000,90 L1000,120 L0,120 Z" />
          </svg>

          {/* Foreground hill where our active trees stand */}
          <svg viewBox="0 0 1000 120" className={`w-full h-[90px] fill-current ${
            isDark ? 'text-[#25221F]' : 'text-[#BAC4BA]'
          }`} preserveAspectRatio="none">
            <path d="M0,100 Q200,60 500,105 T1000,100 L1000,120 L0,120 Z" />
          </svg>
        </div>

        {/* Landscape Grass Level soil wrapper */}
        <div className={`absolute inset-x-0 bottom-0 h-4 ${isDark ? 'bg-[#181614]' : 'bg-[#A2B1A2]'}`} />

        {/* Placed Interactive Trees */}
        {habits.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-sm">
            <AppLogo size={56} className="mb-3" color="#4E7D5B" />
            <h3 className="text-white font-medium text-lg">Your Forest is Empty Seed</h3>
            <p className="text-xs text-neutral-300 mt-1 max-w-sm">
              Plant your first habit to generate an interactive seedling on these hills.
            </p>
            <button
              id="plant-tree-from-forest"
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 bg-[#4E7D5B] text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Plant a Seed
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-end justify-center px-8 pb-3 overflow-x-auto select-none scrollbar-none">
            <div className="flex items-end justify-center w-full max-w-5xl gap-4 sm:gap-8 md:gap-11 pb-px">
              {habits.map((h) => {
                const { currentStreak } = calculateStreaks(h.history);
                const isSelected = selectedTree?.id === h.id;
                const colors = COLOR_MAP[h.color] || COLOR_MAP.lime;
                const completedToday = h.history.includes(todayStr);

                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedTree(h)}
                    className="flex flex-col items-center group cursor-pointer transition-all duration-300 relative select-none pb-0.5"
                    style={{ transform: isSelected ? 'scale(1.1)' : 'scale(1)' }}
                  >
                    
                    {/* Soft atmospheric highlight rings around selected tree */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#4E7D5B]/5 blur-2xl rounded-full scale-150 pointer-events-none animate-pulse" />
                    )}

                    {/* Today Completion bullet above tree */}
                    <div 
                      className={`
                        w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-350 transform translate-y-[-10px] scale-90 group-hover:scale-100 z-10 cursor-pointer
                        ${completedToday 
                          ? 'bg-[#4E7D5B] border-[#4E7D5B] text-white font-bold' 
                          : isDark
                            ? 'bg-black/80 border-neutral-700 text-neutral-400'
                            : 'bg-white border-neutral-300 text-neutral-600'
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleDate(h.id, todayStr);
                      }}
                      title={completedToday ? 'Today watered!' : 'Mark complete for today'}
                    >
                      {completedToday ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold">✓</span>
                      )}
                    </div>

                    {/* Dynamic Graphic SVG */}
                    <div className="hover:scale-105 active:scale-95 transition-transform duration-200">
                      <TreeGraphic species={h.treeSpecies} streak={currentStreak} size={90} animate={true} isDark={isDark} />
                    </div>

                    {/* Small text label embedded under tree */}
                    <span 
                      className={`
                        mt-4 text-[10px] font-mono tracking-wider truncate max-w-[80px] text-center transition-all
                        ${isSelected 
                          ? isDark 
                            ? 'text-[#C9BCA9] font-bold underline' 
                            : 'text-[#4E7D5B] font-bold underline'
                          : 'text-neutral-500 group-hover:text-neutral-700'
                        }
                      `}
                    >
                      {h.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Tree Detailed HUD / Card Popover */}
      {selectedTree && habits.length > 0 && (
        (() => {
          const { currentStreak, maxStreak } = calculateStreaks(selectedTree.history);
          const colors = COLOR_MAP[selectedTree.color] || COLOR_MAP.lime;
          const completedToday = selectedTree.history.includes(todayStr);

          // Growth stage title
          let growthStage = 'Seed Stage';
          if (currentStreak >= 40) growthStage = 'Mighty Elder Giant';
          else if (currentStreak >= 15) growthStage = 'Healthy Forest Tree';
          else if (currentStreak >= 6) growthStage = 'Young Sapling';
          else if (currentStreak >= 2) growthStage = 'Germinated Sprout';

          return (
            <div 
              id="selected-tree-hud"
              className={`border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors shadow-sm ${
                isDark 
                  ? 'bg-[#1C1A18] border-white/5' 
                  : 'bg-[#FFFFFF] border-[#E4E7E4]'
              }`}
            >
              <div className="flex items-center gap-4 text-left w-full md:w-auto">
                {/* Micro avatar */}
                <div className={`p-3 rounded-xl border ${colors.bg} ${colors.text} ${colors.border}`}>
                  <span className="font-mono text-xs font-bold leading-none select-none">
                    {selectedTree.treeSpecies.toUpperCase().slice(0, 3)}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-base font-sans font-semibold ${isDark ? 'text-white' : 'text-[#1C1E1C]'}`}>
                      {selectedTree.name}
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isDark 
                        ? 'bg-white/5 border-white/5 text-[#4E7D5B]' 
                        : 'bg-[#F5F6F5] border-[#E4E7E4] text-[#4E7D5B] font-bold'
                    }`}>
                      {growthStage}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 max-w-md ${isDark ? 'text-neutral-400' : 'text-[#5C615C]'}`}>
                    {selectedTree.description || 'Watch your streak nurture this life.'}
                  </p>
                </div>
              </div>

              {/* Stats and controller */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-[#4E7D5B]/10">
                <div className="flex items-center gap-4 font-mono">
                  <div className="text-left">
                    <span className="block text-[9px] text-neutral-500 uppercase tracking-widest">Current streak</span>
                    <span className="text-sm font-semibold text-[#C56B48] flex items-center gap-1 mt-0.5">
                      <Flame className="w-4 h-4 fill-current text-[#C56B48]" /> {currentStreak} days
                    </span>
                  </div>

                  <div className="text-left">
                    <span className="block text-[9px] text-neutral-500 uppercase tracking-widest">Maximum streak</span>
                    <span className={`text-sm font-semibold mt-0.5 block ${isDark ? 'text-white' : 'text-[#1C1E1C]'}`}>
                      {maxStreak} days
                    </span>
                  </div>
                </div>

                <button
                  id="hud-toggle-today"
                  onClick={() => onToggleDate(selectedTree.id, todayStr)}
                  className={`
                    px-5 py-2.5 rounded-xl text-xs font-semibold select-none transition-all duration-200 outline-none border cursor-pointer
                    ${completedToday 
                      ? isDark 
                        ? 'bg-white/5 border-white/5 text-[#4E7D5B] hover:bg-white/10' 
                        : 'bg-[#F5F6F5] border-[#E4E7E4] text-[#4E7D5B]'
                      : `bg-[#4E7D5B] border-[#4E7D5B] ${isDark ? 'text-white hover:bg-[#5E956D]' : 'text-white hover:bg-[#3D6247]'} shadow-sm active:scale-95`
                    }
                  `}
                >
                  {completedToday ? 'Today is Logged! ✓' : 'Water Seed Today'}
                </button>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
