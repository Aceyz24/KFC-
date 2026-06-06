import React from 'react';
import { ShoppingBag, MapPin, Sparkles, Phone, Award, ShieldAlert, Heart } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  cart,
  setIsCartOpen,
  isAdminMode,
  setIsAdminMode
}: HeaderProps) {
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'deals', label: 'Deals & Promos' },
    { id: 'branches', label: 'Locations' },
    { id: 'about', label: 'About Us' },
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact & FAQ' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/90 backdrop-blur-md border-b border-red-950/40 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Title */}
          <div 
            onClick={() => { setActiveTab('home'); setIsAdminMode(false); }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg text-white border-2 border-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              KFC
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-red-500 transition-colors">
                  NAIROBI
                </span>
                <span className="ml-1.5 px-2 py-0.5 text-[9px] font-bold tracking-widest bg-red-600 text-white rounded uppercase animate-pulse">
                  Portal
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 tracking-wider font-mono">Original 11 Herbs & Spices</p>
            </div>
          </div>

          {/* Main Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsAdminMode(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                  activeTab === item.id && !isAdminMode
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 scale-102 font-bold'
                    : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                }`}
              >
                {item.id === 'deals' ? (
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4.5 w-4.5 text-yellow-400" />
                    {item.label}
                  </span>
                ) : item.label}
              </button>
            ))}
          </nav>

          {/* Action Icons right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Quick AI Recommend CTA */}
            <button
              id="ai-recommend-btn"
              onClick={() => {
                setActiveTab('menu');
                setIsAdminMode(false);
                // Scroll down to the AI recommendation block on ordering page
                setTimeout(() => {
                  document.getElementById('ai-planner-widget')?.scrollIntoView({ behavior: 'smooth' });
                }, 200);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-red-600 text-[11px] sm:text-xs font-bold tracking-wide hover:from-amber-400 hover:to-red-500 hover:scale-105 transition-all text-white border border-amber-400/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-spin" />
              <span className="hidden sm:inline">AI Meal Assistant</span>
              <span className="sm:hidden">AI Chef</span>
            </button>

            {/* Shopping Cart Badge */}
            <button
              id="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-neutral-800/80 border border-neutral-700/60 hover:bg-neutral-700 hover:text-red-500 transition-all group lg:scale-110"
              aria-label="Open Cart"
            >
              <ShoppingBag className="h-5 w-5 text-white group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white ring-2 ring-neutral-900 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Simulated Account / Admin Toggle */}
            <button
              id="admin-toggle-btn"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`p-2.5 rounded-full border transition-all ${
                isAdminMode 
                  ? 'bg-amber-600 border-amber-500 text-white shadow-lg' 
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-white'
              }`}
              title="Toggle Admin CMS & Orders Dashboard"
            >
              <ShieldAlert className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Mobile menu - persistent quick horizontal layout scrollable bar */}
        <div className="flex lg:hidden overflow-x-auto pb-3 pt-1 scrollbar-none border-t border-neutral-800/50 space-x-2 scroll-smooth">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsAdminMode(false);
              }}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === item.id && !isAdminMode
                  ? 'bg-red-600 font-bold text-white shadow-md'
                  : 'bg-neutral-800/80 text-neutral-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
}
