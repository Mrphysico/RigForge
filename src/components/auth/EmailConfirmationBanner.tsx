import React, { useState } from 'react';
import { Mail, CheckCircle2, X, ExternalLink, Sparkles, KeyRound } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const EmailConfirmationBanner: React.FC = () => {
  const { latestDispatchedEmail, clearEmailAlert, user } = useAuthStore();
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  if (!latestDispatchedEmail) return null;

  const recipientName = user?.name || 'Arth Jadav';
  const recipientEmail = user?.email || 'jadavarth07@gmail.com';

  const hasEmailJsKeys = Boolean(
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );

  return (
    <>
      {/* Toast Alert */}
      <div className="fixed top-20 right-6 z-50 max-w-md animate-bounce">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-cyan-500/60 shadow-glow-cyan text-white backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>CONFIRMATION EMAIL DISPATCHED</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                {latestDispatchedEmail}
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => setShowEmailPreview(true)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Preview Automated Email</span>
                </button>
              </div>
            </div>

            <button
              onClick={clearEmailAlert}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Email Client Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                <Mail className="w-4 h-4" />
                <span>RigForge Mailer Engine</span>
              </div>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-zinc-900/90 rounded-xl p-4 border border-zinc-800 text-xs space-y-2">
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
                <span className="font-semibold text-cyan-300">🎉 Welcome to RigForge! Your Account has been Successfully Created</span>
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
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs space-y-3 leading-relaxed text-zinc-300">
              <h4 className="text-base font-bold text-white">Hello {recipientName},</h4>
              <p className="leading-relaxed">
                Your RigForge hardware account has been successfully created. Welcome to the ultimate custom PC building platform in India! You can now configure, price, and save your custom battle rigs with 100% verified component compatibility.
              </p>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 font-mono text-[11px] text-zinc-400 space-y-1">
                <div>• Verified Indian Courier: BlueDart / Delhivery Express Transit</div>
                <div>• GST Invoicing with Input Tax Credit Enabled</div>
                <div>• 100% Genuine Manufacturer Silicon Warranty</div>
              </div>
            </div>

            {/* Note regarding real EmailJS sending */}
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4 flex-shrink-0 text-amber-400" />
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
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 shadow-glow-cyan"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </>
  );
};
