import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { PRODUCT_STOCK_QUERY, PRODUCTS_QUERY, CREATE_CART_MUTATION } from './shopifyQueries';

const client = createStorefrontApiClient({
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
  apiVersion: '2026-04',
  publicAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
});

const getGender = (product: any) => {
  const tags = product.tags || [];
  if (tags.some((t: string) => t.toLowerCase().includes("women"))) return "women";
  if (tags.some((t: string) => t.toLowerCase().includes("men"))) return "men";
  return "unisex";
};

const getType = (product: any) => {
  const tags = product.tags || [];
  if (tags.some((t: string) => t.toLowerCase().includes("hoodie"))) return "hoodie";
  if (tags.some((t: string) => t.toLowerCase().includes("t-shirt"))) return "tshirt";
  if (tags.some((t: string) => t.toLowerCase().includes("sweatshirt"))) return "sweatshirt";
  if (tags.some((t: string) => t.toLowerCase().includes("set"))) return "set";
  return "other";
};

// Fetch all products including variants (needed for cart/checkout)
export const getProducts = async () => {
  const { data } = await client.request(PRODUCTS_QUERY);

  const products = data.products.edges.map(({ node: product }: any) => {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      price: product.priceRange.minVariantPrice.amount,
      currencyCode: product.priceRange.minVariantPrice.currencyCode,
      gender: getGender(product),
      type: getType(product),
      images: product.images.edges.map((img: any) => ({
        url: img.node.url,
        altText: img.node.altText,
      })),
      variants: product.variants.edges.map(({ node: variant }: any) => ({
        id: variant.id,               // <-- this is the merchandiseId for cart
        title: variant.title,         // e.g. "S / Black"
        availableForSale: variant.availableForSale,
        quantityAvailable: variant.quantityAvailable,
        price: variant.price.amount,
        currencyCode: variant.price.currencyCode,
        selectedOptions: variant.selectedOptions, // [{ name: "Size", value: "S" }, ...]
      })),
    };
  });

  return products;
};

export const getProductStock = async (shopifyProductId: string) => {
  const { data } = await client.request(PRODUCT_STOCK_QUERY, {
    variables: { id: shopifyProductId },
  });
  return data.product;
};

// Add to cart and return the checkout URL
export const createCart = async (variantId: string, quantity: number = 1): Promise<string> => {
  const { data } = await client.request(CREATE_CART_MUTATION, {
    variables: {
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });

  const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) throw new Error('Failed to create cart — no checkout URL returned.');

  return checkoutUrl;
};

// Buy Now — creates cart and immediately redirects to Shopify checkout
export const buyNow = async (variantId: string, quantity: number = 1): Promise<void> => {
  const checkoutUrl = await createCart(variantId, quantity);
  window.location.href = checkoutUrl;
};

export default client;
