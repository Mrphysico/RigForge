import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  AlertCircle, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Send, 
  PhoneCall, 
  Mail, 
  X,
  FileText
} from 'lucide-react';

interface SupportPageProps {
  onNavigate: (page: 'home' | 'builds' | 'builder' | 'community' | 'marketplace' | 'guides' | 'support') => void;
  onNotification: (msg: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    question: 'How to create and configure a custom build?',
    answer: 'Navigate to the "Builds" or "Create Build" configurator tab. Step through each of the 9 hardware categories (CPU, Motherboard, RAM, GPU, Storage, PSU, Case, Cooling, Peripherals). Our real-time validation engine will ensure socket compatibility, DDR4/DDR5 matching, and calculate estimated wattage dynamically.',
  },
  {
    question: 'How to post and share setups in the Community?',
    answer: 'Head to the Community tab and click the red "Create Post" button. You can upload photos of your gaming desk, share Cinebench/3DMark scores, or ask other Indian PC enthusiasts for component advice.',
  },
  {
    question: 'How does purchasing from the Marketplace work?',
    answer: 'Browse components with live INR (₹) retail prices. Add items to your cart and proceed through our seamless checkout featuring instant UPI QR Code payments (Google Pay, PhonePe, Paytm, BHIM) and real-time order tracking.',
  },
  {
    question: 'Account and login issues or password resets?',
    answer: 'If you encounter login issues, make sure cookies are enabled. You can reset your password using the "Forgot password?" link on the sign-in modal, or use our 1-click Google OAuth button.',
  },
  {
    question: 'Pan-India Insured Courier via BlueDart & Delhivery?',
    answer: 'All orders over ₹10,000 ship free with 100% transit insurance. Components are packed in anti-static ESD shielding bags with heavy foam shock protection. Delivery typically takes 2-4 business days across metro cities and 4-6 days across rest of India.',
  },
  {
    question: 'GST Tax Invoices & Brand Warranty Coverage?',
    answer: 'Every purchase includes a verified GST tax invoice with full Input Tax Credit (ITC) eligibility for businesses. All parts come with official manufacturer warranty in India (Intel 3-year, AMD 3-year, ASUS/MSI 3-year, Corsair 5 to 10-year).',
  },
];

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate, onNotification }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      onNotification('Please fill in both the subject and message.');
      return;
    }
    setShowContactModal(false);
    setTicketSubject('');
    setTicketMessage('');
    onNotification('Support ticket #RF-9842 created! Our engineering team will respond within 2 hours.');
  };

  const filteredFaqs = FAQ_LIST.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 bg-[#050a14] text-slate-100">
      {/* Header Banner */}
      <div className="border-b border-[#1e2d4f] bg-gradient-to-b from-[#08111f] to-[#050a14] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142244] border border-[#1e2d4f] text-[#0066ff] text-xs font-mono font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>24/7 DEDICATED HARDWARE SUPPORT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-mono">
            SUPPORT <span className="text-[#0066ff]">CENTER</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
            We're here to help. Explore frequent topics, contact our build specialists, or connect with 50,000+ builders in the community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* 4 Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div 
            onClick={() => onNavigate('guides')}
            className="group bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] hover:border-[#0066ff]/60 rounded-2xl p-6 transition-all cursor-pointer shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-[#050a14] border border-[#1e2d4f] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6 text-[#0066ff]" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-[#0066ff] transition-colors">
              Help Center
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Browse articles, benchmark guides, and component walkthroughs.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => setShowContactModal(true)}
            className="group bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] hover:border-[#0066ff]/60 rounded-2xl p-6 transition-all cursor-pointer shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-[#050a14] border border-[#1e2d4f] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6 text-[#0066ff]" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-[#0066ff] transition-colors">
              Contact Support
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Get in touch with our engineering team for custom build assistance.
            </p>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => {
              setTicketSubject('Problem Report: ');
              setShowContactModal(true);
            }}
            className="group bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] hover:border-[#ff1e2d]/60 rounded-2xl p-6 transition-all cursor-pointer shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-[#050a14] border border-[#1e2d4f] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-6 h-6 text-[#ff1e2d]" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-[#ff1e2d] transition-colors">
              Report a Problem
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Let us know about an order bug, delivery issue, or broken link.
            </p>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => onNavigate('community')}
            className="group bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] hover:border-[#ffd000]/60 rounded-2xl p-6 transition-all cursor-pointer shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-[#050a14] border border-[#1e2d4f] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6 text-[#ffd000]" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-[#ffd000] transition-colors">
              Community Help
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Ask 50K+ fellow builders in our verified community forum.
            </p>
          </div>
        </div>

        {/* Popular Topics & Help Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Accordions */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xl font-black text-white font-mono uppercase tracking-wider mb-2">
              Popular Topics &amp; FAQs
            </h2>

            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-[#0d172e] border border-[#1e2d4f] rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-[#0066ff] transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#0066ff] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-[#1e2d4f]/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Help Box */}
          <div className="lg:col-span-4 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help topics..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#0d172e] text-white placeholder-slate-400 rounded-xl border border-[#1e2d4f] focus:outline-none focus:border-[#0066ff] transition-all"
              />
            </div>

            {/* Contact Callout Card */}
            <div className="bg-gradient-to-br from-[#0d172e] to-[#142244] border border-[#1e2d4f] rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-black text-base text-white uppercase font-mono">
                Need More Help?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our certified hardware technicians are available 24/7 to assist with part compatibility, custom liquid cooling loops, or invoice inquiries.
              </p>

              <div className="space-y-2 pt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#0066ff]" />
                  <span>support@rigforge.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#0066ff]" />
                  <span>+91 (022) 800-RIGFORGE</span>
                </div>
              </div>

              <button
                onClick={() => setShowContactModal(true)}
                className="w-full py-3 rounded-xl bg-[#ff1e2d] hover:bg-[#e50914] text-white font-bold text-xs shadow-glow-red transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Support Directly</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Ticket Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0d172e] border border-[#1e2d4f] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#142244]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white">Contact RigForge Support</h2>
            <p className="text-xs text-slate-400">
              Submit your inquiry and our hardware specialists will reach out via email.
            </p>

            <form onSubmit={handleSendTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Subject / Query</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="E.g., Compatibility check for RTX 4070 Super and 650W PSU"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050a14] border border-[#1e2d4f] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#0066ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Detailed Message</label>
                <textarea
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe your setup, requirements, or issue in detail..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050a14] border border-[#1e2d4f] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#0066ff] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold text-xs shadow-glow-blue flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
