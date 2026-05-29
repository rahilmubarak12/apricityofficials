import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { Category, Collection } from '../lib/types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategory: (category: Category | 'all') => void;
  onSelectCollection: (collection: Collection | 'all') => void;
  activeCategory: string;
  activeCollection: string;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onSelectCategory,
  onSelectCollection,
  activeCategory,
  activeCollection,
  onOpenSearch
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // triggers sooner for smoother glassmorphic fade
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLightNav = isScrolled && !mobileMenuOpen;
  const navBg = mobileMenuOpen
    ? 'bg-black/95 backdrop-blur-md border-b border-zinc-800'
    : isScrolled
    ? 'bg-[#faf9f7]/85 backdrop-blur-md border-b border-zinc-200/40 shadow-sm'
    : 'bg-gradient-to-b from-black/50 to-transparent';

  const textColor = isLightNav ? 'text-[#1a1a1a]' : 'text-white';
  const textMuted = isLightNav ? 'text-zinc-500' : 'text-white/70';
  const logoColor = isLightNav ? 'text-[#1a1a1a]' : 'text-white';

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Announcement Bar — FIX 13: marquee animation on mobile so full text is always readable */}
      <div className="bg-black/95 backdrop-blur-sm text-white/70 text-[10px] sm:text-[11px] font-mono-street tracking-[0.2em] py-2.5 px-4 text-center uppercase overflow-hidden">
        <span className="inline-block sm:inline animate-marquee sm:animate-none whitespace-nowrap">
          Complimentary Shipping Across Saudi Arabia
        </span>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 px-4 sm:px-6 lg:px-16 py-4 lg:py-5 ${navBg}`}
      >
        <div className="grid grid-cols-3 items-center">
          
          {/* LEFT: Mobile Menu Trigger (Mobile) / Navigation Links (Desktop) */}
          <div className="flex items-center justify-start">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden transition-colors p-1 ${textColor}`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8 text-[17px] font-mono-street tracking-[0.06em] uppercase font-medium">
              <button
                onClick={() => { onSelectCategory('men'); onSelectCollection('all'); }}
                className={`pb-1 relative transition-colors nav-link-hover ${
                  activeCategory === 'men' && activeCollection === 'all'
                    ? 'font-bold border-b border-current ' + textColor
                    : textMuted + ' hover:' + textColor
                }`}
              >
                Men
              </button>

              <button
                onClick={() => { onSelectCategory('women'); onSelectCollection('all'); }}
                className={`pb-1 relative transition-colors nav-link-hover ${
                  activeCategory === 'women' && activeCollection === 'all'
                    ? 'font-bold border-b border-current ' + textColor
                    : textMuted + ' hover:' + textColor
                }`}
              >
                Women
              </button>

              <button
                onClick={() => { onSelectCategory('all'); onSelectCollection('new-drops'); }}
                className={`pb-1 relative transition-colors nav-link-hover ${
                  activeCollection === 'new-drops'
                    ? 'font-bold border-b border-current ' + textColor
                    : textMuted + ' hover:' + textColor
                }`}
              >
                New Drops
              </button>



              <button
                onClick={() => { onSelectCategory('all'); onSelectCollection('sale'); }}
                className={`pb-1 relative transition-colors nav-link-hover ${
                  activeCollection === 'sale'
                    ? 'font-bold border-b border-current ' + textColor
                    : textMuted + ' hover:' + textColor
                }`}
              >
                Sale
              </button>

              {/* Desktop Contact Dropdown */}
              <div className="relative group flex items-center">
                <button
                  className={`pb-1 relative transition-colors nav-link-hover ${textMuted} hover:${textColor} outline-none cursor-pointer`}
                >
                  Contact
                </button>
                <div className="absolute left-0 top-full mt-2 w-72 bg-black border border-zinc-800 text-white p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 rounded-sm">
                  <div className="flex flex-col space-y-4 text-[10px] tracking-[0.15em] font-mono-street uppercase text-left">
                    <span className="text-zinc-500 border-b border-zinc-800 pb-1.5 block font-bold text-[11px] tracking-widest">Contact Details</span>
                    <div className="space-y-1">
                      <span className="text-zinc-600 block text-[8px] font-bold">WhatsApp Support</span>
                      <a 
                        href="https://wa.me/966536470644" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white hover:text-zinc-300 transition-colors block text-[11px] font-semibold"
                      >
                        +966 53 647 0644
                      </a>
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-600 block text-[8px] font-bold">Email Inquiry</span>
                      <a 
                        href="mailto:theapricity.officials@gmail.com" 
                        className="text-white hover:text-zinc-300 transition-colors block text-[10px] lowercase tracking-normal font-semibold break-all"
                      >
                        theapricity.officials@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER LOGO IMAGE + TEXT */}
          <div
            className="flex flex-col items-center justify-center cursor-pointer select-none gap-1"
            onClick={() => { onSelectCategory('all'); onSelectCollection('all'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <img 
              src="images/logo.png" 
              alt="Apricity Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain transition-all" 
            />
            <span className={`font-heading font-extrabold text-sm sm:text-lg lg:text-xl tracking-[0.3em] uppercase transition-all leading-none ${logoColor}`}>
              APRICITY
            </span>
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 justify-end text-sm sm:text-[17px] font-mono-street uppercase tracking-[0.1em] font-medium">
            <button
              onClick={onOpenSearch}
              className={`transition-colors flex items-center gap-2 p-1 hover:opacity-80 ${textColor}`}
              aria-label="Search"
            >
              <Search size={22} className="sm:w-[24px] sm:h-[24px]" />
              <span className="hidden md:inline">Search</span>
            </button>

            <button
              onClick={onOpenCart}
              className={`relative transition-all flex items-center gap-1.5 p-1 hover:opacity-80 ${textColor}`}
              aria-label="Bag"
            >
              <ShoppingBag size={22} className="sm:w-[24px] sm:h-[24px]" />
              <span className="text-sm sm:text-base">
                <span className="hidden sm:inline">Cart </span>({cartCount})
              </span>
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {/* FIX 6: Added a close button at the bottom of the mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-lg border-b border-zinc-800 h-screen w-full transition-all duration-300 flex flex-col">
          <div className="flex flex-col space-y-6 font-mono-street text-lg tracking-[0.25em] uppercase text-center pt-12 px-6 flex-1">
            <button 
              onClick={() => { onSelectCategory('men'); onSelectCollection('all'); setMobileMenuOpen(false); }}
              className={`py-2 transition-colors ${activeCategory === 'men' && activeCollection === 'all' ? 'text-white font-bold' : 'text-zinc-400'}`}
            >
              Men
            </button>
            <button 
              onClick={() => { onSelectCategory('women'); onSelectCollection('all'); setMobileMenuOpen(false); }}
              className={`py-2 transition-colors ${activeCategory === 'women' && activeCollection === 'all' ? 'text-white font-bold' : 'text-zinc-400'}`}
            >
              Women
            </button>
            <button 
              onClick={() => { onSelectCategory('all'); onSelectCollection('new-drops'); setMobileMenuOpen(false); }}
              className={`py-2 transition-colors ${activeCollection === 'new-drops' ? 'text-white font-bold' : 'text-zinc-400'}`}
            >
              New Drops
            </button>

            <button 
              onClick={() => { onSelectCategory('all'); onSelectCollection('sale'); setMobileMenuOpen(false); }}
              className={`py-2 transition-colors ${activeCollection === 'sale' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              Sale
            </button>

            {/* Mobile Contact Info */}
            <div className="pt-6 border-t border-zinc-800 flex flex-col items-center gap-3">
              <span className="text-zinc-500 text-[10px] tracking-[0.2em] font-bold">Contact Us</span>
              <div className="flex flex-col items-center gap-2">
                <a 
                  href="https://wa.me/966536470644" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-zinc-300 font-semibold text-xs tracking-wider"
                >
                  WhatsApp: +966536470644
                </a>
                <a 
                  href="mailto:theapricity.officials@gmail.com" 
                  className="text-white hover:text-zinc-300 font-semibold text-[11px] lowercase tracking-normal"
                >
                  theapricity.officials@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Close button anchored at the bottom of the drawer */}
          <div className="px-6 pb-16 pt-4 flex justify-center">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-8 py-3 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-400 font-mono-street text-[11px] uppercase tracking-widest transition-colors"
              aria-label="Close menu"
            >
              <X size={14} /> Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
