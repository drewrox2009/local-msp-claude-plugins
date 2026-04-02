/**
 * Payment types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Payment entity
 */
export interface Payment {
  id: number;
  customer_id: number;
  invoice_id: number | null;
  amount: number;
  payment_method: string;
  reference: string;
  notes: string;
  received_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing payments
 */
export interface PaymentListParams extends ListParams {
  /** Filter by customer ID */
  customer_id?: number;
  /** Filter by invoice ID */
  invoice_id?: number;
  /** Filter payments since date */
  since_date?: string;
}

/**
 * Data for creating a payment
 */
export interface PaymentCreateData {
  customer_id: number;
  invoice_id?: number;
  amount: number;
  payment_method?: string;
  reference?: string;
  notes?: string;
  received_at?: string;
}

/**
 * Data for updating a payment
 */
export interface PaymentUpdateData extends Partial<Omit<PaymentCreateData, 'customer_id'>> {}

/**
 * Response from listing payments
 */
export interface PaymentListResponse {
  payments: Payment[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single payment
 */
export interface PaymentResponse {
  payment: Payment;
}
