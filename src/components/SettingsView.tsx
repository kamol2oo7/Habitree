import React, { useState } from 'react';
import { Habit } from '../types';
import { Trash2, AlertOctagon, Download, RefreshCw, BookOpen, CalendarDays } from 'lucide-react';

interface SettingsViewProps {
  isDark: boolean;
  onClearAll: () => void;
  onImportJSON: (jsonStr: string) => boolean;
  habits: Habit[];
  gridStyle: 'classic_strip' | 'mini_heatmap';
  onToggleGridStyle: (style: 'classic_strip' | 'mini_heatmap') => void;
}

export default function SettingsView({ 
  isDark, 
  onClearAll, 
  onImportJSON, 
  habits,
  gridStyle,
  onToggleGridStyle
}: SettingsViewProps) {
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const handleExport = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(habits, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `habitree-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      setMessage({ type: 'success', text: 'Backup JSON downloaded successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to trigger backup download.' });
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const ok = onImportJSON(importText);
    if (ok) {
      setMessage({ type: 'success', text: 'Habitree backup imported successfully!' });
      setImportText('');
    } else {
      setMessage({ type: 'error', text: 'Failed to import. Please ensure JSON conforms to Habitree syntax.' });
    }
  };

  return (
    <div id="settings-container" className="space-y-6 text-left max-w-4xl">
      
      {/* Title */}
      <div>
        <h2 className={`text-2xl font-sans font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#1C1E1C]'}`}>
          System Settings
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-[#5C615C]'}`}>
          Manage local databases, trigger backups, or reset your tree inventory.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-medium border ${
          message.type === 'success' 
            ? 'bg-[#4E7D5B]/10 border-[#4E7D5B]/20 text-[#4E7D5B]' 
            : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {message.text}
        </div>
      )}

      {/* Grid Layout of options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Column 1: Demo & Wipes */}
        <div className="space-y-6">
          
          {/* Grid Style Toggle Preferences card */}
          <div className={`border rounded-2xl p-5 space-y-4 ${
            isDark ? 'bg-[#1C1A18] border-white/5' : 'bg-[#FFFFFF] border-[#E4E7E4] shadow-sm'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl border ${
                isDark ? 'bg-[#4E7D5B]/10 border-[#4E7D5B]/20 text-[#4E7D5B]' : 'bg-[#4E7D5B]/15 border-[#4E7D5B]/35 text-[#4E7D5B]'
              }`}>
                <CalendarDays className="w-5 h-5 text-[#4E7D5B]" />
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1C1E1C]'}`}>Tracking Grid Layout</h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-[#5C615C]'}`}>
                  Choose how your monthly habit completions are visualised inside the dashboard cards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onToggleGridStyle('classic_strip')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition-all cursor-pointer border select-none ${
                  gridStyle === 'classic_strip'
                    ? isDark 
                      ? 'bg-[#4E7D5B]/20 border-[#4E7D5B] text-white font-bold' 
                      : 'bg-[#4E7D5B]/10 border-[#4E7D5B] text-[#4E7D5B] font-extrabold'
                    : isDark
                      ? 'bg-transparent border-white/5 text-[#9D9A90] hover:bg-white/5'
                      : 'bg-transparent border-[#E4E7E4] text-[#706B63] hover:bg-[#FAF8F5]'
                }`}
              >
                <span className="text-xs font-bold block mb-1">Calendar Strip</span>
                <span className="text-[10px] opacity-70 font-mono tracking-tight leading-none">Compact Capsule Bar</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleGridStyle('mini_heatmap')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition-all cursor-pointer border select-none ${
                  gridStyle === 'mini_heatmap'
                    ? isDark 
                      ? 'bg-[#4E7D5B]/20 border-[#4E7D5B] text-white font-bold' 
                      : 'bg-[#4E7D5B]/10 border-[#4E7D5B] text-[#4E7D5B] font-extrabold'
                    : isDark
                      ? 'bg-transparent border-white/5 text-[#9D9A90] hover:bg-white/5'
                      : 'bg-transparent border-[#E4E7E4] text-[#706B63] hover:bg-[#FAF8F5]'
                }`}
              >
                <span className="text-xs font-bold block mb-1">Mini Heatmap</span>
                <span className="text-[10px] opacity-70 font-mono tracking-tight leading-none">Calendar Aligned Grid</span>
              </button>
            </div>
          </div>

          {/* Database Wipe */}
          <div className={`border rounded-2xl p-5 space-y-4 ${
            isDark ? 'bg-[#1C1A18] border-white/5' : 'bg-[#FFFFFF] border-[#E4E7E4] shadow-sm'
          }`}>
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                <AlertOctagon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1C1E1C]'}`}>Clear All Habits</h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-[#5C615C]'}`}>
                  Delete everything including tree growth states, custom metadata parameters, and registered completion logs. This action is atomic and irreversible.
                </p>
              </div>
            </div>

            {isConfirmingClear ? (
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  id="clear-all-cancel"
                  onClick={() => setIsConfirmingClear(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                    isDark 
                      ? 'border-white/10 text-[#9D9A90] hover:bg-white/5' 
                      : 'border-[#E4E7E4] text-[#706B63] hover:bg-[#FAF8F5]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="clear-all-confirm"
                  onClick={() => {
                    onClearAll();
                    setIsConfirmingClear(false);
                    setMessage({ type: 'success', text: 'All data cleared. Your forest is empty.' });
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-sm"
                >
                  Confirm Erase
                </button>
              </div>
            ) : (
              <button
                id="delete-all-btn"
                onClick={() => setIsConfirmingClear(true)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 text-center cursor-pointer ${
                  isDark 
                    ? 'bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10' 
                    : 'bg-transparent border border-red-400 text-red-500 hover:bg-red-500/5 shadow-sm'
                }`}
              >
                Erase Database Completely
              </button>
            )}
          </div>

        </div>

        {/* Column 2: Export & Import */}
        <div className="space-y-6">
          
          <div className={`border rounded-2xl p-5 space-y-4 ${
            isDark ? 'bg-[#1C1A18] border-white/5' : 'bg-[#FFFFFF] border-[#E4E7E4] shadow-sm'
          }`}>
            <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#1C1E1C]'}`}>
              <Download className={`w-4 h-4 ${isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'}`} /> Backup & Port Data
            </h3>
            <p className={`text-xs font-normal ${isDark ? 'text-white/40' : 'text-[#5C615C]'}`}>
              Download your full Habitree profile state. Keep it formatted safely as a backup file.
            </p>

            <button
              id="export-json-btn"
              onClick={handleExport}
              className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border ${
                isDark 
                  ? 'bg-transparent hover:bg-white/5 text-white border-white/5' 
                  : 'bg-[#F5F6F5] hover:bg-[#EBECEB] border-[#E4E7E4] shadow-sm text-[#1C1E1C]'
              }`}
            >
              Export JSON Backup
            </button>

            {/* Custom Import Form */}
            <form onSubmit={handleImportSubmit} className={`pt-4 border-t space-y-3 ${isDark ? 'border-white/5' : 'border-[#E4E7E4]'}`}>
              <label htmlFor="import-data" className={`block text-xs font-mono uppercase tracking-wider font-bold ${
                isDark ? 'text-white/40' : 'text-[#5C615C]'
              }`}>
                Import Backup JSON string:
              </label>
              
              <textarea
                id="import-data"
                placeholder='Paste exported JSON block here...'
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={3}
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-[#4E7D5B] resize-none placeholder:text-neutral-550 ${
                  isDark 
                    ? 'bg-[#12110F] border-white/5 text-white placeholder:text-white/20' 
                    : 'bg-[#F5F6F5] border-[#E4E7E4] text-[#1C1E1C] placeholder:text-neutral-400'
                }`}
              />

              <button
                id="import-submit-btn"
                type="submit"
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                  isDark 
                    ? 'bg-[#4E7D5B]/10 hover:bg-[#4E7D5B]/20 border-[#4E7D5B]/30 text-[#4E7D5B]' 
                    : 'bg-[#F5F6F5] hover:bg-[#EBECEB] border-[#4E7D5B]/40 text-[#4E7D5B]'
                }`}
              >
                Restore from Raw Text JSON
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* ARCHITECTURAL DESCRIPTION CONCEPT BLOCK */}
      <div className={`border rounded-2xl p-5 space-y-3 ${
        isDark ? 'bg-[#1C1A18] border-white/5' : 'bg-[#FFFFFF] border-[#E4E7E4]'
      }`}>
        <h3 className={`text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 font-extrabold ${
          isDark ? 'text-[#4E7D5B]' : 'text-[#4E7D5B]'
        }`}>
          <BookOpen className="w-4 h-4" /> Architectural Design Concepts
        </h3>
        
        <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-[#5C615C]'}`}>
          <strong>Habitree</strong> provides a high-density, beautifully animated offline-first tracking environment. All modules utilize Inter paired with JetBrains Mono to structure tracking date logs elegantly, responding to both light themes and rich dark chocolate clay themes.
        </p>

        <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-[#5C615C]'}`}>
          Growth models are represented dynamically in vector SVGs, letting you visualize consecutive habits as blooming ancients.
        </p>
      </div>

    </div>
  );
}
