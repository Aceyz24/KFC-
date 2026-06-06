import React, { useState } from 'react';
import { Sparkles, DollarSign, Smile, Flame, CheckCircle, Plus } from 'lucide-react';
import { MenuItem, AIRecommendationRequest, AIRecommendationResponse } from '../types';

interface AIPredictionWidgetProps {
  menuItems: MenuItem[];
  onAddSpecialCombo: (items: MenuItem[], discountCode: string, discountPct: number) => void;
}

export default function AIPredictionWidget({ menuItems, onAddSpecialCombo }: AIPredictionWidgetProps) {
  const [budget, setBudget] = useState<number>(1000);
  const [dietary, setDietary] = useState<AIRecommendationRequest['dietary']>('none');
  const [hunger, setHunger] = useState<AIRecommendationRequest['hungerLevel']>('medium');
  const [mood, setMood] = useState<AIRecommendationRequest['mood']>('comfort');
  
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addedComboAlert, setAddedComboAlert] = useState(false);

  const triggerRecommendation = async () => {
    setLoading(true);
    setErrorMsg(null);
    setRecommendation(null);
    setAddedComboAlert(false);

    try {
      const response = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budgetKES: budget,
          dietary,
          hungerLevel: hunger,
          mood,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.recommendation) {
        setRecommendation(resData.recommendation);
      } else {
        throw new Error(resData.error || 'Failed to fetch custom recommendations.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not fetch recommendations. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // Resolve recommended item details from catalog of active items
  const resolvedItems = recommendation
    ? menuItems.filter(item => recommendation.recommendedItemIds.includes(item.id))
    : [];

  const handleAddResolvedToCart = () => {
    if (resolvedItems.length === 0) return;
    const code = `AI-CHEF-${Math.floor(10 + Math.random() * 90)}`;
    const discount = recommendation?.discountAppliedPercentage || 10;
    
    onAddSpecialCombo(resolvedItems, code, discount);
    setAddedComboAlert(true);
    setTimeout(() => {
      setAddedComboAlert(false);
    }, 4500);
  };

  // Quick preset clicks
  const applyPreset = (presetBudget: number, presetHunger: typeof hunger, presetDiet: typeof dietary) => {
    setBudget(presetBudget);
    setHunger(presetHunger);
    setDietary(presetDiet);
  };

  return (
    <div id="ai-planner-widget" className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 px-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-bold tracking-widest uppercase">
              Gemini 3.5-Flash
            </span>
            <span className="flex items-center gap-1 text-red-500 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              Live AI Planner
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Nairobi Chef <span className="text-[#E4002B]">AI Recommendation</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1 max-w-xl">
            Input your budget and hunger specs. Our real-time neural planner will handcraft an optimized food pairing with a custom discount!
          </p>
        </div>
        
        {/* Quick presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <button 
            type="button"
            onClick={() => applyPreset(490, 'snack', 'none')}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold hover:bg-white/10 transition text-neutral-300"
          >
            Quick 490 KES Snack
          </button>
          <button 
            type="button"
            onClick={() => applyPreset(1500, 'medium', 'spicy-lover')}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold hover:bg-white/10 transition text-neutral-300"
          >
            Spicy Hot Selection (1,500/=)
          </button>
          <button 
            type="button"
            onClick={() => applyPreset(3500, 'starving', 'none')}
            className="px-3 py-1.5 rounded-full bg-[#E4002B]/10 border border-[#E4002B]/30 text-[11px] font-bold hover:bg-[#E4002B]/20 transition text-red-400"
          >
            Mega Family Bucket Deal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Parameters Box */}
        <div className="lg:col-span-5 space-y-5 bg-[#080808]/80 p-5 rounded-xl border border-white/5">
          
          {/* Budget Input Slider & Box */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                Max Budget (KES)
              </label>
              <span className="text-lg font-black font-mono text-amber-500">
                {budget.toLocaleString()} /=
              </span>
            </div>
            <input 
              type="range" 
              min={300} 
              max={6000} 
              step={50}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#E4002B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-600 font-mono mt-0.5">
              <span>300 KES</span>
              <span>2,000 KES</span>
              <span>4,000 KES</span>
              <span>6,000 KES</span>
            </div>
          </div>

          {/* Hunger Level Selection */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">
              How hungry are you?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'snack', label: 'Snack Bit', desc: 'Mild pairing' },
                { value: 'medium', label: 'Average', desc: 'Standard meal' },
                { value: 'starving', label: 'Starving!', desc: 'Buckets/Feasts' }
              ].map((lvl) => (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setHunger(lvl.value as any)}
                  className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                    hunger === lvl.value 
                      ? 'bg-red-600 border-red-500 text-white font-black' 
                      : 'bg-neutral-900 border-white/10 hover:bg-neutral-800 text-gray-300'
                  }`}
                >
                  <span className="text-xs">{lvl.label}</span>
                  <span className={`text-[8px] mt-0.5 opacity-60 ${hunger === lvl.value ? 'text-white' : 'text-gray-500'}`}>{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              Dietary Profile
            </label>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value as any)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-sm text-gray-200 outline-none focus:border-[#E4002B] transition-colors"
            >
              <option value="none">No Restrictions (All Sizzling Favorites)</option>
              <option value="spicy-lover">Spicy-Lover 🔥 (Nairobi Peri Peri Style)</option>
              <option value="halal">Halal Sourced Chicken Only (100% Certified)</option>
              <option value="vegetarian">Vegetarian Friendly Chips / Drinks & Sweets</option>
            </select>
          </div>

          {/* Target Mood */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-amber-500" />
              What mood is this?
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { value: 'comfort', label: 'Classic Comfort' },
                { value: 'adventure', label: 'Nairobi Masala Run' },
                { value: 'family-deal', label: 'Sharing Feast' },
                { value: 'classic', label: 'Original Recipe' }
              ].map((md) => (
                <button
                  key={md.value}
                  type="button"
                  onClick={() => setMood(md.value as any)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    mood === md.value 
                      ? 'bg-amber-600 border-amber-500 text-white font-bold' 
                      : 'bg-neutral-900 border-white/10 hover:bg-neutral-800 text-gray-300'
                  }`}
                >
                  {md.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={triggerRecommendation}
            disabled={loading}
            className="w-full py-4.5 bg-gradient-to-r from-[#E4002B] to-amber-600 hover:from-[#c30025] hover:to-amber-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer border border-amber-400/20 disabled:opacity-55"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Flavours & Cooking Recipes...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                Generate My Custom Recommendation
              </>
            )}
          </button>
        </div>

        {/* Output Outcome Results Box */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#080808]/40 border border-white/5 rounded-xl p-5 relative min-h-[350px]">
          
          {!loading && !recommendation && !errorMsg && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Ready for AI Chef Magic</h3>
              <p className="text-gray-500 text-xs mt-2 max-w-sm">
                Set your budget (e.g. 1500 KES) and click generates. Our neural engine will match your local hunger with crispy gold outcomes.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-red-600/25"></div>
                <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-500/50 animate-pulse"></div>
              </div>
              <p className="text-sm font-bold tracking-widest text-[#E4002B] uppercase animate-pulse">
                Consulting Secret 11 Herbs & Spices...
              </p>
              <p className="text-[11px] text-gray-500 mt-1">Configuring prices in KES, calculating calories & surprise rewards.</p>
            </div>
          )}

          {errorMsg && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-red-400">
              <span className="text-3xl mb-3">⚠️</span>
              <p className="text-sm font-bold">{errorMsg}</p>
              <button 
                onClick={triggerRecommendation}
                className="mt-4 px-4 py-2 bg-neutral-900 border border-white/10 text-xs rounded hover:bg-neutral-800 transition text-white"
              >
                Retry
              </button>
            </div>
          )}

          {recommendation && resolvedItems.length > 0 && (
            <div className="flex-1 flex flex-col justify-between gap-6">
              
              {/* Header result */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-widest uppercase text-amber-500 font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    Special Customized Combo
                  </span>
                  
                  {recommendation.discountAppliedPercentage && (
                    <span className="px-2.5 py-1 bg-[#E4002B] text-white text-[11px] font-black rounded-full animate-bounce">
                      🎁 SURPRISE -{recommendation.discountAppliedPercentage}% OFF!
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-white uppercase tracking-tight line-clamp-1 border-b border-white/5 pb-2">
                  {recommendation.comboOfferDescription || 'The Nairobi Neural Combo Deal'}
                </h3>

                <p className="text-xs text-gray-300 italic leading-relaxed mt-3 bg-white/5 p-3.5 rounded-lg border-l-2 border-[#E4002B] font-sans">
                  " {recommendation.reasoning} "
                </p>
              </div>

              {/* Items recommended cards */}
              <div>
                <h4 className="text-[11px] font-black uppercase text-gray-500 mb-3 tracking-widest">Included Food Selection:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resolvedItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-3 bg-neutral-900/90 p-3 rounded-lg border border-white/5 text-left"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 rounded object-cover border border-white/10 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate uppercase">{item.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.category}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-[#E4002B]">{item.price} KES</span>
                          <span className="text-[9px] text-gray-600 font-mono">{item.calories} kcal</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons & stats summary */}
              <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Estimated Combo Total:</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-mono text-white">
                      {(resolvedItems.reduce((acc, current) => acc + current.price, 0) * (1 - (recommendation.discountAppliedPercentage || 10) / 100)).toFixed(0)} KES
                    </span>
                    <span className="text-xs line-through text-gray-600 font-mono">
                      {resolvedItems.reduce((acc, current) => acc + current.price, 0)} KES
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleAddResolvedToCart}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-[#E4002B] hover:bg-[#c30025] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Apply Discount & Load Combo to Cart
                  </button>
                </div>
              </div>

              {addedComboAlert && (
                <div className="absolute inset-x-0 bottom-2 mx-4 p-3 bg-emerald-600 text-white rounded-lg flex items-center gap-2 text-xs font-bold animate-fade-in shadow-xl z-10 justify-center">
                  <CheckCircle className="w-4.5 h-4.5 animate-bounce" />
                  <span>Combo items queued! Surprise discount applied at checkout checkout portal! Yay!</span>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
