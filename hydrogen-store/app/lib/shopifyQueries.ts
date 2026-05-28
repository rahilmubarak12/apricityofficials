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
          attentionSeekers: metafield(namespace: "custom", key: "attention_seekers") { value }
          attentionSeekers2: metafield(namespace: "custom", key: "attention_style_seekers") { value }
          styleSeekers: metafield(namespace: "custom", key: "style_seekers") { value }
          sizeFit: metafield(namespace: "custom", key: "size_fit") { value }
          sizeFit2: metafield(namespace: "custom", key: "size_and_fit") { value }
          careInstructions: metafield(namespace: "custom", key: "care_instructions") { value }
          takeCare: metafield(namespace: "custom", key: "take_care_of_me") { value }
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