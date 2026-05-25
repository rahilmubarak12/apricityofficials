import { useEffect, useState } from 'react';
import client from '../services/shopify';
import { PRODUCTS_QUERY } from '../services/shopifyQueries';

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await client.request(PRODUCTS_QUERY);
      setProducts(data.products.edges);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  async function handleAddToCart(variantId: string) {
    const { data } = await client.request(
      `mutation cartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart { checkoutUrl }
        }
      }`,
      { variables: { lines: [{ quantity: 1, merchandiseId: variantId }] } }
    );
    window.location.href = data.cartCreate.cart.checkoutUrl;
  }

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-grid">
      {products.map(({ node }) => (
        <div key={node.id} className="product-card">
          <img
            src={node.images.edges[0]?.node.url}
            alt={node.images.edges[0]?.node.altText || node.title}
          />
          <h3>{node.title}</h3>
          <p>{node.description}</p>
          <p>
            {node.priceRange.minVariantPrice.currencyCode}{' '}
            {node.priceRange.minVariantPrice.amount}
          </p>
          <button onClick={() =>
            handleAddToCart(node.variants.edges[0].node.id)
          }>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}