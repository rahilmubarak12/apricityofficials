export const PRODUCTS_QUERY = `
  {
    products(first: 50) {
      edges {
        node {
          id
          title
          description
          descriptionHtml
          tags
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
          variants(first: 50) {
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
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_CART_MUTATION = `
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
    }
  }
`;

export const PRODUCT_STOCK_QUERY = `
  query GetProductStock($id: ID!) {
    product(id: $id) {
      availableForSale
      variants(first: 50) {
        edges {
          node {
            id
            title
            quantityAvailable
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;