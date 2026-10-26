import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  TrendingDown, 
  Calendar, 
  FileText, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { BudgetState, CityBenchmark, InflationScenario, AuditReport } from '../types';
import { formatINR } from '../utils/currency';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetState;
  selectedCity: CityBenchmark;
  scenario: InflationScenario;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  budget,
  selectedCity,
  scenario,
}) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const fetchAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/stress-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          cityData: { name: selectedCity.name, index: selectedCity.costIndex },
          inflationScenario: scenario,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate audit report.');
      }

      setReport(data.audit);
    } catch (err: any) {
      setError(err?.message || 'Error running stress audit.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report) {
      fetchAudit();
    }
  }, [isOpen]);

  const copyScript = () => {
    if (!report?.leaseNegotiationScript) return;
    navigator.clipboard.writeText(report.leaseNegotiationScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0a2540]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[740px] max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#635bff] to-[#ec4899] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-[#0a2540] tracking-tight">
                  Executive Stress Audit & Inflation Shield
                </h3>
                <span className="text-xs font-bold text-[#635bff] bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedCity.name}
                </span>
              </div>
              <p className="text-xs text-[#64748b]">
                Comprehensive algorithmic diagnosis powered by Gemini 3.8
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAudit}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-[#635bff] rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Regenerate Audit"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#635bff]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-[#0a2540] rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-7">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#635bff] flex items-center justify-center animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0a2540]">
                  Synthesizing Metro Telemetry & Inflation Vectors...
                </h4>
                <p className="text-xs text-[#64748b] mt-1 max-w-md">
                  Analyzing rent-to-income elasticities, grocery CPI indices, and drafting lease renegotiation scripts tailored to {selectedCity.name}.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          ) : report ? (
            <>
              {/* Executive Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Overall Assessment:
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      report.stressRating === 'Critical'
                        ? 'bg-rose-100 text-rose-700'
                        : report.stressRating === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {report.stressRating} • Score {report.stressScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-[#425466] leading-relaxed max-w-xl">
                    {report.executiveSummary}
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 shrink-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Identified Monthly Recovery</span>
                  <span className="text-2xl font-black text-emerald-600">
                    +{formatINR(report.interventions?.reduce((acc, i) => acc + (i.monthlySavings || 0), 0) || 12000)}/mo
                  </span>
                </div>
              </div>

              {/* Top 3 Vulnerabilities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-3 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  Primary Vulnerabilities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {report.vulnerabilities?.map((vuln, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0a2540]">{vuln.title}</span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          {vuln.impact}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748b] leading-relaxed">
                        {vuln.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 High-Impact Interventions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-3 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                  Recommended Financial Interventions
                </h4>
                <div className="space-y-3">
                  {report.interventions?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0a2540]">{item.title}</span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            {item.difficulty} Effort
                          </span>
                        </div>
                        <p className="text-xs text-[#64748b] leading-relaxed">
                          {item.actionSteps}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md block sm:inline">
                          Save ~{formatINR(item.monthlySavings)}/mo
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 90-Day Roadmap */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#635bff]" />
                  90-Day Inflation Shield Roadmap
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-[#635bff] block">Month 1: Triage & Audit</span>
                    <p className="text-xs text-[#425466] leading-relaxed">{report.roadmap90Day?.month1}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-pink-600 block">Month 2: Structural Lock-in</span>
                    <p className="text-xs text-[#425466] leading-relaxed">{report.roadmap90Day?.month2}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-600 block">Month 3: Income Compounding</span>
                    <p className="text-xs text-[#425466] leading-relaxed">{report.roadmap90Day?.month3}</p>
                  </div>
                </div>
              </div>

              {/* Lease & Rent Negotiation Script */}
              <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#635bff]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a2540]">
                      Tailored Lease Renewal Negotiation Script
                    </h4>
                  </div>
                  <button
                    onClick={copyScript}
                    className="flex items-center gap-1 text-xs font-semibold text-[#635bff] hover:text-[#544dc9] bg-white px-2.5 py-1 rounded-md border border-indigo-200 transition-colors cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied to Clipboard' : 'Copy Script'}</span>
                  </button>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs text-[#0a2540] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {report.leaseNegotiationScript}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Exported from AuraLedger Copilot Telemetry Engine
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-[#0a2540] bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
