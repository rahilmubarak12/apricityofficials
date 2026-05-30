import React from 'react';
import { X } from 'lucide-react';

interface TheRuleProps {
  onBack: () => void;
}

export const TheRule: React.FC<TheRuleProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white">

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 pt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700 transition-colors font-mono-street text-xs uppercase tracking-[0.2em]"
        >
          <X size={14} />
          Close
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* LEFT: Image — tall */}
          <div className="w-full">
            <img
              src="/images/rule.png"
              alt="The Three-Year Rule"
              className="w-full object-cover rounded-sm"
              style={{ height: '75vh', minHeight: '500px' }}
            />
          </div>

          {/* RIGHT: Text — roughly half the image height, scrollable if needed */}
          <div
            className="flex flex-col gap-6 overflow-y-auto pr-1"
            style={{ maxHeight: '37.5vh', minHeight: '250px' }}
          >
            <div>
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-[#1a1a1a] uppercase leading-tight tracking-tight mb-1">
                The Three-Year Rule
              </h1>
              <span className="font-mono-street font-bold text-xs tracking-[0.2em] text-[#1a1a1a] uppercase">
                APY
              </span>
            </div>

            <div className="space-y-4 text-[#1a1a1a] text-[15px] leading-relaxed">
              <p>
                Apricity exists because we rarely agree. Unusual for a brand? Exactly. For years, our differences have shaped everything we build. One of us instinctively edits. The other instinctively pushes. We don't settle quickly. We don't meet in the middle just to move forward.
              </p>
              <p>
                Most ideas don't survive that tension. They're questioned. Reduced. Challenged. Left alone. Revisited. If something feels obvious, it's gone. If it only works for the moment, it's gone.
              </p>
              <p>
                And even if an idea survives us, it faces one final rule: The Three-Year Rule.
              </p>
              <p>
                Before anything becomes APRICITY, we ask one question: Will this still make sense three years from now? Not next season. Not next drop. Three years.
              </p>
              <p>
                If we can't see ourselves standing behind it with the same certainty, it doesn't exist. No trend protection. No hype insurance. No "it'll do for now."
              </p>
              <p>
                If it survives disagreement — and it survives time — it earns the name.
              </p>
              <p className="font-semibold">
                APRICITY is not the result of agreement. It's the result of what survives it.
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-200">
              <button
                onClick={onBack}
                className="inline-block bg-[#1a1a1a] text-white font-mono-street text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-zinc-700 transition-colors"
              >
                Shop the Collection
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
