import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Flame, ChevronRight, CheckCircle2 } from 'lucide-react';
import { BudgetState, CityBenchmark } from '../types';
import { StressCalculationResult } from '../utils/calculator';
import { formatINR } from '../utils/currency';

interface MeshHeroProps {
  budget: BudgetState;
  selectedCity: CityBenchmark;
  stressResult: StressCalculationResult;
  onNavigateTab: (tab: string) => void;
  onOpenAdvisor: () => void;
  onOpenAudit: () => void;
}

export const MeshHero: React.FC<MeshHeroProps> = ({
  budget,
  selectedCity,
  stressResult,
  onNavigateTab,
  onOpenAdvisor,
  onOpenAudit,
}) => {
  const isHighStress = stressResult.stressScore > 65;

  return (
    <div className="relative overflow-hidden bg-white border-b border-slate-200/80">
      {/* Stripe Signature Multi-Color Mesh Gradient Swoosh */}
      <div 
        className="absolute top-0 right-0 -mr-20 -mt-20 w-[640px] h-[520px] lg:w-[920px] lg:h-[680px] pointer-events-none opacity-35 sm:opacity-40 lg:opacity-45 filter blur-3xl transform rotate-12 -skew-y-6"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at 10% 20%, #635bff 0%, transparent 45%),
            radial-gradient(circle at 80% 15%, #ec4899 0%, transparent 45%),
            radial-gradient(circle at 45% 60%, #f43f5e 0%, transparent 45%),
            radial-gradient(circle at 20% 85%, #00d4ff 0%, transparent 45%),
            radial-gradient(circle at 90% 75%, #f59e0b 0%, transparent 45%)
          `,
        }}
      />

      {/* Decorative SVG diagonal wave mesh lines */}
      <svg
        className="absolute top-0 right-0 w-full h-[620px] pointer-events-none opacity-20 hidden md:block"
        viewBox="0 0 1200 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 80C300 200 700 0 1200 120L1200 0L0 0Z"
          fill="url(#mesh-grad-1)"
          fillOpacity="0.4"
        />
        <path
          d="M0 240C400 360 800 120 1200 280L1200 0L0 0Z"
          fill="url(#mesh-grad-2)"
          fillOpacity="0.25"
        />
        <defs>
          <linearGradient id="mesh-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#635bff" />
            <stop offset="35%" stopColor="#ec4899" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
          <linearGradient id="mesh-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#635bff" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-18 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live-status badge / metric */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 shadow-2xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isHighStress ? 'bg-rose-400' : 'bg-[#635bff]'
                }`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isHighStress ? 'bg-rose-500' : 'bg-[#635bff]'
                }`} />
              </span>
              <span className="text-xs font-semibold text-[#0a2540]">
                Cost-of-Living Stress Index:
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                stressResult.stressScore > 75
                  ? 'bg-rose-100 text-rose-700'
                  : stressResult.stressScore > 50
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {stressResult.stressScore}% • {stressResult.stressRating}
              </span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0a2540] tracking-tight leading-[1.08]">
              Defend your budget against runaway{' '}
              <span className="bg-gradient-to-r from-[#635bff] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                rent creep & inflation.
              </span>
            </h1>

            {/* Section Subtitle / Body */}
            <p className="text-lg sm:text-xl text-[#425466] leading-relaxed max-w-2xl font-normal">
              AuraLedger models your hyper-local metro costs, parses grocery receipts with Gemini AI, simulates rent hikes, and surfaces verified remote gigs from top job portals to bridge income deficits.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigateTab('calculator')}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-lg text-base font-bold text-white bg-[#635bff] hover:bg-[#544dc9] shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Analyze Your Budget</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('simulator')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-lg text-base font-semibold text-[#0a2540] bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <TrendingUp className="w-4 h-4 text-[#635bff]" />
                <span>Simulate Rent & Price Hikes</span>
              </button>
            </div>

            {/* Key feature pills */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#425466] font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>42+ Metro Living Baselines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Gemini Receipt OCR & Categorizer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Google-Grounded Job Portal Radar</span>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Interactive Stripe-Styled Live Copilot Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card frame with subtle glow */}
              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-slate-200/90 stripe-card-glow transition-all duration-300 hover:border-indigo-200">
                
                {/* Header bar of preview widget */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                      Telemetry • {selectedCity.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#635bff] bg-indigo-50 px-2 py-0.5 rounded-full">
                    Index {selectedCity.costIndex}
                  </span>
                </div>

                {/* Main Card Gauge & Numbers */}
                <div className="py-5 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                        Monthly Net Cashflow
                      </p>
                      <h4 className="text-3xl font-extrabold text-[#0a2540] tracking-tight mt-0.5">
                        {formatINR(budget.income)}{' '}
                        <span className="text-xs font-medium text-slate-400">/mo</span>
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                        Housing Burden
                      </p>
                      <p className={`text-xl font-bold ${
                        stressResult.housingRatio > 40 ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {stressResult.housingRatio}%
                      </p>
                    </div>
                  </div>

                  {/* Stress Visual Meter Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-[#425466]">Stress Exposure</span>
                      <span className={
                        stressResult.stressScore > 70 ? 'text-rose-600 font-bold' : 'text-[#635bff] font-bold'
                      }>
                        {stressResult.stressScore}/100 • {stressResult.stressRating}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${stressResult.stressScore}%`,
                          background: stressResult.stressScore > 75 
                            ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' 
                            : 'linear-gradient(90deg, #635bff, #a855f7)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Expense Breakdown Mini Strip */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Housing</span>
                      <span className="text-sm font-bold text-[#0a2540]">{formatINR(budget.housing)}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Groceries</span>
                      <span className="text-sm font-bold text-[#0a2540]">{formatINR(budget.groceries)}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Free Buffer</span>
                      <span className={`text-sm font-bold ${
                        stressResult.netMonthlySurplus < 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {stressResult.netMonthlySurplus >= 0 ? '+' : ''}{formatINR(stressResult.netMonthlySurplus)}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Alert Banner inside widget */}
                  <div className={`p-3 rounded-xl flex items-start gap-2.5 text-xs ${
                    stressResult.housingRatio > 40
                      ? 'bg-rose-50 text-rose-900 border border-rose-200/70'
                      : 'bg-indigo-50 text-indigo-950 border border-indigo-200/70'
                  }`}>
                    {stressResult.housingRatio > 40 ? (
                      <Flame className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-[#635bff] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {stressResult.housingRatio > 40
                          ? `Rent exceeds 40% rule by ${formatINR(Math.round(budget.housing - budget.income * 0.3))}/mo.`
                          : `Healthy 30% housing threshold preserved in ${selectedCity.name}.`}
                      </p>
                      <p className="opacity-90 text-[11px] mt-0.5">
                        {stressResult.housingRatio > 40
                          ? 'Inflation increases risk of emergency runway drain within 3 months.'
                          : 'Explore side gigs to compound emergency savings into high-yield buffers.'}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Footer action inside card */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={onOpenAdvisor}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#635bff] hover:text-[#544dc9] transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Copilot for scripts</span>
                  </button>
                  <button
                    onClick={onOpenAudit}
                    className="text-xs font-semibold text-slate-500 hover:text-[#0a2540] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Full Audit Report</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

              </div>

              {/* Decorative mini floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-lg hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-[#0a2540]">Real-Time BLS CPI Fed Grounding</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
