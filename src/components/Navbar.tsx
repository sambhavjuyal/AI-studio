import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Wallet,
  TrendingUp,
  X,
  Menu
} from 'lucide-react';

interface NavbarProps {
  onOpenAdvisor: () => void;
  onScrollToSection?: (sectionId: string) => void;
  onPlayGame?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdvisor,
  onScrollToSection,
  onPlayGame,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5 text-left group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#635bff] to-[#ec4899] flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <span className="font-black text-white text-lg tracking-tight">₹</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xl tracking-tight text-[#0a2540]">EasyBudget</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Simple
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748b] font-medium leading-none">
                    Know what you can spend • Make extra cash
                  </p>
                </div>
              </div>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-2">
                <a
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#425466] hover:text-[#0a2540] hover:bg-slate-100/60 transition-colors cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5 text-[#635bff]" />
                  <span>Budget Calculator</span>
                </a>

                {onPlayGame && (
                  <button
                    onClick={onPlayGame}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#635bff] bg-[#635bff]/10 hover:bg-[#635bff]/20 transition-all cursor-pointer"
                  >
                    <span>🎮 Play Rupee Master</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899] animate-pulse" />
                  </button>
                )}

                <a
                  href="#easy-money-section"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#425466] hover:text-[#0a2540] hover:bg-slate-100/60 transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ways To Make Extra Money</span>
                </a>
              </nav>
            </div>

            {/* Right CTA Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {onPlayGame && (
                <button
                  onClick={onPlayGame}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-[#635bff] bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
                >
                  <span>🎮 Play Money Game</span>
                </button>
              )}

              <button
                onClick={() => setShowSignInModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-[#425466] hover:text-[#0a2540] transition-colors cursor-pointer"
              >
                Sign In
              </button>

              <button
                onClick={onOpenAdvisor}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#635bff] hover:bg-[#544dc9] shadow-md shadow-indigo-500/20 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Money Helper</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="sm:hidden flex items-center gap-2">
              {onPlayGame && (
                <button
                  onClick={onPlayGame}
                  className="px-2.5 py-1.5 text-xs font-bold bg-[#635bff] text-white rounded-lg shadow-sm cursor-pointer"
                >
                  🎮 Play
                </button>
              )}
              <button
                onClick={onOpenAdvisor}
                className="p-2 text-[#635bff] bg-indigo-50 rounded-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pt-2 pb-4 space-y-2 bg-white border-b border-slate-200 text-xs">
            <a
              href="#top"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block py-2 font-semibold text-[#0a2540]"
            >
              Budget Calculator
            </a>
            <a
              href="#easy-money-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 font-semibold text-[#0a2540]"
            >
              Ways To Make Extra Money
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdvisor();
              }}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#635bff] text-white font-bold flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Money Helper</span>
            </button>
          </div>
        )}
      </header>

      {/* Simple Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#635bff] flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0a2540]">Save Your Budget</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your email to save your budget and receive weekly alerts on new high-paying side gigs.
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowSignInModal(false); }} className="space-y-3">
              <input
                type="email"
                placeholder="your.email@example.com"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#635bff] hover:bg-[#544dc9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Save My Budget
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
