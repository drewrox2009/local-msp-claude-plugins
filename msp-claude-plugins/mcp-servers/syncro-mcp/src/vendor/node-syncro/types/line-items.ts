/**
 * Line item types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Line item entity
 */
export interface LineItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  cost: number;
  discount_percent: number;
  taxable: boolean;
  product_id: number | null;
  invoice_id: number | null;
  estimate_id: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing line items
 */
export interface LineItemListParams extends ListParams {
  /** Filter by invoice ID */
  invoice_id?: number;
  /** Filter by estimate ID */
  estimate_id?: number;
}

/**
 * Data for creating a line item
 */
export interface LineItemCreateData {
  name: string;
  quantity?: number;
  price: number;
  cost?: number;
  discount_percent?: number;
  taxable?: boolean;
  product_id?: number;
  invoice_id?: number;
  estimate_id?: number;
}

/**
 * Data for updating a line item
 */
export interface LineItemUpdateData extends Partial<LineItemCreateData> {}

/**
 * Response from listing line items
 */
export interface LineItemListResponse {
  line_items: LineItem[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single line item
 */
export interface LineItemResponse {
  line_item: LineItem;
}
