// Shopify Storefront API Types

export interface ShopifyCartLine {
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string;
  attributes?: { key: string; value: string }[];
}

export interface CartCreateInput {
  lines: ShopifyCartLine[];
  attributes?: { key: string; value: string }[];
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  createdAt: string;
  updatedAt: string;
  cost: {
    subTotal: { amount: string };
    taxTotal: { amount: string };
    grandTotal: { amount: string };
  };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        cost: {
          amountPerQuantity: { amount: string };
          grandTotal: { amount: string };
        };
        merchandise: {
          id: string;
          product: { id: string };
        };
      };
    }[];
  };
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
      code?: string;
    }[];
  };
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
      code?: string;
    }[];
  };
}

export interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
      code?: string;
    }[];
  };
}

export interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
      code?: string;
    }[];
  };
}

export interface ShopifyError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: {
    code: string;
    documentation?: string;
  };
}

export interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: ShopifyError[];
}
