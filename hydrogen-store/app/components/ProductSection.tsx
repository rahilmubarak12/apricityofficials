import React, { useState, useMemo } from 'react';
import { Product, Category, Collection } from '../lib/types';

interface ProductSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  selectedCategory: string;
  selectedCollection: string;
  onSelectCategory: (cat: Category | 'all') => void;
  onSelectCollection: (col: Collection | 'all') => void;
  formatPrice: (amountInSAR: number) => string;
  formatPriceCompact: (amountInSAR: number) => string;
}

// FIX 9: Skeleton card for loading state
const SkeletonCard: React.FC = () => (
  <div className="flex flex-col">
    <div className="h-[220px] sm:h-[380px] w-full animate-shimmer mb-3 sm:mb-4" />
    <div className="h-2 animate-shimmer rounded w-1/3 mb-2" />
    <div className="h-4 animate-shimmer rounded w-3/4 mb-3" />
    <div className="h-px bg-[#f3f2f0] w-full mb-2" />
    <div className="flex justify-between">
      <div className="h-3 animate-shimmer rounded w-1/4" />
      <div className="h-3 animate-shimmer rounded w-1/6" />
    </div>
  </div>
);

export const ProductSection = React.memo(({
  products,
  onSelectProduct,
  onQuickAdd,
  selectedCategory,
  selectedCollection,
  onSelectCategory,
  onSelectCollection,
  formatPrice,
  formatPriceCompact
}: ProductSectionProps) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const category = (p.category || '').toLowerCase().trim();

      if (selectedCategory !== 'all') {
        const target = selectedCategory.toLowerCase().trim();
        switch (target) {
          case 'men':
            if (!(category === 'men' || category === 'unisex')) return false;
            break;
          case 'women':
            if (!(category === 'women' || category === 'unisex')) return false;
            break;
          case 'unisex':
            if (category !== 'unisex') return false;
            break;
        }
      }

      if (selectedCollection !== 'all') {
        const matchesCollection = p.collection === selectedCollection || (p.collections && p.collections.includes(selectedCollection as Collection));
        if (!matchesCollection) return false;
      }

      // Hide completely out-of-stock products from New Drops
      if (selectedCollection === 'new-drops') {
        const allOOS = p.variants && p.variants.length > 0 && p.variants.every((v: any) => v.stock <= 0);
        if (allOOS) return false;
      }

      if (activeSubcategory !== 'all') {
        const matchesSubcategoryProperty = p.subCategory === activeSubcategory;
        // FIX 5: p.tags is now preserved on the product, so this filter actually works
        const matchesShopifyTags = (p as any).tags?.some(
          (tag: string) => tag.toLowerCase() === activeSubcategory.toLowerCase()
        );
        if (!matchesSubcategoryProperty && !matchesShopifyTags) return false;
      }

      return true;
    });
  }, [products, selectedCategory, selectedCollection, activeSubcategory]);

  const subcategoryLabels: Record<string, string> = {
    all: 'All',
    hoodie: 'Hoodies',
    't-shirt': 'T-Shirts',
    shirt: 'Shirts',
    sweatshirt: 'Sweatshirts',
    'trouser-short': 'Trousers & Shorts'
  };

  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto" id="shop-catalog">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-zinc-200 gap-6">

        <div>
          <span className="text-[11px] font-mono-street tracking-[0.25em] text-zinc-400 uppercase">
            Catalog
          </span>

          <h2 className="font-heading font-extrabold text-3xl md:text-5xl uppercase text-[#1a1a1a] mt-1">
            {selectedCategory === 'men'
              ? "Men's Archive"
              : selectedCategory === 'women'
              ? "Women's Archive"
              : "The Collection"}
            {selectedCollection === 'new-drops' && " · New Drops"}
            {selectedCollection === 'summer-drop' && " · Summer Capsule"}
            {selectedCollection === 'sale' && " · Archival Sale"}
          </h2>

          <p className="text-[11px] text-zinc-400 font-mono-street tracking-wider mt-2 uppercase">
            Showing {filtered.length} premium pieces
          </p>
        </div>

        {/* CATEGORY TOGGLE */}
        <div className="flex items-center gap-6 font-mono-street text-[11px] uppercase tracking-widest">

          <button
            onClick={() => { onSelectCategory('all'); onSelectCollection('all'); }}
            className={`pb-0.5 transition ${
              selectedCategory === 'all' && selectedCollection === 'all'
                ? 'text-[#1a1a1a] font-bold border-b border-[#1a1a1a]'
                : 'text-zinc-400 hover:text-[#1a1a1a]'
            }`}
          >
            All
          </button>

          <button
            onClick={() => { onSelectCategory('men'); onSelectCollection('all'); }}
            className={`pb-0.5 transition ${
              selectedCategory === 'men' && selectedCollection === 'all'
                ? 'text-[#1a1a1a] font-bold border-b border-[#1a1a1a]'
                : 'text-zinc-400 hover:text-[#1a1a1a]'
            }`}
          >
            Men
          </button>

          <button
            onClick={() => { onSelectCategory('women'); onSelectCollection('all'); }}
            className={`pb-0.5 transition ${
              selectedCategory === 'women' && selectedCollection === 'all'
                ? 'text-[#1a1a1a] font-bold border-b border-[#1a1a1a]'
                : 'text-zinc-400 hover:text-[#1a1a1a]'
            }`}
          >
            Women
          </button>

        </div>
      </div>

      {/* SUBCATEGORY PILLS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-none mb-12">
        {Object.keys(subcategoryLabels).map((key) => (
          <button
            key={key}
            onClick={() => setActiveSubcategory(key)}
            className={`px-5 py-2 rounded-full text-[11px] font-mono-street tracking-[0.15em] uppercase whitespace-nowrap border transition ${
              activeSubcategory === key
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-white text-zinc-400 hover:text-[#1a1a1a] border-zinc-200'
            }`}
          >
            {subcategoryLabels[key]}
          </button>
        ))}
      </div>

      {/* FIX 10: Empty state when filters return no products */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
          <p className="font-mono-street text-xs uppercase tracking-[0.25em] text-zinc-400">
            No products found
          </p>
          <p className="text-zinc-300 text-sm font-light">Try adjusting your filters</p>
          <button
            onClick={() => { onSelectCategory('all'); onSelectCollection('all'); setActiveSubcategory('all'); }}
            className="mt-2 px-8 py-3 bg-[#1a1a1a] text-white font-mono-street text-[11px] uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12">

          {filtered.map((product) => {
            const stableKey = product.id || (product as any).gid;
            const isOutOfStock = product.variants && product.variants.length > 0 && product.variants.every((v) => v.stock <= 0);

            const isProductInSale = selectedCollection === 'sale' || product.collection === 'sale' || product.collections?.includes('sale');
            const originalPriceVal = product.originalPrice ? parseFloat(product.originalPrice as any) : 0;
            const currentPriceVal = product.price ? parseFloat(product.price as any) : 0;
            const moneyOff = (originalPriceVal > currentPriceVal) ? Math.round(originalPriceVal - currentPriceVal) : 0;
            const showDiscountBadge = isProductInSale && moneyOff > 0;

            return (
              <div
                key={stableKey}
                className="group flex flex-col cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >

                {/* IMAGE */}
                <div className="relative h-[220px] sm:h-[380px] w-full bg-[#f3f2f0] overflow-hidden mb-3 sm:mb-4">
                  {isOutOfStock && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[9px] sm:text-[10px] font-mono-street font-extrabold uppercase tracking-widest px-2.5 py-1 z-20 rounded-sm">
                      Out of Stock
                    </span>
                  )}

                  {showDiscountBadge && (
                    <span className="absolute top-3 left-3 bg-[#1a1a1a] text-white text-[9px] sm:text-[10px] font-mono-street font-extrabold uppercase tracking-widest px-2.5 py-1 z-20 rounded-sm shadow-md">
                      {formatPriceCompact(moneyOff)} OFF
                    </span>
                  )}

                  {/* FIX 14: loading="lazy" + explicit dimensions for layout stability */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    width={600}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0 will-change-opacity"
                  />

                  {product.images[1] && (
                    <img
                      src={product.images[1]}
                      alt={`${product.name} alternate view`}
                      width={600}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 will-change-opacity"
                    />
                  )}

                  {/* Size Tray for Desktop (Slides up on hover) */}
                  <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform-gpu will-change-transform hidden lg:flex flex-col gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
                    <p className="text-[9px] font-mono-street text-white/90 uppercase tracking-widest text-center mb-0.5">Quick Add Size</p>
                    <div className="flex gap-1.5 justify-center flex-wrap">
                      {product.variants.map((v) => {
                        const inStock = v.stock > 0;
                        return (
                          <button
                            key={v.size}
                            disabled={!inStock}
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAdd(product, v.size);
                            }}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded uppercase tracking-wider transition ${
                              inStock
                                ? 'bg-white text-zinc-950 hover:bg-zinc-950 hover:text-white shadow hover:scale-105 active:scale-95'
                                : 'bg-white/20 text-white/40 cursor-not-allowed line-through'
                            }`}
                          >
                            {v.size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="flex flex-col gap-1">

                  <span className="text-[9px] sm:text-[10px] font-mono-street text-zinc-400 uppercase tracking-[0.2em]">
                    {product.category}
                  </span>

                  <h3 className="font-heading font-semibold text-[14px] sm:text-[15px] text-[#1a1a1a] group-hover:text-zinc-500 transition-colors leading-snug">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-zinc-100">

                    <div className="flex items-center gap-2">
                      <span className="font-mono-street font-semibold text-[12px] tracking-wide text-zinc-900">
                        {formatPrice(product.price)}
                      </span>
                      {originalPriceVal > currentPriceVal && (
                        <span className="font-mono-street text-[11px] tracking-wide text-zinc-400 line-through">
                          {formatPrice(originalPriceVal)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(() => {
                        // Derive unique color names from Shopify variant selectedOptions
                        const rawVariants: any[] = (product as any)._rawVariants ?? product.variants ?? [];
                        const colorNames = Array.from(new Set(
                          rawVariants.flatMap((v: any) =>
                            (v?.selectedOptions ?? [])
                              .filter((o: any) => /colou?r/i.test(o?.name ?? ''))
                              .map((o: any) => o.value as string)
                          )
                        )) as string[];

                        // CSS named colors and common mappings for Shopify color option values
                        const toCSS = (name: string): string => {
                          const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
                          const map: Record<string, string> = {
                            // Neutrals
                            black: '#1a1a1a', white: '#f5f5f5', offwhite: '#f8f4ee',
                            cream: '#f5f0e8', ivory: '#f8f4e8', ecru: '#f0e6d3',
                            beige: '#d4b896', linen: '#e8dcc8', sand: '#c2a882',
                            stone: '#a8a29e', taupe: '#b5a99a', nude: '#e8c9a0',
                            grey: '#9ca3af', gray: '#9ca3af', charcoal: '#374151',
                            onyx: '#1a1a1a', slate: '#64748b',
                            // Browns / Warm
                            brown: '#6b4226', camel: '#c19a6b', caramel: '#c68642',
                            khaki: '#b8a87a', tan: '#c4a882', chocolate: '#3d1c02',
                            mocha: '#6b3a2a', walnut: '#5c3317',
                            // Yellows / Golds
                            yellow: '#facc15', mustard: '#d97706', gold: '#d4af37',
                            buttercream: '#f5e6c8', butter: '#f5e6a3', lemon: '#fef08a',
                            // Oranges / Reds
                            orange: '#f97316', rust: '#c2410c', coral: '#fb7185',
                            red: '#dc2626', burgundy: '#7f1d1d', wine: '#6b1d2e',
                            cherry: '#990000', scarlet: '#ff2400', tomato: '#ff6347',
                            // Pinks
                            pink: '#f9a8d4', blush: '#fbc8c8', blushpink: '#f4b8c1',
                            softpink: '#f9c5ce', babypink: '#f9c5d0', dustypink: '#d4a0a0',
                            rosepink: '#f48fb1', hotpink: '#ff69b4', mauve: '#d4a5a5',
                            rose: '#f43f5e', fuchsia: '#d946ef', magenta: '#c026d3',
                            // Purples
                            purple: '#7c3aed', lavender: '#c4b5fd', violet: '#7c3aed',
                            lilac: '#c8a2c8', plum: '#673147', indigo: '#4338ca',
                            // Blues
                            blue: '#2563eb', navy: '#1a2744', royal: '#4169e1',
                            cobalt: '#0047ab', sky: '#7dd3fc', lightblue: '#93c5fd',
                            babyblue: '#89cff0', powder: '#b0d4e8', denim: '#1560bd',
                            // Greens
                            green: '#16a34a', olive: '#6b7c41', sage: '#7c9e6e',
                            mint: '#a7f3d0', teal: '#0d9488', forest: '#228b22',
                            emerald: '#059669', hunter: '#355e3b', army: '#4b5320',
                            // Others
                            white: '#f5f5f5',
                          };
                          // Try exact key match first, then try CSS named color via a test element
                          if (map[key]) return map[key];
                          // If it looks like a valid CSS color word, pass it through
                          const css = new Option().style;
                          css.color = name.toLowerCase();
                          if (css.color !== '') return name.toLowerCase();
                          // Fallback: mid-grey so it's visible, not white
                          return '#9ca3af';
                        };

                        if (!colorNames.length) return null;
                        return colorNames.slice(0, 4).map((name, i) => (
                          <span
                            key={i}
                            className="w-5 h-5 rounded-full shadow-sm flex-shrink-0"
                            style={{
                              backgroundColor: toCSS(name),
                              border: '2px solid #e4e4e7',
                              outline: '1px solid rgba(0,0,0,0.08)',
                            }}
                            title={name}
                          />
                        ));
                      })()}
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
});

export { SkeletonCard };
