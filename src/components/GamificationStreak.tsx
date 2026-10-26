import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Zap, 
  Gift, 
  Smile, 
  Award,
  PartyPopper
} from 'lucide-react';
import { MicroWin, StreakProfile } from '../types';
import { formatINR } from '../utils/currency';

interface GamificationStreakProps {
  gentleMode: boolean;
  setGentleMode: (val: boolean) => void;
  microWins: MicroWin[];
  onAddMicroWin: (title: string, amount: number) => void;
}

export const GamificationStreak: React.FC<GamificationStreakProps> = ({
  gentleMode,
  setGentleMode,
  microWins,
  onAddMicroWin,
}) => {
  const [streak, setStreak] = useState<number>(14);
  const [showCelebration, setShowCelebration] = useState<string | null>(null);
  const [customWinTitle, setCustomWinTitle] = useState('');
  const [customWinAmount, setCustomWinAmount] = useState('');

  const quickPresets = [
    { title: 'Cooked meals at home instead of Swiggy/Zomato', amount: 350 },
    { title: 'Avoided delivery app surge & packaging fees', amount: 85 },
    { title: 'Brewed specialty filter coffee / cold brew at home', amount: 160 },
    { title: 'Took Namma Metro instead of peak cab surge', amount: 240 },
    { title: 'Cancelled recurring unused OTT/app subscription', amount: 499 },
  ];

  const totalSavedFromWins = microWins.reduce((acc, w) => acc + w.amountSaved, 0);

  const badges = [
    { name: 'Inflation Shield', desc: 'Protected budget against 8%+ rent shock', unlocked: true, icon: '🛡️' },
    { name: 'Micro-Win Champion', desc: 'Logged 10+ small financial victories', unlocked: microWins.length >= 5, icon: '🏆' },
    { name: 'Receipt Sleuth', desc: 'Parsed mixed cart into Needs vs Wants', unlocked: true, icon: '🔍' },
    { name: 'Zero-Leak Monk', desc: 'Avoided delivery apps for 7 days', unlocked: true, icon: '⚡' },
    { name: 'Runway Architect', desc: 'Maintained 60+ days survival buffer', unlocked: true, icon: '🏰' },
  ];

  const handleLogWin = (title: string, amount: number) => {
    onAddMicroWin(title, amount);
    setShowCelebration(`🎉 Micro-Win! Saved +${formatINR(amount)} on "${title}"`);
    setTimeout(() => setShowCelebration(null), 3500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWinTitle.trim() || !customWinAmount) return;
    handleLogWin(customWinTitle.trim(), parseFloat(customWinAmount) || 5);
    setCustomWinTitle('');
    setCustomWinAmount('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 stripe-card-glow space-y-6">
      
      {/* Header with Gentle Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-2.5 py-0.5 rounded mb-1">
            <Trophy className="w-3.5 h-3.5" />
            Behavioral Support & Micro-Wins
          </div>
          <h3 className="text-xl font-extrabold text-[#0a2540] tracking-tight">
            Streak Gamification & Micro-Savings Loop
          </h3>
          <p className="text-xs text-[#425466]">
            Transforms budgeting from anxiety into positive reinforcement through micro-savings celebrations and check-in momentum.
          </p>
        </div>

        {/* Anxiety-Free Gentle Mode Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="text-right">
            <span className="text-xs font-bold text-[#0a2540] block flex items-center gap-1 justify-end">
              <Smile className={`w-3.5 h-3.5 ${gentleMode ? 'text-indigo-600' : 'text-slate-400'}`} />
              Gentle Mode
            </span>
            <span className="text-[10px] text-slate-500">
              {gentleMode ? 'Calm guidance active' : 'Red alert badges active'}
            </span>
          </div>

          <button
            onClick={() => setGentleMode(!gentleMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              gentleMode ? 'bg-[#635bff]' : 'bg-slate-300'
            }`}
            aria-label="Toggle Gentle Mode"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                gentleMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Pop-up celebration toast */}
      {showCelebration && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#635bff] text-white text-xs font-bold shadow-lg animate-in zoom-in-95 duration-200 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PartyPopper className="w-4 h-4 animate-bounce" />
            {showCelebration}
          </span>
          <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
            +50 XP
          </span>
        </div>
      )}

      {/* Streak and Level Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Streak Counter */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-xs">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Check-In Momentum
            </span>
            <span className="text-xl font-black text-amber-950">
              {streak} Days Streak 🔥
            </span>
          </div>
        </div>

        {/* Total Micro-Wins Saved */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Micro-Wins Accumulated
            </span>
            <span className="text-xl font-black text-emerald-950">
              +{formatINR(totalSavedFromWins)} Saved
            </span>
          </div>
        </div>

        {/* Level & XP */}
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#635bff] text-white flex items-center justify-center font-black shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="w-full">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-900">
              <span>Level 4 Fortress</span>
              <span>720 / 1000 XP</span>
            </div>
            <div className="w-full h-2 bg-indigo-200/70 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#635bff] rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
        </div>

      </div>

      {/* Log a Micro-Win Section */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a2540] flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-[#635bff]" />
          Log Today's Micro-Savings Win (1-Click)
        </h4>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-2">
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleLogWin(preset.title, preset.amount)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 font-semibold text-[#0a2540] transition-colors cursor-pointer shadow-2xs"
            >
              {preset.title} (+{formatINR(preset.amount)})
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} className="pt-2 flex flex-wrap gap-2 text-xs">
          <input
            type="text"
            value={customWinTitle}
            onChange={(e) => setCustomWinTitle(e.target.value)}
            placeholder="Custom win (e.g. Swapped to local milk pouch / bulk dal)..."
            className="flex-1 min-w-[200px] px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#635bff]"
          />
          <div className="relative w-28">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
            <input
              type="number"
              value={customWinAmount}
              onChange={(e) => setCustomWinAmount(e.target.value)}
              placeholder="Saved"
              className="w-full pl-6 pr-2 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#635bff]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Log Win
          </button>
        </form>
      </div>

      {/* Earned Badges Showcase */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Resilience Badges Unlocked ({badges.filter((b) => b.unlocked).length} / {badges.length})
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center transition-all ${
                badge.unlocked
                  ? 'bg-white border-slate-200 shadow-2xs'
                  : 'bg-slate-50 border-slate-200/60 opacity-40'
              }`}
            >
              <span className="text-2xl block mb-1">{badge.icon}</span>
              <span className="text-xs font-bold text-[#0a2540] block truncate">
                {badge.name}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                {badge.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
