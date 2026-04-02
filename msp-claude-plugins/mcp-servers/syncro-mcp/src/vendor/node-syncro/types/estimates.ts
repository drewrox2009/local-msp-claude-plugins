/**
 * Estimate types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';
import type { LineItem } from './line-items.js';

/**
 * Estimate status
 */
export type EstimateStatus = 'draft' | 'sent' | 'viewed' | 'won' | 'lost';

/**
 * Estimate entity
 */
export interface Estimate {
  id: number;
  number: string;
  customer_id: number;
  date: string;
  expiration_date: string;
  subtotal: number;
  total: number;
  tax: number;
  status: EstimateStatus;
  sent_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  line_items: LineItem[];
}

/**
 * Parameters for listing estimates
 */
export interface EstimateListParams extends ListParams {
  /** Filter by customer ID */
  customer_id?: number;
  /** Filter by status */
  status?: EstimateStatus;
  /** Search query */
  query?: string;
}

/**
 * Data for creating an estimate
 */
export interface EstimateCreateData {
  customer_id: number;
  date?: string;
  expiration_date?: string;
  notes?: string;
}

/**
 * Data for updating an estimate
 */
export interface EstimateUpdateData extends Partial<Omit<EstimateCreateData, 'customer_id'>> {}

/**
 * Data for emailing an estimate
 */
export interface EstimateEmailData {
  cc_emails?: string;
  subject?: string;
  message?: string;
}

/**
 * Response from listing estimates
 */
export interface EstimateListResponse {
  estimates: Estimate[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single estimate
 */
export interface EstimateResponse {
  estimate: Estimate;
}
