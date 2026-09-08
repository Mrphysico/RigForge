import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, X, ExternalLink, Sparkles, KeyRound } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const EmailConfirmationBanner: React.FC = () => {
  const { latestDispatchedEmail, clearEmailAlert, user } = useAuthStore();
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailDetails, setEmailDetails] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const handleEmailSent = (e: any) => {
      if (e.detail) {
        setEmailDetails({ name: e.detail.name, email: e.detail.recipient });
      }
    };
    window.addEventListener('rigforge_email_sent', handleEmailSent);
    return () => window.removeEventListener('rigforge_email_sent', handleEmailSent);
  }, []);

  if (!latestDispatchedEmail) return null;

  const recipientName = emailDetails?.name || user?.name || 'Valued Member';
  const recipientEmail = emailDetails?.email || user?.email || 'your-email@example.com';

  const hasEmailJsKeys = Boolean(
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );

  return (
    <>
      {/* Toast Alert */}
      <div className="fixed top-20 right-6 z-50 max-w-md animate-bounce">
        <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#FCA311]/60 shadow-glow-orange text-white backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FCA311]/15 text-[#FCA311] flex items-center justify-center flex-shrink-0 border border-[#FCA311]/30">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FCA311] mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FCA311]" />
                <span>CONFIRMATION EMAIL DISPATCHED</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                {latestDispatchedEmail}
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => setShowEmailPreview(true)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FCA311]/15 hover:bg-[#FCA311]/25 text-[#FCA311] border border-[#FCA311]/30 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Preview Automated Email</span>
                </button>
              </div>
            </div>

            <button
              onClick={clearEmailAlert}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#151515] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Email Client Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FCA311] font-bold">
                <Mail className="w-4 h-4" />
                <span>RigForge Mailer Engine</span>
              </div>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-[#151515] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#111111] rounded-2xl p-4 border border-[#262626] text-xs space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>To:</span>
                <span className="font-mono text-zinc-100 font-semibold">{recipientName} &lt;{recipientEmail}&gt;</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>From:</span>
                <span className="font-mono text-zinc-200">welcome@mailer.rigforge.in</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Subject:</span>
                <span className="font-semibold text-[#FCA311]">🎉 Welcome to RigForge! Your Account has been Successfully Created</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {hasEmailJsKeys ? 'Delivered via EmailJS (250 OK)' : 'Delivered to In-App Simulator (250 OK)'}
                </span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-4 rounded-2xl bg-[#111111]/70 border border-[#262626] text-xs space-y-3 leading-relaxed text-zinc-300">
              <h4 className="text-base font-bold text-white">Hello {recipientName},</h4>
              <p className="leading-relaxed">
                Your RigForge hardware account has been successfully created. Welcome to the ultimate custom PC building platform in India! You can now configure, price, and save your custom battle rigs with 100% verified component compatibility.
              </p>
              <div className="p-3 rounded-xl bg-[#151515] border border-[#262626] font-mono text-[11px] text-zinc-400 space-y-1">
                <div>• Verified Indian Courier: BlueDart / Delhivery Express Transit</div>
                <div>• GST Invoicing with Input Tax Credit Enabled</div>
                <div>• 100% Genuine Manufacturer Silicon Warranty</div>
              </div>
            </div>

            {/* Note regarding real EmailJS sending */}
            <div className="p-3 rounded-2xl bg-[#FCA311]/10 border border-[#FCA311]/30 text-xs text-[#FCA311] flex items-center gap-2">
              <KeyRound className="w-4 h-4 flex-shrink-0 text-[#FCA311]" />
              <span>
                {hasEmailJsKeys ? (
                  <strong className="text-emerald-400">EmailJS Active: Real emails are dispatched to your inbox!</strong>
                ) : (
                  <span>To receive real emails in your inbox, add your EmailJS keys in <code>.env</code></span>
                )}
              </span>
            </div>

            <button
              onClick={() => {
                setShowEmailPreview(false);
                clearEmailAlert();
              }}
              className="w-full py-3 rounded-xl bg-[#FCA311] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e5920a] shadow-glow-orange transition-all"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </>
  );
};
