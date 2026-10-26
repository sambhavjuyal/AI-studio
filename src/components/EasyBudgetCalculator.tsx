import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wallet, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Smile, 
  Clock, 
  Briefcase, 
  DollarSign, 
  HelpCircle, 
  RefreshCw, 
  ChevronRight,
  Flame,
  ShieldCheck,
  Building,
  Layers,
  ShoppingBag,
  Zap,
  Home,
  CreditCard,
  PiggyBank
} from 'lucide-react';
import { formatINR } from '../utils/currency';
import { JobListing, GroundingSource } from '../types';

interface EasyBudgetCalculatorProps {
  onOpenAdvisorWithPrompt?: (prompt: string) => void;
  onPlayGame?: () => void;
}

export const EasyBudgetCalculator: React.FC<EasyBudgetCalculatorProps> = ({
  onOpenAdvisorWithPrompt,
  onPlayGame,
}) => {
  // Simple, intuitive user budget inputs
  const [income, setIncome] = useState<number>(65000);
  const [rent, setRent] = useState<number>(18000);
  const [food, setFood] = useState<number>(9000);
  const [utilities, setUtilities] = useState<number>(3500); // electricity, wifi, recharge
  const [loans, setLoans] = useState<number>(5000); // EMIs or cards
  const [savingsPercent, setSavingsPercent] = useState<number>(15); // % to save

  // Extra money target
  const [extraMoneyGoal, setExtraMoneyGoal] = useState<number>(15000);
  const [jobCategory, setJobCategory] = useState<string>('Work From Home / Remote');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [jobSummary, setJobSummary] = useState<string>('');
  const [jobSources, setJobSources] = useState<GroundingSource[]>([]);
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);
  const [jobSearchError, setJobSearchError] = useState<string | null>(null);

  // Quick Income Preset Buttons
  const incomePresets = [
    { label: '₹35,000', value: 35000 },
    { label: '₹50,000', value: 50000 },
    { label: '₹65,000', value: 65000 },
    { label: '₹90,000', value: 90000 },
    { label: '₹1,25,000', value: 125000 },
  ];

  // Core Easy Calculations
  const calculations = useMemo(() => {
    const totalBills = rent + food + utilities + loans;
    const targetSavings = Math.round((income * savingsPercent) / 100);
    const totalCommitted = totalBills + targetSavings;
    
    // Free money left for fun, dining out, shopping, and everyday wants
    const freeMonthlySpending = income - totalCommitted;
    
    // Daily & weekly limits (assuming 30 days / month)
    const dailySafeSpend = Math.max(0, Math.round(freeMonthlySpending / 30));
    const weeklySafeSpend = Math.max(0, Math.round(freeMonthlySpending / 4.3));

    // Percentages
    const billsPercentage = Math.round((totalBills / (income || 1)) * 100);
    const freeSpendPercentage = Math.round((freeMonthlySpending / (income || 1)) * 100);

    // Health condition
    let healthState: 'great' | 'okay' | 'tight' = 'great';
    let healthMessage = 'Great job! You have plenty of comfortable spending money left every day.';
    if (freeMonthlySpending < 0) {
      healthState = 'tight';
      healthMessage = 'Caution: Your bills are higher than your income! Check the easy money ways below to cover the gap.';
    } else if (freeMonthlySpending < income * 0.15) {
      healthState = 'okay';
      healthMessage = 'Your budget is a little tight. Be mindful of daily spends and stick to your daily limit.';
    }

    return {
      totalBills,
      targetSavings,
      freeMonthlySpending,
      dailySafeSpend,
      weeklySafeSpend,
      billsPercentage,
      freeSpendPercentage,
      healthState,
      healthMessage,
    };
  }, [income, rent, food, utilities, loans, savingsPercent]);

  // Search real side jobs via Google Grounding from specific portals
  const fetchEasyMoneyJobs = async (categoryName?: string) => {
    setLoadingJobs(true);
    setJobSearchError(null);
    const cat = categoryName || jobCategory;

    try {
      const res = await fetch('/api/ai/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: cat,
          location: 'India / Remote / Work From Home',
          targetDeficit: extraMoneyGoal,
          category: cat,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not fetch jobs right now.');
      }

      setJobs(data.data.jobs || []);
      setJobSummary(data.data.summary || '');
      setJobSources(data.sources || []);
    } catch (err: any) {
      setJobSearchError(err?.message || 'Failed to search job portals via Google.');
    } finally {
      setLoadingJobs(false);
    }
  };

  // Load jobs once on mount
  useEffect(() => {
    fetchEasyMoneyJobs('Work From Home / Remote');
  }, []);

  const easyJobCategories = [
    { label: 'Work From Home / Remote', icon: '🏠', desc: 'Flexible hours from your laptop' },
    { label: 'Typing & Content Review', icon: '✍️', desc: 'Proofreading, data review & transcripts' },
    { label: 'Customer Chat & Support', icon: '🎧', desc: 'Email/chat help for apps during evenings' },
    { label: 'Weekend & Part-Time Gigs', icon: '📱', desc: 'Saturday-Sunday flexible tasks' },
    { label: 'Online Tutoring & Teaching', icon: '🎓', desc: 'Teach school subjects or spoken English' },
  ];

  return (
    <div className="space-y-12">
      
      {/* 1. Header with Stripe Mesh Gradient Accent */}
      <section className="relative overflow-hidden pt-10 pb-8 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#635bff]/10 border border-[#635bff]/20 text-[#635bff] text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Simple Budget Calculator • No Finance Jargon</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0a2540] tracking-tight max-w-3xl mx-auto leading-tight">
            How much can you <span className="bg-gradient-to-r from-[#635bff] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">safely spend</span> every day?
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#425466] max-w-2xl mx-auto leading-relaxed">
            Enter your monthly earnings and bills below. We'll give you your exact <strong>daily spending limit</strong>, and show you <strong>easy ways to make extra money</strong> if you need more.
          </p>

          {/* Key Answer Cards: The 3 Big Numbers Everyday People Need */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            
            {/* Card 1: Safe Daily Limit */}
            <div className="p-6 rounded-2xl bg-white border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-2">
                  Safe To Spend Today
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#0a2540] tracking-tight">
                  {formatINR(calculations.dailySafeSpend)}
                  <span className="text-sm font-semibold text-slate-400 font-normal"> / day</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Spend this on tea, lunch, shopping, or fun today without feeling guilty.
                </p>
              </div>
            </div>

            {/* Card 2: Safe Weekly Allowance */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/60 rounded-bl-full -z-0 pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-2.5 py-1 rounded-md inline-block mb-2">
                  Safe Weekly Budget
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#0a2540] tracking-tight">
                  {formatINR(calculations.weeklySafeSpend)}
                  <span className="text-sm font-semibold text-slate-400 font-normal"> / week</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Your weekly allowance for weekend outings, movies, and eating out.
                </p>
              </div>
            </div>

            {/* Card 3: Free Cash Left for Month */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50/60 rounded-bl-full -z-0 pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md inline-block mb-2">
                  Total Free Money Left
                </span>
                <div className={`text-3xl sm:text-4xl font-black tracking-tight ${
                  calculations.freeMonthlySpending < 0 ? 'text-rose-600' : 'text-[#0a2540]'
                }`}>
                  {formatINR(calculations.freeMonthlySpending)}
                  <span className="text-sm font-semibold text-slate-400 font-normal"> / mo</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {calculations.freeMonthlySpending >= 0 
                    ? `Pure free money left after paying all bills and saving ${formatINR(calculations.targetSavings)}.`
                    : 'Your bills exceed your earnings. Look below for easy ways to earn extra cash.'}
                </p>
              </div>
            </div>

          </div>

          {/* Friendly Status Alert */}
          <div className="mt-5 max-w-4xl mx-auto">
            <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-medium ${
              calculations.healthState === 'great' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : calculations.healthState === 'okay'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2 text-left">
                {calculations.healthState === 'great' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <span>{calculations.healthMessage}</span>
              </div>
              
              <a
                href="#easy-money-section"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold underline shrink-0 cursor-pointer text-[#635bff]"
              >
                <span>Make Extra Money</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Game Teaser Banner */}
          {onPlayGame && (
            <div className="mt-6 max-w-4xl mx-auto">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a2540] via-[#1e1b4b] to-[#311042] text-white shadow-xl shadow-indigo-950/20 border border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-left relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#635bff] rounded-full blur-3xl opacity-30 pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#ec4899] rounded-full blur-3xl opacity-20 pointer-events-none" />

                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#635bff] to-[#ec4899] flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg shadow-indigo-500/30">
                    🎮
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                        New: Rupee Master 50-30-20 Wealth Quest
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ec4899] text-white">
                        Play & Learn
                      </span>
                    </div>
                    <p className="text-xs text-indigo-200 mt-0.5 max-w-xl leading-relaxed">
                      A fast, fun game that teaches you <strong>exactly how much to spend on essentials (50%)</strong>, <strong>how to save (20%)</strong>, and <strong>where to invest for compounding (30%)</strong> while dodging temptation debt traps!
                    </p>
                  </div>
                </div>

                <button
                  onClick={onPlayGame}
                  className="relative z-10 w-full sm:w-auto px-5 py-3 rounded-xl bg-[#635bff] hover:bg-[#544dc9] text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Play Game Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 2. The Simple Budget Calculator Form */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-8">
          
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-2xl font-extrabold text-[#0a2540] tracking-tight">
              1. Enter Your Monthly Money & Bills
            </h2>
            <p className="text-sm text-[#425466] mt-1">
              Adjust the numbers to match your real life. Everything updates in real time.
            </p>
          </div>

          {/* Monthly Income Input with Quick Chips */}
          <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-bold text-[#0a2540] flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#635bff]" />
                How much money do you take home each month?
              </label>
              <div className="relative w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-base text-[#0a2540] focus:outline-none focus:ring-2 focus:ring-[#635bff]"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-slate-500 font-medium">Quick Pick:</span>
              {incomePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setIncome(preset.value)}
                  className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                    income === preset.value
                      ? 'bg-[#635bff] text-white border-[#635bff]'
                      : 'bg-white text-[#425466] border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Main Bills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Rent / Room / Flat */}
            <div className="space-y-2 p-4 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0a2540] flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-[#635bff]" />
                  House Rent / Room Payment
                </span>
                <span className="text-sm font-bold text-[#0a2540]">{formatINR(rent)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(80000, income * 0.7)}
                step={500}
                value={rent}
                onChange={(e) => setRent(parseInt(e.target.value) || 0)}
                className="w-full accent-[#635bff] cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block">
                Usually around 25% to 35% of your income.
              </span>
            </div>

            {/* Food & Groceries */}
            <div className="space-y-2 p-4 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0a2540] flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  Food, Groceries & Milk
                </span>
                <span className="text-sm font-bold text-[#0a2540]">{formatINR(food)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={40000}
                step={500}
                value={food}
                onChange={(e) => setFood(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block">
                Cooking at home, vegetables, dairy, and food staples.
              </span>
            </div>

            {/* Electricity, WiFi, Phone Recharge */}
            <div className="space-y-2 p-4 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0a2540] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Electricity, Phone & WiFi Bills
                </span>
                <span className="text-sm font-bold text-[#0a2540]">{formatINR(utilities)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={20000}
                step={200}
                value={utilities}
                onChange={(e) => setUtilities(parseInt(e.target.value) || 0)}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block">
                Power bill, mobile recharge, broadband internet.
              </span>
            </div>

            {/* Loans, EMIs, or Credit Cards */}
            <div className="space-y-2 p-4 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0a2540] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-rose-500" />
                  Loan EMIs / Credit Card Bills
                </span>
                <span className="text-sm font-bold text-[#0a2540]">{formatINR(loans)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(50000, income * 0.5)}
                step={500}
                value={loans}
                onChange={(e) => setLoans(parseInt(e.target.value) || 0)}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block">
                Bike/car loan, student loan, or phone EMI.
              </span>
            </div>

          </div>

          {/* How Much to Save Slider */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0a2540] flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-[#635bff]" />
                How much do you want to save every month? ({savingsPercent}%)
              </span>
              <span className="text-sm font-extrabold text-[#635bff]">
                {formatINR(calculations.targetSavings)} / mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={savingsPercent}
              onChange={(e) => setSavingsPercent(parseInt(e.target.value) || 0)}
              className="w-full accent-[#635bff] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0% (No savings)</span>
              <span>10% (Good start)</span>
              <span>20% (Recommended)</span>
              <span>30%+ (Fast wealth)</span>
            </div>
          </div>

          {/* Visual Breakdown Bar: Where Does Your Money Go? */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-[#0a2540]">
              <span>Where your money goes:</span>
              <span>
                Bills: {calculations.billsPercentage}% • Savings: {savingsPercent}% • Free Spend: {Math.max(0, calculations.freeSpendPercentage)}%
              </span>
            </div>

            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-rose-500 transition-all duration-300"
                style={{ width: `${Math.min(100, calculations.billsPercentage)}%` }}
                title={`Bills: ${formatINR(calculations.totalBills)}`}
              />
              <div 
                className="bg-[#635bff] transition-all duration-300"
                style={{ width: `${Math.min(100 - calculations.billsPercentage, savingsPercent)}%` }}
                title={`Savings: ${formatINR(calculations.targetSavings)}`}
              />
              <div 
                className="bg-emerald-500 transition-all duration-300"
                style={{ width: `${Math.max(0, calculations.freeSpendPercentage)}%` }}
                title={`Free Spending: ${formatINR(calculations.freeMonthlySpending)}`}
              />
            </div>

            <div className="flex items-center justify-center gap-6 pt-1 text-xs text-[#425466]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Must-Pay Bills ({formatINR(calculations.totalBills)})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#635bff]" />
                Savings Put Aside ({formatINR(calculations.targetSavings)})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Safe Spending Money ({formatINR(calculations.freeMonthlySpending)})
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. "What's The Way You Can Make Easy Money Out Of It?" */}
      <section id="easy-money-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-pink-50/30 rounded-3xl p-6 sm:p-10 border border-indigo-100 shadow-xl shadow-indigo-500/5 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-indigo-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#635bff] bg-white px-2.5 py-1 rounded-md border border-indigo-200/80 mb-2">
                <TrendingUp className="w-4 h-4 text-[#635bff]" />
                Easy Ways To Make Extra Money
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540] tracking-tight">
                Want more cash? Here's how to make easy extra money.
              </h2>
              <p className="text-sm text-[#425466] mt-1 max-w-2xl">
                We use <strong>Google Search</strong> to check specific job portals (Naukri, Indeed, LinkedIn, Internshala, RemoteOK) for flexible part-time and online side gigs you can do right now.
              </p>
            </div>

            {/* Extra Money Target Picker */}
            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-xs shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Target Extra Cash:
              </span>
              <div className="flex items-center gap-1.5">
                {[10000, 15000, 25000, 40000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setExtraMoneyGoal(amount);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      extraMoneyGoal === amount
                        ? 'bg-[#635bff] text-white shadow-xs'
                        : 'bg-slate-50 text-[#0a2540] hover:bg-indigo-50'
                    }`}
                  >
                    +{formatINR(amount)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Hours Needed Explainer */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-[#0a2540]">
              <Clock className="w-5 h-5 text-[#635bff] shrink-0" />
              <span>
                To make an extra <strong>{formatINR(extraMoneyGoal)}/mo</strong>, you only need about <strong>5 to 8 hours a week</strong> (e.g. 1 hour on weekday evenings, or Saturday morning)!
              </span>
            </div>
            <button
              onClick={() => fetchEasyMoneyJobs(jobCategory)}
              disabled={loadingJobs}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#635bff] hover:text-[#544dc9] bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingJobs ? 'animate-spin' : ''}`} />
              <span>Search Fresh Gigs</span>
            </button>
          </div>

          {/* 1-Click Category Filter Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Choose the kind of easy work you like:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {easyJobCategories.map((cat) => {
                const isSelected = jobCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => {
                      setJobCategory(cat.label);
                      fetchEasyMoneyJobs(cat.label);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#635bff] text-white border-[#635bff] shadow-md shadow-indigo-500/20'
                        : 'bg-white text-[#0a2540] border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-xl block mb-1">{cat.icon}</span>
                    <span className="text-xs font-extrabold block truncate">{cat.label}</span>
                    <span className={`text-[10px] block mt-0.5 leading-tight truncate ${
                      isSelected ? 'text-indigo-100' : 'text-slate-400'
                    }`}>
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Listings from Google Grounded Search */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Found verified opportunities matching <strong>{jobCategory}</strong>:
              </span>
              {jobSources.length > 0 && (
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  ✓ Verified via Google Search on Job Portals
                </span>
              )}
            </div>

            {loadingJobs ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-2xl border border-slate-200">
                <RefreshCw className="w-8 h-8 text-[#635bff] animate-spin" />
                <h4 className="text-sm font-bold text-[#0a2540]">
                  Searching Naukri, Indeed, LinkedIn, & Internshala via Google...
                </h4>
                <p className="text-xs text-slate-400">
                  Finding real flexible roles that pay around {formatINR(extraMoneyGoal)}/mo.
                </p>
              </div>
            ) : jobSearchError ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {jobSearchError}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#635bff] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {job.portalName}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          {job.payRate}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#0a2540] group-hover:text-[#635bff] transition-colors leading-snug">
                        {job.title}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.company}</span>
                        <span>•</span>
                        <span className="font-medium text-[#0a2540]">{job.workType}</span>
                        <span>•</span>
                        <span>{job.commitment}</span>
                      </div>

                      <p className="text-xs text-[#425466] leading-relaxed line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-emerald-700 font-bold">
                        +{formatINR(job.estimatedMonthlyBoost || extraMoneyGoal)}/mo extra cash
                      </div>

                      <a
                        href={job.portalUrl.startsWith('http') ? job.portalUrl : `https://${job.portalUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#635bff] hover:text-[#544dc9] group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Apply / View on {job.portalName}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Google Search Citations / Source Badges */}
            {jobSources.length > 0 && (
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-semibold">Google Search Verified Portals:</span>
                {jobSources.map((src, i) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#635bff] hover:underline bg-indigo-50/70 px-2 py-0.5 rounded text-[11px]"
                  >
                    <span>{src.title}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 4. Simple Question Helper (Ask Anything in Plain English) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 text-center space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-[#635bff] flex items-center justify-center mx-auto">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0a2540]">
              Still confused or have a quick question?
            </h3>
            <p className="text-xs sm:text-sm text-[#425466] mt-1 max-w-lg mx-auto">
              Ask our Money Helper anything in plain English. No complicated financial terms.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto pt-2">
            {[
              'Can I afford to buy a ₹15,000 phone this month?',
              'How can I save ₹2,000 easily on my groceries?',
              'Is paying ₹18,000 rent too high for ₹65,000 salary?',
              'What are 3 easiest side jobs for college students or freshers?',
            ].map((question, i) => (
              <button
                key={i}
                onClick={() => onOpenAdvisorWithPrompt?.(question)}
                className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 text-[#0a2540] hover:text-[#635bff] border border-slate-200 font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                {question} →
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
