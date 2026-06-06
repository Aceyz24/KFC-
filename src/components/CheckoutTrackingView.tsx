import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Trash2, ShieldCheck, MapPin, Truck, HelpCircle, Navigation, Landmark, DollarSign, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { CartItem, Coupon, Branch, OrderDetails } from '../types';

interface CheckoutTrackingViewProps {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  onAddToCart: (item: any) => void;
  onRemoveOneFromCart: (item: any) => void;
  onClearCart: () => void;
  activeCoupon: Coupon | null;
  onRemoveActiveCoupon: () => void;
  onApplyCouponCode: (code: string, value: number, type: 'percentage' | 'fixed') => void;
  nairobiBranches: Branch[];
}

export default function CheckoutTrackingView({
  cart,
  isCartOpen,
  setIsCartOpen,
  onAddToCart,
  onRemoveOneFromCart,
  onClearCart,
  activeCoupon,
  onRemoveActiveCoupon,
  onApplyCouponCode,
  nairobiBranches
}: CheckoutTrackingViewProps) {
  
  // Checkout & Payment screen statuses
  const [checkoutActive, setCheckoutActive] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<OrderDetails | null>(null);

  // STK Prompt Overlay simulation
  const [mPesaPromptActive, setMPesaPromptActive] = useState(false);
  const [mPesaInputPin, setMPesaInputPin] = useState('');
  const [mPesaErrorMsg, setMPesaErrorMsg] = useState('');

  // Checkout forms state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [preferredBranch, setPreferredBranch] = useState(nairobiBranches[0].name);
  const [paymentOption, setPaymentOption] = useState<'mpesa' | 'visa' | 'mastercard'>('mpesa');
  
  // Coupon inputs states inside checkout
  const [couponField, setCouponField] = useState('');
  const [checkoutSubmitLoading, setCheckoutSubmitLoading] = useState(false);

  // Calculate fees
  const subtotal = cart.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
  
  let discountValue = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discountValue = Math.floor(subtotal * (activeCoupon.value / 100));
    } else {
      discountValue = activeCoupon.value;
    }
  }

  const deliveryFee = deliveryMethod === 'delivery' ? 150 : 0;
  const netTotal = Math.max(0, subtotal - discountValue + deliveryFee);

  // Form Coupon quick application click
  const handleCheckoutPromoApply = (e: React.FormEvent) => {
    e.preventDefault();
    const upCode = couponField.trim().toUpperCase();
    if (!upCode) return;

    if (upCode === 'STUDENT20') onApplyCouponCode('STUDENT20', 20, 'percentage');
    else if (upCode === 'KUKULOVE') onApplyCouponCode('KUKULOVE', 150, 'fixed');
    else if (upCode === 'WINGMAN50') onApplyCouponCode('WINGMAN50', 50, 'percentage');
    else if (upCode === 'FREECHIPS') onApplyCouponCode('FREECHIPS', 180, 'fixed');
    else {
      // Create surprise random
      onApplyCouponCode(upCode, 10, 'percentage');
      alert(`Coupon "${upCode}" evaluated and approved! 10% surprise discount attached.`);
    }
    setCouponField('');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert('Kindly fill in your Name and Contact Phone Number to continue!');
      return;
    }
    setCheckoutSubmitLoading(true);

    const payload = {
      customerName,
      phone,
      email,
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
      branch: preferredBranch,
      items: cart,
      subtotal,
      discount: discountValue,
      deliveryFee,
      total: netTotal,
      paymentMethod: paymentOption
    };

    try {
      const response = await fetch('/api/order/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success && data.order) {
        const freshOrder = data.order;
        
        // Save database backups dynamically on client side for the Admin Dashboard to read
        const existingOrdersStr = localStorage.getItem('kfc_nairobi_all_orders') || '[]';
        const existingOrders = JSON.parse(existingOrdersStr);
        existingOrders.unshift(freshOrder);
        localStorage.setItem('kfc_nairobi_all_orders', JSON.stringify(existingOrders));

        if (paymentOption === 'mpesa') {
          // Trigger the immersive dialing PIN STK push simulator
          setPlacedOrder(freshOrder);
          setMPesaPromptActive(true);
        } else {
          // Direct completion
          setPlacedOrder(freshOrder);
          onClearCart();
          setCheckoutActive(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Payment dispatch timed out. Re-routing dispatch parameters.');
    } finally {
      setCheckoutSubmitLoading(false);
    }
  };

  // Dial Keypad PIN pushes
  const pushPinDigit = (num: string) => {
    if (mPesaInputPin.length < 4) {
      setMPesaInputPin(prev => prev + num);
      setMPesaErrorMsg('');
    }
  };

  const clearLastPinDigit = () => {
    setMPesaInputPin(prev => prev.slice(0, -1));
  };

  const handleAuthorizeMPesaSTK = () => {
    if (mPesaInputPin.length < 4) {
      setMPesaErrorMsg('Kindly input a 4-digit PIN code to secure authorize payment.');
      return;
    }
    
    // Simulate payment authorizing lock
    setCheckoutSubmitLoading(true);
    setTimeout(() => {
      setMPesaPromptActive(false);
      setMPesaInputPin('');
      setCheckoutSubmitLoading(false);
      
      // Update local storage order to 'preparing' immediately
      if (placedOrder) {
        const finalOrder = { ...placedOrder, status: 'preparing' as const };
        setPlacedOrder(finalOrder);
        
        // Sync back orders database
        const raw = localStorage.getItem('kfc_nairobi_all_orders') || '[]';
        const parsed = JSON.parse(raw);
        const mapped = parsed.map((o: any) => o.id === placedOrder.id ? { ...o, status: 'preparing' } : o);
        localStorage.setItem('kfc_nairobi_all_orders', JSON.stringify(mapped));

        // Push update to server
        fetch(`/api/order/track/${placedOrder.id}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'preparing' })
        }).catch(console.warn);
      }
      onClearCart();
      setCheckoutActive(false);
    }, 1800);
  };

  // Countdown timer simulation hook inside placedOrder live status
  useEffect(() => {
    if (!placedOrder) return;
    
    // Periodically fetch updated order details from server (CMS tracker) so when admin updates, it reflects here!
    const trackInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/track/${placedOrder.id}`);
        const data = await res.json();
        if (data.success && data.order) {
          setPlacedOrder(data.order);
        }
      } catch (e) {
        // Fallback simulate countdown decrement values
        setPlacedOrder(prev => {
          if (!prev) return null;
          if (prev.etaMinutes > 2) {
            return { ...prev, etaMinutes: prev.etaMinutes - 1 };
          }
          return prev;
        });
      }
    }, 6000);

    return () => clearInterval(trackInterval);
  }, [placedOrder?.id]);

  return (
    <div className="text-left">
      
      {/* 1. Shopping Drawer Panel Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            
            {/* Dark back backdrop */}
            <div 
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            ></div>

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col bg-[#0b0c0d] border-l border-white/10 shadow-2xl text-white">
                  
                  {/* Header Drawer */}
                  <div className="px-5 py-6 bg-neutral-900 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#E4002B]" />
                      <h2 className="text-lg font-black uppercase tracking-wide">Your Sizzling Box</h2>
                    </div>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="p-1 rounded hover:bg-neutral-800 text-gray-500 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Cart Item lists */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {cart.length === 0 ? (
                      <div className="py-24 text-center text-gray-500 space-y-3 font-sans">
                        <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto" />
                        <p className="text-sm font-bold">Your ordering box is empty.</p>
                        <p className="text-xs max-w-xs mx-auto">Explore our Nairobi menu list and add crispy original piece combinations to get started.</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.menuItem.id} className="flex items-center justify-between gap-3 bg-[#0f1011] p-3 rounded-xl border border-white/5">
                          <img 
                            src={item.menuItem.image} 
                            alt={item.menuItem.name} 
                            className="w-12 h-12 object-cover rounded border border-white/10 shrink-0" 
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black uppercase truncate">{item.menuItem.name}</h4>
                            <p className="text-[10px] text-gray-500 mt-1">{item.menuItem.price} /= x {item.quantity}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Minus / Plus */}
                            <button 
                              onClick={() => onRemoveOneFromCart(item.menuItem)}
                              className="px-2 py-1 bg-neutral-900 border border-white/5 rounded text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-black font-mono">{item.quantity}</span>
                            <button 
                              onClick={() => onAddToCart(item.menuItem)}
                              className="px-2 py-1 bg-neutral-900 border border-white/5 rounded text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer calculations & checkout actions */}
                  {cart.length > 0 && (
                    <div className="border-t border-white/10 bg-neutral-900/90 p-5 space-y-4">
                      
                      {/* Attached active coupon banner */}
                      {activeCoupon ? (
                        <div className="bg-emerald-650/15 border border-emerald-500/25 p-3 rounded-lg flex items-center justify-between text-emerald-400 text-xs">
                          <div className="flex items-center gap-1.5 uppercase font-mono text-[10px]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Coupon applied: <strong>{activeCoupon.code}</strong> (-{discountValue} KES)</span>
                          </div>
                          <button onClick={onRemoveActiveCoupon} className="p-1 hover:bg-neutral-800 text-gray-500 rounded">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest leading-none">
                          Surprise coupon reward? Apply on Checkout form next!
                        </p>
                      )}

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-gray-400 font-sans">
                          <span>Box Subtotal:</span>
                          <span className="font-mono text-white">{subtotal.toLocaleString()} KES</span>
                        </div>
                        {activeCoupon && (
                          <div className="flex justify-between text-emerald-500 font-sans">
                            <span>Bonus Discount Applied:</span>
                            <span className="font-mono">-{discountValue.toLocaleString()} KES</span>
                          </div>
                        )}
                        <div className="border-t border-white/5 pt-1.5 flex justify-between text-sm font-bold">
                          <span>Total Box Value:</span>
                          <span className="font-mono text-[#E4002B]">{netTotal.toLocaleString()} KES</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setCheckoutActive(true);
                        }}
                        className="w-full py-4 bg-[#E4002B] hover:bg-[#c30025] text-white text-xs font-black uppercase tracking-widest rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-900/20"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Proceed to Secure Checkout
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Unified Extended Checkout Form Screen overlay */}
      {checkoutActive && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md overflow-y-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-[#0d0c0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white">
            
            {/* Header Form */}
            <div className="bg-neutral-900 px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase text-white tracking-tight">Checkout Portal</h3>
                <p className="text-xs text-gray-400">Secure delivery logistics and mobile money integrations</p>
              </div>
              <button 
                onClick={() => setCheckoutActive(false)}
                className="p-1 rounded hover:bg-neutral-800 text-gray-505"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-6">
              
              {/* Checkout details grid */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-black text-[#E4002B] border-b border-white/5 pb-1 tracking-widest">
                  1. Contact Customer File
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase">Full Names</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Victor Omondi"
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase">Contact Mobile Number</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0712345678"
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Logistics selector */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-black text-[#E4002B] border-b border-white/5 pb-1 tracking-widest">
                  2. Delivery Dispatch Location
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs uppercase">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center justify-center gap-1 transition ${
                      deliveryMethod === 'delivery' 
                        ? 'bg-red-650/15 border-[#E4002B] text-white' 
                        : 'bg-neutral-900 border-white/5 text-gray-500 hover:text-white'
                    }`}
                  >
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>Nairobi Delivery (+150/=)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center justify-center gap-1 transition ${
                      deliveryMethod === 'pickup' 
                        ? 'bg-red-650/15 border-[#E4002B] text-white' 
                        : 'bg-neutral-900 border-white/5 text-gray-500 hover:text-white'
                    }`}
                  >
                    <Navigation className="w-4 h-4 shrink-0" />
                    <span>In-Store Pick-up</span>
                  </button>
                </div>

                {deliveryMethod === 'delivery' ? (
                  <div className="text-xs font-sans">
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase">Specific Physical Address (Nairobi Settle Route)</label>
                    <textarea
                      rows={2}
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Woodvale Grove Apt 4B, Westlands, behind Galleria Mall Karen..."
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white"
                    ></textarea>
                  </div>
                ) : (
                  <div className="text-xs font-sans">
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase">Pick Up Outlet Branch</label>
                    <select
                      value={preferredBranch}
                      onChange={(e) => setPreferredBranch(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white"
                    >
                      {nairobiBranches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Payment integrations options */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-black text-[#E4002B] border-b border-white/5 pb-1 tracking-widest">
                  3. Secure M-Pesa & Card Integration
                </h4>

                <div className="grid grid-cols-3 gap-3 text-[10px] uppercase font-bold">
                  {[
                    { key: 'mpesa', label: 'SAFARICOM M-PESA', icon: Landmark, color: 'text-emerald-500' },
                    { key: 'visa', label: 'VISA DEBIT', icon: DollarSign, color: 'text-blue-500' },
                    { key: 'mastercard', label: 'MASTERCARD CREDIT', icon: DollarSign, color: 'text-orange-500' }
                  ].map((pay) => (
                    <button
                      key={pay.key}
                      type="button"
                      onClick={() => setPaymentOption(pay.key as any)}
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition text-center ${
                        paymentOption === pay.key 
                          ? 'bg-red-650/15 border-[#E4002B] text-white' 
                          : 'bg-neutral-900 border-white/5 text-gray-500 hover:text-white'
                      }`}
                    >
                      <pay.icon className={`w-4 h-4 shrink-0 ${pay.color}`} />
                      <span>{pay.label}</span>
                    </button>
                  ))}
                </div>

                {paymentOption === 'mpesa' && (
                  <div className="bg-emerald-650/10 border border-emerald-500/20 p-4 rounded-xl text-xs space-y-2 font-sans">
                    <p className="text-emerald-400 font-bold uppercase font-mono text-[10px]">Lipa na M-Pesa STK Prompt Active:</p>
                    <p className="text-gray-300">
                      When you submit order, our Safaricom Lipa simulator triggers a dialing prompt overlay. Enter physical PIN to release the kitchen prepare.
                    </p>
                  </div>
                )}
              </div>

              {/* Coupon inputs inside checkout */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs uppercase font-black text-gray-400 font-sans">Apply Loyalty coupon code:</label>
                <div className="flex gap-2 font-sans">
                  <input
                    type="text"
                    value={couponField}
                    onChange={(e) => setCouponField(e.target.value)}
                    placeholder="Enter e.g. STUDENT20 or LUCKY result..."
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleCheckoutPromoApply}
                    className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded text-xs font-black uppercase transition"
                  >
                    Link Coupon
                  </button>
                </div>
              </div>

              {/* Order calculations summary box */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Sizzling items total:</span>
                  <span className="font-mono">{subtotal} KES</span>
                </div>
                {activeCoupon && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Discount applied ({activeCoupon.code}):</span>
                    <span className="font-mono">-{discountValue} KES</span>
                  </div>
                )}
                {deliveryMethod === 'delivery' && (
                  <div className="flex justify-between text-gray-400">
                    <span>Nairobi flat delivery courier dispatcher fee:</span>
                    <span className="font-mono">+150 KES</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-black uppercase">
                  <span>Net Total Due Paid:</span>
                  <span className="font-mono text-[#E4002B]">{netTotal} KES</span>
                </div>
              </div>

              {/* Submit triggers */}
              <button
                type="submit"
                disabled={checkoutSubmitLoading}
                className="w-full py-4 bg-[#E4002B] hover:bg-[#c30025] text-white rounded-xl text-xs font-black uppercase tracking-widest transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-red-900/30"
              >
                {checkoutSubmitLoading ? 'Configuring secure pipeline transaction...' : `Submit Order & Authorize ${netTotal} KES`}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* 3. Safaricom Lipa Na M-Pesa dial PIN Dial simulator prompt overlay */}
      {mPesaPromptActive && placedOrder && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-neutral-900 rounded-3xl border border-emerald-500/30 overflow-hidden shadow-2xl relative">
            
            {/* Header phone brand */}
            <div className="bg-emerald-600 p-4 text-center text-white space-y-1">
              <span className="text-[9px] font-mono tracking-widest uppercase text-white/80">SAFARICOM M-PESA SIMULATION</span>
              <h4 className="text-sm font-black uppercase tracking-wide">Enter M-Pesa PIN Prompt</h4>
            </div>

            <div className="p-6 space-y-6 text-center">
              
              <div>
                <p className="text-xs text-gray-300">Lipa na M-Pesa Online STK Push sent to:</p>
                <p className="text-base font-bold text-white font-mono mt-1">{placedOrder.phone || '07xxxxxxxx'}</p>
                
                <p className="text-xs text-gray-400 mt-3">Merchant: <strong className="text-white">KFC NAIROBI PORTAL</strong></p>
                <p className="text-xs text-gray-400">Amount: <strong className="text-emerald-400 text-sm">{placedOrder.total} /= KES</strong></p>
              </div>

              {/* PIN circles displays input mockup */}
              <div className="space-y-2">
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((pos) => {
                    const filled = mPesaInputPin.length > pos;
                    return (
                      <div 
                        key={pos}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          filled ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-neutral-500'
                        }`}
                      ></div>
                    );
                  })}
                </div>
                {mPesaErrorMsg ? (
                  <p className="text-[10px] text-red-400">{mPesaErrorMsg}</p>
                ) : (
                  <p className="text-[10px] text-gray-500">Security Encrypted Pin</p>
                )}
              </div>

              {/* Keypad dial grids */}
              <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto text-sm font-sans font-bold">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => pushPinDigit(digit)}
                    className="w-12 h-12 rounded-full bg-neutral-950 border border-white/5 hover:border-white/15 text-white flex items-center justify-center mx-auto transition cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                
                {/* Clear */}
                <button
                  type="button"
                  onClick={clearLastPinDigit}
                  className="w-12 h-12 rounded-full bg-neutral-950 border border-white/5 hover:border-red-500 text-red-500 text-[10px] flex items-center justify-center mx-auto transition cursor-pointer"
                >
                  DEL
                </button>
                
                {/* 0 digit */}
                <button
                  type="button"
                  onClick={() => pushPinDigit('0')}
                  className="w-12 h-12 rounded-full bg-neutral-950 border border-white/5 hover:border-white/10 text-white flex items-center justify-center mx-auto transition cursor-pointer"
                >
                  0
                </button>

                {/* Confirm */}
                <button
                  type="button"
                  onClick={handleAuthorizeMPesaSTK}
                  className="w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-[9px] font-black uppercase flex items-center justify-center mx-auto transition cursor-pointer"
                >
                  OK
                </button>
              </div>

              {/* Action buttons list */}
              <div className="pt-2 border-t border-white/5 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMPesaPromptActive(false);
                    setMPesaInputPin('');
                    // Fallback order to 'preparing' anyway so sandbox does not get fully blocked
                    onClearCart();
                    setCheckoutActive(false);
                  }}
                  className="w-1/2 py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-white/10 text-gray-400 rounded-lg text-xs font-bold uppercase transition"
                >
                  Cancel Pin
                </button>
                <button
                  type="button"
                  onClick={handleAuthorizeMPesaSTK}
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black uppercase tracking-wider transition"
                >
                  Simulate PIN
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 4. Live active Real-time Order Tracking milestones Screen */}
      {placedOrder && !checkoutActive && !isCartOpen && (
        <div id="live-order-tracker-pane" className="bg-[#0b0b0b] border border-[#E4002B]/15 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden my-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header tracking labels */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="p-1 px-2.5 rounded bg-red-650/15 border border-[#E4002B]/30 text-[#E4002B] text-[10px] font-bold tracking-widest uppercase">
                Active Live Sizzling Order Status
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1.5 font-mono">
                Order Reference: {placedOrder.id}
              </h3>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Dispatch Target: <strong>{placedOrder.customerName}</strong> • Selected Destination: <strong>{placedOrder.deliveryMethod === 'delivery' ? placedOrder.address : placedOrder.branch}</strong>
              </p>
            </div>

            {/* Timings ticker */}
            <div className="bg-neutral-900 border border-white/10 p-3 rounded-xl flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-500 shrink-0" />
              <div className="text-left font-mono">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider leading-none">Estimated Delivery ETA</p>
                <p className="text-lg font-black text-white leading-none mt-1">{placedOrder.etaMinutes} mins</p>
              </div>
            </div>
          </div>

          {/* Milestone visual progress indicator bar */}
          <div className="space-y-4 font-sans text-xs">
            <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest text-left">Pipeline Milestones Tracker:</h4>
            
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase relative">
              
              {/* Dash Connect path */}
              <div className="absolute top-3.5 left-[12%] right-[12%] h-[3px] bg-neutral-800 -z-10">
                {/* Active progress color fill */}
                <div 
                  className="h-full bg-[#E4002B] transition-all duration-700"
                  style={{
                    width: 
                      placedOrder.status === 'pending' || placedOrder.status === 'mpesa_prompt' ? '0%' :
                      placedOrder.status === 'preparing' ? '33%' :
                      placedOrder.status === 'in_transit' ? '66%' : '100%'
                  }}
                ></div>
              </div>

              {[
                { key: 'confirm', label: 'Paid & Approved', activeStates: ['pending', 'mpesa_prompt', 'preparing', 'in_transit', 'ready_for_pickup', 'delivered'] },
                { key: 'cook', label: 'Original Recipe Cooking', activeStates: ['preparing', 'in_transit', 'ready_for_pickup', 'delivered'] },
                { key: 'transit', label: placedOrder.deliveryMethod === 'delivery' ? 'Express Rider Flying' : 'Ready for Counter Pick-up', activeStates: ['in_transit', 'ready_for_pickup', 'delivered'] },
                { key: 'finish', label: 'Delivered successfully!', activeStates: ['delivered'] }
              ].map((step, sIdx) => {
                const isCompleted = step.activeStates.includes(placedOrder.status);
                return (
                  <div key={sIdx} className="space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-all ${
                      isCompleted 
                        ? 'bg-[#E4002B] border-2 border-white/20 text-white' 
                        : 'bg-neutral-900 text-gray-650 text-neutral-500 border border-white/5'
                    }`}>
                      {isCompleted ? '✓' : sIdx + 1}
                    </div>
                    <span className={isCompleted ? 'text-white' : 'text-gray-650 text-gray-500'}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sizzling moving courier bike simulation graphical section */}
          {placedOrder.deliveryMethod === 'delivery' && placedOrder.status !== 'delivered' && (
            <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 relative h-20 overflow-hidden flex items-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
              
              {/* Bike track line */}
              <div className="w-full h-1 bg-neutral-800 rounded-full relative">
                {/* Moving Bike symbol container */}
                <div 
                  className="absolute -top-4 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-[3000ms]"
                  style={{
                    left: 
                      placedOrder.status === 'pending' || placedOrder.status === 'mpesa_prompt' ? '10%' :
                      placedOrder.status === 'preparing' ? '35%' : '75%'
                  }}
                >
                  <span className="px-2 py-0.5 bg-[#E4002B] text-white font-mono text-[8px] rounded uppercase animate-bounce font-bold">
                    🏍️ COURIER
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E4002B] shadow-lg shadow-red-500 ring-2 ring-white"></div>
                </div>
              </div>

              {/* Courier coordinates hint bottom */}
              <span className="absolute bottom-1 right-3 text-[8px] font-mono text-gray-600">
                SPEED DISPATCH: 48KM/H VIA UHURU HIGHWAY
              </span>
            </div>
          )}

          {/* Success Delivered card */}
          {placedOrder.status === 'delivered' && (
            <div className="p-4 bg-emerald-650/10 border border-emerald-500/20 rounded-xl flex items-center gap-4 text-left animate-fade-in">
              <div className="h-10 w-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg shrink-0">
                ✓
              </div>
              <div>
                <h4 className="text-emerald-400 font-extrabold uppercase text-sm">Bon appetit! Order Delivered Successfully</h4>
                <p className="text-gray-300 text-xs mt-0.5">
                  Our dispatch rider marked this basket delivered. Thank you for dining with KFC Nairobi.
                </p>
              </div>
            </div>
          )}

          {/* Quick simulation advance controls helper info for users */}
          <div className="bg-neutral-900/60 p-4.5 rounded-xl border border-white/5 text-xs text-neutral-400 space-y-2">
            <h4 className="text-amber-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              How do I simulate dispatch progress?
            </h4>
            <p className="font-sans leading-relaxed text-gray-400">
              You can act as the delivery rider! Toggle the **Admin Mode (Shield Icon)** in the top navigation bar, navigate to **Monitor Live Orders**, and click the Status dropdown selector to advance milestones manually. Your progress screen below will sync live in real-time!
            </p>
          </div>

          {/* Order Details items summary */}
          <div className="text-left space-y-2.5 pt-2 border-t border-white/5 text-xs">
            <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Ordered Items Checklist:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
              {placedOrder.items?.map((item: any, idx: number) => (
                <div key={idx} className="bg-neutral-950 p-2.5 rounded border border-white/5 flex justify-between">
                  <span>{item.menuItem.name} x <strong>{item.quantity}</strong></span>
                  <span className="font-mono">{item.menuItem.price * item.quantity} KES</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPlacedOrder(null)}
            className="w-full py-2.5 bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            Dimiss Tracker Screen
          </button>
        </div>
      )}

    </div>
  );
}
