import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'apricity_discount_popup_shown';

export const DiscountPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Only show once per browser session for first-time visitors
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyShown) return;

    // Wait until site fully loads
    const handleLoad = () => {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setVisible(true);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('APY-15').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Top black band */}
        <div className="bg-[#1a1a1a] px-8 py-6 text-center">
          <img
            src="/images/logo.png"
            alt="Apricity"
            className="h-10 w-10 object-contain mx-auto mb-3 opacity-80"
          />
          <p className="font-mono-street text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">
            Welcome to
          </p>
          <h2 className="text-white font-heading font-extrabold text-2xl tracking-[0.2em] uppercase">
            Apricity
          </h2>
        </div>

        {/* Content */}
        <div className="px-8 py-8 text-center flex flex-col items-center gap-5">

          {/* Offer 1 — discount */}
          <div className="w-full border border-zinc-100 rounded-xl px-6 py-4 bg-zinc-50">
            <p className="font-heading font-bold text-3xl text-[#1a1a1a] mb-1">15% Off</p>
            <p className="text-zinc-500 text-sm font-light">when you purchase two or more items</p>
          </div>

          {/* Offer 2 — free shipping */}
          <div className="w-full border border-zinc-100 rounded-xl px-6 py-4 bg-zinc-50 flex items-center justify-center gap-3">
            <span className="text-2xl">🇸🇦</span>
            <p className="text-zinc-700 text-sm font-light">Free shipping with no minimum order</p>
          </div>

          <p className="text-zinc-400 text-xs font-mono-street tracking-wider uppercase leading-relaxed">
            Apply code at checkout
          </p>

          {/* Code box */}
          <button
            onClick={handleCopy}
            className="w-full border-2 border-dashed border-zinc-300 hover:border-zinc-900 rounded-xl py-4 px-6 transition-all group"
          >
            <span className="font-mono-street font-bold text-xl tracking-[0.3em] text-[#1a1a1a] group-hover:text-zinc-600 transition-colors">
              APY-15
            </span>
            <p className="text-[10px] text-zinc-400 mt-1 font-mono-street tracking-widest uppercase">
              {copied ? '✓ Copied!' : 'Tap to copy'}
            </p>
          </button>

          <button
            onClick={() => setVisible(false)}
            className="w-full bg-[#1a1a1a] text-white font-mono-street text-xs uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-zinc-700 transition-colors"
          >
            Shop Now
          </button>

          <button
            onClick={() => setVisible(false)}
            className="text-[11px] text-zinc-400 font-mono-street uppercase tracking-widest hover:text-zinc-600 transition-colors"
          >
            No thanks
          </button>
        </div>

      </div>
    </div>
  );
};
