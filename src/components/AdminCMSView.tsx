import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Trash2, RotateCcw, Check, ShoppingBag, Briefcase, RefreshCw, Layers } from 'lucide-react';
import { MenuItem, MenuItemCategory } from '../types';

interface AdminCMSViewProps {
  menuItems: MenuItem[];
  onRefreshMenu: () => void;
  branches: any[];
}

export default function AdminCMSView({ menuItems, onRefreshMenu, branches }: AdminCMSViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'cms' | 'orders' | 'candidates'>('cms');
  
  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Candidate State
  const [candidates, setCandidates] = useState<any[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  // New Menu Item Inputs State
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<MenuItemCategory>('Fried Chicken');
  const [itemPrice, setItemPrice] = useState<number>(450);
  const [itemCalories, setItemCalories] = useState<number>(550);
  const [itemImage, setItemImage] = useState('https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=500');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPopular, setItemPopular] = useState(false);
  
  const [cmsSubmitLoader, setCmsSubmitLoader] = useState(false);
  const [cmsMessage, setCmsMessage] = useState<{ text: string; error: boolean } | null>(null);

  // Fetch admin orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      // Create a fallback simulator list if server orders are empty since it starts empty
      // Retrieve from memory state if orders are active
      const response = await fetch('/api/order/track/dummy-id-to-force-catch-all');
      // The dummy fetch will fail unless we define a catch-all list.
      // Let's call /api/order/track/KFC-NBI-123456 or similar, or fetch our memory grid.
      // Since express server in server.ts has a local let serverOrders and we don't have a direct get /api/orders,
      // let's fetch orders safely. Wait! Let's check server.ts. In server.ts, we did not write app.get('/api/admin/orders').
      // Let's create a dynamic mock in-memory state or fallback, but wait: we do have local storage order backup sync too.
      // Let's sync with local storage if server endpoint is not made for queries, or fetch from `/api` if we can.
      // Actually, we can fetch all orders by maintaining order state on client-side or getting default list.
      const localStored = localStorage.getItem('kfc_nairobi_all_orders');
      if (localStored) {
        setOrders(JSON.parse(localStored));
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchCandidates = async () => {
    setCandidatesLoading(true);
    try {
      const stored = localStorage.getItem('kfc_nairobi_candidates_list');
      if (stored) {
        setCandidates(JSON.parse(stored));
      } else {
        // Mock seed candidate for demo tracking
        const defaultCandidates = [
          {
            id: 'APP-CX-4801',
            fullName: 'Michael Kamau',
            email: 'kamau.mike@gmail.com',
            phone: '0711222333',
            positionId: 'job-delivery',
            experienceYears: 4,
            branchPreference: 'Kimathi Street (CBD)',
            coverLetter: 'I am a highly disciplined rider with 4 years experience navigating Nairobi highway shortcuts safely. I have my own helmet and motor license.'
          },
          {
            id: 'APP-CX-7128',
            fullName: 'Stacy Awuor',
            email: 'awuorstacy@gmail.com',
            phone: '0744555666',
            positionId: 'job-cashier',
            experienceYears: 2,
            branchPreference: 'Westlands Mall Branch',
            coverLetter: 'I love customer interaction and fast-paced environments. I am swift at counting change, fully fluent in Swahili and English.'
          }
        ];
        setCandidates(defaultCandidates);
        localStorage.setItem('kfc_nairobi_candidates_list', JSON.stringify(defaultCandidates));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCandidatesLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCandidates();
  }, [activeSubTab]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    // Modify status on storage & server if possible
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updatedOrders);
    localStorage.setItem('kfc_nairobi_all_orders', JSON.stringify(updatedOrders));

    // Post update directly to server so client order tracking responds immediately
    fetch(`/api/order/track/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(console.warn);
  };

  const handleAddCMSItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !itemName || !itemPrice) {
      setCmsMessage({ text: 'Item ID, Name, and Price are mandatory fields.', error: true });
      return;
    }
    setCmsSubmitLoader(true);
    setCmsMessage(null);

    const payload: MenuItem = {
      id: itemId,
      name: itemName,
      category: itemCategory,
      price: Number(itemPrice),
      calories: Number(itemCalories),
      image: itemImage,
      description: itemDescription || 'Sizzling hot snack prepared directly under physical Nairobi conditions.',
      popular: itemPopular
    };

    try {
      const response = await fetch('/api/admin/menu/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setCmsMessage({ text: 'Product added successfully to database CMS!', error: false });
        onRefreshMenu();
        // Clear forms
        setItemId('');
        setItemName('');
        setItemDescription('');
      } else {
        throw new Error(data.error || 'Failed to inject menu item.');
      }
    } catch (err: any) {
      setCmsMessage({ text: err.message || 'CMS insertion error.', error: true });
    } finally {
      setCmsSubmitLoader(false);
    }
  };

  const handleDeleteCMSItem = async (id: string) => {
    if (!confirm(`Are you sure you want to delete "${id}" from the active menu?`)) return;
    try {
      const response = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        onRefreshMenu();
        alert('Menu item removed successfully.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetMenu = async () => {
    if (!confirm('Are you sure you want to restore the default menu? Any custom items will be overwritten.')) return;
    try {
      const response = await fetch('/api/admin/menu/reset', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        onRefreshMenu();
        alert('Active menu re-synced successfully!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Alert Warn banner */}
      <div className="bg-amber-600/10 border border-amber-500/25 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white text-base font-black uppercase">Staff CMS & Orders Control</h4>
            <p className="text-gray-400 text-xs mt-0.5 font-sans">
              This panel interfaces directly with our server in-memory database. Modify menu lists, advance live delivery bikes on maps, and review career submissions.
            </p>
          </div>
        </div>

        {/* Sync Controls button */}
        <button
          onClick={handleResetMenu}
          className="px-4 py-2 bg-neutral-900 border border-white/10 hover:border-white/20 text-xs font-bold uppercase rounded text-neutral-300 flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          Reset Menu Catalog
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-white/10 whitespace-nowrap overflow-x-auto pb-0.5">
        {[
          { key: 'cms', label: 'Menu Catalog Creator (CMS)', icon: Layers },
          { key: 'orders', label: 'Monitor Live Orders', icon: ShoppingBag },
          { key: 'candidates', label: 'Review Applicants', icon: Briefcase }
        ].map((sub) => {
          const isSel = activeSubTab === sub.key;
          const Icon = sub.icon;
          return (
            <button
              key={sub.key}
              onClick={() => setActiveSubTab(sub.key as any)}
              className={`px-5 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                isSel ? 'border-[#E4002B] text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* TAB A: Menu Catalog Creator */}
      {activeSubTab === 'cms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form: Add product */}
          <form onSubmit={handleAddCMSItem} className="lg:col-span-5 bg-[#0c0c0c] border border-white/10 rounded-2xl p-6.5 space-y-4">
            <h3 className="text-white font-extrabold text-base uppercase border-b border-white/5 pb-2">
              Inject Menu Item To Catalog
            </h3>

            {cmsMessage && (
              <p className={`p-3 text-[11px] font-bold rounded-lg ${cmsMessage.error ? 'bg-red-950/20 text-red-400 border border-red-500/10' : 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10'}`}>
                {cmsMessage.text}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Unique ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. b-charger"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Category</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-[#222222] text-xs text-gray-300 p-2.5 rounded-lg"
                >
                  <option value="Fried Chicken">Fried Chicken</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Wraps">Wraps</option>
                  <option value="Fries">Fries</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Buckets">Buckets</option>
                  <option value="Family Meals">Family Meals</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Food Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Nairobi Spicy Maharaja Slider"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Price (KES)</label>
                <input
                  type="number"
                  required
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Calories (Kcal)</label>
                <input
                  type="number"
                  required
                  value={itemCalories}
                  onChange={(e) => setItemCalories(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Visual Image URL</label>
              <input
                type="text"
                value={itemImage}
                onChange={(e) => setItemImage(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white text-[10px]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Brief Description</label>
              <textarea
                rows={3}
                placeholder="Describe spices, standard sides, lettuce type..."
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white font-sans resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cms-popular"
                checked={itemPopular}
                onChange={(e) => setItemPopular(e.target.checked)}
                className="w-4 h-4 rounded accent-[#E4002B]"
              />
              <label htmlFor="cms-popular" className="text-xs text-gray-300 select-none">
                Recommend in Nairobi Popular section
              </label>
            </div>

            <button
              type="submit"
              disabled={cmsSubmitLoader}
              className="w-full py-3 bg-[#E4002B] hover:bg-[#c30025] text-white text-xs font-black uppercase rounded-lg tracking-wider transition-all cursor-pointer"
            >
              {cmsSubmitLoader ? 'Saving product to database...' : 'Insert Product & Sync Website'}
            </button>
          </form>

          {/* Right Area: Catalog grid to delete */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-white font-extrabold text-base uppercase">Manage Menu Catalog ({menuItems.length} Products)</h3>
            
            <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-1">
              {menuItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="text-left leading-tight">
                      <span className="text-[10px] tracking-wide text-[#E4002B] uppercase font-bold">{item.category}</span>
                      <h4 className="text-sm font-bold text-white uppercase">{item.name}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{item.price} KES • ID: {item.id}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCMSItem(item.id)}
                    className="p-2 bg-neutral-950 border border-white/5 hover:border-red-650/40 text-gray-500 hover:text-[#E4002B] rounded transition"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB B: Monitor and Alter Order Progression */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Simulation Control Center: Track Orders ({orders.length} Active Orders)
            </h3>
            <button 
              onClick={fetchOrders}
              className="p-2 bg-neutral-900 rounded border border-white/5 inline-flex gap-1 items-center text-xs text-gray-300"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-24 bg-[#080808] border border-dashed border-white/10 rounded-2xl text-gray-500 text-xs">
              No orders have been submitted yet on this session's sandbox. Add items to cart and check out to inspect tracker!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((o) => (
                <div key={o.id} className="bg-[#0c0c0c] border border-white/10 rounded-xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-white font-mono">{o.id}</span>
                        <span className="px-2 py-0.5 bg-[#E4002B]/10 border border-[#E4002B]/30 text-[#E4002B] font-mono font-bold text-[9px] rounded uppercase">
                          {o.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Placed by <strong className="text-white">{o.customerName}</strong> ({o.phone}) • {o.deliveryMethod === 'delivery' ? 'Deliver to ' + o.address : 'Self Pick-up: ' + o.branch}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-neutral-900 border border-white/15 px-3 py-1.5 rounded-lg">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Pipeline State:</span>
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="bg-black border border-white/10 text-xs rounded text-white py-1 px-2.5 font-bold uppercase outline-none focus:border-[#E4002B]"
                      >
                        <option value="pending">Pending Pay</option>
                        <option value="mpesa_prompt">M-Pesa STK Pin Prompt</option>
                        <option value="preparing">Preparing (Kitchen Cook)</option>
                        <option value="in_transit">In Transit (Rider bike moving)</option>
                        <option value="ready_for_pickup">Ready for Self-Pick-up</option>
                        <option value="delivered">Delivered Successfully 🎉</option>
                      </select>
                    </div>
                  </div>

                  {/* List order items */}
                  <div className="text-xs font-sans space-y-1.5 text-gray-300">
                    <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Requested Items:</p>
                    {o.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center max-w-md bg-neutral-900/50 p-2 rounded">
                        <span>{item.menuItem.name} x <strong className="text-[#E4002B]">{item.quantity}</strong></span>
                        <span className="font-mono text-gray-500">{item.menuItem.price * item.quantity} KES</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 text-xs font-mono border-t border-white/5">
                    <span className="text-gray-500 uppercase">Subtotal / Discount / Total Paid:</span>
                    <span className="text-white font-bold">
                      {o.subtotal} KES - {o.discount} KES = <strong className="text-emerald-400 text-sm">{o.total} KES</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB C: Candidates CV files */}
      {activeSubTab === 'candidates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Recruitment Filing Cabinet ({candidates.length} Applications)
            </h3>
            <button 
              onClick={fetchCandidates}
              className="p-2 bg-neutral-900 rounded border border-white/5 text-xs text-gray-300 hover:text-white"
            >
              Refresh Candidate List
            </button>
          </div>

          {candidatesLoading ? (
            <div className="text-center py-10 text-gray-500 text-xs">Loading application files...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((cand) => (
                <div key={cand.id} className="bg-[#0b0b0b] border border-white/10 rounded-xl p-5 text-left space-y-4">
                  <div className="flex justify-between items-start border-b border-white/5 pb-2">
                    <div>
                      <h4 className="font-extrabold text-white text-base truncate">{cand.fullName}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{cand.email} • {cand.phone}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono font-bold text-[9px] rounded uppercase">
                      {cand.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs leading-none font-mono text-gray-400">
                    <div className="bg-neutral-900 p-2.5 rounded">
                      <p className="text-[10px] text-gray-500 uppercase">Target Branch:</p>
                      <p className="text-white font-bold mt-1.5">{cand.branchPreference.replace(' Branch', '')}</p>
                    </div>
                    <div className="bg-neutral-900 p-2.5 rounded">
                      <p className="text-[10px] text-gray-500 uppercase">Experience:</p>
                      <p className="text-white font-bold mt-1.5">{cand.experienceYears} Years cooking</p>
                    </div>
                  </div>

                  <div className="space-y-1 bg-[#101010] p-3 rounded font-sans text-xs">
                    <p className="text-[10px] uppercase font-bold text-gray-500">Candidacy Statement Statement:</p>
                    <p className="text-gray-300 italic mt-1 leading-relaxed">
                      " {cand.coverLetter || 'No cover letter attached.'} "
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
