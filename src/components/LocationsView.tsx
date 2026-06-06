import React, { useState } from 'react';
import { MapPin, Phone, Clock, Search, Map, CheckCircle2, ChevronRight, Navigation } from 'lucide-react';
import { Branch } from '../types';

interface LocationsViewProps {
  branches: Branch[];
  onSelectBranchOrder: (branchName: string) => void;
}

export default function LocationsView({ branches, onSelectBranchOrder }: LocationsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0].id);

  // Filter according to terms
  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Search Header visual */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-3xl font-black uppercase text-white tracking-tight">
            Nairobi <span className="text-[#E4002B]">Branch Finder</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Order fresh original crispy bites from any of our 6 high-density Nairobi outlets with express delivery dispatcher.
          </p>
        </div>

        {/* Search input bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Westlands, Kilimani, CBD..."
            className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#E4002B] outline-none transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Branch list */}
        <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
          {filteredBranches.length === 0 ? (
            <div className="text-center py-10 bg-neutral-900/40 rounded-xl border border-dashed border-white/10 text-gray-500 text-xs">
              No Nairobi outlets found matching your criteria.
            </div>
          ) : (
            filteredBranches.map((branch) => {
              const isSelected = branch.id === selectedBranchId;
              return (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-neutral-900 border-[#E4002B] shadow-lg shadow-[#E4002B]/5 scale-101' 
                      : 'bg-[#0c0c0c] border-white/5 hover:bg-neutral-900/50 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-base flex items-center gap-2">
                        {branch.name}
                        {branch.id === 'br-kimathi' && (
                          <span className="px-1.5 py-0.5 bg-red-650 text-[#E4002B] text-[8px] font-black rounded uppercase border border-[#E4002B]/20">
                            24/7 CBD
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1.5 font-sans line-clamp-1">
                        {branch.address}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-red-650 text-[#E4002B] flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {branch.hours.replace(' (Everyday)', '')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      {branch.phone}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Map Canvas Simulation & Detail Pane */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Interactive Custom Nairobi Map Vector Canvas */}
          <div className="bg-[#080808]/90 border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl h-[380px]">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            
            {/* Map Roads Simulation */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Thika Superhighway / Uhuru Highway Grid vertical */}
              <div className="absolute left-[35%] top-0 bottom-0 w-[4px] bg-neutral-800 rotate-12"></div>
              {/* Ngong Road / Langata Road diagonal */}
              <div className="absolute left-0 right-0 top-[60%] h-[4px] bg-neutral-800 -rotate-6"></div>
              {/* Westlands bypass arc */}
              <div className="absolute left-[15%] right-[25%] top-[25%] h-[150px] border-l border-t border-dashed border-neutral-700/40 rounded-full"></div>
            </div>

            {/* Custom Interactive Marker Pins overlay */}
            {branches.map((branch) => {
              // Simulated scatter positions for Map rendering based on Nairobi Coordinates
              // Kimathi: Center-Right (-1.2842, 36.8227)
              // Westlands: Top-Left (-1.2644, 36.8044)
              // Junction: Center-Left (-1.3005, 36.7621)
              // Galleria: Bottom-Right (-1.3411, 36.7725)
              // Yaya: Center (-1.2917, 36.7983)
              // The Hub Karen: Bottom-Left (-1.3214, 36.7028)
              
              let top = '50%';
              let left = '50%';
              if (branch.id === 'br-kimathi') { top = '40%'; left = '65%'; }
              else if (branch.id === 'br-westlands') { top = '20%'; left = '45%'; }
              else if (branch.id === 'br-junction') { top = '55%'; left = '30%'; }
              else if (branch.id === 'br-galleria') { top = '80%'; left = '70%'; }
              else if (branch.id === 'br-kilimani') { top = '45%'; left = '52%'; }
              else if (branch.id === 'br-hub') { top = '70%'; left = '18%'; }

              const isSelected = branch.id === selectedBranchId;

              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => setSelectedBranchId(branch.id)}
                  style={{ top, left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-300 z-10`}
                >
                  {/* Tooltip tooltip bubble */}
                  <span className={`absolute bottom-full mb-1 px-2.5 py-1 text-[9px] font-black tracking-wide text-white rounded bg-neutral-900 border border-white/20 whitespace-nowrap shadow-xl transition-all duration-200 ${
                    isSelected ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-90 group-hover:opacity-100 group-hover:translate-y-0'
                  }`}>
                    {branch.name.replace(' Branch', '')}
                  </span>

                  {/* Marker Pin Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-[#E4002B] scale-125 ring-4 ring-[#E4002B]/20 shadow-lg shadow-red-600/55 animate-bounce' 
                      : 'bg-neutral-800 border border-white/20 group-hover:bg-[#E4002B] group-hover:scale-110'
                  }`}>
                    <MapPin className="w-4 h-4 text-white" />
                  </div>

                  {/* Dot Ripple for selected */}
                  {isSelected && (
                    <span className="absolute w-6 h-6 rounded-full bg-[#E4002B]/30 animate-ping -z-10"></span>
                  )}
                </button>
              );
            })}

            {/* Simulated Map Hud stats */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/15 text-left pointer-events-none max-w-xs text-[10px]">
              <p className="text-gray-400 uppercase font-bold tracking-wider mb-1">Nairobi Coordinates Grid</p>
              <div className="font-mono text-gray-500 space-y-0.5">
                <p>LAT CLAMP: -1.2500 S TO -1.3500 S</p>
                <p>LNG CLAMP: 36.6500 E TO 36.8500 E</p>
                <p>STATUS: ACTIVE REAL-TIME TELEMETRY</p>
              </div>
            </div>

            {/* Nairobi Reference Watermarks */}
            <div className="absolute top-[28%] right-[8%] text-neutral-800 font-black text-2xl uppercase select-none tracking-widest leading-none text-right">
              Central<br/>Nairobi
            </div>
            <div className="absolute bottom-[28%] left-[12%] text-neutral-800 font-bold text-lg uppercase select-none tracking-widest">
              Ngong Road
            </div>
            <div className="absolute bottom-[8%] right-[32%] text-neutral-800 font-bold text-sm uppercase select-none tracking-widest">
              Langata Forest
            </div>

            {/* Bottom branch details controller */}
            <div className="absolute bottom-4 inset-x-4 bg-black/90 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex items-center justify-between text-left">
              <div>
                <p className="text-amber-500 font-extrabold text-[10px] uppercase tracking-wider">Currently Pinpointed:</p>
                <h4 className="text-white text-sm font-black uppercase mt-0.5">{selectedBranch.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => onSelectBranchOrder(selectedBranch.name)}
                className="px-4 py-2 bg-[#E4002B] hover:bg-[#c30025] text-white text-[11px] font-bold uppercase rounded tracking-wide transition flex items-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                Select & Order
              </button>
            </div>
          </div>

          {/* Core Outlet Hours & Helpline Details Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-neutral-900/40 p-5 rounded-xl border border-white/5">
              <h3 className="text-sm font-bold uppercase text-white tracking-wide border-b border-white/5 pb-2 mb-3">
                Branch Details
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-[#E4002B] shrink-0 mt-0.5" />
                  <span>{selectedBranch.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>{selectedBranch.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/40 p-5 rounded-xl border border-white/5">
              <h3 className="text-sm font-bold uppercase text-white tracking-wide border-b border-white/5 pb-2 mb-3">
                Operational Status
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{selectedBranch.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-emerald-400 font-bold font-mono text-[11px]">OPEN - DISPATCHING CORONEL ITEMS</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
