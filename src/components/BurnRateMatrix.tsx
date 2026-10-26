import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  PiggyBank, 
  Coins, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Calendar, 
  TrendingDown, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AccountBalances, BurnRateCalculation } from '../types';
import { formatINR } from '../utils/currency';

interface BurnRateMatrixProps {
  accounts: AccountBalances;
  setAccounts: React.Dispatch<React.SetStateAction<AccountBalances>>;
  monthlyExpenses: number;
  gentleMode: boolean;
}

export const BurnRateMatrix: React.FC<BurnRateMatrixProps> = ({
  accounts,
  setAccounts,
  monthlyExpenses,
  gentleMode,
}) => {
  const [dailyBurnAdjustment, setDailyBurnAdjustment] = useState(0);

  // Total liquid cash
  const liquidCash = accounts.checking + accounts.savings + accounts.cash;
  const netLiquid = liquidCash - accounts.creditCardDebt;

  // Monthly and daily burn rate
  const monthlyBurn = Math.max(1000, monthlyExpenses + dailyBurnAdjustment * 30);
  const dailyBurn = Number((monthlyBurn / 30).toFixed(0));

  // Runway calculation in days and months
  const runwayDays = netLiquid > 0 ? Math.floor(netLiquid / dailyBurn) : 0;
  const runwayMonths = Number((runwayDays / 30).toFixed(1));

  // Depletion Date
  const today = new Date();
  const depletionDate = new Date(today);
  depletionDate.setDate(today.getDate() + runwayDays);

  const formattedDepletion = depletionDate.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleAccountChange = (field: keyof AccountBalances, val: number) => {
    setAccounts((prev) => ({
      ...prev,
      [field]: isNaN(val) ? 0 : val,
    }));
  };

  const isLowRunway = runwayDays < 60;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 stripe-card-glow space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-2.5 py-0.5 rounded mb-1">
            <Clock className="w-3.5 h-3.5" />
            Tracking & Visibility
          </div>
          <h3 className="text-xl font-extrabold text-[#0a2540] tracking-tight">
            Multi-Account Burn Rate Matrix (INR)
          </h3>
          <p className="text-xs text-[#425466]">
            Tracks salary accounts, savings (FD/HYSA), cash, and card debt in Rupees (₹) to calculate exact days before funds exhaust.
          </p>
        </div>

        {/* Depletion Pill */}
        <div className={`text-right p-3 rounded-xl border ${
          gentleMode
            ? 'bg-indigo-50/70 border-indigo-100 text-indigo-900'
            : isLowRunway
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            {gentleMode ? 'Active Protection Timeline' : 'Zero-Balance Horizon'}
          </span>
          <span className="text-base font-extrabold">
            {runwayDays} Days ({runwayMonths} mo)
          </span>
          <span className="text-[10px] block opacity-80 mt-0.5">
            Depletion Target: {formattedDepletion}
          </span>
        </div>
      </div>

      {/* Account Balances Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Checking */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <Wallet className="w-3.5 h-3.5 text-[#635bff]" />
            Salary / Checking A/C
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
            <input
              type="number"
              step="1000"
              value={accounts.checking || ''}
              onChange={(e) => handleAccountChange('checking', parseFloat(e.target.value))}
              className="w-full pl-6 pr-2 py-1 text-sm font-bold text-[#0a2540] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#635bff]"
            />
          </div>
        </div>

        {/* Savings (HYSA / FD) */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />
            Savings (FD / Liquid MF)
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
            <input
              type="number"
              step="5000"
              value={accounts.savings || ''}
              onChange={(e) => handleAccountChange('savings', parseFloat(e.target.value))}
              className="w-full pl-6 pr-2 py-1 text-sm font-bold text-[#0a2540] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#635bff]"
            />
          </div>
        </div>

        {/* Physical Cash */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            Cash in Hand
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
            <input
              type="number"
              step="500"
              value={accounts.cash || ''}
              onChange={(e) => handleAccountChange('cash', parseFloat(e.target.value))}
              className="w-full pl-6 pr-2 py-1 text-sm font-bold text-[#0a2540] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#635bff]"
            />
          </div>
        </div>

        {/* Credit Card Floating Debt */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <CreditCard className="w-3.5 h-3.5 text-rose-500" />
            Credit Card Dues
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
            <input
              type="number"
              step="1000"
              value={accounts.creditCardDebt || ''}
              onChange={(e) => handleAccountChange('creditCardDebt', parseFloat(e.target.value))}
              className="w-full pl-6 pr-2 py-1 text-sm font-bold text-rose-600 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

      </div>

      {/* Burn Rate Velocity Strip */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              True Daily Burn Rate
            </span>
            <span className="text-xl font-extrabold text-[#0a2540]">
              {formatINR(dailyBurn)} <span className="text-xs font-normal text-slate-500">/ day</span>
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Monthly Outflow Velocity
            </span>
            <span className="text-xl font-extrabold text-[#0a2540]">
              {formatINR(monthlyBurn)} <span className="text-xs font-normal text-slate-500">/ mo</span>
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Net Liquid Reserves
            </span>
            <span className={`text-xl font-extrabold ${netLiquid > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatINR(netLiquid)}
            </span>
          </div>
        </div>

        {/* Quick What-If Slider on Daily Burn */}
        <div className="w-full md:w-64 bg-white p-2.5 rounded-lg border border-slate-200 text-right">
          <div className="flex justify-between text-[11px] font-semibold text-[#425466] mb-1">
            <span>Trim Daily Spend</span>
            <span className="font-bold text-[#635bff]">
              {dailyBurnAdjustment <= 0 ? `${formatINR(dailyBurnAdjustment)}/day` : `+${formatINR(dailyBurnAdjustment)}/day`}
            </span>
          </div>
          <input
            type="range"
            min="-500"
            max="500"
            step="50"
            value={dailyBurnAdjustment}
            onChange={(e) => setDailyBurnAdjustment(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#635bff]"
          />
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {dailyBurnAdjustment < 0 ? `Adds +${Math.round(Math.abs(dailyBurnAdjustment) * 30 / (dailyBurn || 1))} days of buffer` : 'Adjust to test impact'}
          </span>
        </div>

      </div>

    </div>
  );
};
