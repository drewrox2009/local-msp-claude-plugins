/**
 * Product types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Product entity
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  cost: number;
  quantity: number;
  taxable: boolean;
  category: string;
  upc_code: string;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing products
 */
export interface ProductListParams extends ListParams {
  /** Search query */
  query?: string;
  /** Filter by category */
  category?: string;
}

/**
 * Data for creating a product
 */
export interface ProductCreateData {
  name: string;
  description?: string;
  price?: number;
  cost?: number;
  quantity?: number;
  taxable?: boolean;
  category?: string;
  upc_code?: string;
}

/**
 * Data for updating a product
 */
export interface ProductUpdateData extends Partial<ProductCreateData> {}

/**
 * Response from listing products
 */
export interface ProductListResponse {
  products: Product[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single product
 */
export interface ProductResponse {
  product: Product;
}
