/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EasyBudgetCalculator } from './components/EasyBudgetCalculator';
import { Footer } from './components/Footer';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { MoneyMasterGame } from './components/MoneyMasterGame';
import { BudgetState, CityBenchmark } from './types';
import { CITIES_DATA } from './data/cities';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'calculator' | 'game'>('calculator');
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [advisorInitialPrompt, setAdvisorInitialPrompt] = useState<string | undefined>(undefined);

  // Default friendly budget state (for modal context)
  const defaultBudget: BudgetState = {
    income: 65000,
    city: 'Bengaluru, KA',
    householdSize: 1,
    housing: 18000,
    groceries: 9000,
    utilities: 3500,
    transport: 3000,
    insurance: 5000,
    discretionary: 19500,
    currentSavings: 150000,
  };

  const defaultCity: CityBenchmark = CITIES_DATA[0];

  const handleOpenAdvisorWithPrompt = (prompt: string) => {
    setAdvisorInitialPrompt(prompt);
    setIsAdvisorOpen(true);
  };

  // 1. FULL-VIEWPORT GAME SHELL
  // When in game view, strictly render the game shell with no website navbar or footer
  if (viewMode === 'game') {
    return (
      <MoneyMasterGame
        onExitGame={() => setViewMode('calculator')}
        defaultSalary={defaultBudget.income}
      />
    );
  }

  // 2. MAIN APPLICATION VIEW: CRISP STRIPE-INSPIRED BUDGET CALCULATOR & JOB FINDER
  return (
    <div id="top" className="min-h-screen flex flex-col font-sans bg-white text-[#0a2540] selection:bg-[#635bff]/20 selection:text-[#635bff]">
      
      {/* Clean, Simple Top Navigation */}
      <Navbar
        onOpenAdvisor={() => {
          setAdvisorInitialPrompt(undefined);
          setIsAdvisorOpen(true);
        }}
        onPlayGame={() => setViewMode('game')}
      />

      {/* Main Single App Feature: Easy Budget Calculator & Extra Money Finder */}
      <main className="flex-1">
        <EasyBudgetCalculator
          onOpenAdvisorWithPrompt={handleOpenAdvisorWithPrompt}
          onPlayGame={() => setViewMode('game')}
        />
      </main>

      {/* Floating Plain-Language AI Money Helper Button */}
      <button
        onClick={() => {
          setAdvisorInitialPrompt(undefined);
          setIsAdvisorOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 bg-[#0a2540] hover:bg-[#635bff] text-white rounded-full shadow-xl shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        aria-label="Ask Money Helper"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-indigo-300 group-hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-bold tracking-tight pr-1">
          Ask Money Helper
        </span>
      </button>

      {/* Plain-Language AI Assistant Modal */}
      <AiAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        budget={defaultBudget}
        selectedCity={defaultCity}
        stressScore={42}
        inflationDeficit={15000}
        initialPrompt={advisorInitialPrompt}
      />

      {/* Clean Footer */}
      <Footer
        onOpenAdvisor={() => {
          setAdvisorInitialPrompt(undefined);
          setIsAdvisorOpen(true);
        }}
      />

    </div>
  );
}
