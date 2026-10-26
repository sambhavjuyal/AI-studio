import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wrench, 
  Briefcase, 
  Home, 
  Percent, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { BudgetState } from '../types';
import { formatINR } from '../utils/currency';

interface AdvancedScenarioSimulatorProps {
  budget: BudgetState;
  gentleMode: boolean;
}

export const AdvancedScenarioSimulator: React.FC<AdvancedScenarioSimulatorProps> = ({
  budget,
  gentleMode,
}) => {
  // Multi-factor parameters in Rupees
  const [unexpectedRepair, setUnexpectedRepair] = useState<number>(18000);
  const [sideHustleBoost, setSideHustleBoost] = useState<number>(25000);
  const [cheaperRentSavings, setCheaperRentSavings] = useState<number>(6000);
  const [macroInflationRate, setMacroInflationRate] = useState<number>(6);
  const [timelineMonths, setTimelineMonths] = useState<3 | 6 | 12>(6);

  // Mid-Month Overburn Early Warning parameters
  const [dayOfMonth, setDayOfMonth] = useState<number>(14);
  const [budgetConsumedPercent, setBudgetConsumedPercent] = useState<number>(58); // 58% consumed on Day 14

  // Baseline monthly expenses
  const baselineMonthly =
    budget.housing +
    budget.groceries +
    budget.utilities +
    budget.transport +
    budget.insurance +
    budget.discretionary;

  // New monthly burn after side hustle, cheaper rent, and inflation
  const inflationDelta = baselineMonthly * (macroInflationRate / 100);
  const netMonthlyExpenses = baselineMonthly + inflationDelta - cheaperRentSavings;
  const netMonthlyIncome = budget.income + sideHustleBoost;
  const monthlySurplusOrDeficit = netMonthlyIncome - netMonthlyExpenses;

  // Total projected savings/deficit over chosen timeline including unexpected one-time repair
  const cumulativeChange = monthlySurplusOrDeficit * timelineMonths - unexpectedRepair;
  const projectedFinalSavings = Math.max(0, budget.currentSavings + cumulativeChange);

  // Mid-Month Overburn Calculations
  const expectedBurnOnCurrentDay = (dayOfMonth / 30) * 100;
  const burnDiscrepancy = budgetConsumedPercent - expectedBurnOnCurrentDay;
  const isOverburning = burnDiscrepancy > 6;
  
  // Calculate projected day when 100% budget is exhausted
  const burnPacePerDay = budgetConsumedPercent / (dayOfMonth || 1);
  const projectedExhaustionDay = Math.min(30, Math.floor(100 / (burnPacePerDay || 1)));

  // Daily target to recover
  const remainingBudgetPercent = Math.max(0, 100 - budgetConsumedPercent);
  const remainingDays = 30 - dayOfMonth;
  const targetBurnRateCap = remainingDays > 0 ? ((budget.income * (remainingBudgetPercent / 100)) / remainingDays).toFixed(0) : '0';

  const resetAll = () => {
    setUnexpectedRepair(0);
    setSideHustleBoost(0);
    setCheaperRentSavings(0);
    setMacroInflationRate(5);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 stripe-card-glow space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-2.5 py-0.5 rounded mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Forecasting & Planning
          </div>
          <h3 className="text-xl font-extrabold text-[#0a2540] tracking-tight">
            Advanced Multi-Factor "What-If" Engine (Rupees)
          </h3>
          <p className="text-xs text-[#425466]">
            Simulate combinations of sudden repairs, side-gigs, moving to cheaper rent, and macroeconomic inflation over 3, 6, and 12-month horizons in Indian Rupees (₹).
          </p>
        </div>

        <button
          onClick={resetAll}
          className="self-start sm:self-center flex items-center gap-1 text-xs text-slate-500 hover:text-[#0a2540] px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Shock 1: Unexpected Repair / Emergency */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0a2540]">
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-rose-500" />
              One-Time Emergency Shock
            </span>
            <span className="text-rose-600 font-extrabold">{formatINR(unexpectedRepair)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            step="5000"
            value={unexpectedRepair}
            onChange={(e) => setUnexpectedRepair(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹0</span>
            <span>Vehicle / Medical (₹40k)</span>
            <span>₹1L</span>
          </div>
        </div>

        {/* Shock 2: Side Hustle Boost */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0a2540]">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              Side Hustle / Consulting
            </span>
            <span className="text-emerald-700 font-extrabold">+{formatINR(sideHustleBoost)}/mo</span>
          </div>
          <input
            type="range"
            min="0"
            max="80000"
            step="2500"
            value={sideHustleBoost}
            onChange={(e) => setSideHustleBoost(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹0</span>
            <span>+₹25k/mo</span>
            <span>+₹80k/mo</span>
          </div>
        </div>

        {/* Shock 3: Moving / Cheaper Rent */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0a2540]">
            <span className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#635bff]" />
              Downsizing / Rent Savings
            </span>
            <span className="text-[#635bff] font-extrabold">-{formatINR(cheaperRentSavings)}/mo</span>
          </div>
          <input
            type="range"
            min="0"
            max="25000"
            step="1000"
            value={cheaperRentSavings}
            onChange={(e) => setCheaperRentSavings(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#635bff]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Same Rent</span>
            <span>-₹10k/mo</span>
            <span>-₹25k/mo</span>
          </div>
        </div>

        {/* Shock 4: Macro Inflation Rate */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0a2540]">
            <span className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-amber-500" />
              India CPI Inflation Rate
            </span>
            <span className="text-amber-700 font-extrabold">+{macroInflationRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={macroInflationRate}
            onChange={(e) => setMacroInflationRate(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0%</span>
            <span>6% Baseline</span>
            <span>20% High Shock</span>
          </div>
        </div>

      </div>

      {/* Projection Timeline Bar */}
      <div className="p-5 rounded-2xl bg-[#0a2540] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Projected Net Reserve ({timelineMonths} Months)
            </span>
            <div className="flex gap-1">
              {[3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setTimelineMonths(m as any)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    timelineMonths === m ? 'bg-[#635bff] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black tracking-tight">
              {formatINR(projectedFinalSavings)}
            </span>
            <span className={`text-xs font-bold ${
              cumulativeChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              ({cumulativeChange >= 0 ? '+' : ''}{formatINR(cumulativeChange)} net change)
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-300 space-y-1 border-t md:border-t-0 md:border-l border-slate-700/80 pt-3 md:pt-0 md:pl-6 w-full md:w-auto">
          <div>
            Adjusted Net Cashflow:{' '}
            <strong className={monthlySurplusOrDeficit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {monthlySurplusOrDeficit >= 0 ? '+' : ''}{formatINR(Math.round(monthlySurplusOrDeficit))}/mo
            </strong>
          </div>
          <div>
            One-Time Shock Absorbed: <strong className="text-white">{formatINR(unexpectedRepair)}</strong>
          </div>
        </div>

      </div>

      {/* Mid-Month Overburn Early Warning Feature */}
      <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/90 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-950">
              Mid-Month Overburn Early Warning System
            </h4>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isOverburning ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {isOverburning ? `Overburn Alert: Pace exhausts on Day ${projectedExhaustionDay}` : 'Burn Pace On Target'}
          </span>
        </div>

        {/* Sliders for Day of Month and Spend Consumed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="space-y-1">
            <div className="flex justify-between font-semibold text-[#0a2540]">
              <span>Current Day of Month: Day {dayOfMonth}</span>
              <span className="text-slate-500">{Math.round(expectedBurnOnCurrentDay)}% of month elapsed</span>
            </div>
            <input
              type="range"
              min="1"
              max="29"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold text-[#0a2540]">
              <span>Monthly Budget Consumed: {budgetConsumedPercent}%</span>
              <span className={isOverburning ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                {isOverburning ? `+${Math.round(burnDiscrepancy)}% over normal pace` : 'Normal pace'}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              value={budgetConsumedPercent}
              onChange={(e) => setBudgetConsumedPercent(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

        </div>

        {/* Mid-Month Recalibration Advice */}
        <div className="p-3 bg-white rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
          <span>
            💡 <strong>Corrective Recalibration:</strong> Cap non-essential spending to{' '}
            <strong className="text-[#0a2540] underline">{formatINR(parseFloat(targetBurnRateCap))}/day</strong> for the remaining {remainingDays} days to end the month safely in the green.
          </span>
        </div>

      </div>

    </div>
  );
};
