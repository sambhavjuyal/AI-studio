import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingCart, 
  Zap, 
  Shield, 
  Car, 
  Coffee, 
  DollarSign, 
  Users, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { BudgetState, CityBenchmark } from '../types';
import { CITIES_DATA } from '../data/cities';
import { StressCalculationResult } from '../utils/calculator';
import { formatINR } from '../utils/currency';

interface StressCalculatorProps {
  budget: BudgetState;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState>>;
  selectedCity: CityBenchmark;
  setSelectedCity: (city: CityBenchmark) => void;
  stressResult: StressCalculationResult;
  onOpenAudit: () => void;
  onOpenAdvisor: () => void;
}

export const StressCalculator: React.FC<StressCalculatorProps> = ({
  budget,
  setBudget,
  selectedCity,
  setSelectedCity,
  stressResult,
  onOpenAudit,
  onOpenAdvisor,
}) => {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const presets = [
    {
      name: 'Software Engineer in Bengaluru',
      cityId: 'blr',
      income: 95000,
      housing: 28000,
      groceries: 14000,
      utilities: 4200,
      transport: 5500,
      insurance: 4500,
      discretionary: 12000,
      currentSavings: 350000,
      householdSize: 1,
    },
    {
      name: 'Couple in Mumbai',
      cityId: 'bom',
      income: 145000,
      housing: 48000,
      groceries: 19000,
      utilities: 5400,
      transport: 6500,
      insurance: 7000,
      discretionary: 18000,
      currentSavings: 550000,
      householdSize: 2,
    },
    {
      name: 'Family of 3 in Delhi NCR (Gurugram)',
      cityId: 'del',
      income: 120000,
      housing: 35000,
      groceries: 17500,
      utilities: 5800,
      transport: 7000,
      insurance: 6500,
      discretionary: 14000,
      currentSavings: 420000,
      householdSize: 3,
    },
    {
      name: 'Remote Specialist in Hyderabad / Pune',
      cityId: 'hyd',
      income: 85000,
      housing: 22000,
      groceries: 12500,
      utilities: 3600,
      transport: 4200,
      insurance: 4000,
      discretionary: 11000,
      currentSavings: 280000,
      householdSize: 1,
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setActivePreset(preset.name);
    const city = CITIES_DATA.find((c) => c.id === preset.cityId) || CITIES_DATA[0];
    setSelectedCity(city);
    setBudget({
      city: city.name,
      income: preset.income,
      housing: preset.housing,
      groceries: preset.groceries,
      utilities: preset.utilities,
      transport: preset.transport,
      insurance: preset.insurance,
      discretionary: preset.discretionary,
      currentSavings: preset.currentSavings,
      householdSize: preset.householdSize,
    });
  };

  const handleInputChange = (field: keyof BudgetState, value: number) => {
    setBudget((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

  // 50/30/20 ideal comparison
  const idealNeeds = budget.income * 0.5;
  const idealWants = budget.income * 0.3;
  const idealSavings = budget.income * 0.2;

  const actualNeeds =
    budget.housing + budget.groceries + budget.utilities + budget.transport + budget.insurance;
  const actualWants = budget.discretionary;
  const actualSavings = budget.income - actualNeeds - actualWants;

  return (
    <div className="py-12 bg-[#f8fafc] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              <MapPin className="w-3.5 h-3.5" />
              Real-Time Cost-of-Living Telemetry
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a2540] tracking-tight">
              Cost-of-Living Stress Index Calculator
            </h2>
            <p className="text-[#425466] text-base mt-1 max-w-2xl">
              Calibrated against housing medians, local grocery indices, and regional utility inflation across major Indian metropolitan markets.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Sample Profiles:</span>
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                  activePreset === p.name
                    ? 'bg-[#635bff] text-white border-[#635bff] shadow-xs'
                    : 'bg-white text-[#425466] border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {p.name.split(' in ')[0]} ({p.name.split(' in ')[1]})
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Inputs on Left, Gauge & Telemetry on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Input Panel */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-[#0a2540] flex items-center gap-2">
                <span className="font-extrabold text-[#635bff] text-lg">₹</span>
                Monthly Cash Flow & Expenses (INR)
              </h3>
              
              {/* City Selector */}
              <div className="relative">
                <select
                  value={selectedCity.id}
                  onChange={(e) => {
                    const found = CITIES_DATA.find((c) => c.id === e.target.value);
                    if (found) {
                      setSelectedCity(found);
                      setBudget((prev) => ({ ...prev, city: found.name }));
                    }
                  }}
                  className="text-xs font-semibold text-[#0a2540] bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 cursor-pointer"
                >
                  {CITIES_DATA.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Index {c.costIndex})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Income */}
              <div className="sm:col-span-2 bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/80">
                <label className="flex items-center justify-between text-xs font-bold text-[#0a2540] uppercase tracking-wider mb-1.5">
                  <span>Monthly Take-Home (Net Salary)</span>
                  <span className="text-indigo-600 font-semibold lowercase">after PF & TDS</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={budget.income || ''}
                    onChange={(e) => handleInputChange('income', parseFloat(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 text-base font-bold text-[#0a2540] bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]"
                  />
                </div>
              </div>

              {/* Rent / Housing */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-[#425466] mb-1">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#635bff]" />
                    Rent / Home Loan EMI
                  </span>
                  <span className="text-[11px] text-slate-400">Avg {formatINR(selectedCity.avgRent1Bed)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={budget.housing || ''}
                    onChange={(e) => handleInputChange('housing', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold text-[#0a2540] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]/30"
                  />
                </div>
              </div>

              {/* Groceries & Essentials */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-[#425466] mb-1">
                  <span className="flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-pink-500" />
                    Groceries, Milk & Veggies
                  </span>
                  <span className="text-[11px] text-slate-400">x{selectedCity.avgGroceryMultiplier} local index</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={budget.groceries || ''}
                    onChange={(e) => handleInputChange('groceries', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold text-[#0a2540] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]/30"
                  />
                </div>
              </div>

              {/* Utilities & Electricity */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-[#425466] mb-1">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Electricity, Gas & WiFi
                  </span>
                  <span className="text-[11px] text-slate-400">Baseline {formatINR(selectedCity.avgUtilityBaseline)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="200"
                    value={budget.utilities || ''}
                    onChange={(e) => handleInputChange('utilities', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold text-[#0a2540] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]/30"
                  />
                </div>
              </div>

              {/* Transport / Fuel / Metro */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-[#425466] mb-1">
                  <span className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-cyan-500" />
                    Fuel, Metro & Cabs
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="200"
                    value={budget.transport || ''}
                    onChange={(e) => handleInputChange('transport', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold text-[#0a2540] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]/30"
                  />
                </div>
              </div>

              {/* Insurance & Healthcare */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-[#425466] mb-1">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                    Health & Term Insurance
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="200"
                    value={budget.insurance || ''}
                    onChange={(e) => handleInputChange('insurance', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold text-[#0a2540] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]/30"
                  />
                </div>
              </div>

              {/* Discretionary / Dining */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-[#425466] mb-1">
                  <span className="flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-purple-500" />
                    Dining Out & Weekend Fun
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={budget.discretionary || ''}
                    onChange={(e) => handleInputChange('discretionary', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold text-[#0a2540] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]/30"
                  />
                </div>
              </div>

              {/* Current Liquid Savings */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-semibold text-[#425466] mb-1">
                    Emergency Fund (Savings / FD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={budget.currentSavings || ''}
                      onChange={(e) => handleInputChange('currentSavings', parseFloat(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-sm font-semibold text-[#0a2540] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]/30"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-1/2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-[#425466]">
                  <span className="font-bold text-[#0a2540] block">
                    Current Runway: {stressResult.runwayMonths} months
                  </span>
                  <span>Recommended for {selectedCity.name}: 6 months ({formatINR(stressResult.recommendedEmergencyFund)})</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Stress Index Scorecard & 50/30/20 Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Score Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 stripe-card-glow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                  Calculated Risk Score
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  stressResult.stressScore > 75
                    ? 'bg-rose-100 text-rose-700'
                    : stressResult.stressScore > 50
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {stressResult.stressRating}
                </span>
              </div>

              {/* Circular / Large Score Display */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-5xl sm:text-6xl font-black text-[#0a2540] tracking-tight">
                  {stressResult.stressScore}
                </span>
                <span className="text-lg font-bold text-slate-400">/ 100</span>
                <div className="ml-auto text-right">
                  <p className="text-xs font-semibold text-slate-400">Surplus / Deficit</p>
                  <p className={`text-lg font-bold ${
                    stressResult.netMonthlySurplus < 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {stressResult.netMonthlySurplus >= 0 ? '+' : ''}{formatINR(stressResult.netMonthlySurplus)}/mo
                  </p>
                </div>
              </div>

              {/* Stress Gauge Bar with Segments */}
              <div className="space-y-1.5 mb-6">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${stressResult.stressScore}%`,
                      background:
                        stressResult.stressScore > 75
                          ? 'linear-gradient(90deg, #f59e0b, #f43f5e)'
                          : stressResult.stressScore > 50
                          ? 'linear-gradient(90deg, #635bff, #f59e0b)'
                          : 'linear-gradient(90deg, #10b981, #635bff)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
                  <span>Safe (0-40)</span>
                  <span>Moderate (41-65)</span>
                  <span>Stressed (66-80)</span>
                  <span>Crisis (81+)</span>
                </div>
              </div>

              {/* Housing Metric Callout */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    stressResult.housingRatio > 40 ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {stressResult.housingRatio}%
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0a2540] block">Housing-to-Income Ratio</span>
                    <span className="text-[11px] text-[#425466]">
                      {stressResult.housingRatio > 35 ? 'Above recommended 30% guideline' : 'Healthy allocation'}
                    </span>
                  </div>
                </div>

                {stressResult.cityRentVariance > 0 ? (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded">
                    +{formatINR(stressResult.cityRentVariance)} vs median
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    -{formatINR(Math.abs(stressResult.cityRentVariance))} vs median
                  </span>
                )}
              </div>

              {/* Action Button: Trigger Full AI Audit */}
              <button
                onClick={onOpenAudit}
                className="w-full group flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-[#635bff] hover:bg-[#544dc9] shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Deep AI Stress Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 50/30/20 Budget Rule Visualizer */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90">
              <h4 className="text-sm font-bold text-[#0a2540] mb-3 flex items-center justify-between">
                <span>50 / 30 / 20 Rule Comparison</span>
                <span className="text-xs text-[#64748b] font-normal">Actual vs Target</span>
              </h4>

              <div className="space-y-3 text-xs">
                {/* Needs */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">Needs (Target 50% = {formatINR(idealNeeds)})</span>
                    <span className={actualNeeds > idealNeeds ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                      {stressResult.needsRatio}% ({formatINR(actualNeeds)})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#635bff]"
                      style={{ width: `${Math.min(100, stressResult.needsRatio)}%` }}
                    />
                  </div>
                </div>

                {/* Wants */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">Wants (Target 30% = {formatINR(idealWants)})</span>
                    <span className="text-slate-800">
                      {stressResult.wantsRatio}% ({formatINR(actualWants)})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-pink-500"
                      style={{ width: `${Math.min(100, stressResult.wantsRatio)}%` }}
                    />
                  </div>
                </div>

                {/* Savings / Surplus */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">Savings (Target 20% = {formatINR(idealSavings)})</span>
                    <span className={actualSavings < 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {stressResult.savingsRatio}% ({formatINR(actualSavings)})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${actualSavings < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.max(0, Math.min(100, stressResult.savingsRatio))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#425466]">
                <span>Want personalized reduction tactics?</span>
                <button
                  onClick={onOpenAdvisor}
                  className="font-bold text-[#635bff] hover:underline cursor-pointer"
                >
                  Consult AI Copilot &rarr;
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
