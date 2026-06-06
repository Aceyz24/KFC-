import React, { useState } from 'react';
import { Award, ShieldAlert, MessageSquare, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { faqs } from '../data';

export default function AboutContactView() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'chef'; text: string; time: string }>>([
    { sender: 'chef', text: 'Habari! Welcomes to KFC Nairobi Support. Writing from our Westlands dispatcher station. Ask me anything about menu status, halal certification, or M-Pesa deliveries!', time: '11:15' }
  ]);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Simple chatbot rules matching key strings
  const simulateBotReply = (userText: string) => {
    let response = "Ah, asante for reaching out! One of our human dispatch managers on Kimathi Street is retrieving your file. We will update you here shortly.";
    const txt = userText.toLowerCase();

    if (txt.includes('mpesa') || txt.includes('pay') || txt.includes('money')) {
      response = "Our automated Nairobi M-Pesa integration runs via an instant STK Push prompt. Enter your phone PIN when you see the simulation prompt on checkout to unlock instant preparing!";
    } else if (txt.includes('halal') || txt.includes('muslim') || txt.includes('certify')) {
      response = "Yes, absolutely! All KFC Kenya branches source premium chicken exclusively from 100% Halal certified local premium suppliers.";
    } else if (txt.includes('delivery') || txt.includes('eta') || txt.includes('ride')) {
      response = "We commit to a 35-minute express transit window in central Nairobi! Enter your destination during checkout and watch our real-time GPS simulation bike progress on screen.";
    } else if (txt.includes('fresh') || txt.includes('quality') || txt.includes('herbs')) {
      response = "Our chicken is hand-breaded fresh daily in-store and pressure cooked to perfection with Colonel Sanders' legendary secret 11 herbs and spices!";
    }

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        { sender: 'chef', text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1200);
  };

  const handleSendChatMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatLog(prev => [...prev, { sender: 'user', text: userMessage, time: now }]);
    setChatMessage('');

    simulateBotReply(userMessage);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setFormName('');
      setFormEmail('');
      setFormMsg('');
      setFormSubject('');
    }, 4000);
  };

  return (
    <div className="space-y-12 animate-fade-in text-left">
      
      {/* Brand Story Banner (About Us tab core) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-900/40 p-6 sm:p-10 rounded-2xl border border-white/5 relative overflow-hidden">
        
        {/* Story copy */}
        <div className="lg:col-span-7 space-y-4">
          <span className="p-1 px-2.5 rounded bg-[#E4002B]/10 border border-[#E4002B]/35 text-[#E4002B] text-[10px] font-bold tracking-widest uppercase">
            Since 1952 • In Kenya Since 2011
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white leading-tight tracking-tight">
            Original Recipe, <br/><span className="text-[#E4002B]">Nairobi Sourced</span>
          </h2>
          
          <div className="text-gray-300 text-sm leading-relaxed space-y-4 font-sans">
            <p>
              Our secret formula of 11 herbs and spices is legendary, but our heart belongs to East Africa. Every basket of fried chicken served at our Nairobi branches is carefully sourced from certified Kenyan poultry farms, keeping our commitments to extreme quality and strict hygiene on high priorities.
            </p>
            <p>
              We are heavily committed to supporting the Kenyan agricultural community. 100% of our Nairobi Masala Chips are freshly prepared using raw potatoes harvested by local farmers in Nyandarua and Meru fields, then sliced and crisped to our golden standard. Double hand-breaded, pressure cooked, and always served fresh.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-white/5">
            <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
              <p className="text-2xl font-black font-mono text-[#E4002B]">6</p>
              <p className="text-[10px] text-gray-500 uppercase mt-0.5">Nairobi Outlets</p>
            </div>
            <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
              <p className="text-2xl font-black font-mono text-amber-500">100%</p>
              <p className="text-[10px] text-gray-500 uppercase mt-0.5">Kienyeji Halal</p>
            </div>
            <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
              <p className="text-2xl font-black font-mono text-emerald-500">11</p>
              <p className="text-[10px] text-gray-500 uppercase mt-0.5">Secret Spices</p>
            </div>
          </div>
        </div>

        {/* Story graphical feature */}
        <div className="lg:col-span-5 bg-neutral-950 border border-white/10 rounded-2xl p-6 text-center space-y-4">
          <img 
            src="https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600" 
            alt="Fried Chicken cooking"
            className="w-full h-48 object-cover rounded-xl border border-white/15"
          />
          <div className="text-left">
            <h4 className="text-white text-base font-bold uppercase">Our Quality Guarantee</h4>
            <p className="text-gray-400 text-xs mt-1 font-sans">
              We operate under rigorous global sanitary benchmarks. Every surface is sanitized hourly. Every cook takes standard daily safety certifications to ensure Nairobi families dine safely.
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Contact Form and WhatsApp Link */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-white font-extrabold text-lg uppercase mb-4 border-b border-white/5 pb-2">
              Send Customer Support Message
            </h3>

            {formSuccess ? (
              <div className="py-10 text-center text-emerald-400 space-y-3 font-sans">
                <span className="text-3xl">🎉</span>
                <p className="font-bold">Message Delivered to Nairobi Central Service Office!</p>
                <p className="text-xs text-gray-400">Thank you for writing. We will reply to your inbox within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. David Kiprop" 
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="david@mail.co.ke" 
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="Feedback, Event catering, delivery issue..." 
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white" 
                  />
                </div>

                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1">Your Message</label>
                  <textarea 
                    rows={4} 
                    required
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    placeholder="Describe your inquiry fully..." 
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E4002B] hover:bg-[#c30025] text-white text-xs font-black uppercase rounded-lg tracking-wider transition cursor-pointer"
                >
                  Post Message to Staff
                </button>
              </form>
            )}
          </div>

          {/* WhatsApp Direct Line Simulator click */}
          <div className="bg-neutral-900/60 p-5 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
            <div className="flex gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <MessageSquare className="w-5.5 h-5.5" />
              </div>
              <div className="text-left font-sans">
                <h4 className="text-white text-sm font-bold uppercase">WhatsApp Instant Support</h4>
                <p className="text-gray-400 text-xs mt-0.5">Automated helper to check courier location or complain.</p>
              </div>
            </div>
            
            <a
              href="https://wa.me/254700111001"
              target="_blank"
              onClick={(e) => {
                e.preventDefault();
                alert("Simulating WhatsApp dispatch call! Dialing +254 700 111 001. Habari! Express delivery desk is ready to respond.");
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase rounded tracking-wide transition whitespace-nowrap cursor-pointer"
            >
              Direct WhatsApp
            </a>
          </div>
        </div>

        {/* Right Side: Collapsible FAQs Accordion & Live Support Chatbot */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* FAQ Accordion container */}
          <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-white font-extrabold text-lg uppercase mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              Frequently Asked Questions (FAQ)
            </h3>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border-b border-white/5 pb-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left font-bold text-xs uppercase text-white flex justify-between items-center py-2 hover:text-[#E4002B] transition-colors focus:outline-none"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4.5 h-4.5 text-gray-500" /> : <ChevronDown className="w-4.5 h-4.5 text-gray-500" />}
                    </button>

                    {isOpen && (
                      <p className="text-gray-400 text-xs leading-relaxed font-sans pt-1 pb-2">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Support Chatbot widget */}
          <div className="bg-[#0c0c0c] border border-[#E4002B]/15 rounded-2xl shadow-xl overflow-hidden h-[340px] flex flex-col justify-between">
            <div className="bg-[#E4002B] px-4.5 py-3 flex justify-between items-center text-white">
              <div className="flex items-center gap-2 text-left">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Live Nairobi Chat</h4>
                  <p className="text-[9px] opacity-75">Branch Support Dispatcher On standby</p>
                </div>
              </div>
              <Phone className="w-4 h-4 text-white hover:scale-105 transition cursor-pointer" onClick={() => alert("Helpline desk active: +254 700 111 001")} />
            </div>

            {/* Chat message logger */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs bg-black/40">
              {chatLog.map((log, lIdx) => {
                const isChef = log.sender === 'chef';
                return (
                  <div 
                    key={lIdx} 
                    className={`flex flex-col max-w-[85%] ${isChef ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                  >
                    <div className={`p-3 rounded-2xl ${isChef ? 'bg-neutral-900 text-neutral-200 rounded-tl-none border border-white/5' : 'bg-[#E4002B] text-white rounded-tr-none'}`}>
                      <p className="text-left leading-relaxed">{log.text}</p>
                    </div>
                    <span className="text-[8px] text-gray-600 font-mono mt-1">{log.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat inputs footer */}
            <form onSubmit={handleSendChatMsg} className="p-3 border-t border-white/5 bg-neutral-900/90 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask e.g. Is my chicken halal?..."
                className="flex-1 bg-black border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#E4002B] outline-none"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#E4002B] hover:bg-[#c30025] text-white rounded-lg transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
