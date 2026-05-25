import React, { useState } from 'react';
import { Product } from '../lib/types';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  formatPrice: (amountInSAR: number) => string;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, products, onSelectProduct, formatPrice }) => {
  const [query, setQuery] = useState('');
  if (!isOpen) return null;

  const results = query.trim() === ''
    ? []
    : products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.subCategory.toLowerCase().includes(query.toLowerCase()) ||
        p.collection.toLowerCase().includes(query.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

  const trending = ['Signature Hoodie', 'Summer Drop', 'Linen Shirt', 'Sweatshirt', 'Cargo Trousers'];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col p-6 md:p-16 animate-fade-in font-mono-street text-xs">
      <div className="max-w-4xl mx-auto w-full relative border-b border-zinc-200 pb-6 flex items-center gap-4 mt-8">
        <Search size={22} className="text-zinc-400 shrink-0" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pieces..."
          className="bg-transparent text-[#1a1a1a] font-heading font-extrabold text-xl sm:text-3xl w-full outline-none placeholder:text-zinc-300 tracking-wider uppercase"
        />
        {query && <button onClick={() => setQuery('')} className="text-zinc-400 hover:text-[#1a1a1a] p-2 uppercase text-[11px]">Clear</button>}
        <button onClick={onClose} className="p-2 text-zinc-400 hover:text-[#1a1a1a]" aria-label="Close"><X size={22} /></button>
      </div>

      {query.trim() === '' && (
        <div className="max-w-4xl mx-auto w-full pt-12 animate-fade-in uppercase">
          <span className="text-zinc-400 tracking-[0.2em] block mb-4 text-[11px]">Trending</span>
          <div className="flex flex-wrap gap-2">
            {trending.map((tag) => (
              <button key={tag} onClick={() => setQuery(tag)} className="px-4 py-2 bg-[#f3f2f0] hover:bg-zinc-200 border border-zinc-200 text-zinc-500 text-[11px] tracking-widest uppercase transition-colors">{tag}</button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto py-12">
        {query.trim() !== '' && results.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 uppercase tracking-widest text-sm">No pieces match "{query}".</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 uppercase">
            {results.map((product) => (
              <div key={product.id} onClick={() => { onSelectProduct(product); onClose(); }} className="group bg-[#f3f2f0] border border-zinc-200 p-4 flex gap-4 items-center cursor-pointer hover:border-zinc-400 transition-colors">
                <img src={product.images[0]} alt="" className="w-14 h-18 object-cover bg-white shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">{product.category}</span>
                  <h4 className="font-heading font-bold text-[#1a1a1a] text-sm truncate group-hover:text-zinc-500 transition-colors">{product.name}</h4>
                  <span className="text-[#1a1a1a] font-bold text-[11px] mt-0.5 block">{formatPrice(product.price)}</span>
                </div>
                <ArrowRight size={14} className="text-zinc-300 group-hover:text-[#1a1a1a] transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
