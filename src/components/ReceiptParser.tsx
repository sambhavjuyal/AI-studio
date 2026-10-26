import React, { useState, useRef } from 'react';
import { 
  Receipt, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { ParsedReceipt, BudgetState } from '../types';
import { formatINR, formatDecimalINR } from '../utils/currency';

interface ReceiptParserProps {
  onApplyExpenseToBudget: (category: string, amount: number) => void;
}

export const ReceiptParser: React.FC<ReceiptParserProps> = ({ onApplyExpenseToBudget }) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedReceipt | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleReceipts = [
    {
      title: 'Blinkit / Zepto Grocery Cart (₹1,480)',
      category: 'Groceries',
      text: `Blinkit Quick Delivery
1 Amul Taaza Homogenised Toned Milk 1L - ₹72.00
1 Aashirvaad Shudh Chakki Atta 5kg - ₹275.00
1 Fortune Sunlite Refined Sunflower Oil 1L - ₹158.00
1 Country Delight Fresh Malai Paneer 200g - ₹120.00
1 Farm Fresh Brown Eggs 12pk - ₹110.00
1 Tata Salt 1kg - ₹28.00
1 Tata Tea Gold 500g - ₹295.00
1 Organic Sourdough Bread - ₹75.00
1 Royal Gala Apples 500g - ₹145.00
Handling & Rain Surge Fee: ₹25.00
GST (5% / 18%): ₹45.50
Total Paid: ₹1,348.50`,
    },
    {
      title: 'Bescom / Tata Power Electricity Bill (₹3,840)',
      category: 'Utilities',
      text: `Electricity Distribution Utility Statement
Billing Cycle: Oct 2026
Meter No: #KA-05-99214
Energy Charges (380 Units @ ₹7.50/unit): ₹2,850.00
Fixed Demand Charges: ₹240.00
Fuel Cost Adjustment (FAC Surcharge): ₹310.00
State Electricity Duty (9%): ₹282.60
Green Energy Surcharge: ₹157.40
Total Amount Payable: ₹3,840.00`,
    },
    {
      title: 'D-Mart Supermarket Household Essentials (₹2,450)',
      category: 'Discretionary',
      text: `DMART HYPERMARKET INDIRANAGAR
1 Surf Excel Matic Liquid Detergent 2L - ₹420.00
1 Vim Dishwash Liquid Gel 750ml - ₹155.00
1 Dettol Antiseptic Liquid 550ml - ₹210.00
1 Colgate Total Whitening Toothpaste 2pk - ₹245.00
1 Premier Kitchen Towel Tissue 4 Rolls - ₹180.00
1 Stainless Steel Kitchen Storage Container - ₹340.00
1 Borosil Glass Water Bottle 1L - ₹420.00
GST / Taxes: ₹180.00
Total Amount Paid: ₹2,150.00`,
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setInputText('');
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const parseReceipt = async (textToParse?: string) => {
    setLoading(true);
    setError(null);
    setAppliedSuccess(false);

    try {
      const payload: any = {};
      if (selectedImage) {
        payload.imageBase64 = selectedImage;
      } else {
        payload.text = textToParse || inputText;
      }

      const res = await fetch('/api/ai/parse-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse receipt.');
      }

      setParsedResult(data.data);
    } catch (err: any) {
      setError(err?.message || 'Error parsing receipt. Please check your text or image.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToBudget = () => {
    if (!parsedResult) return;
    onApplyExpenseToBudget(parsedResult.category, parsedResult.totalAmount);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 4000);
  };

  return (
    <div className="py-12 bg-[#f8fafc] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Expense Categorizer & OCR
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a2540] tracking-tight">
              Receipt & Invoice AI Parser (Rupees)
            </h2>
            <p className="text-[#425466] text-base mt-1 max-w-2xl">
              Snap a photo of grocery bills (Blinkit, Zepto, D-Mart) or electricity tariffs. Gemini AI itemizes every SKU in Rupees (₹) and syncs directly into your active cost model.
            </p>
          </div>

          {/* Preset Sample Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Test Samples:</span>
            {sampleReceipts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImage(null);
                  setInputText(sample.text);
                  parseReceipt(sample.text);
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 font-medium text-[#0a2540] transition-colors cursor-pointer"
              >
                {sample.category}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel (Left) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0a2540]">
                Input Receipt or Expense List
              </span>
              {selectedImage && (
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Clear Image
                </button>
              )}
            </div>

            {/* Drag & Drop / Image Picker Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                selectedImage
                  ? 'border-[#635bff] bg-indigo-50/30'
                  : 'border-slate-300 hover:border-[#635bff] hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {selectedImage ? (
                <div className="space-y-2">
                  <img
                    src={selectedImage}
                    alt="Uploaded Receipt"
                    className="max-h-48 mx-auto rounded-lg shadow-xs object-contain border border-slate-200"
                  />
                  <p className="text-xs font-semibold text-[#635bff]">
                    Image ready for AI analysis. Click to change.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 text-[#635bff] flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#0a2540] block">
                      Upload bill photo or drop image here
                    </span>
                    <span className="text-xs text-[#64748b]">
                      Supports PNG, JPG, or phone camera snapshots
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Or Paste Raw Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748b] mb-1.5">
                Or Paste Line Items / Expense Text (₹)
              </label>
              <textarea
                rows={5}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setSelectedImage(null);
                }}
                placeholder="Paste store bill, Zepto order breakdown, or UPI statement lines..."
                className="w-full p-3 text-xs font-mono text-[#0a2540] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]/30"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={() => parseReceipt()}
              disabled={loading || (!inputText.trim() && !selectedImage)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-[#635bff] hover:bg-[#544dc9] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini 3.8 Extracting Rupee SKUs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Categorize & Extract Insights (₹)</span>
                </>
              )}
            </button>
          </div>

          {/* Parsed Output Card (Right) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 stripe-card-glow min-h-[460px] flex flex-col justify-between">
            {parsedResult ? (
              <div className="space-y-5">
                
                {/* Header info */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#635bff] bg-indigo-50 px-2 py-0.5 rounded">
                      {parsedResult.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-[#0a2540] mt-1">
                      {parsedResult.merchant || 'Verified Merchant'}
                    </h3>
                    <p className="text-xs text-slate-400">Date: {parsedResult.date || 'Recent'}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400 block">Total Spend</span>
                    <span className="text-3xl font-black text-[#0a2540]">
                      {formatINR(parsedResult.totalAmount)}
                    </span>
                    {parsedResult.taxAmount ? (
                      <span className="text-[11px] text-slate-400 block">
                        GST: {formatINR(parsedResult.taxAmount)}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Itemized Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-2.5">
                    Extracted Line Items ({parsedResult.items?.length || 0})
                  </h4>
                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
                    {parsedResult.items?.map((item, i) => (
                      <div key={i} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#635bff]" />
                          <span className="font-semibold text-[#0a2540]">{item.name}</span>
                          <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-100">
                            {item.category}
                          </span>
                        </div>
                        <span className="font-bold text-[#0a2540]">{formatINR(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inflation Saving Insights */}
                {parsedResult.inflationInsights?.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-100 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-pink-900">
                      <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                      <span>Smart Inflation Mitigation Tips</span>
                    </div>
                    <ul className="list-disc list-inside text-pink-950 space-y-1 text-[11px] leading-relaxed">
                      {parsedResult.inflationInsights.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Apply Button */}
                <div className="pt-2">
                  <button
                    onClick={handleApplyToBudget}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Apply {formatINR(parsedResult.totalAmount)} to Monthly {parsedResult.category}</span>
                  </button>

                  {appliedSuccess && (
                    <div className="mt-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 rounded-lg border border-emerald-200">
                      Updated! Your budget stress index has been recalculated.
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <Receipt className="w-14 h-14 mb-3 text-slate-300 stroke-[1.2]" />
                <h4 className="text-base font-bold text-[#0a2540] mb-1">
                  Ready to parse your expenditures
                </h4>
                <p className="text-xs text-[#64748b] max-w-sm">
                  Upload an image receipt or select one of the sample test bills above to see instant AI extraction in Rupees (₹).
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
