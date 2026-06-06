/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles, Navigation, Award, ChevronRight, Play, Heart, Star, MapPin } from 'lucide-react';
import { MenuItem, MenuItemCategory, CartItem, Coupon } from './types';
import { initialMenuItems, nairobiBranches, initialCareers } from './data';
import Header from './components/Header';
import MenuView from './components/MenuView';
import LocationsView from './components/LocationsView';
import CareersView from './components/CareersView';
import DealsPromosView from './components/DealsPromosView';
import AboutContactView from './components/AboutContactView';
import AdminCMSView from './components/AdminCMSView';
import CheckoutTrackingView from './components/CheckoutTrackingView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  
  // Cart, Coupons and Overlay States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Sync menu list dynamically from CMS Server
  const fetchMenuFromCMS = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      if (data.success && data.menu) {
        setMenuItems(data.menu);
      }
    } catch (e) {
      console.warn('Backend server CMS unavailable. Utilizing master defaults.', e);
    }
  };

  useEffect(() => {
    fetchMenuFromCMS();
  }, []);

  // Global Cart manipulators
  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === item.id);
      if (existing) {
        return prev.map(i => i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleRemoveOneFromCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === item.id);
      if (existing) {
        if (existing.quantity === 1) {
          return prev.filter(i => i.menuItem.id !== item.id);
        }
        return prev.map(i => i.menuItem.id === item.id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  // Add Special Custom combo from AI prediction to shopping list
  const handleAddAIComboToCart = (comboItems: MenuItem[], codeStr: string, discountPct: number) => {
    comboItems.forEach(item => {
      handleAddToCart(item);
    });
    // Set coupon
    setActiveCoupon({
      code: codeStr,
      discountType: 'percentage',
      value: discountPct
    });
  };

  const handleApplyCouponToCart = (code: string, value: number, type: 'percentage' | 'fixed') => {
    setActiveCoupon({
      code,
      discountType: type,
      value
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans transition-colors duration-300 antialiased overflow-x-hidden">
      
      {/* Sticky High-contrast Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />

      {/* Primary Outlet Alert Ribbon */}
      <div className="bg-gradient-to-r from-red-800 to-[#E4002B] py-1.5 px-4 text-center text-xs font-bold tracking-wider relative z-10 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
        <span className="uppercase text-[9px] sm:text-xs">
          CRISPY CHYCKEN DISPATCH - serving Kimathi Central CBD, Westlands Woodvale, Yaya Kilimani & Galleria Hub!
        </span>
      </div>

      {/* Main Container screen slots */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Render ADMIN Mode dashboard if flag active */}
        {isAdminMode ? (
          <AdminCMSView 
            menuItems={menuItems} 
            onRefreshMenu={fetchMenuFromCMS} 
            branches={nairobiBranches} 
          />
        ) : (
          <>
            {/* RENDER PAGE: Home Tab */}
            {activeTab === 'home' && (
              <div className="space-y-16 animate-fade-in text-left">
                
                {/* Immersive Home cinematic visual grid blocks */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
                  
                  {/* Left Column contents copy */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-650/15 border border-[#E4002B]/35">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E4002B]">
                        100% Certified Local Halal Chickens
                      </span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tighter uppercase text-white">
                      CRISPY.<br/>GOLDEN.<br/><span className="text-[#E4002B] text-glow-red">NAIROBI.</span>
                    </h1>

                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md font-sans">
                      The Original Secret Recipe is here. Freshly prepared, double-breaded in 11 secret herbs & spices, and pressure-cooked daily by our Nairobi experts.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-3">
                      <button
                        onClick={() => setActiveTab('menu')}
                        className="px-8 py-4.5 bg-[#E4002B] hover:bg-[#c30025] text-white font-black text-xs uppercase tracking-wider rounded transition-all shadow-xl shadow-red-900/35 cursor-pointer active:scale-95"
                      >
                        Order Crispy Box Now
                      </button>
                      <button
                        onClick={() => setActiveTab('branches')}
                        className="px-7 py-4 bg-transparent border border-white/20 hover:border-white hover:bg-white hover:text-black font-extrabold text-xs uppercase tracking-widest rounded transition-all cursor-pointer"
                      >
                        Locate Nairobi Outlet
                      </button>
                    </div>

                    {/* Simple badge checkout specs */}
                    <div className="pt-4 flex items-center gap-3 border-t border-white/5 text-gray-500 text-xs">
                      <span className="font-bold uppercase tracking-wider text-[10px]">Secure Pay via:</span>
                      <span className="px-2 py-0.5 bg-[#121212] rounded font-semibold text-emerald-500 font-mono">M-Pesa STK</span>
                      <span className="px-2 py-0.5 bg-[#121212] rounded font-semibold text-white">Visa / MasterCard</span>
                    </div>
                  </div>

                  {/* Right Column: Hero interactive graphics visual */}
                  <div className="lg:col-span-7 h-[380px] bg-neutral-900/40 border border-white/10 rounded-3xl overflow-hidden relative flex items-center justify-center shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-65 z-10"></div>
                    <div className="absolute inset-x-0 bottom-0 p-6 z-20 text-center sm:text-left">
                      <p className="text-yellow-400 font-extrabold text-[10px] uppercase tracking-widest mb-1 font-mono">Special Sizzling Deal</p>
                      <h3 className="text-2xl font-black uppercase text-white truncate max-w-md">The Nairobi Hot-9 Wings Bucket</h3>
                      <p className="text-xs text-gray-300 mt-1 max-w-sm font-sans">9 Pieces of crunchy Hot Wings tossed with local Masala spice dip.</p>
                      
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                        <span className="text-xl font-mono font-black text-white">KES 1,850 /=</span>
                        <button
                          onClick={() => {
                            // Find and add wings bucket
                            const wings = menuItems.find(i => i.id === 'fc-wings10') || menuItems[0];
                            handleAddToCart(wings);
                            setIsCartOpen(true);
                          }}
                          className="px-4 py-2 bg-[#E4002B] hover:bg-[#c30025] text-white text-[10px] font-black uppercase tracking-wider rounded transition-all cursor-pointer shadow-md"
                        >
                          Load Box
                        </button>
                      </div>
                    </div>

                    {/* Vector graphical display circle mockup representation */}
                    <div className="w-[80%] h-[80%] bg-[#121212] rounded-full border border-dashed border-white/10 flex items-center justify-center relative scale-95 group-hover:scale-100 transition-transform duration-500">
                      <span className="text-white/5 text-[10vw] font-black select-none tracking-tight leading-none rotate-12">
                        CRUSHY
                      </span>
                    </div>
                  </div>

                </div>

                {/* Popular Food Categories strip banner */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Explore Nairobi Favourites</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { key: 'Fried Chicken', tag: 'Hand-Breaded', img: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=500' },
                      { key: 'Burgers', tag: 'Brioche Sesame', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500' },
                      { key: 'Buckets', tag: 'Family Size', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500' },
                      { key: 'Desserts', tag: 'Malindi Sunrise', img: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=500' }
                    ].map((cat) => (
                      <div
                        key={cat.key}
                        onClick={() => {
                          setActiveTab('menu');
                        }}
                        className="bg-[#0b0b0b] border border-white/5 rounded-2xl overflow-hidden hover:border-[#E4002B]/35 transition-all duration-300 cursor-pointer text-center relative h-36 flex flex-col justify-end p-4 group"
                      >
                        <img src={cat.img} className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-85"></div>
                        
                        <div className="relative text-left leading-none z-10 space-y-0.5">
                          <span className="text-[#E4002B] text-[8px] font-mono uppercase tracking-widest font-black">{cat.tag}</span>
                          <h4 className="text-white text-sm font-extrabold uppercase leading-none truncate">{cat.key}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery partners logos tracker strip */}
                <div className="bg-neutral-900/30 p-6 rounded-2xl border border-white/5 text-center space-y-3">
                  <p className="text-gray-500 uppercase font-black tracking-widest text-[10px]">Express Nairobi Courier Dispatch Networks:</p>
                  <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 text-xs text-gray-400 font-bold tracking-widest font-mono select-none">
                    <span className="text-orange-500 hover:text-white transition">UBER EATS NAIROBI</span>
                    <span className="text-[#FFC72C] hover:text-white transition">GLOVO KENYA</span>
                    <span className="text-emerald-500 hover:text-white transition">BOLT DISPATCH</span>
                    <span className="text-red-500 hover:text-white transition">KFC EXECUTIVE FLEET</span>
                  </div>
                </div>

                {/* Local customer reviews slider */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Nairobi Locals Saying:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                    {[
                      { name: 'Arap Langat', loc: 'Kilimani Yaya Outlet Customer', text: 'Masala Chips here are on point. Real thick seasoning marinade, and the chicken has that beautiful hand-breaded original crisp!' },
                      { name: 'Mercy Wanjiku', loc: 'Kimathi CBD regular', text: 'I love ordering via the STK push simulator on Friday nights. The STK keypad works instantly, and my order tracking bike moves exactly how the driver rides!' },
                      { name: 'Kevin Juma', loc: 'Westlands Mall Diner', text: 'Highly recommend using the Gemini AI helper menu recommendation. It designed a wings combo with surprise coupon STUDENT20 and saved our pocket!' }
                    ].map((rev, rIdx) => (
                      <div key={rIdx} className="bg-neutral-900/40 p-5 rounded-2xl border border-white/5 text-left space-y-3 leading-relaxed">
                        <div className="flex items-center gap-1 text-yellow-500 text-xs">
                          {[0, 1, 2, 3, 4].map(s => <span key={s}>★</span>)}
                        </div>
                        <p className="text-gray-300 text-xs italic">" {rev.text} "</p>
                        <div className="leading-none pt-1">
                          <h4 className="font-extrabold text-white text-xs">{rev.name}</h4>
                          <span className="text-[10px] text-gray-500 font-mono">{rev.loc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download CTA Ribbon banner */}
                <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-white text-2xl font-black uppercase">Download KFC Kenya App</h3>
                    <p className="text-gray-400 text-xs max-w-sm font-sans leading-relaxed">Grab our mobile client. Order express wings, enjoy continuous member spin games, and view delivery courier status.</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => alert('Simulating Play Store download trigger!')} className="flex-1 sm:flex-initial px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl border border-white/10 text-xs font-bold uppercase transition">
                      Google Play Store
                    </button>
                    <button onClick={() => alert('Simulating Apple Store download trigger!')} className="flex-1 sm:flex-initial px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl border border-white/10 text-xs font-bold uppercase transition">
                      Apple App Store
                    </button>
                  </div>
                </div>

                {/* Aesthetic footer copyright disclaimer */}
                <div className="py-4 border-t border-white/5 text-center text-[10px] text-gray-650 text-gray-650 space-y-2 font-mono">
                  <p className="text-gray-500">© 2026 KFC NAIROBI SYSTEMS DESK. ALL RIGHTS RESERVED PORTAL LICENSE.</p>
                  <p className="text-gray-650 text-gray-650 text-neutral-600">
                    Prepared under high sanitization commitments. Our chickens are sourced from local Halal providers in Kenya. Masala potatoes harvested fresh daily from Meru & Nyandarua fields.
                  </p>
                </div>

              </div>
            )}

            {/* RENDER PAGE: Menu Tab */}
            {activeTab === 'menu' && (
              <MenuView 
                menuItems={menuItems} 
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveOneFromCart={handleRemoveOneFromCart}
                onAddSpecialCombo={handleAddAIComboToCart}
              />
            )}

            {/* RENDER PAGE: Deals Tab */}
            {activeTab === 'deals' && (
              <DealsPromosView onApplyCouponToActiveCart={handleApplyCouponToCart} />
            )}

            {/* RENDER PAGE: Locations Tab */}
            {activeTab === 'branches' && (
              <LocationsView 
                branches={nairobiBranches} 
                onSelectBranchOrder={(bName) => {
                  alert(`Dispatched default pickup center to "${bName}". Swapping views to active food Catalog menu!`);
                  setActiveTab('menu');
                }} 
              />
            )}

            {/* RENDER PAGE: About Tab */}
            {activeTab === 'about' && (
              <AboutContactView />
            )}

            {/* RENDER PAGE: Careers Tab */}
            {activeTab === 'careers' && (
              <CareersView jobOpenings={initialCareers} branches={nairobiBranches} />
            )}

            {/* RENDER PAGE: Contact Tab */}
            {activeTab === 'contact' && (
              <AboutContactView />
            )}
          </>
        )}

      </main>

      {/* Floating Sticky Right-side Cart Badge helper summary inside home */}
      {cart.length > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#E4002B] hover:bg-[#c30025] text-white p-4.5 rounded-full shadow-2xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-wider animate-bounce border-2 border-white cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 shrink-0 text-white" />
          <span>Checkout My Cart ({cart.reduce((a, b) => a + b.quantity, 0)} Items)</span>
        </button>
      )}

      {/* Embedded Cart Checkout & Payment drawer coordinator */}
      <CheckoutTrackingView
        cart={cart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onAddToCart={handleAddToCart}
        onRemoveOneFromCart={handleRemoveOneFromCart}
        onClearCart={handleClearCart}
        activeCoupon={activeCoupon}
        onRemoveActiveCoupon={() => setActiveCoupon(null)}
        onApplyCouponCode={handleApplyCouponToCart}
        nairobiBranches={nairobiBranches}
      />

    </div>
  );
}
