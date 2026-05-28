import { useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Category, Collection } from './types';
import { Navbar } from './components/Navbar';
import { HeroVideo } from './components/HeroVideo';
import { CollectionsGrid } from './components/CollectionsGrid';
import { FabricDetailSection } from './components/FabricDetailSection';
import { ProductSection } from './components/ProductSection';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { SkeletonCard } from './components/ProductSection';
import { RefundPolicy } from './components/RefundPolicy';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { CountrySelector, COUNTRIES } from './components/CountrySelector';
import shopifyProductDetails from './data/shopify_product_details.json';
import shopifySizeCharts from './data/shopify_size_charts.json';

// Auto-detect size chart page handle from product tags + title.
// When client adds a new product of any existing type (hoodie, sweatshirt, etc.),
// it will automatically pick up the correct size chart with zero code changes.
function resolveSizeChartHandle(handle: string, tags: string[], title: string): string {
  const t = tags.map((s) => s.toLowerCase());
  const h = handle.toLowerCase();
  const n = title.toLowerCase();

  // Hoodie
  if (t.some((s) => s.includes('hoodie')) || h.includes('hoodie') || n.includes('hoodie')) {
    return 'unisex-hoodies-size-chart';
  }
  // Women-specific sweatshirts / sets
  if (
    (t.some((s) => s.includes('women')) || n.includes('women') || n.includes('blush') || n.includes('butter')) &&
    (t.some((s) => s.includes('sweatshirt') || s.includes('set') || s.includes('top')) || n.includes('sweatshirt') || n.includes('set') || n.includes('top') || h.includes('blush') || h.includes('butter'))
  ) {
    return 'women-size-chart';
  }
  // Linen sets
  if (t.some((s) => s.includes('linen')) || h.includes('linen') || n.includes('linen')) {
    return 'linen-shirt-shorts-size-chart';
  }
  // Sweatshirt (unisex)
  if (t.some((s) => s.includes('sweatshirt')) || h.includes('sweatshirt') || n.includes('sweatshirt')) {
    return 'unisex-sweatshirts-size-chart';
  }
  // T-shirt
  if (t.some((s) => s.includes('t-shirt') || s.includes('tee')) || h.includes('t-shirt') || n.includes('t-shirt') || n.includes('tee')) {
    return 't-shirt-size-chart';
  }
  // Handle-specific fallbacks for existing products without clear tags
  const handleMap: Record<string, string> = {
    'oversized-sweatshirt-turtleneck': 'size-chart',
    'a-new-era-cropped-sweatshirt': 'a-new-era-cropped-sweatshirt-size-chart',
    'apricity-blush': 'women-size-chart',
    'apy-butter-set': 'women-size-chart',
    'onyx-black': 't-shirt-size-chart',
    'onyx-gray': 't-shirt-size-chart',
    'echoes-of-silence-green': 't-shirt-size-chart',
    'echoes-of-silence-white': 't-shirt-size-chart',
    'staple-sand': 'staple-sand-unisex-size-chart',
    'bayview-linen-set': 'linen-shirt-shorts-size-chart',
    'club-1932-t-shirt': 't-shirt-size-chart',
  };
  return handleMap[handle] ?? '';
}


const shopifyClient = createStorefrontApiClient({
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
  apiVersion: '2026-04',
  publicAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
});

const PRODUCTS_QUERY = `
  {
    products(first: 50) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          tags
          attentionSeekers: metafield(namespace: "custom", key: "attention_seekers") { value }
          attentionSeekers2: metafield(namespace: "custom", key: "attention_style_seekers") { value }
          styleSeekers: metafield(namespace: "custom", key: "style_seekers") { value }
          sizeFit: metafield(namespace: "custom", key: "size_fit") { value }
          sizeFit2: metafield(namespace: "custom", key: "size_and_fit") { value }
          careInstructions: metafield(namespace: "custom", key: "care_instructions") { value }
          takeCare: metafield(namespace: "custom", key: "take_care_of_me") { value }
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function mapCategory(tags: string[], title: string): Category {
  const lowerTags = tags.map((t) => t.toLowerCase());
  const lowerTitle = title.toLowerCase();
  if (lowerTags.some((t) => t.includes('women')) || lowerTitle.includes('women')) return 'women';
  if (lowerTags.some((t) => t.includes('men')) || lowerTitle.includes('men')) return 'men';
  return 'unisex';
}

function mapShopifyCollections(node: any): Collection[] {
  const collections: Collection[] = [];
  const tags: string[] = node.tags ?? [];
  const lowerTags = tags.map((t: string) => t.toLowerCase());

  const shopifyCollections = node.collections?.edges ?? [];
  for (const { node: col } of shopifyCollections) {
    const handle = col.handle?.toLowerCase() ?? '';
    const title = col.title?.toLowerCase() ?? '';
    if (handle === 'new-drops' || title === 'new drops') collections.push('new-drops');
    if (handle === 'summer-drop' || title === 'summer drop') collections.push('summer-drop');
    if (handle === 'heavyweight-essentials' || title === 'heavyweight essentials') collections.push('heavyweight-essentials');
    if (handle === 'limited-run' || title === 'limited run') collections.push('limited-run');
    if (handle === 'sale' || title === 'sale') collections.push('sale');
  }

  if (lowerTags.includes('new-drops') || lowerTags.includes('new drops')) collections.push('new-drops');
  if (lowerTags.includes('summer-drop') || lowerTags.includes('summer drop')) collections.push('summer-drop');
  if (lowerTags.includes('heavyweight-essentials') || lowerTags.includes('heavyweight essentials')) collections.push('heavyweight-essentials');
  if (lowerTags.includes('limited-run') || lowerTags.includes('limited run')) collections.push('limited-run');
  if (lowerTags.includes('sale')) collections.push('sale');

  return Array.from(new Set(collections));
}

function mapSubCategory(tags: string[], title: string): Product['subCategory'] {
  const lowerTags = tags.map((t) => t.toLowerCase());
  const lowerTitle = title.toLowerCase();
  if (lowerTags.some((t) => t.includes('hoodie')) || lowerTitle.includes('hoodie')) return 'hoodie';
  if (lowerTags.some((t) => t.includes('sweatshirt')) || lowerTitle.includes('sweatshirt')) return 'sweatshirt';
  if (lowerTags.some((t) => t.includes('trouser') || t.includes('short') || t.includes('trouser-short')) || lowerTitle.includes('trouser') || lowerTitle.includes('short')) return 'trouser-short';
  if (lowerTags.some((t) => t.includes('shirt')) || lowerTitle.includes('shirt') || lowerTitle.includes('t-shirt') || lowerTitle.includes('tee')) return 't-shirt';
  if (lowerTags.some((t) => t.includes('jacket')) || lowerTitle.includes('jacket')) return 'jacket';
  return 't-shirt';
}


function mapVariants(variantEdges: any[]): { size: string; stock: number }[] {
  const seen = new Set<string>();
  const variants: { size: string; stock: number }[] = [];
  for (const { node } of variantEdges) {
    const sizeOption = node.selectedOptions?.find((o: any) =>
      o.name.toLowerCase().includes('size') || o.name.toLowerCase().includes('sizes')
    );
    const size = sizeOption?.value ?? node.title;
    const cleanSize = size.toLowerCase() === 'default title' ? 'One Size' : size;
    if (cleanSize && !seen.has(cleanSize)) {
      seen.add(cleanSize);
      const stock =
        typeof node.quantityAvailable === 'number'
          ? node.quantityAvailable
          : node.availableForSale
          ? 10
          : 0;
      variants.push({ size: cleanSize, stock });
    }
  }
  if (variants.length === 0) {
    return [{ size: 'One Size', stock: 10 }];
  }
  return variants;
}

function mapRawVariants(variantEdges: any[]): any[] {
  return variantEdges.map(({ node }) => node);
}

function mapShopifyProduct(node: any): any {
  const tags: string[] = node.tags ?? [];
  const images: string[] = node.images.edges.map((e: any) => e.node.url);
  const firstVariantId = node.variants.edges[0]?.node.id ?? '';
  const handle: string = node.handle ?? '';

  const collections = mapShopifyCollections(node);
  const primaryCollection = collections[0] ?? 'new-drops';

  // Look up scraped accordion details by product handle
  const scraped = (shopifyProductDetails as Record<string, any>)[handle] ?? null;

  return {
    id: node.id,
    handle,
    name: node.title,
    description: node.description ?? '',
    descriptionHtml: node.descriptionHtml ?? '',
    // Scraped data takes priority, then metafields, then empty string (triggers defaults)
    attentionSeekersMetafield: scraped?.attentionStyleSeekers || node.attentionSeekers?.value || node.attentionSeekers2?.value || node.styleSeekers?.value || '',
    descriptionFeaturesHtml: scraped?.descriptionFeatures || '',
    sizeFitMetafield: scraped?.sizeFit || node.sizeFit?.value || node.sizeFit2?.value || '',
    sizeChartHtml: (() => {
      const chartHandle = resolveSizeChartHandle(handle, tags, node.title);
      if (chartHandle) {
        const chart = (shopifySizeCharts as Record<string, any>)[chartHandle];
        if (chart) return chart.body;
      }
      return '';
    })(),
    careMetafield: scraped?.takeCareOfMe || node.careInstructions?.value || node.takeCare?.value || '',
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    originalPrice: node.compareAtPriceRange?.minVariantPrice?.amount
      ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
      : undefined,
    category: mapCategory(tags, node.title),
    collection: primaryCollection,
    collections: collections,
    subCategory: mapSubCategory(tags, node.title),
    tags,
    images: images.length > 0 ? images : ['/placeholder.jpg'],
    colors: [{ name: 'Standard', hex: '#1a1a1a', image: images[0] ?? '' }],
    variants: mapVariants(node.variants.edges),
    fabricDetails: [],
    fitNotes: '',
    isBestSeller: tags.includes('best-seller'),
    isNewArrival: tags.includes('new-arrival'),
    rating: 4.5,
    reviewsCount: 0,
    _rawVariants: mapRawVariants(node.variants.edges),
    _variantId: firstVariantId,
  };
}

const FALLBACK_RATES: Record<string, number> = {
  AED: 0.979333,
  AFN: 16.946499,
  ALL: 21.944357,
  AMD: 98.089635,
  ANG: 0.477333,
  AOA: 245.534648,
  ARS: 371.600507,
  AUD: 0.372892,
  AWG: 0.477333,
  AZN: 0.453519,
  BAM: 0.448472,
  BBD: 0.533333,
  BDT: 32.770803,
  BGN: 0.448472,
  BHD: 0.100267,
  BIF: 794.699529,
  BMD: 0.266667,
  BND: 0.341078,
  BOB: 1.844344,
  BRL: 1.337103,
  BSD: 0.266667,
  BTN: 25.553007,
  BWP: 3.606953,
  BYN: 0.733557,
  BZD: 0.533333,
  CAD: 0.368135,
  CDF: 607.716621,
  CHF: 0.208964,
  CLP: 240.091528,
  CNY: 1.813757,
  COP: 985.594246,
  CRC: 120.906582,
  CUP: 6.4,
  CVE: 25.28379,
  CZK: 5.572511,
  DJF: 47.392267,
  DKK: 1.710667,
  DOP: 15.729483,
  DZD: 35.466212,
  EGP: 14.119904,
  ERN: 4,
  ETB: 42.186314,
  EUR: 0.229301,
  FJD: 0.588431,
  FKP: 0.198093,
  GBP: 0.198094,
  GEL: 0.71161,
  GHS: 3.083729,
  GIP: 0.198093,
  GMD: 19.78361,
  GNF: 2337.301803,
  GTQ: 2.033741,
  GYD: 55.800955,
  HKD: 2.089562,
  HNL: 7.099909,
  HTG: 34.897104,
  HUF: 82.226872,
  IDR: 4730.404448,
  ILS: 0.773246,
  INR: 25.553116,
  IQD: 349.582468,
  IRR: 295696.06189,
  ISK: 33.013949,
  JMD: 42.001369,
  JOD: 0.189067,
  JPY: 42.390885,
  KES: 34.603024,
  KGS: 23.327107,
  KHR: 1076.172489,
  KMF: 112.80832,
  KPW: 1.0,
  KRW: 405.007087,
  KWD: 0.082291,
  KYD: 0.222222,
  KZT: 125.909356,
  LAK: 5845.755043,
  LBP: 23866.666667,
  LKR: 87.678967,
  LRD: 48.866344,
  LSL: 4.373001,
  LYD: 1.69927,
  MAD: 2.46063,
  MDL: 4.621805,
  MGA: 1120.180162,
  MMK: 560.324632,
  MNT: 955.07569,
  MOP: 2.152249,
  MRU: 10.665677,
  MUR: 12.631284,
  MVR: 4.121224,
  MWK: 462.903459,
  MXN: 4.60791,
  MYR: 1.05808,
  MZN: 16.9567,
  NAD: 4.373001,
  NGN: 365.498167,
  NIO: 9.811805,
  NOK: 2.467989,
  NPR: 40.884811,
  NZD: 0.45428,
  OMR: 0.102533,
  PAB: 0.266667,
  PEN: 0.910759,
  PGK: 1.162087,
  PHP: 16.451551,
  PKR: 74.545158,
  PLN: 0.972736,
  PYG: 1642.542298,
  QAR: 0.970667,
  RON: 1.206466,
  RSD: 26.99477,
  RUB: 19.037369,
  RWF: 390.267385,
  SAR: 1.0,
  SBD: 2.114527,
  SCR: 3.756932,
  SDG: 122.336254,
  SEK: 2.488454,
  SGD: 0.341078,
  SHP: 0.198093,
  SLL: 6489.141898,
  SOS: 152.346756,
  SRD: 9.940612,
  SSP: 1278.605629,
  STN: 5.617856,
  SYP: 29.983961,
  SZL: 4.373001,
  THB: 8.71117,
  TJS: 2.473334,
  TMT: 0.933146,
  TND: 0.775388,
  TOP: 0.630915,
  TRY: 12.181542,
  TTD: 1.809368,
  TWD: 8.395405,
  TZS: 695.045532,
  UAH: 11.799089,
  UGX: 1006.440089,
  USD: 0.266667,
  UYU: 10.71922,
  UZS: 3167.958449,
  VES: 141.46792,
  VND: 6970.447064,
  VUV: 31.523327,
  WST: 0.717187,
  XAF: 150.411093,
  XCD: 0.72,
  XOF: 150.411093,
  XPF: 27.362855,
  YER: 63.66115,
  ZAR: 4.373043,
  ZMW: 5.021068,
  ZWL: 7.019093,
};

const PRODUCTS_CACHE_KEY = 'apricity_products_v5';
const PRODUCTS_CACHE_TIME_KEY = 'apricity_products_time_v5';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function App() {
  const [products, setProducts] = useState<any[]>(() => {
    // Hydrate from cache instantly on first render — no loading flash for repeat visitors
    try {
      const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
      const cachedTime = localStorage.getItem(PRODUCTS_CACHE_TIME_KEY);
      const isFresh = cachedTime && (Date.now() - parseInt(cachedTime)) < CACHE_TTL_MS;
      if (cached && isFresh) return JSON.parse(cached);
    } catch {}
    return [];
  });

  const [productsLoading, setProductsLoading] = useState<boolean>(() => {
    // If we already have fresh cache, skip the loading state entirely
    try {
      const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
      const cachedTime = localStorage.getItem(PRODUCTS_CACHE_TIME_KEY);
      const isFresh = cachedTime && (Date.now() - parseInt(cachedTime)) < CACHE_TTL_MS;
      if (cached && isFresh) return false;
    } catch {}
    return true;
  });

  const [productsError, setProductsError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('apricity_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('apricity_cart', JSON.stringify(cart));
  }, [cart]);

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedCollection, setSelectedCollection] = useState<Collection | 'all'>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    return localStorage.getItem('selectedCountry') || 'SA';
  });
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ SAR: 1.0 });

  // Fetch exchange rates and automatically geolocate country
  useEffect(() => {
    async function initGeolocationAndRates() {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/SAR');
        if (response.ok) {
          const data = await response.json();
          if (data.result === 'success' && data.rates) {
            setExchangeRates(data.rates);
          }
        }
      } catch (err) {
        console.error('Failed to fetch exchange rates, using fallbacks:', err);
      }

      if (!localStorage.getItem('selectedCountry')) {
        let detectedCode = '';

        try {
          const response = await fetch('https://api.country.is/');
          if (response.ok) {
            const data = await response.json();
            if (data.country) detectedCode = data.country.toUpperCase();
          }
        } catch (err) {
          console.warn('Geolocation Tier 1 failed, trying Tier 2:', err);
        }

        if (!detectedCode) {
          try {
            const response = await fetch('https://ipwho.is/');
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.country_code) detectedCode = data.country_code.toUpperCase();
            }
          } catch (err) {
            console.warn('Geolocation Tier 2 failed, trying Tier 3:', err);
          }
        }

        if (!detectedCode) {
          try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
              const data = await response.json();
              if (data.country_code) detectedCode = data.country_code.toUpperCase();
            }
          } catch (err) {
            console.error('All geolocation tiers failed:', err);
          }
        }

        if (detectedCode) {
          if (COUNTRIES[detectedCode]) {
            setSelectedCountry(detectedCode);
          } else {
            const eurozoneCodes = [
              'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'AT', 'FI', 'IE', 'PT',
              'GR', 'EE', 'LV', 'LT', 'SK', 'SI', 'CY', 'MT', 'LU', 'HR'
            ];
            setSelectedCountry(eurozoneCodes.includes(detectedCode) ? 'EU' : 'SA');
          }
        } else {
          setSelectedCountry('SA');
        }
      }
    }

    initGeolocationAndRates();
  }, []);

  const handleSelectCountry = useCallback((code: string) => {
    setSelectedCountry(code);
    localStorage.setItem('selectedCountry', code);
  }, []);

  const formatPriceVal = useCallback((amountInSAR: number, compact: boolean = false) => {
    const country = COUNTRIES[selectedCountry] || COUNTRIES.SA;
    const rate = exchangeRates[country.currency] || FALLBACK_RATES[country.currency] || 1;
    const convertedAmount = amountInSAR * rate;

    let fractionDigits = compact ? 0 : 2;
    if (!compact && ['BHD', 'OMR', 'KWD'].includes(country.currency)) {
      fractionDigits = 3;
    }

    const resolvedLocale = country.code === 'IN' ? 'en-IN' : 'en-US';

    try {
      return new Intl.NumberFormat(resolvedLocale, {
        style: 'currency',
        currency: country.currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(convertedAmount);
    } catch (e) {
      return `${country.currency} ${convertedAmount.toFixed(fractionDigits)}`;
    }
  }, [selectedCountry, exchangeRates]);

  const formatPrice = useCallback((amountInSAR: number) => formatPriceVal(amountInSAR, false), [formatPriceVal]);
  const formatPriceCompact = useCallback((amountInSAR: number) => formatPriceVal(amountInSAR, true), [formatPriceVal]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Check if cache is still fresh — if so, skip the API call
        const cachedTime = localStorage.getItem(PRODUCTS_CACHE_TIME_KEY);
        const isFresh = cachedTime && (Date.now() - parseInt(cachedTime)) < CACHE_TTL_MS;
        const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
        if (cached && isFresh) return; // Already loaded from cache in useState initializer

        setProductsLoading(true);
        const { data, errors } = await shopifyClient.request(PRODUCTS_QUERY);
        if (errors) {
          console.error('Shopify GraphQL errors:', JSON.stringify(errors, null, 2));
          throw new Error(
            Array.isArray(errors)
              ? errors.map((e: any) => e?.message ?? String(e)).join('; ')
              : String(errors)
          );
        }
        const mapped = (data as any).products.edges.map(({ node }: any) =>
          mapShopifyProduct(node)
        );
        setProducts(mapped);
        // Save to cache
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(mapped));
        localStorage.setItem(PRODUCTS_CACHE_TIME_KEY, Date.now().toString());
      } catch (err: any) {
        console.error('Failed to fetch Shopify products:', err);
        setProductsError(
          `Failed to load products: ${err?.message ?? 'Unknown error'}. Check the console for details.`
        );
      } finally {
        setProductsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = useCallback((
    product: Product,
    size: string,
    color: string,
    variantId?: string,
    qty: number = 1
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color &&
          item.variantId === variantId
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += qty;
        return next;
      }

      return [
        ...prev,
        {
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: qty,
          variantId,
        },
      ];
    });

    setIsCartOpen(true);
  }, []);

  const handleQuickAdd = useCallback((product: Product, size: string) => {
    const rawVariants: any[] = (product as any)._rawVariants ?? [];
    const matchedVariant = rawVariants.find((v: any) => {
      const sizeOption = v.selectedOptions?.find((o: any) =>
        o.name.toLowerCase().includes('size') || o.name.toLowerCase().includes('sizes')
      );
      return (sizeOption?.value ?? v.title) === size;
    });
    const variantId = matchedVariant?.id ?? (product as any)._variantId;
    handleAddToCart(product, size, product.colors[0]?.name || 'Standard', variantId);
  }, [handleAddToCart]);

  const handleSelectProduct = useCallback((prod: Product) => {
    setActiveProductModal(prod);
  }, []);

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) return handleRemoveItem(index);
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleShopifyCheckout = async () => {
    try {
      const lines = cart
        .map((item) => ({
          quantity: item.quantity,
          merchandiseId: item.variantId ?? (item.product as any)._variantId,
        }))
        .filter((line) => line.merchandiseId);

      if (lines.length === 0) {
        alert('Could not find product variants. Please try again.');
        return;
      }

      const { data, errors } = await shopifyClient.request(CREATE_CART_MUTATION, {
        variables: { lines },
      });

      if (errors) throw new Error('Cart creation failed');

      const userErrors = (data as any).cartCreate?.userErrors;
      if (userErrors?.length > 0) {
        console.error('Cart user errors:', userErrors);
        alert('There was an issue creating your cart. Please try again.');
        return;
      }

      const checkoutUrl = (data as any).cartCreate?.cart?.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Shopify checkout error:', err);
      alert('Checkout failed. Please try again.');
    }
  };

  const scrollToCatalog = () => {
    document.getElementById('shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a]">
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategory={(cat) => { setSelectedCategory(cat); setShowRefundPolicy(false); scrollToCatalog(); }}
        onSelectCollection={(col) => { setSelectedCollection(col); setShowRefundPolicy(false); scrollToCatalog(); }}
        activeCategory={selectedCategory}
        activeCollection={selectedCollection}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {showRefundPolicy ? (
        <RefundPolicy onBack={() => { setShowRefundPolicy(false); window.scrollTo({ top: 0 }); }} />
      ) : (
        <>
          <HeroVideo
            onShopMen={() => { setSelectedCategory('men'); setSelectedCollection('all'); scrollToCatalog(); }}
            onShopWomen={() => { setSelectedCategory('women'); setSelectedCollection('all'); scrollToCatalog(); }}
            onExploreCollection={() => { setSelectedCategory('all'); setSelectedCollection('all'); scrollToCatalog(); }}
          />
          <CollectionsGrid
            onSelectCategory={(cat) => { setSelectedCategory(cat); scrollToCatalog(); }}
            onSelectCollection={(col) => { setSelectedCollection(col); scrollToCatalog(); }}
          />
          <FabricDetailSection />
          {productsError ? (
            <div className="text-center py-20 text-red-500">{productsError}</div>
          ) : productsLoading ? (
            <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto" id="shop-catalog">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </section>
          ) : (
            <ProductSection
              products={products}
              onSelectProduct={handleSelectProduct}
              onQuickAdd={handleQuickAdd}
              selectedCategory={selectedCategory}
              selectedCollection={selectedCollection}
              onSelectCategory={setSelectedCategory}
              onSelectCollection={setSelectedCollection}
              formatPrice={formatPrice}
              formatPriceCompact={formatPriceCompact}
            />
          )}
        </>
      )}

      <Footer
        onSelectCategory={(cat) => { setSelectedCategory(cat); setShowRefundPolicy(false); scrollToCatalog(); }}
        onSelectCollection={(col) => { setSelectedCollection(col); setShowRefundPolicy(false); scrollToCatalog(); }}
        onOpenRefundPolicy={() => { setShowRefundPolicy(true); window.scrollTo({ top: 0 }); }}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={handleShopifyCheckout}
        formatPrice={formatPrice}
      />
      {activeProductModal && (
        <ProductModal
          product={{
            ...activeProductModal,
            variants: (activeProductModal as any)._rawVariants ?? activeProductModal.variants,
          }}
          onClose={() => setActiveProductModal(null)}
          onAddToCart={(prod, sz, col, variantId, qty) => {
            handleAddToCart(prod, sz, col, variantId, qty);
            setActiveProductModal(null);
          }}
          formatPrice={formatPrice}
        />
      )}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(prod) => { setActiveProductModal(prod); setIsSearchOpen(false); }}
        formatPrice={formatPrice}
      />
      <CountrySelector selectedCountry={selectedCountry} onSelectCountry={handleSelectCountry} />
    </div>
  );
}

export default App;