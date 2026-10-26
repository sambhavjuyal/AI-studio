import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CreditCard, 
  Repeat, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Flame,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { FixedObligation } from '../types';
import { formatINR } from '../utils/currency';

interface FixedCostTrackerProps {
  income: number;
  rent: number;
  gentleMode: boolean;
  onAskCopilot: (prompt: string) => void;
}

export const FixedCostTracker: React.FC<FixedCostTrackerProps> = ({
  income,
  rent,
  gentleMode,
  onAskCopilot,
}) => {
  const [obligations, setObligations] = useState<FixedObligation[]>([
    {
      id: 'fix-1',
      title: 'Apartment Rent / Home Loan EMI',
      category: 'Housing',
      amount: rent || 28000,
      dueDay: 1,
      annualRateHike: 8.5,
      shopAroundAlert: false,
      benchmarkSuggestion: 'Renegotiate with 15-month extension to cap annual 10% rent hike',
    },
    {
      id: 'fix-2',
      title: 'Family Health Insurance (Floater ₹10L)',
      category: 'Insurance',
      amount: 2800,
      dueDay: 15,
      annualRateHike: 14.5,
      shopAroundAlert: true,
      benchmarkSuggestion: 'Medical inflation +14% YoY; compare Star Health / HDFC Ergo / Care to save ~₹500/mo',
    },
    {
      id: 'fix-3',
      title: 'Education / Car Loan Fixed EMI',
      category: 'Debt',
      amount: 8500,
      dueDay: 10,
      annualRateHike: 0,
      shopAroundAlert: false,
      benchmarkSuggestion: 'Check MCLR/repo rate linkage for lower interest rate reset',
    },
    {
      id: 'fix-4',
      title: 'Term Life Insurance (₹1.5 Cr Cover)',
      category: 'Insurance',
      amount: 1400,
      dueDay: 5,
      annualRateHike: 0,
      shopAroundAlert: false,
      benchmarkSuggestion: 'Locked-in level premium term policy',
    },
    {
      id: 'fix-5',
      title: 'Fiber Broadband & Postpaid Mobile Plan',
      category: 'Subscriptions',
      amount: 1850,
      dueDay: 18,
      annualRateHike: 10.0,
      shopAroundAlert: true,
      benchmarkSuggestion: 'Annual payment bundle provides 2 months complimentary access',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<FixedObligation['category']>('Insurance');

  // Total fixed obligations
  const totalFixed = obligations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const fixedRatio = income > 0 ? Math.round((totalFixed / income) * 100) : 100;
  const rentRatio = income > 0 ? Math.round((rent / income) * 100) : 100;

  const isHighFixedPressure = fixedRatio > 50;
  const isModerateFixedPressure = fixedRatio > 40;

  const handleAddObligation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;
    const item: FixedObligation = {
      id: `fix-${Date.now()}`,
      title: newTitle.trim(),
      amount: parseFloat(newAmount) || 0,
      category: newCategory,
      dueDay: 1,
      annualRateHike: 5,
      shopAroundAlert: newCategory === 'Insurance' || newCategory === 'Subscriptions',
      benchmarkSuggestion: 'Review current rate against market average',
    };
    setObligations((prev) => [...prev, item]);
    setNewTitle('');
    setNewAmount('');
  };

  const removeObligation = (id: string) => {
    setObligations((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 stripe-card-glow space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-2.5 py-0.5 rounded mb-1">
            <Building2 className="w-3.5 h-3.5" />
            Fixed Cost Pressure
          </div>
          <h3 className="text-xl font-extrabold text-[#0a2540] tracking-tight">
            Fixed Cost Ratio & Insurance Lock-In Sentinel (INR)
          </h3>
          <p className="text-xs text-[#425466]">
            Monitors non-negotiable structural costs (rent, insurance, loan EMIs) in Rupees (₹) to prevent fixed obligations from exceeding 50% of your take-home pay.
          </p>
        </div>

        {/* Ratio Gauge Pill */}
        <div className={`text-right p-3 rounded-xl border ${
          gentleMode
            ? 'bg-indigo-50/60 border-indigo-100 text-indigo-950'
            : isHighFixedPressure
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : isModerateFixedPressure
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            Fixed Cost Ratio
          </span>
          <span className="text-xl font-extrabold">
            {fixedRatio}% of Net Income
          </span>
          <span className="text-[10px] block opacity-85 mt-0.5">
            {formatINR(totalFixed)} / {formatINR(income)}
          </span>
        </div>
      </div>

      {/* Fixed Pressure Meter Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-[#0a2540]">
          <span>Rent Burden: {rentRatio}%</span>
          <span>Target Maximum: 50% Fixed Ceiling</span>
          <span>Actual Fixed: {fixedRatio}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              gentleMode
                ? 'bg-[#635bff]'
                : fixedRatio > 55
                ? 'bg-rose-500'
                : fixedRatio > 45
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, fixedRatio)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
          <span>0% (Hyper Flexible)</span>
          <span>30% (Standard Rent Guideline)</span>
          <span>50% (Hard Upper Bound)</span>
          <span>70%+ (Extreme Fixed Squeeze)</span>
        </div>
      </div>

      {/* Obligations List with Rate Hike Alerts */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Tracked Fixed Obligations & Shop-Around Flags
        </h4>
        <div className="space-y-2.5">
          {obligations.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0a2540]">{item.title}</span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {item.category}
                  </span>
                  {item.shopAroundAlert && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Shop-Around Alert (+{item.annualRateHike}% YoY)
                    </span>
                  )}
                </div>
                {item.benchmarkSuggestion && (
                  <p className="text-[11px] text-[#425466]">
                    💡 {item.benchmarkSuggestion}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-base font-extrabold text-[#0a2540]">
                  {formatINR(item.amount)}/mo
                </span>
                {item.shopAroundAlert && (
                  <button
                    onClick={() => onAskCopilot(`How do I shop around and lower my ${item.title} cost in India? It is currently ${formatINR(item.amount)}/month.`)}
                    className="text-[11px] font-bold text-[#635bff] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Script</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                {item.category !== 'Housing' && (
                  <button
                    onClick={() => removeObligation(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Fixed Cost Form */}
      <form onSubmit={handleAddObligation} className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New fixed item (e.g. Car EMI, Term Insurance)..."
          className="flex-1 min-w-[200px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#635bff]"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as any)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-[#0a2540]"
        >
          <option value="Insurance">Insurance</option>
          <option value="Debt">Debt</option>
          <option value="Subscriptions">Subscription</option>
          <option value="Housing">Housing</option>
        </select>
        <div className="relative w-28">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="Amount"
            className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#635bff]"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#635bff] hover:bg-[#544dc9] text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

    </div>
  );
};
