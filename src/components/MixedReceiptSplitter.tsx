import React, { useState } from 'react';
import { 
  Split, 
  Receipt, 
  FileSpreadsheet, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  DollarSign, 
  Share2, 
  Tag, 
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { ParsedReceipt, ReceiptItem } from '../types';
import { formatINR, formatDecimalINR } from '../utils/currency';

interface MixedReceiptSplitterProps {
  onSyncNetExpense: (netAmount: number, category: string) => void;
  gentleMode: boolean;
}

export const MixedReceiptSplitter: React.FC<MixedReceiptSplitterProps> = ({
  onSyncNetExpense,
  gentleMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedReceipt | null>(null);
  const [roommateSplitPercent, setRoommateSplitPercent] = useState<number>(50);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const sampleDatasets = [
    {
      title: 'Zepto / Swiggy Instamart Mixed Cart (₹1,450)',
      text: `Zepto Quick Delivery Bill
1 Amul Taaza Milk 1L - ₹72.00 (Need, Groceries)
1 Fortune Sunflower Oil 1L - ₹165.00 (Need, Groceries)
1 Dettol Handwash Refill 750ml - ₹145.00 (Need, Hygiene)
1 Ariel Matic Liquid Detergent 1L - ₹230.00 (Need, Household)
1 Boat Bassheads Wired Earphones - ₹399.00 (Want, Tech)
1 Ferrero Rocher 4pk - ₹165.00 (Want, Treats)
1 Minimalist Scented Soy Candle - ₹240.00 (Want, Decor)
Delivery & Platform Handling: ₹35.00
Order Total: ₹1,451.00`,
    },
    {
      title: 'HDFC / ICICI Bank Statement CSV (Pasted)',
      text: `Date,Narration,Withdrawal (INR),Category
22/10/2026,UPI-ZEPTO GROCERIES-PAYTM,1420.00,Groceries
23/10/2026,UPI-BESCOM ELECTRICITY BILL,3450.00,Utilities
24/10/2026,POS-DMART INDIRANAGAR BLR,2840.00,Household
24/10/2026,SWIGGY-GOURMET BURGER,680.00,Dining
25/10/2026,NETFLIX INDIA SUBSCRIPTION,649.00,Entertainment`,
    },
    {
      title: 'D-Mart Supermarket Household & Groceries (₹3,250)',
      text: `DMART HYPERMARKET RECEIPT
1 AASHIRVAAD ATTA 10KG - ₹460.00
1 FORTUNE MUSTARD OIL 1L - ₹155.00
1 TATA SAMPANN TOOR DAL 1KG - ₹175.00
1 SURF EXCEL MATIC POWDER 2KG - ₹410.00
1 COLGATE TOTAL TOOTHPASTE 2PK - ₹230.00
1 CADBURY CELEBRATIONS BOX - ₹350.00
1 SMART LED DESK LAMP - ₹690.00
1 NON-STICK FRYING PAN 24CM - ₹780.00
GST TAX INCLUDED: ₹280.00
TOTAL AMOUNT PAID: ₹3,250.00`,
    },
  ];

  const handleParse = async (textToRun?: string) => {
    setLoading(true);
    setError(null);
    setAppliedNotice(null);

    const textToSubmit = textToRun || inputText;

    try {
      const res = await fetch('/api/ai/parse-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSubmit }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to parse text.');
      }

      setParsedData(json.data);
    } catch (err: any) {
      setError(err?.message || 'Error processing statement.');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemType = (index: number) => {
    if (!parsedData) return;
    const items = [...parsedData.items];
    const current = items[index].itemType || 'Need';
    const nextType = current === 'Need' ? 'Want' : current === 'Want' ? 'Shared' : current === 'Shared' ? 'Business' : 'Need';
    items[index].itemType = nextType;

    // Recalculate needs vs wants
    let needs = 0;
    let wants = 0;
    items.forEach((it) => {
      if (it.itemType === 'Need') needs += it.price;
      else if (it.itemType === 'Want') wants += it.price;
    });

    setParsedData({
      ...parsedData,
      items,
      needsTotal: Number(needs.toFixed(2)),
      wantsTotal: Number(wants.toFixed(2)),
    });
  };

  // Shared calculations
  const sharedItemsTotal = parsedData?.items
    ?.filter((i) => i.itemType === 'Shared' || i.itemType === 'Need')
    ?.reduce((acc, i) => acc + i.price, 0) || 0;

  const roommateShareOwed = Number((sharedItemsTotal * (roommateSplitPercent / 100)).toFixed(2));
  const myNetShare = Number(((parsedData?.totalAmount || 0) - roommateShareOwed).toFixed(2));

  const handleApplyNetToBudget = () => {
    if (!parsedData) return;
    onSyncNetExpense(myNetShare, parsedData.category || 'Groceries');
    setAppliedNotice(`Synced! Net expenditure of ${formatINR(myNetShare)} applied to your budget (Flatmate owes ${formatINR(roommateShareOwed)}).`);
    setTimeout(() => setAppliedNotice(null), 4000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 stripe-card-glow space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-2.5 py-0.5 rounded mb-1">
            <Split className="w-3.5 h-3.5" />
            Mixed-Receipt & Statement Parser
          </div>
          <h3 className="text-xl font-extrabold text-[#0a2540] tracking-tight">
            Mixed-Receipt Splitter & Shared Cost Calculator (Rupees)
          </h3>
          <p className="text-xs text-[#425466]">
            Splits complex shopping trips into strict "Needs" vs "Wants", parses bank CSVs, and computes exact flatmate/partner split reimbursements in Rupees (₹).
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5">
          {sampleDatasets.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                handleParse(sample.text);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 font-semibold text-[#0a2540] transition-colors cursor-pointer"
            >
              {sample.title.split(' ')[0]} {sample.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Input or Result Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Input Text / CSV Box */}
        <div className="lg:col-span-5 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Paste Receipt Text, Bank CSV Lines, or UPI Statement
          </label>
          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw bank export CSV, Zepto order receipt, or grocery line items..."
            className="w-full p-3.5 text-xs font-mono text-[#0a2540] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635bff]/30"
          />

          <button
            onClick={() => handleParse()}
            disabled={loading || !inputText.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-[#635bff] hover:bg-[#544dc9] disabled:opacity-50 transition-all shadow-xs cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Classifying Needs vs Wants...' : 'Split & Itemize Statement (₹)'}</span>
          </button>

          {/* Split Ratio Slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0a2540]">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#635bff]" />
                Flatmate / Partner Split Ratio
              </span>
              <span className="text-[#635bff]">{roommateSplitPercent}% / {100 - roommateSplitPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={roommateSplitPercent}
              onChange={(e) => setRoommateSplitPercent(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#635bff]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>Solo (0%)</span>
              <span>50 / 50 Equal</span>
              <span>100% Reimbursed</span>
            </div>
          </div>
        </div>

        {/* Right: Itemized Breakdown Card */}
        <div className="lg:col-span-7 bg-[#f8fafc] rounded-2xl p-5 border border-slate-200/90 space-y-4 min-h-[380px] flex flex-col justify-between">
          {parsedData ? (
            <div className="space-y-4">
              
              {/* Top Summary Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-[#0a2540]">{parsedData.merchant}</span>
                  <span className="text-[11px] text-slate-400 block">{parsedData.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Transaction</span>
                  <span className="text-xl font-extrabold text-[#0a2540]">{formatINR(parsedData.totalAmount)}</span>
                </div>
              </div>

              {/* Needs vs Wants Progress Meter */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Essential Needs: {formatINR(parsedData.needsTotal || 0)}
                  </span>
                  <span className="text-pink-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    Lifestyle Wants: {formatINR(parsedData.wantsTotal || 0)}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{
                      width: `${Math.round(((parsedData.needsTotal || 1) / (parsedData.totalAmount || 1)) * 100)}%`,
                    }}
                  />
                  <div
                    className="h-full bg-pink-500 transition-all"
                    style={{
                      width: `${Math.round(((parsedData.wantsTotal || 0) / (parsedData.totalAmount || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Line Items with Click-to-Toggle Type */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
                {parsedData.items?.map((item, idx) => (
                  <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleItemType(idx)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          item.itemType === 'Need'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.itemType === 'Want'
                            ? 'bg-pink-100 text-pink-700'
                            : item.itemType === 'Shared'
                            ? 'bg-indigo-100 text-[#635bff]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                        title="Click to toggle: Need / Want / Shared / Business"
                      >
                        {item.itemType || 'Need'}
                      </button>
                      <span className="font-semibold text-[#0a2540]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#0a2540]">{formatINR(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* Shared Reimbursement Strip */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-indigo-950 block">Flatmate / Partner Share:</span>
                  <span className="text-[11px] text-indigo-800">
                    {roommateSplitPercent}% of shared essentials ({formatINR(sharedItemsTotal)})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Reimbursement Owed</span>
                  <span className="text-lg font-black text-[#635bff]">+{formatINR(roommateShareOwed)}</span>
                </div>
              </div>

              {/* Apply Action */}
              <div>
                <button
                  onClick={handleApplyNetToBudget}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#0a2540] hover:bg-[#635bff] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Apply Your True Net Portion ({formatINR(myNetShare)}) to Budget</span>
                </button>

                {appliedNotice && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold text-center border border-emerald-200">
                    {appliedNotice}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <FileSpreadsheet className="w-12 h-12 text-slate-300 mb-2 stroke-[1.2]" />
              <p className="text-sm font-bold text-[#0a2540]">No statement parsed yet</p>
              <p className="text-xs text-[#64748b] max-w-xs mt-1">
                Paste bank export text or click one of the quick test presets above to isolate Wants vs Needs in Rupees (₹).
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
