import React from 'react';
import { Category, Collection } from '../lib/types';

interface CollectionsGridProps {
  onSelectCategory: (category: Category | 'all') => void;
  onSelectCollection: (collection: Collection | 'all') => void;
}

export const CollectionsGrid: React.FC<CollectionsGridProps> = ({
  onSelectCategory,
  onSelectCollection
}) => {
  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] font-mono-street text-zinc-400">Collections</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl uppercase text-[#1a1a1a] mt-1">
            Explore the Archive
          </h2>
        </div>
        <span className="text-[11px] font-mono-street text-zinc-400 uppercase tracking-widest mt-4 md:mt-0">Season '26</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div
          onClick={() => { onSelectCategory('men'); onSelectCollection('all'); }}
          className="group relative h-[460px] overflow-hidden cursor-pointer"
        >
          <img
            src="/images/man.png"
            alt="Men"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
            <span className="text-[10px] font-mono-street tracking-[0.2em] text-white/60 uppercase">Category</span>
            <h3 className="font-heading font-extrabold text-2xl text-white uppercase mt-0.5">Men</h3>
            <span className="text-[11px] font-mono-street tracking-widest text-white/60 mt-2 group-hover:text-white transition-colors">Shop Collection →</span>
          </div>
        </div>

        <div
          onClick={() => { onSelectCategory('women'); onSelectCollection('all'); }}
          className="group relative h-[460px] overflow-hidden cursor-pointer"
        >
          <img
            src="/images/woman.png"
            alt="Women"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
            <span className="text-[10px] font-mono-street tracking-[0.2em] text-white/60 uppercase">Category</span>
            <h3 className="font-heading font-extrabold text-2xl text-white uppercase mt-0.5">Women</h3>
            <span className="text-[11px] font-mono-street tracking-widest text-white/60 mt-2 group-hover:text-white transition-colors">Shop Collection →</span>
          </div>
        </div>

        <div
          onClick={() => { onSelectCategory('all'); onSelectCollection('new-drops'); }}
          className="group relative h-[460px] overflow-hidden cursor-pointer"
        >
          <img
            src="/images/both.png"
            alt="New Drops"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
            <span className="text-[10px] font-mono-street tracking-[0.2em] text-white/60 uppercase">Capsule</span>
            <h3 className="font-heading font-extrabold text-2xl text-white uppercase mt-0.5">New Drops</h3>
            <span className="text-[11px] font-mono-street tracking-widest text-white/60 mt-2 group-hover:text-white transition-colors">Discover Pieces →</span>
          </div>
        </div>

        <div
          onClick={() => { onSelectCategory('all'); onSelectCollection('sale'); }}
          className="group relative h-[460px] overflow-hidden cursor-pointer"
        >
          <img
            src="/images/sale.png"
            alt="Sale Collection"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
            <span className="text-[10px] font-mono-street tracking-[0.2em] text-white/60 uppercase">Seasonal</span>
            <h3 className="font-heading font-extrabold text-2xl text-white uppercase mt-0.5">SALE</h3>
            <span className="text-[11px] font-mono-street tracking-widest text-white/60 mt-2 group-hover:text-white transition-colors">Shop Sale →</span>
          </div>
        </div>

      </div>
    </section>
  );
};
