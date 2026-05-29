import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronUp, Search } from 'lucide-react';
import { COUNTRIES, CountryInfo } from '../lib/countries';

export { COUNTRIES };
export type { CountryInfo };

interface CountrySelectorProps {
  selectedCountry: string;
  onSelectCountry: (code: string) => void;
}

// Pinned popular countries for rapid access
const PINNED_CODES = ['SA', 'AE', 'QA', 'OM', 'BH', 'KW', 'US', 'GB', 'IN', 'EU'];

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onSelectCountry,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const activeCountry = COUNTRIES[selectedCountry] || COUNTRIES.SA;

  // Split and filter countries dynamically based on the search query
  const { pinnedCountries, remainingCountries, searchResults } = useMemo(() => {
    const allList = Object.values(COUNTRIES);

    if (searchQuery.trim() === '') {
      // Pinned list in exact specified order
      const pinned = PINNED_CODES.map(code => COUNTRIES[code]).filter(Boolean);
      // All other countries sorted alphabetically
      const remaining = allList
        .filter(c => !PINNED_CODES.includes(c.code))
        .sort((a, b) => a.name.localeCompare(b.name));

      return { pinnedCountries: pinned, remainingCountries: remaining, searchResults: [] };
    }

    // Perform search
    const query = searchQuery.toLowerCase();
    const filtered = allList
      .filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.currency.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query)
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    return { pinnedCountries: [], remainingCountries: [], searchResults: filtered };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search query when dropdown closes/opens
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const renderCountryRow = (country: CountryInfo) => {
    const isSelected = selectedCountry === country.code;
    return (
      <button
        key={country.code}
        onClick={() => {
          onSelectCountry(country.code);
          setIsOpen(false);
        }}
        className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-mono-street font-medium tracking-wide transition-all ${
          isSelected
            ? 'bg-zinc-900 text-white font-bold'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-[#1a1a1a]'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base select-none">{country.flag}</span>
          <span className="truncate max-w-[130px]">{country.name}</span>
        </div>
        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'}`}>
          {country.currency}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-6 left-6 z-40" ref={containerRef}>
      {/* Geolocation Loading / Selection Popup */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-3 bg-white/95 backdrop-blur-lg border border-zinc-200/50 shadow-[0_10px_35px_rgba(0,0,0,0.12)] rounded-2xl p-1.5 flex flex-col gap-1 w-64 max-h-80 transform origin-bottom-left transition-all duration-300">
          <div className="px-3 pt-2 pb-1 text-[9px] uppercase tracking-widest font-mono-street text-zinc-400 font-bold border-b border-zinc-100/60 flex items-center justify-between">
            <span>Select Region</span>
            <span className="text-[8px] font-medium text-zinc-300 font-mono-street">({Object.keys(COUNTRIES).length} total)</span>
          </div>

          {/* Sleek Search Input */}
          <div className="relative my-1 px-1">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-[11px] border border-zinc-200/80 rounded-xl focus:border-zinc-900 focus:outline-none bg-zinc-50/50 font-mono-street transition-colors"
              autoFocus
            />
          </div>

          {/* Countries List Area */}
          <div className="flex-1 overflow-y-auto scrollbar-none pr-0.5 max-h-56 flex flex-col gap-0.5">
            {searchQuery.trim() === '' ? (
              <>
                {/* Pinned Section */}
                <div className="px-3 py-1 text-[8px] uppercase tracking-widest font-mono-street text-zinc-400/80 font-bold">
                  Popular
                </div>
                {pinnedCountries.map(renderCountryRow)}

                {/* Divider */}
                <div className="border-t border-zinc-100 my-1"></div>

                {/* All Countries Section */}
                <div className="px-3 py-1 text-[8px] uppercase tracking-widest font-mono-street text-zinc-400/80 font-bold">
                  All Countries
                </div>
                {remainingCountries.map(renderCountryRow)}
              </>
            ) : (
              <>
                {searchResults.length > 0 ? (
                  searchResults.map(renderCountryRow)
                ) : (
                  <div className="px-3 py-6 text-center text-[10px] text-zinc-400 font-mono-street">
                    No countries found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Selector Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/95 backdrop-blur-lg border border-zinc-200/60 shadow-[0_4px_15px_rgba(0,0,0,0.06)] text-[#1a1a1a] pl-3.5 pr-4 py-2.5 rounded-full flex items-center gap-2.5 text-xs font-mono-street font-bold tracking-wider hover:bg-zinc-900 hover:text-white hover:border-zinc-900 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-pointer select-none active:scale-95 animate-fade-in"
      >
        <span className="text-base leading-none select-none">{activeCountry.flag}</span>
        <span className="uppercase text-[10px] tracking-widest">{activeCountry.name} ({activeCountry.currency})</span>
        <ChevronUp size={13} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
