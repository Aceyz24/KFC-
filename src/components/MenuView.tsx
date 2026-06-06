import React, { useState } from 'react';
import { Search, Filter, Flame, Plus, Minus, ThumbsUp, Sparkles } from 'lucide-react';
import { MenuItem, MenuItemCategory, CartItem } from '../types';
import AIPredictionWidget from './AIPredictionWidget';

interface MenuViewProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onRemoveOneFromCart: (item: MenuItem) => void;
  onAddSpecialCombo: (items: MenuItem[], discountCode: string, discountPct: number) => void;
}

export default function MenuView({
  menuItems,
  cart,
  onAddToCart,
  onRemoveOneFromCart,
  onAddSpecialCombo
}: MenuViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<MenuItemCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalories, setShowCalories] = useState(true);
  const [sortBy, setSortBy] = useState<'none' | 'price-asc' | 'price-desc' | 'rating'>('none');

  const categories: Array<MenuItemCategory | 'All'> = [
    'All',
    'Fried Chicken',
    'Burgers',
    'Wraps',
    'Fries',
    'Buckets',
    'Family Meals',
    'Drinks',
    'Desserts'
  ];

  // Helper to query quantity in cart
  const getItemQuantity = (itemId: string) => {
    const found = cart.find(i => i.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  // Filter & sort list
  let processedItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-asc') {
    processedItems = [...processedItems].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    processedItems = [...processedItems].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    processedItems = [...processedItems].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Category Horizontal Filter Rail */}
      <div className="flex overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-red-650 space-x-2 scroll-smooth border-b border-white/5 pt-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-[#E4002B] text-white shadow-lg shadow-red-600/10 scale-102' 
                : 'bg-neutral-900 text-gray-300 hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Control Utility bar (Search inside category & Sort filter) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-neutral-900/40 p-4.5 rounded-2xl border border-white/5">
        
        {/* Search */}
        <div className="relative w-full md:w-80 font-sans">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search standard ${selectedCategory === 'All' ? 'menu' : selectedCategory.toLowerCase()}...`}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-[#E4002B] outline-none transition"
          />
        </div>

        {/* Filters checklist */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end text-xs">
          
          {/* Calorie filter trigger */}
          <button
            type="button"
            onClick={() => setShowCalories(!showCalories)}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              showCalories 
                ? 'bg-neutral-950 border-[#E4002B]/30 text-white' 
                : 'bg-neutral-900 border-white/5 text-gray-500'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${showCalories ? 'text-amber-500 animate-pulse' : 'text-gray-600'}`} />
            <span>Show Calories</span>
          </button>

          {/* Sort selection dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-bold uppercase tracking-wider font-sans text-[10px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-950 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-gray-300 outline-none focus:border-[#E4002B]"
            >
              <option value="none">Standard Menu Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Popular Rating</option>
            </select>
          </div>

        </div>

      </div>

      {/* Grid List Products mapping */}
      {processedItems.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/20 border border-dashed border-white/10 rounded-2xl text-gray-400">
          <p className="text-sm font-bold uppercase font-mono">No dishes found matching criteria.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-3 px-4 py-2 bg-[#E4002B] text-white text-[11px] rounded font-bold uppercase transition"
          >
            Reset Catalog Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedItems.map((item) => {
            const quantity = getItemQuantity(item.id);
            return (
              <div 
                key={item.id}
                className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden hover:border-[#E4002B]/40 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                
                {/* Product image with overlays */}
                <div className="relative h-48 bg-neutral-950 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover opacity-90 hover:scale-106 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>

                  {/* Badges overlay */}
                  <div className="absolute top-3 inset-x-3 flex justify-between items-center pointer-events-none">
                    <span className="px-2.5 py-1 bg-black/80 border border-white/10 text-white text-[9px] font-black uppercase tracking-wider rounded-md">
                      {item.category}
                    </span>
                    {item.popular && (
                      <span className="px-2.5 py-1 bg-[#E4002B] text-white text-[9px] font-black uppercase rounded-md tracking-wider flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-white" />
                        Favorite
                      </span>
                    )}
                  </div>

                  {/* Price Tag overlay bottom */}
                  <div className="absolute bottom-3 right-3 bg-[#E4002B] text-white px-3 py-1.5 rounded-lg border border-white/20 font-mono font-black text-xs">
                    {item.price.toLocaleString()} /= KES
                  </div>
                </div>

                {/* Content body description */}
                <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="text-base font-extrabold text-white uppercase tracking-tight line-clamp-1">
                        {item.name}
                      </h3>
                      {item.rating && (
                        <span className="text-[11px] font-bold text-amber-500 font-mono flex items-center shrink-0">
                          ⭐️ {item.rating}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-xs font-sans line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions line */}
                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    
                    {/* Calories metadata */}
                    <div className="text-left">
                      {showCalories && item.calories > 0 ? (
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono uppercase font-bold">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>{item.calories} kCal</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-600 font-mono">100% Halal</span>
                      )}
                    </div>

                    {/* Add to list trigger */}
                    <div className="flex items-center">
                      {quantity > 0 ? (
                        <div className="flex items-center bg-neutral-900 border border-white/10 rounded-lg p-0.5 max-w-sm">
                          <button
                            type="button"
                            onClick={() => onRemoveOneFromCart(item)}
                            className="p-1.5 text-gray-450 hover:text-white hover:bg-neutral-800 rounded transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-black text-white font-mono">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => onAddToCart(item)}
                            className="p-1.5 text-gray-450 hover:text-[#E4002B] hover:bg-neutral-800 rounded transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddToCart(item)}
                          className="px-4 py-2 bg-neutral-900 hover:bg-[#E4002B] hover:text-white text-gray-300 rounded-lg border border-white/10 hover:border-transparent text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add to Box
                        </button>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Embedded Intelligent Assistant Centerpiece at Bottom */}
      <div className="pt-8 border-t border-white/5">
        <AIPredictionWidget menuItems={menuItems} onAddSpecialCombo={onAddSpecialCombo} />
      </div>

    </div>
  );
}
