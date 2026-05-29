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
                    <span className="absolute top-3 right-3 bg-black text-white text-[9px] sm:text-[10px] font-mono-street font-extrabold uppercase tracking-widest px-2.5 py-1 z-20 rounded-sm">
                      Out of Stock
                    </span>
                  )}

                  {showDiscountBadge && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[9px] sm:text-[10px] font-mono-street font-extrabold uppercase tracking-widest px-2.5 py-1 z-20 rounded-sm shadow-md">
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

                      <div className="flex flex-col gap-0.5">
                      {product.originalPrice && Number(product.originalPrice) > 0 && Number(product.originalPrice) > Number(product.price) && (
                        <span className="font-mono-street text-[10px] tracking-wide text-zinc-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="font-mono-street font-semibold text-[12px] tracking-wide text-zinc-500">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {product.colors?.map((c, i) => (
                        <span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-zinc-300"
                          style={{
                            backgroundColor: c.hex || (c as any).color || '#1a1a1a'
                          }}
                          title={c.name}
                        />
                      ))}
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
