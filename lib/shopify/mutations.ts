// Shopify Storefront GraphQL Mutations

export const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    createdAt
    updatedAt
    cost {
      subTotal: checkoutChargeAmount {
        amount
      }
      taxTotal: totalTaxAmount {
        amount
      }
      grandTotal: totalAmount {
        amount
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost {
            amountPerQuantity {
              amount
            }
            grandTotal: totalAmount {
              amount
            }
          }
          sellingPlanAllocation {
            sellingPlan {
              id
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              product {
                id
              }
            }
          }
          attributes {
            key
            value
          }
        }
      }
    }
    attributes {
      key
      value
    }
    discountCodes {
      applicable
      code
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${CART_FRAGMENT}
`;
