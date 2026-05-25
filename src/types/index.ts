export type Category = 'men' | 'women' | 'unisex';
export type Collection = 'new-drops' | 'summer-drop' | 'heavyweight-essentials' | 'limited-run' | 'sale';

export interface ProductVariant {
  size: string;
  stock: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number; // in SAR
  originalPrice?: number;
  category: Category;
  collection: Collection;
  collections?: Collection[];
  subCategory: 't-shirt' | 'shirt' | 'hoodie' | 'sweatshirt' | 'trouser-short' | 'jacket';
  images: string[];
  colors: ProductColor[];
  variants: ProductVariant[];
  description: string;
  fabricDetails: string[];
  fitNotes: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewsCount: number;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  variantId?: string; // Shopify variant GID for the selected size/color combo
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  country: string; // 'KSA' default
  paymentMethod: 'card' | 'tabby' | 'apple-pay' | 'mada';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}