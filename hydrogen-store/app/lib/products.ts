import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'apr-01',
    name: 'Black Hoodie',
    price: 420,
    originalPrice: 490,
    category: 'men',
    collection: 'new-drops',
    subCategory: 'hoodie',
    images: [
      '/images/clothing-images/blackhoodie.png',
      '/images/clothing-images/blackhoodiepeople.png'
    ],
    colors: [
      {
        name: 'Jet Black',
        hex: '#000000',
        image: '/images/clothing-images/blackhoodiepeople.png'
      }
    ],
    variants: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 18 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 3 }
    ],
    description: 'A premium heavyweight black hoodie designed for everyday comfort and streetwear style. Features a soft brushed interior, adjustable drawstring hood, and a relaxed fit for effortless layering.',
    fabricDetails: [
      '80% Cotton, 20% Polyester fleece blend',
      'Soft brushed interior for warmth',
      'Double-layer hood for structure',
      'Ribbed cuffs and hem for a secure fit',
      'Durable stitching for long-lasting wear'
    ],
    fitNotes: 'Relaxed fit with a slightly oversized silhouette. True to size for a standard fit or size up for a baggier streetwear look.',
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 42
  },
  {
    id: 'apr-02',
    name: 'Brown Hoodie',
    price: 420,
    originalPrice: 490,
    category: 'men',
    collection: 'new-drops',
    subCategory: 'hoodie',
    images: [
      '/images/clothing-images/brownhoodie.png',
      '/images/clothing-images/brownhoodiepeople.png'
    ],
    colors: [
      {
        name: 'Earth Brown',
        hex: '#5a3a1a',
        image: '/images/clothing-images/brownhoodiepeople.png'
      }
    ],
    variants: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 16 },
      { size: 'XL', stock: 10 },
      { size: 'XXL', stock: 4 }
    ],
    description: 'A premium earthy brown hoodie built for comfort and everyday streetwear. Designed with a soft fleece interior and relaxed silhouette for a warm, effortless look.',
    fabricDetails: [
      '80% Cotton, 20% Polyester fleece blend',
      'Soft brushed interior for warmth',
      'Adjustable drawstring hood',
      'Ribbed cuffs and hem',
      'Durable stitching for long-term wear'
    ],
    fitNotes: 'Relaxed men’s fit. True to size for a standard look or size up for a more oversized streetwear style.',
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 31
  },
  {
    id: 'apr-03',
    name: 'Club 1932 T-Shirt',
    price: 290,
    originalPrice: 340,
    category: 'men',
    collection: 'new-drops',
    subCategory: 't-shirt',
    images: [
      '/images/clothing-images/club1932.png',
      '/images/clothing-images/club1932people.png'
    ],
    colors: [
      {
        name: 'Classic White',
        hex: '#ffffff',
        image: '/images/clothing-images/club1932people.png'
      }
    ],
    variants: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 12 },
      { size: 'XXL', stock: 5 }
    ],
    description: 'A clean Club 1932 graphic T-shirt designed for everyday streetwear. Made from soft breathable cotton with a minimal yet bold front design.',
    fabricDetails: [
      '100% Premium Cotton',
      'Lightweight breathable fabric',
      'Pre-shrunk for consistent fit',
      'Reinforced neckline for durability',
      'Soft-touch finish'
    ],
    fitNotes: 'Regular fit with a comfortable straight cut. True to size for everyday wear.',
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.7,
    reviewsCount: 38
  },
  

 {
  id: 'apr-05',
  name: "Women's Casual Pink Shorts",
  price: 310,
  originalPrice: 360,
  category: 'women',
  collection: 'new-drops',
  subCategory: 'trouser-short',
  images: [
    '/images/clothing-images/pinkshortswoman.png',
    '/images/clothing-images/pinkshortspeople.png'
  ],
  colors: [
    {
      name: 'Soft Pink',
      hex: '#f4a6c1',
      image: '/images/clothing-images/skybluesweaterandpinkshortswoman.png'
    }
  ],
  variants: [
    { size: 'S', stock: 10 },
    { size: 'M', stock: 15 },
    { size: 'L', stock: 12 },
    { size: 'XL', stock: 8 },
    { size: 'XXL', stock: 5 }
  ],
  description: "Stylish women's pink casual shorts designed for everyday comfort and streetwear looks. Made with soft, breathable fabric for all-day ease and movement.",
  fabricDetails: [
    'Soft premium cotton blend',
    'Lightweight and breathable',
    'Stretch-friendly fabric',
    'Durable stitching for daily wear',
    'Smooth finish for comfort'
  ],
  fitNotes: "Relaxed casual fit designed for comfort and mobility. True to size, with a slightly loose streetwear-inspired silhouette.",
  isBestSeller: false,
  isNewArrival: true,
  rating: 4.7,
  reviewsCount: 11
},
{
  id: 'apr-06',
  name: "Women's Sky Blue Sweater",
  price: 420,
  originalPrice: 490,
  category: 'women',
  collection: 'new-drops',
  subCategory: 'sweatshirt',
  images: [
    '/images/clothing-images/skybluesweaterwoman.png',
    '/images/clothing-images/skybluesweaterandpinkshortswoman.png'
  ],
  colors: [
    {
      name: 'Sky Blue',
      hex: '#87CEEB',
      image: '/images/clothing-images/skybluesweaterwoman.png'
    }
  ],
  variants: [
    { size: 'S', stock: 10 },
    { size: 'M', stock: 15 },
    { size: 'L', stock: 12 },
    { size: 'XL', stock: 8 },
    { size: 'XXL', stock: 5 }
  ],
  description: "Elegant women's sky blue sweater designed for a soft and cozy everyday look. Crafted with breathable fabric that keeps you comfortable while maintaining a clean, stylish silhouette.",
  fabricDetails: [
    'Soft premium knit fabric',
    'Warm yet breathable material',
    'Stretchable comfort fit',
    'Durable stitching for long-lasting wear',
    'Smooth and soft-touch finish'
  ],
  fitNotes: "Relaxed fit designed for comfort and layering. True to size with a slightly loose, cozy silhouette.",
  isBestSeller: false,
  isNewArrival: true,
  rating: 4.6,
  reviewsCount: 9
},


];