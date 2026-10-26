import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Flame, 
  ShieldAlert, 
  ArrowRight, 
  Briefcase, 
  DollarSign, 
  Percent, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { BudgetState, InflationScenario } from '../types';
import { calculateInflationImpact } from '../utils/calculator';
import { formatINR } from '../utils/currency';

interface InflationSimulatorProps {
  budget: BudgetState;
  scenario: InflationScenario;
  setScenario: React.Dispatch<React.SetStateAction<InflationScenario>>;
  onFindJobsForDeficit: (amount: number) => void;
}

export const InflationSimulator: React.FC<InflationSimulatorProps> = ({
  budget,
  scenario,
  setScenario,
  onFindJobsForDeficit,
}) => {
  const impact = calculateInflationImpact(budget, scenario);

  const resetSliders = () => {
    setScenario({
      rentHike: 8,
      groceryHike: 10,
      utilityHike: 15,
      transportHike: 8,
      timeHorizonYears: 1,
    });
  };

  return (
    <div className="py-12 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ec4899] bg-pink-50 px-2.5 py-1 rounded-md mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Scenario Forecasting Engine
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a2540] tracking-tight">
              "What-If" Inflation & Rent Creep Simulator
            </h2>
            <p className="text-[#425466] text-base mt-1 max-w-2xl">
              Model impending lease renewals, grocery shrinkflation, and energy tariff spikes to project the true erosion of your purchasing power.
            </p>
          </div>

          <button
            onClick={resetSliders}
            className="self-start md:self-end flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0a2540] px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sliders Column */}
          <div className="lg:col-span-7 bg-[#f8fafc] rounded-2xl p-6 sm:p-7 border border-slate-200/90 space-y-6">
            
            {/* Rent Hike Slider */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#0a2540] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#635bff]" />
                  Projected Lease / Rent Hike
                </span>
                <span className="text-sm font-bold text-[#635bff] bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  +{scenario.rentHike}% (+{formatINR(impact.rentIncrease)}/mo)
                </span>
              </div>
              <p className="text-xs text-[#64748b] mb-3">
                Current rent: {formatINR(budget.housing)}/mo &rarr; Projected: {formatINR(budget.housing + impact.rentIncrease)}/mo
              </p>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={scenario.rentHike}
                onChange={(e) => setScenario((prev) => ({ ...prev, rentHike: parseInt(e.target.value, 10) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#635bff]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1.5">
                <span>0% (Frozen)</span>
                <span>5% (Historical Avg)</span>
                <span>10% (High Metro)</span>
                <span>25% (Extreme Squeeze)</span>
              </div>
            </div>

            {/* Grocery Inflation Slider */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#0a2540] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  Food & Grocery Price Inflation
                </span>
                <span className="text-sm font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-md">
                  +{scenario.groceryHike}% (+{formatINR(impact.groceryIncrease)}/mo)
                </span>
              </div>
              <p className="text-xs text-[#64748b] mb-3">
                Current spend: {formatINR(budget.groceries)}/mo &rarr; Projected: {formatINR(budget.groceries + impact.groceryIncrease)}/mo
              </p>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={scenario.groceryHike}
                onChange={(e) => setScenario((prev) => ({ ...prev, groceryHike: parseInt(e.target.value, 10) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1.5">
                <span>0%</span>
                <span>10% (Moderate)</span>
                <span>20% (Core Food Inflation)</span>
                <span>30% (Spike)</span>
              </div>
            </div>

            {/* Utility & Energy Spike */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#0a2540] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Power Grid & Seasonal Summer/Winter Spike
                </span>
                <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md">
                  +{scenario.utilityHike}% (+{formatINR(impact.utilityIncrease)}/mo)
                </span>
              </div>
              <p className="text-xs text-[#64748b] mb-3">
                Current utilities: {formatINR(budget.utilities)}/mo &rarr; Projected: {formatINR(budget.utilities + impact.utilityIncrease)}/mo
              </p>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={scenario.utilityHike}
                onChange={(e) => setScenario((prev) => ({ ...prev, utilityHike: parseInt(e.target.value, 10) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1.5">
                <span>0%</span>
                <span>15% (Summer AC / Winter Heat)</span>
                <span>40% (Peak Tariff Surcharge)</span>
              </div>
            </div>

            {/* Transport & Fuel */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#0a2540] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  Transport, Fuel & Cab Surge
                </span>
                <span className="text-sm font-bold text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded-md">
                  +{scenario.transportHike}% (+{formatINR(impact.transportIncrease)}/mo)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={scenario.transportHike}
                onChange={(e) => setScenario((prev) => ({ ...prev, transportHike: parseInt(e.target.value, 10) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Horizon Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748b] mb-2">
                Simulation Projection Horizon
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[1, 3, 5].map((years) => (
                  <button
                    key={years}
                    onClick={() => setScenario((prev) => ({ ...prev, timeHorizonYears: years }))}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      scenario.timeHorizonYears === years
                        ? 'bg-[#0a2540] text-white border-[#0a2540] shadow-xs'
                        : 'bg-white text-[#425466] border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {years} {years === 1 ? 'Year' : 'Years'} Horizon
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results & Impact Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Impact Metric Cards */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 stripe-card-glow">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] block mb-1">
                Total Monthly Purchasing Power Loss
              </span>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-rose-600 tracking-tight">
                  +{formatINR(impact.monthlyIncrease)}
                </span>
                <span className="text-sm font-bold text-slate-500">/ month extra</span>
              </div>

              <p className="text-xs text-[#64748b] leading-relaxed mb-6">
                Your monthly expenditure increases from <strong className="text-[#0a2540]">{formatINR(budget.housing + budget.groceries + budget.utilities + budget.transport + budget.insurance + budget.discretionary)}</strong> to <strong className="text-[#0a2540]">{formatINR(impact.newTotalExpenses)}</strong>.
              </p>

              {/* Cumulative Horizon Loss */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 mb-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#425466]">
                    Cumulative {scenario.timeHorizonYears}-Year Drag:
                  </span>
                  <span className="text-base font-extrabold text-[#0a2540]">
                    {formatINR(impact.cumulativeLossHorizon)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#64748b]">
                  <span>Purchasing Power Erosion:</span>
                  <span className="font-bold text-rose-600">
                    -{impact.purchasingPowerLossPercent}%
                  </span>
                </div>
              </div>

              {/* Emergency Runway Decay Indicator */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-amber-900">Emergency Fund Runway Impact</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  At this burn rate, your {formatINR(budget.currentSavings)} savings reserve shrinks from{' '}
                  <strong>{(budget.currentSavings / (impact.newTotalExpenses - impact.monthlyIncrease || 1)).toFixed(1)} months</strong> down to{' '}
                  <strong className="text-rose-700 underline">{impact.newRunwayMonths} months</strong>.
                </p>
              </div>

              {/* Action: Bridge Deficit with Jobs Search */}
              <button
                onClick={() => onFindJobsForDeficit(impact.monthlyIncrease)}
                className="w-full group flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#635bff] to-[#ec4899] hover:from-[#544dc9] hover:to-[#db2777] shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Find Gigs to Bridge This +{formatINR(impact.monthlyIncrease)}/mo Deficit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>

            {/* Quick Tips Box */}
            <div className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-200 text-xs text-[#425466] space-y-2.5">
              <h4 className="font-bold text-[#0a2540] flex items-center gap-1.5 text-xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Inflation Defense Playbook
              </h4>
              <p>
                <strong>1. Lease Lock-in:</strong> If facing an 8-10% hike, offer a 15 or 18-month agreement in exchange for a 3% cap. Most landlords accept rather than risk a 1-month brokerage & vacancy loss.
              </p>
              <p>
                <strong>2. Grocery Arbitrage:</strong> Shifting 4 high-inflation staples (cooking oils, dairy, lentils/dal, dry fruits) to bulk wholesale markets cuts food CPI drag by ~30%.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
