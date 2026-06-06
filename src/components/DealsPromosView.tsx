import React, { useState } from 'react';
import { Award, Gift, Sparkles, AlertTriangle, HelpCircle, Check, Copy } from 'lucide-react';

interface DealsPromosViewProps {
  onApplyCouponToActiveCart: (code: string, value: number, type: 'percentage' | 'fixed') => void;
}

export default function DealsPromosView({ onApplyCouponToActiveCart }: DealsPromosViewProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Spin-the-wheel state
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<{ code: string; label: string; value: number; type: 'percentage' | 'fixed' } | null>(null);
  const [appliedSpinCoupon, setAppliedSpinCoupon] = useState(false);

  const discountCoupons = [
    { code: 'STUDENT20', label: 'Student Discount Flat 20%', value: 20, type: 'percentage' as const, desc: 'Needs active student card from UON, Strathmore, USIU etc. 20% off whole cart.' },
    { code: 'KUKULOVE', label: '150/= Off Crispy Chicken Combo', value: 150, type: 'fixed' as const, desc: 'Flat deduction of KES 150 on any order worth 1200 KES and above.' },
    { code: 'WINGMAN50', label: '50% Off Wings Addition', value: 50, type: 'percentage' as const, desc: 'Half-off on Wings category purchase when combined with family baskets.' },
    { code: 'FREECHIPS', label: 'Masala Chips Complementary', value: 180, type: 'fixed' as const, desc: 'Subtracts cost of regular fries (180 KES) from your checkout total directly.' }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyNow = (item: typeof discountCoupons[0]) => {
    onApplyCouponToActiveCart(item.code, item.value, item.type);
    alert(`Success! Coupon "${item.code}" has been attached to your checkout pipeline.`);
  };

  const spinWheelRewards = [
    { label: 'Free Masala Splash!', code: 'MASALAFREE', value: 320, type: 'fixed' as const },
    { label: '15% Off Total Order!', code: 'CHEF-SECRET', value: 15, type: 'percentage' as const },
    { label: 'Surprise 100/= Off!', code: 'NAI-AI-100', value: 100, type: 'fixed' as const },
    { label: 'Royal Treatment 10% Off!', code: 'ROYAL10', value: 10, type: 'percentage' as const },
    { label: '25% Mega Hunger Relief!', code: 'MEGADEAL25', value: 25, type: 'percentage' as const },
    { label: 'Free Regular Gold Chips!', code: 'FREECHIPS', value: 180, type: 'fixed' as const }
  ];

  const triggerLuckySpin = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);
    setAppliedSpinCoupon(false);

    // Simulate 2 seconds beautiful spin delay
    setTimeout(() => {
      const luckyIndex = Math.floor(Math.random() * spinWheelRewards.length);
      const outcome = spinWheelRewards[luckyIndex];
      setSpinResult(outcome);
      setSpinning(false);
    }, 2000);
  };

  const handleApplySpinCoupon = () => {
    if (!spinResult) return;
    onApplyCouponToActiveCart(spinResult.code, spinResult.value, spinResult.type);
    setAppliedSpinCoupon(true);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Dynamic Animated Promo Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-red-700 via-amber-600 to-red-900 p-6 sm:p-10 border border-amber-400/20 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] [background-size:250px_250px] animate-[pulse_5s_infinite] pointer-events-none"></div>
        <div className="space-y-3 relative shrink max-w-xl">
          <span className="bg-yellow-400 text-black font-extrabold px-3 py-1 rounded text-[10px] tracking-widest uppercase">
            Limited Friday Offers • Nairobi Only
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white leading-none tracking-tight">
            Nairobi Chicken <br/>Feast Bonanza!
          </h2>
          <p className="text-white/80 text-sm max-w-md font-sans">
            Get an additional 2 free pieces of original crispy chicken on any order values above 1,500 KES. Use active checkout codes or play our lucky spin box!
          </p>
        </div>

        {/* Big visual deal card */}
        <div className="relative flex-shrink-0 bg-black/40 border border-white/20 p-5 rounded-2xl rotate-2 hover:rotate-0 transition-transform duration-300 max-w-xs text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-400 block mb-1">Double Value Spec</span>
          <p className="text-2xl font-black text-white uppercase">WEEKLY STUDENT MEAL</p>
          <div className="text-3xl font-black text-red-500 font-mono my-2">KES 490 /=</div>
          <p className="text-[10px] text-gray-400">Streetwise 2 + carbonated soda (350ml)</p>
          <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white rotate-12">
            HOT!
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Grid: Active Promo Codes */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Gift className="w-5 h-5 text-red-500" />
              Nairobi Active Coupons
            </h3>
            <span className="text-xs font-bold text-gray-500">Click to load</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {discountCoupons.map((item) => {
              const isCopied = copiedCode === item.code;
              return (
                <div 
                  key={item.code} 
                  className="bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 hover:border-white/10 rounded-xl p-4.5 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-extrabold uppercase font-mono bg-red-650/15 border border-[#E4002B]/30 px-2 py-0.5 rounded text-[#E4002B]">
                        {item.code}
                      </span>
                      <span className="text-xs text-white font-bold">{item.label}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans max-w-md">{item.desc}</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(item.code)}
                      className="p-2 rounded bg-neutral-800 border border-white/15 text-gray-400 hover:text-white hover:bg-neutral-700 transition"
                      title="Copy Coupon Code"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyNow(item)}
                      className="px-3.5 py-1.5 bg-neutral-800 hover:bg-[#E4002B] hover:text-white text-gray-300 rounded text-[11px] font-black uppercase transition-all"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-orange-650/5 border border-orange-500/10 text-orange-400 text-xs flex gap-3">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
            <div className="space-y-1 font-sans">
              <p className="font-bold uppercase tracking-wider">M-Pesa Multi-Offer Rules:</p>
              <p>Coupons do not combine with existing combo discounts directly unless noted by AI Chef. Maximum one coupon evaluated at checkout portal.</p>
            </div>
          </div>
        </div>

        {/* Right Grid: Interactive Spin-The-Wheel Mini Game */}
        <div className="lg:col-span-6">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 shadow-2xl relative text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-500 text-[10px] font-bold tracking-widest uppercase">
              Loyalty Rewards Game
            </span>
            <h3 className="text-2xl font-black uppercase text-white mt-2.5">
              Lucky Chicken <span className="text-[#E4002B]">Spin-The-Wheel</span>
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 max-w-sm mx-auto font-sans">
              Play our virtual fortune box. Win flat KES coupons or free masala wings, copy code, and submit directly at order confirmation!
            </p>

            {/* Simulated Wheel visual box */}
            <div className="my-8 relative flex justify-center">
              
              {/* Spinning circular container */}
              <div className={`w-52 h-52 rounded-full border-4 border-neutral-700 bg-neutral-900 relative shadow-2xl flex items-center justify-center transition-transform duration-[2000ms] ease-out ${
                spinning ? 'rotate-[1440deg]' : 'rotate-0'
              }`}>
                {/* Visual grid sectors */}
                <div className="absolute inset-0 border-t border-b border-white/10 rounded-full rotate-45"></div>
                <div className="absolute inset-0 border-t border-b border-white/10 rounded-full -rotate-45"></div>
                <div className="absolute inset-0 border-l border-r border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-l border-r border-white/10 rounded-full rotate-90"></div>
                
                {/* Text hints at sectors */}
                <span className="absolute top-3 text-[8px] font-bold text-gray-500 uppercase font-mono">15% OFF</span>
                <span className="absolute bottom-3 text-[8px] font-bold text-[#E4002B] uppercase font-mono">FREE FRYS</span>
                <span className="absolute left-3 text-[8px] font-bold text-amber-500 uppercase font-mono">100/= OFF</span>
                <span className="absolute right-3 text-[8px] font-bold text-emerald-500 uppercase font-mono">WINGS</span>

                {/* Secret inner core dial */}
                <div className="w-16 h-16 rounded-full bg-black border-2 border-[#E4002B] flex items-center justify-center z-10 shadow-lg">
                  <span className="font-black text-white text-xs select-none">KFC</span>
                </div>
              </div>

              {/* Pin indicator pointer of the wheel at top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 bg-red-600 clip-triangle z-20 shadow-lg border border-white/20"></div>

              {/* Spin blocker text if spinning */}
              {spinning && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center rounded-2xl z-20">
                  <span className="animate-bounce font-black text-yellow-400 text-sm tracking-widest uppercase">
                    🍗 Rolling the spices... 🍗
                  </span>
                </div>
              )}
            </div>

            {/* Spin CTA Button */}
            <button
              type="button"
              onClick={triggerLuckySpin}
              disabled={spinning}
              className="w-full py-3.5 bg-gradient-to-r from-[#E4002B] to-amber-600 hover:from-red-600 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-900/40 cursor-pointer disabled:opacity-50"
            >
              Spin Fortune Wheel (Free Play)
            </button>

            {/* Spin results box */}
            {spinResult && (
              <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl animate-fade-in space-y-3">
                <p className="text-xs uppercase font-bold text-gray-400">🎉 Congratulations Nairobi Local! You won:</p>
                
                <div>
                  <h4 className="text-xl font-extrabold text-[#E4002B] uppercase tracking-wide">
                    {spinResult.label}
                  </h4>
                  <div className="flex justify-center items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-gray-500 font-mono">Coupon Code:</span>
                    <span className="px-2 py-0.5 bg-neutral-900 border border-white/10 text-white font-mono font-bold uppercase rounded text-xs select-all">
                      {spinResult.code}
                    </span>
                  </div>
                </div>

                {!appliedSpinCoupon ? (
                  <button
                    type="button"
                    onClick={handleApplySpinCoupon}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold uppercase rounded-lg tracking-wide transition cursor-pointer"
                  >
                    Auto-Apply This Reward Code Now!
                  </button>
                ) : (
                  <p className="text-xs text-emerald-500 font-bold flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" />
                    Coupon linked to your active Checkout pipeline!
                  </p>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
