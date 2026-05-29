import { Link } from '@remix-run/react';

export default function TheRulePage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">

      {/* Back nav */}
      <div className="px-6 md:px-16 pt-8">
        <Link
          to="/"
          className="font-mono-street text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          ← Back
        </Link>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* LEFT: Image */}
          <div className="w-full">
            <img
              src="/images/rule.png"
              alt="The Three-Year Rule"
              className="w-full h-auto object-cover rounded-sm"
            />
          </div>

          {/* RIGHT: Text */}
          <div className="flex flex-col gap-8">

            <div>
              <span className="font-mono-street text-[11px] uppercase tracking-[0.25em] text-zinc-400 block mb-4">
                The Philosophy
              </span>
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-[#1a1a1a] uppercase leading-tight tracking-tight mb-2">
                The Three-Year Rule
              </h1>
              <span className="font-mono-street font-bold text-sm tracking-[0.2em] text-[#1a1a1a] uppercase">
                APY
              </span>
            </div>

            <div className="space-y-4 text-zinc-600 text-[15px] leading-relaxed font-light">
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
              <p className="font-medium text-[#1a1a1a]">
                APRICITY is not the result of agreement. It's the result of what survives it.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-200">
              <Link
                to="/"
                className="inline-block bg-[#1a1a1a] text-white font-mono-street text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-zinc-700 transition-colors"
              >
                Shop the Collection
              </Link>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
