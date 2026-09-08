import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const isError = type === 'error' || message.toLowerCase().includes('fail') || message.toLowerCase().includes('error');
  const isWarning = type === 'warning' || message.toLowerCase().includes('warn') || message.toLowerCase().includes('stock');

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 max-w-sm w-[calc(100%-2.5rem)] sm:w-auto animate-fadeIn pointer-events-auto">
      <div className={`flex items-center gap-3 py-3 px-4 rounded-2xl bg-[#111111] border text-white shadow-2xl backdrop-blur-md ${
        isError 
          ? 'border-red-500/40 shadow-[0_0_25px_-5px_rgba(239,68,68,0.25)]' 
          : isWarning
          ? 'border-[#FCA311]/50 shadow-glow-orange'
          : 'border-[#FCA311]/40 shadow-glow-orange'
      }`}>
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isError
            ? 'bg-red-500/20 text-red-400'
            : isWarning
            ? 'bg-[#FCA311]/20 text-[#FCA311]'
            : 'bg-[#FCA311]/20 text-[#FCA311]'
        }`}>
          {isError ? (
            <AlertCircle className="w-4 h-4" />
          ) : isWarning ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#FCA311]" />
          )}
        </div>

        <div className="text-xs font-semibold pr-2 leading-relaxed min-w-0">
          {message}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#1F1F1F] transition-colors ml-auto flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
