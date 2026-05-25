import React, { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { Category, Collection } from '../types';

interface FooterProps {
  onSelectCategory: (category: Category | 'all') => void;
  onSelectCollection: (collection: Collection | 'all') => void;
  onOpenRefundPolicy: () => void;
}

// FIX 1: Credentials now read from environment variables (same pattern as App.tsx)
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

export const Footer: React.FC<FooterProps> = ({ onSelectCategory: _onSelectCategory, onSelectCollection: _onSelectCollection, onOpenRefundPolicy }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    // FIX 2: Use GraphQL variables instead of string interpolation to prevent injection
    const mutation = `
      mutation customerCreate($email: String!, $password: String!) {
        customerCreate(input: {
          email: $email,
          acceptsMarketing: true,
          password: $password
        }) {
          customer {
            id
            email
            acceptsMarketing
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    try {
      const res = await fetch(
        `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { email, password: crypto.randomUUID() },
          }),
        }
      );

      const data = await res.json();
      const customerErrors = data?.data?.customerCreate?.customerUserErrors;

      // EMAIL_TAKEN / CUSTOMER_DISABLED just means they're already subscribed — treat as success
      if (customerErrors?.length && customerErrors[0]?.code !== 'CUSTOMER_DISABLED' && customerErrors[0]?.code !== 'TAKEN') {
        setError('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setSubscribed(true);
      setLoading(false);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3500);

    } catch (err) {
      console.error('Subscription error:', err);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* Newsletter */}
        <div className="bg-[#242424] border border-zinc-700 p-8 md:p-16 mb-20 font-mono-street text-xs uppercase tracking-wider">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <span className="text-zinc-500 tracking-[0.2em] block">Apricity Archive List</span>
              <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-white uppercase leading-tight">
                Join the Drop Notification List
              </h3>
              <p className="text-zinc-400 text-xs font-light max-w-xl normal-case tracking-normal">
                Our limited pieces sell out rapidly. Subscribe for early private access 24 hours before public release.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={email}
                  // FIX 12: Clear error state as user types a new email
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                  disabled={loading || subscribed}
                  className="bg-[#1a1a1a] border border-zinc-700 px-4 py-4 text-xs font-mono-street text-white outline-none focus:border-zinc-400 w-full placeholder:text-zinc-600 tracking-widest disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || subscribed}
                  className="bg-white text-black font-mono-street text-xs font-extrabold uppercase px-8 py-4 hover:bg-zinc-200 transition-colors shrink-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {subscribed ? (
                    <><Check size={16} /> Subscribed</>
                  ) : loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Joining...</>
                  ) : (
                    <>Notify Me <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              {error && (
                <p className="text-[10px] text-red-400 font-mono-street mt-2 uppercase tracking-widest">
                  {error}
                </p>
              )}

              {!error && (
                <p className="text-[10px] text-zinc-600 font-mono-street mt-2 uppercase tracking-widest">
                  Zero spam. Unsubscribe anytime.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-zinc-800 font-mono-street text-[11px] uppercase">

          {/* About Us */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-heading font-extrabold text-xl tracking-[0.25em] text-white block">
              About Us
            </span>
            <div className="text-zinc-400 text-xs font-light leading-relaxed max-w-md normal-case tracking-normal space-y-2">
              <p>Apricity is built through tension and refined over time.</p>
              <p>Guided by the Three-Year Rule, we release only what proves its place. now and years from now.</p>
              <p>Quietly considered. Meant to last.</p>
            </div>
          </div>

          {/* Client Services */}
          <div className="space-y-3">
            <span className="text-white font-bold tracking-wider block pb-2 border-b border-zinc-800">
              Client Services
            </span>
            <ul className="space-y-2.5 text-zinc-400">
              <li>
                <button
                  onClick={onOpenRefundPolicy}
                  className="hover:text-white transition-colors text-left font-mono-street text-[11px] uppercase outline-none"
                >
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-3">
            <span className="text-white font-bold tracking-wider block pb-2 border-b border-zinc-800">
              Socials
            </span>
            <ul className="space-y-3 text-zinc-400">
              <li>
                <a
                  href="https://www.instagram.com/theapricity.officials?igsh=MTE1eTltM3ZoNzFqNQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-3 group"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <span className="group-hover:text-white">Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@theapricity.officials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-3 group"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-zinc-400 group-hover:text-white transition-colors"
                    >
                      <path d="M12.525.229a8.175 8.175 0 0 0 .195 1.763c.487 1.95 1.778 3.514 3.551 4.358a8.21 8.21 0 0 0 3.329.743v3.94a12.11 12.11 0 0 1-4.706-1.127 12.197 12.197 0 0 1-2.18-1.424v7.502a5.5 5.5 0 1 1-5.5-5.5c.307 0 .611.026.91.076v3.985a1.49 1.49 0 0 0-.91-.311 1.5 1.5 0 1 0 1.5 1.5V0h3.811c0 .076 0 .153.001.229z"/>
                    </svg>
                  </div>
                  <span className="group-hover:text-white">TikTok</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-mono-street text-zinc-500 uppercase tracking-widest">
          <div>© {new Date().getFullYear()} Apricity Officials. All Rights Reserved.</div>
          <div>Designed in Riyadh 🇸🇦</div>
        </div>

      </div>
    </footer>
  );
};
