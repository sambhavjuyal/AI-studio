import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  ShieldCheck, 
  DollarSign, 
  ChevronRight, 
  RefreshCw,
  Building2,
  Receipt
} from 'lucide-react';
import { BudgetState, ChatMessage, CityBenchmark } from '../types';
import { formatINR } from '../utils/currency';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetState;
  selectedCity: CityBenchmark;
  stressScore: number;
  inflationDeficit: number;
  initialPrompt?: string;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  budget,
  selectedCity,
  stressScore,
  inflationDeficit,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hi there! I am your EasyBudget Money Helper. Ask me anything in simple, plain words — like whether you can afford to buy something, how to save on daily bills, or easy ways to earn extra cash!`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sentInitialRef = useRef<string | null>(null);

  const promptChips = [
    'Can I afford to buy a ₹15,000 phone this month?',
    'How can I easily save ₹2,000 on my groceries?',
    'What are 3 easiest side jobs to do from home?',
    'Is my rent too high for my monthly income?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (initialPrompt && initialPrompt !== sentInitialRef.current) {
        sentInitialRef.current = initialPrompt;
        handleSendMessage(initialPrompt);
      }
    }
  }, [messages, isOpen, initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          budgetContext: {
            income: budget.income,
            city: selectedCity.name,
            householdSize: budget.householdSize,
            housing: budget.housing,
            groceries: budget.groceries,
            utilities: budget.utilities,
            transport: budget.transport,
            insurance: budget.insurance,
            discretionary: budget.discretionary,
            stressIndex: stressScore,
            inflationDeficit,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get copilot response');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Analysis complete.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'model',
          text: `⚠️ **Advisory Error**: ${err?.message || 'Could not connect to Gemini AI server.'}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0a2540]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[680px] max-h-[92vh] overflow-hidden">
        
        {/* Stripe-style Modal Header */}
        <div className="px-6 py-4.5 bg-white border-b border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#635bff] to-[#ec4899] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#0a2540] tracking-tight">
                  Easy Money Helper
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                  Plain Words
                </span>
              </div>
              <p className="text-xs text-[#64748b]">
                Ask any question about your budget, spending, or side jobs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0a2540] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Context Bar in plain words */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-[11px] text-[#425466]">
          <span>Earnings: <strong>{formatINR(budget.income)}</strong></span>
          <span>Rent: <strong>{formatINR(budget.housing)}</strong></span>
          <span>Food: <strong>{formatINR(budget.groceries)}</strong></span>
          <span className="font-bold text-emerald-700">Daily Spend: ~{formatINR(Math.max(0, Math.round((budget.income - budget.housing - budget.groceries - budget.utilities - budget.insurance) / 30)))}/day</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-[#635bff] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    isUser
                      ? 'bg-[#635bff] text-white shadow-xs'
                      : 'bg-slate-50 text-[#0a2540] border border-slate-200/80'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <span className={`block text-[10px] mt-1.5 opacity-60 ${isUser ? 'text-white' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-[#0a2540] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    U
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#635bff] bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60 w-max">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing financial levers & drafting strategy...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-6 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 text-[#425466] hover:text-[#635bff] border border-slate-200 font-medium transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for rent negotiation scripts, grocery arbitrage, or side income tactics..."
              className="flex-1 px-4 py-2.5 text-xs text-[#0a2540] bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff]"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-[#635bff] hover:bg-[#544dc9] text-white disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
