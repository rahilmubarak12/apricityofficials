import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';
import { X, ShoppingBag, AlertCircle, Minus, Plus } from 'lucide-react';
import { getProductStock } from '../services/shopify';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, variantId?: string, quantity?: number) => void;
  formatPrice: (amountInSAR: number) => string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getOptionValues = (variants: any[], optionType: 'size' | 'color'): string[] => {
  const seen = new Set<string>();
  variants.forEach((v) => {
    (v?.selectedOptions ?? []).forEach((o: { name: string; value: string }) => {
      const nameLower = o?.name?.toLowerCase() ?? '';
      if (optionType === 'size') {
        if (nameLower.includes('size') || nameLower.includes('sizes')) {
          seen.add(o.value);
        }
      } else if (optionType === 'color') {
        if (nameLower.includes('color') || nameLower.includes('colour')) {
          seen.add(o.value);
        }
      }
    });
  });
  return Array.from(seen);
};

const findVariant = (variants: any[], size: string, color: string | null) =>
  variants.find((v) => {
    const opts: { name: string; value: string }[] = v?.selectedOptions ?? [];
    if (!opts.length) return true;
    const hasSizeOpt  = opts.some((o) => o.name.toLowerCase().includes('size') || o.name.toLowerCase().includes('sizes'));
    const hasColorOpt = opts.some((o) => o.name.toLowerCase().includes('color') || o.name.toLowerCase().includes('colour'));
    const sizeMatch   = hasSizeOpt
      ? opts.some((o) => (o.name.toLowerCase().includes('size') || o.name.toLowerCase().includes('sizes')) && o.value.toLowerCase() === size.toLowerCase())
      : true;
    const colorMatch  = hasColorOpt
      ? opts.some((o) => (o.name.toLowerCase().includes('color') || o.name.toLowerCase().includes('colour')) && o.value.toLowerCase() === color?.toLowerCase())
      : true;
    return sizeMatch && colorMatch;
  });

/**
 * Read quantityAvailable directly from the variant object as returned by
 * Shopify's Storefront API. No magic numbers — if the field isn't present we
 * fall back to availableForSale so the UI still works.
 */
const getVariantQty = (variant: any): number | null => {
  if (!variant) return null;
  if (typeof variant.quantityAvailable === 'number') return variant.quantityAvailable;
  return null; // field not present → show no qty label
};

const isVariantInStock = (variant: any): boolean => {
  if (!variant) return false;
  const qty = getVariantQty(variant);
  if (qty !== null) return qty > 0;
  return variant.availableForSale !== false;
};



/**
 * Converts a live Shopify quantityAvailable into a human label.
 * Thresholds: ≤3 → critical, ≤10 → low, >10 → ok.
 * If qty is null (field not in API response) → returns null (show nothing).
 */
const stockLabel = (qty: number | null): { text: string; level: 'ok' | 'low' | 'critical' } | null => {
  if (qty === null) return null;
  if (qty <= 0)  return { text: 'Out of stock',    level: 'critical' };
  if (qty === 1) return { text: 'Only 1 left',     level: 'critical' };
  if (qty <= 3)  return { text: `Only ${qty} left`, level: 'critical' };
  if (qty <= 10) return { text: `${qty} remaining`, level: 'low' };
  return { text: 'In stock', level: 'ok' };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, formatPrice }) => {
  const images = product?.images ?? [];

  // Derive initial options from product variants for default states
  const initialVariants = ((product as any)?._rawVariants ?? product?.variants ?? []) as any[];
  const initialSizes = getOptionValues(initialVariants, 'size');
  const initialColors = getOptionValues(initialVariants, 'color');
  const initialHasColors = initialColors.length > 0;

  const [selectedImage, setSelectedImage] = useState(images[0] ?? '');
  const [selectedSize,  setSelectedSize]  = useState<string>((): string => {
    if (initialSizes.length) {
      const firstInStock = initialSizes.find((sz) =>
        isVariantInStock(findVariant(initialVariants, sz, initialHasColors ? initialColors[0] : null))
      );
      return firstInStock ?? initialSizes[0];
    }
    const titles = Array.from(new Set(initialVariants.map((v: any) => v?.title).filter(Boolean))) as string[];
    if (titles.length === 1 && titles[0].toLowerCase() === 'default title') {
      return '';
    }
    return titles[0] ?? '';
  });
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    return initialColors[0] ?? '';
  });
  const [isAdded,       setIsAdded]       = useState(false);
  const [quantity,      setQuantity]      = useState(1);
  const [openSection,  setOpenSection]  = useState<string | null>(null);

  const toggleSection = (id: string) => setOpenSection((prev) => (prev === id ? null : id));

  // Parse description into sections dynamically using <hr> separators
  const parsedSections = useMemo(() => {
    const descHtml = (product as any).descriptionHtml;
    const defaultAudience = (
      <p className="text-sm text-zinc-500 leading-relaxed">
        Designed for those who move between worlds — from quiet confidence to bold statements.
        Apricity Officials speaks to the individual who appreciates quality without compromise.
        This piece is made for you.
      </p>
    );

    const defaultSizeFit = product.fitNotes ? (
      <p className="text-sm text-zinc-500 leading-relaxed whitespace-pre-line">
        {product.fitNotes}
      </p>
    ) : (
      <div className="space-y-2 text-sm text-zinc-500 leading-relaxed">
        <p>Designed for a versatile unisex fit, it looks great on everyone.</p>
        <p className="text-xs text-zinc-400">Model is 6'1" / 185cm and wears size L.</p>
      </div>
    );

    const defaultDescription = (
      <>
        {product.description ? (
          <p className="text-sm text-zinc-500 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        ) : (
          <p className="text-sm text-zinc-500 leading-relaxed">
            Premium heavyweight construction built to last. Clean silhouettes with considered details throughout.
          </p>
        )}
        {(product.fabricDetails && product.fabricDetails.length > 0) ? (
          <ul className="space-y-1.5 mt-3">
            {product.fabricDetails.map((feat) => (
              <li key={feat} className="text-xs text-zinc-400 flex items-start gap-2">
                <span className="mt-0.5 shrink-0">·</span>{feat}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-1.5 mt-3">
            {[
              '100% premium ring-spun cotton',
              'Heavyweight 280gsm fabric',
              'Ribbed cuffs and hem',
              'Embroidered Apricity Officials branding',
              'Dropped shoulders for a relaxed modern fit',
            ].map((feat) => (
              <li key={feat} className="text-xs text-zinc-400 flex items-start gap-2">
                <span className="mt-0.5 shrink-0">·</span>{feat}
              </li>
            ))}
          </ul>
        )}
      </>
    );

    // If specific metafields exist on the product, prioritize them!
    const hasMetafields = product.attentionSeekersMetafield || product.sizeFitMetafield || product.careMetafield;

    if (hasMetafields) {
      return {
        audience: product.attentionSeekersMetafield ? (
          <div
            className="text-sm text-zinc-500 leading-relaxed prose prose-sm max-w-none prose-zinc whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: product.attentionSeekersMetafield }}
          />
        ) : defaultAudience,
        description: product.descriptionHtml ? (
          <div
            className="text-sm text-zinc-500 leading-relaxed prose prose-sm max-w-none prose-zinc whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        ) : defaultDescription,
        sizeFit: product.sizeFitMetafield ? (
          <div
            className="text-sm text-zinc-500 leading-relaxed prose prose-sm max-w-none prose-zinc whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: product.sizeFitMetafield }}
          />
        ) : defaultSizeFit,
      };
    }

    if (!descHtml) {
      return {
        audience: defaultAudience,
        description: defaultDescription,
        sizeFit: defaultSizeFit,
      };
    }

    // Split by horizontal line tag <hr ...>
    const parts = descHtml.split(/<hr\b[^>]*>/i);

    if (parts.length >= 3) {
      return {
        audience: (
          <div
            className="text-sm text-zinc-500 leading-relaxed prose prose-sm max-w-none prose-zinc whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: parts[0].trim() }}
          />
        ),
        description: (
          <div
            className="text-sm text-zinc-500 leading-relaxed prose prose-sm max-w-none prose-zinc whitespace-pre-line animate-fade-in"
            dangerouslySetInnerHTML={{ __html: parts[1].trim() }}
          />
        ),
        sizeFit: (
          <div
            className="text-sm text-zinc-500 leading-relaxed prose prose-sm max-w-none prose-zinc whitespace-pre-line animate-fade-in"
            dangerouslySetInnerHTML={{ __html: parts[2].trim() }}
          />
        ),
      };
    } else if (parts.length === 2) {
      return {
        audience: defaultAudience,
        description: (
          <div
            className="text-sm text-zinc-500 leading-relaxed prose prose-sm max-w-none prose-zinc whitespace-pre-line animate-fade-in"
            dangerouslySetInnerHTML={{ __html: parts[0].trim() }}
          />
        ),
        sizeFit: (
          <div
            className="text-sm text-zinc-500 leading-relaxed prose prose-sm max-w-none prose-zinc whitespace-pre-line animate-fade-in"
            dangerouslySetInnerHTML={{ __html: parts[1].trim() }}
          />
        ),
      };
    } else {
      return {
        audience: defaultAudience,
        description: (
          <div
            className="text-sm text-zinc-500 leading-relaxed prose prose-sm max-w-none prose-zinc whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: descHtml }}
          />
        ),
        sizeFit: defaultSizeFit,
      };
    }
  }, [
    product.description,
    (product as any).descriptionHtml,
    product.attentionSeekersMetafield,
    product.sizeFitMetafield,
    product.careMetafield,
    product.fabricDetails,
    product.fitNotes
  ]);

  // ------------------------------------------------------------------
  // Live stock query — Shopify Storefront API via your getProductStock()
  // quantityAvailable is requested per variant there; we just read it here.
  // ------------------------------------------------------------------

  const { data: stockData } = useQuery({
    queryKey: ['stock', product.id],
    queryFn:  () => getProductStock(product.id),
    refetchInterval: 60_000,
    staleTime:       30_000,
  });

  // ------------------------------------------------------------------
  // Variants — prefer live data (has fresh quantityAvailable), fall back
  // ------------------------------------------------------------------

  const liveVariants: any[] = useMemo(() => {
    const fromStock  = stockData?.variants?.edges?.map((e: any) => e.node);
    const validStock = fromStock?.length && fromStock[0]?.selectedOptions?.length;
    if (validStock) return fromStock;
    return (product as any)?._rawVariants ?? product?.variants ?? [];
  }, [stockData, product]);

  // ------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------

  const availableSizes = useMemo(() => {
    const sizes = getOptionValues(liveVariants, 'size');
    if (sizes.length) return sizes;
    const titles = Array.from(new Set(liveVariants.map((v) => v?.title).filter(Boolean)));
    if (titles.length === 1 && titles[0].toLowerCase() === 'default title') {
      return [];
    }
    return titles;
  }, [liveVariants]);

  const availableColors = useMemo(() => {
    return getOptionValues(liveVariants, 'color');
  }, [liveVariants]);

  const hasColors = availableColors.length > 0;

  // ------------------------------------------------------------------
  // Seed defaults
  // ------------------------------------------------------------------

  useEffect(() => {
    if (availableSizes.length && !selectedSize) {
      const firstInStock = availableSizes.find((sz) =>
        isVariantInStock(findVariant(liveVariants, sz, hasColors ? availableColors[0] : null))
      );
      setSelectedSize(firstInStock ?? availableSizes[0]);
    }
    if (availableColors.length && !selectedColor) setSelectedColor(availableColors[0]);
  }, [availableSizes, availableColors]);

  useEffect(() => {
    setSelectedImage(images[0] ?? '');
    
    const newVariants = ((product as any)?._rawVariants ?? product?.variants ?? []) as any[];
    const newSizes = getOptionValues(newVariants, 'size');
    const newColors = getOptionValues(newVariants, 'color');
    const newHasColors = newColors.length > 0;
    
    let defaultSize = '';
    if (newSizes.length) {
      const firstInStock = newSizes.find((sz) =>
        isVariantInStock(findVariant(newVariants, sz, newHasColors ? newColors[0] : null))
      );
      defaultSize = firstInStock ?? newSizes[0];
    } else {
      const titles = Array.from(new Set(newVariants.map((v: any) => v?.title).filter(Boolean))) as string[];
      if (!(titles.length === 1 && titles[0].toLowerCase() === 'default title')) {
        defaultSize = titles[0] ?? '';
      }
    }
    
    setSelectedSize(defaultSize);
    setSelectedColor(newColors[0] ?? '');
  }, [product.id]);

  // ------------------------------------------------------------------
  // Derived maps — all keyed off live Shopify quantityAvailable
  // ------------------------------------------------------------------

  const selectedVariant = useMemo(() => {
    if (liveVariants.length === 1) return liveVariants[0];
    return findVariant(liveVariants, selectedSize, hasColors ? selectedColor : null);
  }, [liveVariants, selectedSize, selectedColor, hasColors]);

  /** Live qty per size button (used for dot indicators + stock label) */
  const sizeQtyMap = useMemo<Record<string, number | null>>(() => {
    const map: Record<string, number | null> = {};
    availableSizes.forEach((sz) => {
      const v = findVariant(liveVariants, sz, hasColors ? selectedColor : null);
      map[sz] = getVariantQty(v); // reads variant.quantityAvailable from Shopify
    });
    return map;
  }, [liveVariants, availableSizes, selectedColor, hasColors]);

  const sizeStockMap = useMemo<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    availableSizes.forEach((sz) => {
      const v = findVariant(liveVariants, sz, hasColors ? selectedColor : null);
      map[sz] = isVariantInStock(v);
    });
    return map;
  }, [liveVariants, availableSizes, selectedColor, hasColors]);

  const colorStockMap = useMemo<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    availableColors.forEach((col) => {
      const v = findVariant(liveVariants, selectedSize, col);
      map[col] = isVariantInStock(v);
    });
    return map;
  }, [liveVariants, availableColors, selectedSize]);

  // ------------------------------------------------------------------
  // Overall OOS
  // ------------------------------------------------------------------

  const isCompletelyOutOfStock = useMemo(() => {
    if (liveVariants.length === 0) return true;
    return !liveVariants.some((v) => isVariantInStock(v));
  }, [liveVariants]);

  const selectedVariantOutOfStock = selectedVariant ? !isVariantInStock(selectedVariant) : false;

  const canAddToCart =
    !isCompletelyOutOfStock &&
    !selectedVariantOutOfStock &&
    (!!selectedVariant || liveVariants.length === 1);

  // ------------------------------------------------------------------
  // Selected variant stock label (shown after a size is picked)
  // Reads quantityAvailable directly — zero hardcoded values here.
  // ------------------------------------------------------------------

  const selectedQty   = selectedVariant ? getVariantQty(selectedVariant) : null;
  const selectedStock = selectedSize ? stockLabel(selectedQty) : null;

  // ------------------------------------------------------------------
  // Price
  // ------------------------------------------------------------------

  const displayPrice = useMemo(() => {
    const vp = selectedVariant?.price ?? selectedVariant?.priceV2;
    if (vp) {
      const amount = parseFloat(vp.amount ?? vp);
      if (!isNaN(amount)) return formatPrice(amount);
    }
    const p = product as any;
    if (p.price != null) {
      const amount = parseFloat(p.price);
      if (!isNaN(amount)) return formatPrice(amount);
    }
    return '';
  }, [selectedVariant, product, formatPrice]);

  const compareAtPrice = useMemo(() => {
    const cap = selectedVariant?.compareAtPrice ?? selectedVariant?.compareAtPriceV2;
    if (!cap) return '';
    const amountStr = cap.amount ?? cap;
    const amount = parseFloat(amountStr);
    if (!amount || isNaN(amount)) return '';
    return formatPrice(amount);
  }, [selectedVariant, formatPrice]);

  const maxStock = typeof selectedQty === 'number' ? selectedQty : 99;

  // Reset quantity when variant/size/color changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize, selectedColor, product.id]);

  // Ensure quantity is bound to max stock if stock changes underneath
  useEffect(() => {
    if (quantity > maxStock) {
      setQuantity(maxStock > 0 ? maxStock : 1);
    }
  }, [maxStock, quantity]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  // ------------------------------------------------------------------
  // Add handler
  // ------------------------------------------------------------------

  const handleAdd = () => {
    if (!canAddToCart) return;
    onAddToCart(product, selectedSize, selectedColor, selectedVariant?.id, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-[#f6f5f2]/80 backdrop-blur-md flex items-start lg:items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-5xl h-auto lg:h-[90vh] flex flex-col lg:flex-row overflow-visible lg:overflow-hidden rounded-3xl shadow-2xl my-4 lg:my-0"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 border border-zinc-200 p-2 rounded-full hover:bg-zinc-100 transition"
        >
          <X size={16} />
        </button>

        {/* ── LEFT: Images ── */}
        <div className="w-full lg:w-1/2 bg-zinc-50 p-6 flex flex-col gap-3 overflow-visible lg:overflow-y-auto">
          <div className="aspect-[3/4] bg-white rounded-2xl overflow-hidden">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110 cursor-zoom-in" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: centred layout ── */}
        <div className="w-full lg:w-1/2 flex flex-col justify-start lg:justify-center px-8 py-10 gap-6 overflow-visible lg:overflow-y-auto">

          {/* Title + price */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold uppercase leading-tight tracking-tight">{product.name}</h2>

            {displayPrice && (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold tracking-tight">{displayPrice}</span>
                {compareAtPrice && (
                  <span className="text-sm text-zinc-400 line-through">{compareAtPrice}</span>
                )}
              </div>
            )}
          </div>



          {/* Colours */}
          {hasColors && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 font-medium">
                Colour — <span className="text-zinc-600 normal-case tracking-normal">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((col) => {
                  const inStock  = colorStockMap[col];
                  const isActive = selectedColor === col;
                  return (
                    <button
                      key={col}
                      disabled={!inStock}
                      onClick={() => setSelectedColor(col)}
                      className={`
                        px-4 py-2 text-xs rounded-full border transition-all duration-200 tracking-wide
                        ${isActive
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-500 hover:shadow-sm'
                        }
                        ${!inStock ? 'opacity-35 line-through cursor-not-allowed' : ''}
                      `}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── LUXURY SIZE + CTA PANEL ── */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 overflow-hidden">

            {/* Sizes */}
            {availableSizes.length > 0 && (
              <div className="px-5 pt-5 pb-4">

                {/* Header: label + live stock indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
                    Select Size
                  </span>

                  {/* Appears only after a size is selected; value comes from
                      variant.quantityAvailable returned by Shopify */}
                  {selectedStock && (
                    <span className={`
                      text-[10px] font-semibold tracking-wide uppercase flex items-center gap-1.5
                      ${selectedStock.level === 'critical' ? 'text-red-500' : ''}
                      ${selectedStock.level === 'low'      ? 'text-amber-500' : ''}
                      ${selectedStock.level === 'ok'       ? 'text-emerald-600' : ''}
                    `}>
                      {selectedStock.level !== 'ok' && <AlertCircle size={11} className="flex-shrink-0" />}
                      {selectedStock.text}
                    </span>
                  )}
                </div>

                {/* Size buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((sz) => {
                    const inStock  = sizeStockMap[sz];
                    const isActive = selectedSize === sz;
                    // qty comes straight from Shopify's quantityAvailable field
                    const qty      = sizeQtyMap[sz];
                    const info     = stockLabel(qty);
                    const isLow    = info?.level === 'low' || info?.level === 'critical';

                    return (
                      <button
                        key={sz}
                        disabled={!inStock}
                        onClick={() => setSelectedSize(sz)}
                        className={`
                          relative py-3 text-xs font-semibold rounded-xl border transition-all duration-200
                          ${isActive
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg scale-[1.03]'
                            : inStock
                              ? 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400 hover:shadow-sm'
                              : 'bg-white text-zinc-300 border-zinc-100 cursor-not-allowed'
                          }
                        `}
                      >
                        {sz}
                        {/* Amber dot = low stock on this size (from Shopify qty) */}
                        {inStock && isLow && !isActive && (
                          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                        {/* Diagonal slash = sold out */}
                        {!inStock && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="block w-[60%] h-px bg-zinc-200 rotate-45" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend — only show if any size has qty data from Shopify */}
                {availableSizes.some((sz) => sizeQtyMap[sz] !== null && (sizeQtyMap[sz] ?? 0) <= 10 && (sizeQtyMap[sz] ?? 0) > 0) && (
                  <p className="mt-3 text-[10px] text-zinc-400 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    Low stock
                  </p>
                )}
              </div>
            )}

            <div className="h-px bg-zinc-100 mx-5" />

            {/* CTA */}
            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 tracking-wide uppercase">
                <span>Free returns</span>
                <span>·</span>
                <span>Secure checkout</span>
              </div>

              {/* Quantity selector */}
              {canAddToCart && (
                <div className="flex items-center justify-between border border-zinc-200 bg-white rounded-xl h-12 w-full px-4 mt-1">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-zinc-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-mono-street text-sm text-zinc-950 font-bold min-w-[1.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrease}
                      disabled={quantity >= maxStock}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-zinc-50"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAdd}
                disabled={!canAddToCart}
                className={`
                  w-full py-4 rounded-xl text-sm font-semibold tracking-[0.1em] uppercase
                  flex items-center justify-center gap-2.5
                  transition-all duration-300
                  ${canAddToCart
                    ? isAdded
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-zinc-900 text-white hover:bg-zinc-700 shadow-lg shadow-zinc-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  }
                `}
              >
                {isCompletelyOutOfStock ? (
                  <><AlertCircle size={15} /> Out of Stock</>
                ) : selectedVariantOutOfStock ? (
                  <><AlertCircle size={15} /> Unavailable</>
                ) : isAdded ? (
                  <><span className="text-base leading-none">✓</span> Added to Cart</>
                ) : (
                  <><ShoppingBag size={15} /> Add to Cart</>
                )}
              </button>
            </div>
          </div>

          {/* ── ACCORDION SECTIONS ── */}
          <div className="mt-4 border-t border-zinc-100">
            {([
              {
                id: 'audience',
                title: 'Attention style seekers',
                content: parsedSections.audience,
              },
              {
                id: 'description',
                title: 'Description & Features',
                content: parsedSections.description,
              },
              {
                id: 'size',
                title: 'Size & Fit',
                content: parsedSections.sizeFit,
              },
              {
                id: 'care',
                title: 'Take care of me',
                content: (
                  <ul className="space-y-1.5">
                    {[
                      'Machine wash cold at 30°C, inside out',
                      'Do not tumble dry — hang to dry',
                      'Iron on low heat, inside out only',
                      'Do not bleach',
                      'Store folded to preserve shape',
                    ].map((inst) => (
                      <li key={inst} className="text-xs text-zinc-400 flex items-start gap-2">
                        <span className="mt-0.5 shrink-0">·</span>{inst}
                      </li>
                    ))}
                  </ul>
                ),
              },
            ] as { id: string; title: string; content: React.ReactNode }[]).map(({ id, title, content }) => (
              <div key={id} className="border-b border-zinc-100">
                <button
                  onClick={() => toggleSection(id)}
                  className="w-full flex items-center justify-between py-4 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-300 text-xs select-none font-light">‡</span>
                    <span className="text-sm text-zinc-700 font-medium tracking-wide">{title}</span>
                  </div>
                  <span
                    className="text-zinc-400 text-xl leading-none transition-transform duration-300 ease-in-out"
                    style={{ transform: openSection === id ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >+</span>
                </button>
                {openSection === id && (
                  <div className="pb-5 px-1 animate-fade-in">
                    {content}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};