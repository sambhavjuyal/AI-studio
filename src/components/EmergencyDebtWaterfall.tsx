import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  ArrowDownCircle, 
  CheckCircle2, 
  Percent, 
  DollarSign, 
  Sparkles, 
  Layers, 
  Zap,
  HelpCircle
} from 'lucide-react';
import { DebtItem } from '../types';
import { formatINR } from '../utils/currency';

interface EmergencyDebtWaterfallProps {
  savings: number;
  essentialMonthly: number;
  gentleMode: boolean;
}

export const EmergencyDebtWaterfall: React.FC<EmergencyDebtWaterfallProps> = ({
  savings,
  essentialMonthly,
  gentleMode,
}) => {
  const [strategy, setStrategy] = useState<'hybrid' | 'avalanche' | 'snowball'>('hybrid');
  const [extraMonthlyPaydown, setExtraMonthlyPaydown] = useState<number>(8000);

  const [debts, setDebts] = useState<DebtItem[]>([
    {
      id: 'debt-1',
      name: 'Credit Card Revolving Dues',
      balance: 85000,
      interestRate: 42.0, // standard Indian credit card APR ~3.5%/month = 42%
      minimumPayment: 4200,
    },
    {
      id: 'debt-2',
      name: 'Consumer Electronics EMI / BNPL',
      balance: 24000,
      interestRate: 22.0,
      minimumPayment: 2200,
    },
    {
      id: 'debt-3',
      name: 'Unsecured Personal Loan',
      balance: 180000,
      interestRate: 13.5,
      minimumPayment: 5400,
    },
  ]);

  // Essential survival runway in days
  const dailyEssentialBurn = essentialMonthly / 30;
  const survivalRunwayDays = dailyEssentialBurn > 0 ? Math.floor(savings / dailyEssentialBurn) : 0;
  const survivalRunwayMonths = Number((survivalRunwayDays / 30).toFixed(1));

  // Starter Safety Cushion Target in Rupees
  const starterBufferTarget = 50000;
  const hasStarterBuffer = savings >= starterBufferTarget;

  // Sorting based on strategy
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'avalanche') {
      return b.interestRate - a.interestRate; // highest APR first
    } else {
      return a.balance - b.balance; // lowest balance first (snowball)
    }
  });

  const totalDebtBalance = debts.reduce((acc, d) => acc + d.balance, 0);
  const totalMinPayment = debts.reduce((acc, d) => acc + d.minimumPayment, 0);

  // Interest saved estimate
  const estimatedInterestSaved = Math.round(totalDebtBalance * 0.22);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 stripe-card-glow space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-2.5 py-0.5 rounded mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Emergency & Buffer Management
          </div>
          <h3 className="text-xl font-extrabold text-[#0a2540] tracking-tight">
            Emergency Survival Runway & Debt Waterfall Engine (INR)
          </h3>
          <p className="text-xs text-[#425466]">
            Calculates exact survival days based strictly on non-negotiable living needs in Rupees (₹), balancing starter safety buffers against high-APR card dues.
          </p>
        </div>

        {/* Survival Runway Pill */}
        <div className={`p-3 rounded-xl border text-right ${
          gentleMode
            ? 'bg-indigo-50/70 border-indigo-100 text-indigo-950'
            : survivalRunwayDays < 60
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            Survival Runway (Core Needs Only)
          </span>
          <span className="text-xl font-black">
            {survivalRunwayDays} Days
          </span>
          <span className="text-[10px] block opacity-85 mt-0.5">
            {formatINR(savings)} &divide; {formatINR(Math.round(dailyEssentialBurn))}/day bare minimum
          </span>
        </div>
      </div>

      {/* Starter Cushion Guardrail */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
        hasStarterBuffer
          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
          : 'bg-amber-50/70 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            hasStarterBuffer ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm block">
              {hasStarterBuffer
                ? `Starter Safety Cushion Secured (${formatINR(starterBufferTarget)} Target)`
                : `Priority #1: Establish ${formatINR(starterBufferTarget)} Starter Cushion`}
            </span>
            <p className="opacity-90 text-[11px] mt-0.5">
              {hasStarterBuffer
                ? 'Your emergency foundation is intact. All surplus monthly cashflow can safely attack high-APR credit card dues.'
                : 'Pause aggressive prepayments until you maintain at least ₹50,000 in liquid savings to avoid falling back into credit card revolving interest.'}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 shrink-0">
          Reserves: {formatINR(savings)}
        </span>
      </div>

      {/* Strategy Switcher */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Debt Waterfall Strategy
          </h4>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStrategy('hybrid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                strategy === 'hybrid' ? 'bg-white text-[#635bff] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Hybrid Safety-First
            </button>
            <button
              onClick={() => setStrategy('avalanche')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                strategy === 'avalanche' ? 'bg-white text-[#635bff] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Avalanche (Max Interest Saved)
            </button>
            <button
              onClick={() => setStrategy('snowball')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                strategy === 'snowball' ? 'bg-white text-[#635bff] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Snowball (Quick Wins)
            </button>
          </div>
        </div>

        {/* Priority Payoff Order */}
        <div className="space-y-2.5">
          {sortedDebts.map((debt, index) => (
            <div
              key={debt.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0a2540] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  #{index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0a2540]">{debt.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                      debt.interestRate > 25 ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {debt.interestRate}% APR
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748b]">
                    Min payment: {formatINR(debt.minimumPayment)}/mo
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Balance</span>
                  <span className="text-sm font-extrabold text-[#0a2540]">
                    {formatINR(debt.balance)}
                  </span>
                </div>
                {index === 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                    Target: Min + {formatINR(extraMonthlyPaydown)}/mo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#0a2540]">
        <div>
          <span>Total Balance to Eliminate: <strong className="font-extrabold">{formatINR(totalDebtBalance)}</strong></span>
          <span className="text-slate-400 mx-2">•</span>
          <span>Monthly Minimums: <strong className="font-extrabold">{formatINR(totalMinPayment)}/mo</strong></span>
        </div>
        <span className="font-bold text-[#635bff] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Estimated Interest Saved with Waterfall: ~{formatINR(estimatedInterestSaved)}
        </span>
      </div>

    </div>
  );
};
