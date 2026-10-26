import React from 'react';
import { 
  Building2, 
  Receipt, 
  TrendingUp, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Lock, 
  ArrowRight,
  Layers,
  ChevronRight
} from 'lucide-react';

interface BentoGridProps {
  onNavigateTab: (tab: string) => void;
  onOpenAdvisor: () => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ onNavigateTab, onOpenAdvisor }) => {
  return (
    <section className="py-20 bg-[#f8fafc] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-3 py-1 rounded-full mb-3">
            <Layers className="w-3.5 h-3.5" />
            Infrastructure for Financial Resilience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2540] tracking-tight">
            Engineered to neutralize cost-of-living volatility.
          </h2>
          <p className="text-base sm:text-lg text-[#425466] mt-3 leading-relaxed">
            Four interconnected engines running continuously to monitor, forecast, itemize, and bridge your household balance sheet.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: 7 cols */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 ease-out group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#635bff]/10 text-[#635bff] border border-[#635bff]/20">
                  Algorithmic Grounding
                </span>
                <span className="text-xs text-slate-400 font-semibold">42+ Metro Baselines</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0a2540] tracking-tight mb-2">
                Hyper-Local Metro Stress Indexing
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed mb-6">
                National CPI numbers mask brutal city-level spikes. AuraLedger tracks rental medians, grocery multipliers, and regional grid tariffs across Bengaluru, Mumbai, Delhi NCR, Hyderabad, and Pune to measure your true financial elasticity.
              </p>

              {/* Visual preview strip */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Bengaluru</span>
                  <span className="font-extrabold text-[#0a2540] text-sm">Index 175</span>
                  <span className="text-[10px] text-rose-600 block mt-0.5">+8.5% YoY Rent</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Mumbai</span>
                  <span className="font-extrabold text-[#0a2540] text-sm">Index 195</span>
                  <span className="text-[10px] text-rose-600 block mt-0.5">+10.2% YoY Rent</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Delhi NCR</span>
                  <span className="font-extrabold text-[#0a2540] text-sm">Index 160</span>
                  <span className="text-[10px] text-amber-600 block mt-0.5">+6.8% YoY Rent</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('calculator')}
                className="text-xs font-bold text-[#635bff] hover:text-[#544dc9] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
              >
                <span>Calibrate your city index</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bento Card 2: 5 cols */}
          <div className="md:col-span-5 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 ease-out group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-600 border border-pink-500/20">
                  Multimodal OCR
                </span>
                <Receipt className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#0a2540] tracking-tight mb-2">
                Automated Receipt AI Parser
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed mb-6">
                Stop manual entry. Upload store photos or copy-paste bills. Gemini 3.8 extracts each SKU, tags grocery shrinkflation, and isolates recurring subscriptions.
              </p>

              {/* Pill mock */}
              <div className="space-y-2 p-3.5 rounded-xl bg-pink-50/40 border border-pink-100 text-xs">
                <div className="flex justify-between font-semibold text-[#0a2540]">
                  <span>Blinkit / Zepto Supermart</span>
                  <span className="font-extrabold">₹1,480</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded text-pink-600 font-bold border border-pink-100">
                    12 SKUs Itemized
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded text-emerald-700 font-bold border border-emerald-100">
                    Save ₹380 via Local Brands
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('receipts')}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
              >
                <span>Upload a receipt now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bento Card 3: 5 cols */}
          <div className="md:col-span-5 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 ease-out group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  Dynamic Forecasting
                </span>
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#0a2540] tracking-tight mb-2">
                "What-If" Creep Simulation
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed mb-6">
                Test 1 to 5 year projections for lease renewals (+8% to +25%) and utility shocks. See precisely how fast emergency fund runways erode before making financial commitments.
              </p>

              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-amber-900 font-medium">
                "A 10% rent renewal shrinks a 6-month buffer to 3.8 months in high-cost metro regions."
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('simulator')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
              >
                <span>Test inflation sliders</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bento Card 4: 7 cols */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 ease-out group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
                  Google Search Grounding
                </span>
                <span className="text-xs font-bold text-[#635bff] bg-indigo-50 px-2 py-0.5 rounded">
                  Direct Portal Matching
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#0a2540] tracking-tight mb-2">
                Google-Grounded Job Portal Arbitrage
              </h3>
              <p className="text-sm text-[#425466] leading-relaxed mb-6">
                Cutting expenses only goes so far. When your simulated inflation deficit is +₹15,000/mo, AuraLedger calls Gemini with live Google Search grounding across specific job boards (LinkedIn, Indeed, RemoteOK, Wellfound, Naukri) to surface targeted side roles requiring as little as 10 hours a month.
              </p>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cyan-50/40 border border-cyan-100 text-xs">
                <Briefcase className="w-4 h-4 text-cyan-600 shrink-0" />
                <span className="text-[#0a2540] font-semibold">
                  Verified job portal links, compensation bands in ₹ / INR, and exact deficit-neutralizing hours calculated on the fly.
                </span>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('jobs')}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
              >
                <span>Search remote job portals</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Stripe-style FAQ */}
        <div className="mt-20 pt-16 border-t border-slate-200/80">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-extrabold text-[#0a2540] tracking-tight mb-8 text-center">
              Frequently Asked Questions
            </h3>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
                <h4 className="text-sm font-bold text-[#0a2540] mb-2">
                  How does AuraLedger calculate the Cost-of-Living Stress Index?
                </h4>
                <p className="text-xs text-[#425466] leading-relaxed">
                  The Stress Index utilizes a multi-variable econometric model evaluating your housing-to-income ratio (30% baseline), grocery cost index against metro BLS CPI reports, emergency cash runway months, and net discretionary surplus. Scores above 65 trigger high-stress alerts.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
                <h4 className="text-sm font-bold text-[#0a2540] mb-2">
                  How does the Google-grounded job search work?
                </h4>
                <p className="text-xs text-[#425466] leading-relaxed">
                  We instruct Google Gemini 3.8 Flash with live Google Search grounding to query specific high-reputation hiring portals (LinkedIn, Indeed, RemoteOK, Wellfound, WeWorkRemotely) for active postings tailored to your required monthly deficit.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
                <h4 className="text-sm font-bold text-[#0a2540] mb-2">
                  Is my financial data secure?
                </h4>
                <p className="text-xs text-[#425466] leading-relaxed">
                  Yes. All receipt images and budget numbers are analyzed in-session through server-side authenticated APIs without persistent tracking or sale of personal consumer information.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
