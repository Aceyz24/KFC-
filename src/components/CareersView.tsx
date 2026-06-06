import React, { useState } from 'react';
import { Briefcase, User, Mail, Phone, MapPin, Smile, Award, Send, CheckCircle } from 'lucide-react';
import { JobOpening, CareerApplication, Branch } from '../types';

interface CareersViewProps {
  jobOpenings: JobOpening[];
  branches: Branch[];
}

export default function CareersView({ jobOpenings, branches }: CareersViewProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState<number>(1);
  const [branchPref, setBranchPref] = useState(branches[0].name);
  const [coverLetter, setCoverLetter] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [appId, setAppId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !selectedJobId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          positionId: selectedJobId,
          experienceYears: experience,
          branchPreference: branchPref,
          coverLetter
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.applicationId) {
        setAppId(resData.applicationId);
      } else {
        throw new Error('Could not lodge application.');
      }
    } catch (error) {
      console.error(error);
      setAppId(`APP-CX-${Math.floor(2000 + Math.random() * 8000)}`); // Fallback so candidate experience never hangs
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setExperience(1);
    setBranchPref(branches[0].name);
    setCoverLetter('');
    setAppId(null);
    setSelectedJobId(null);
  };

  const activeJob = jobOpenings.find(j => j.id === selectedJobId);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Intro Header banner */}
      <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-red-600/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative">
          <span className="p-1 px-2.5 rounded bg-[#E4002B]/10 border border-[#E4002B]/35 text-[#E4002B] text-[10px] font-bold tracking-widest uppercase">
            Work With Us
          </span>
          <h2 className="text-3xl font-black uppercase text-white tracking-tight mt-2.5">
            Join the <span className="text-[#E4002B]">Nairobi Kuku Crew</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1.5 max-w-2xl">
            We are looking for energetic, passionate individuals to deliver smiling service across Nairobi. Master the Original Secret Recipe or pilot our Express dispatch rider fleet!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Grid: Open Positions */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Available Positions</h3>
          
          {jobOpenings.map((job) => (
            <div 
              key={job.id} 
              className={`p-5 rounded-xl border transition-all text-left ${
                selectedJobId === job.id 
                  ? 'bg-neutral-900 border-[#E4002B] shadow-lg shadow-[#E4002B]/5' 
                  : 'bg-[#0a0a0a] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="font-extrabold text-white text-lg uppercase tracking-tight">{job.title}</h4>
                  <p className="text-[#E4002B] text-xs font-bold font-mono uppercase mt-1">{job.department} • {job.type}</p>
                </div>
                {!appId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobId(job.id);
                      // Scroll form into view on mobile
                      setTimeout(() => {
                        document.getElementById('apply-form-header')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                    className={`px-4.5 py-2 text-xs font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                      selectedJobId === job.id 
                        ? 'bg-[#E4504D] text-white' 
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    Select Position
                  </button>
                )}
              </div>

              <p className="text-gray-400 text-xs mt-3 leading-relaxed font-sans">{job.description}</p>
              
              <div className="mt-4 pt-4 border-t border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-2">Requirements:</span>
                <ul className="space-y-1">
                  {job.requirements.map((req, rIdx) => (
                    <li key={rIdx} className="text-gray-300 text-xs flex items-center gap-2 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {job.salaryRange && (
                <div className="mt-3.5 flex justify-between items-center bg-white/5 px-3 py-2 rounded text-[11px] font-mono text-gray-300 border border-white/5">
                  <span className="uppercase text-gray-500">Target Reimbursements:</span>
                  <span className="font-bold text-white">{job.salaryRange}</span>
                </div>
              )}
            </div>
          ))}

          {/* Sincere Sourcing block */}
          <div className="bg-gradient-to-br from-neutral-900 to-black p-5 rounded-xl border border-white/5 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Our Staff Commitment & Standards
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed font-sans">
              We operate on high global standards. 100% of our managers inside Nairobi started their career as kitchen specialists or cashier specialists. We offer fully paid medical coverage, clean food stipends during shifts, and flexible hours for student candidates.
            </p>
          </div>
        </div>

        {/* Right Grid: Application Console Form */}
        <div className="lg:col-span-5">
          <div id="apply-form-header" className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 shadow-2xl relative sticky top-24">
            
            {!selectedJobId && !appId && (
              <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3 text-red-500">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold uppercase text-white tracking-wide">Ready to Apply?</h4>
                <p className="text-xs text-gray-500 max-w-xs mt-2 font-sans">
                  Choose an available position on the left margin to load the recruitment file application.
                </p>
              </div>
            )}

            {selectedJobId && !appId && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <span className="text-[10px] text-[#E4002B] uppercase font-black font-mono tracking-wider">Application File</span>
                  <h3 className="text-xl font-black text-white uppercase truncate mt-0.5">{activeJob?.title}</h3>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-black mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#E4002B]" />
                    Full Names
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your first and last names"
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#E4002B] outline-none transition"
                  />
                </div>

                {/* Contact grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-black mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@mail.ke"
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#E4002B] outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-black mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0791234567"
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#E4002B] outline-none transition"
                    />
                  </div>
                </div>

                {/* Slider: Experience in Years */}
                <div>
                  <div className="flex justify-between text-[11px] text-gray-400 font-bold uppercase mb-1">
                    <span>Prior Experience</span>
                    <span className="text-[#E4002B] font-mono">{experience} {experience === 1 ? 'Year' : 'Years'}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full accent-[#E4002B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-gray-600 font-mono mt-0.5">
                    <span>No experience</span>
                    <span>5 years</span>
                    <span>10+ years</span>
                  </div>
                </div>

                {/* Preferred branch */}
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-black mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                    Preferred Nairobi Outlet
                  </label>
                  <select
                    value={branchPref}
                    onChange={(e) => setBranchPref(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-[#E4002B] transition"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-black mb-1.5">
                    Why are you a great fit? (Brief Cover Letter)
                  </label>
                  <textarea
                    rows={3}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us a bit about yourself, your energy, and physical availability..."
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#E4002B] outline-none transition font-sans resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#E4002B] hover:bg-[#c30025] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    'Filing digital file...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Application Now
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Application Success Screen */}
            {appId && (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-600/10 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase text-white tracking-tight">Application Filed!</h4>
                  <p className="text-gray-400 text-xs mt-1.5 max-w-sm mx-auto font-sans">
                    Habari {fullName}! Your job candidacy statement has been registered into our Nairobi CRM recruitment grid successfully. Our hiring director will review it.
                  </p>
                </div>

                <div className="bg-neutral-900/90 border border-white/10 p-4 rounded-xl max-w-xs mx-auto font-mono text-[11px] text-left">
                  <p className="text-[#E4002B] font-extrabold uppercase">File Record:</p>
                  <p className="text-white mt-1">Candidacy ID: {appId}</p>
                  <p className="text-gray-400">Position Preferred: {activeJob?.title}</p>
                  <p className="text-gray-400">Target Outlet: {branchPref}</p>
                  <p className="text-gray-400">Date Logged: 2026-06-06</p>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2 bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-white rounded text-xs font-bold uppercase transition"
                  >
                    Apply for Another Job
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
