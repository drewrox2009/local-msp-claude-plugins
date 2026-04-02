/**
 * Invoice types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';
import type { LineItem } from './line-items.js';

/**
 * Invoice status
 */
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'void';

/**
 * Invoice entity
 */
export interface Invoice {
  id: number;
  number: string;
  customer_id: number;
  date: string;
  due_date: string;
  subtotal: number;
  total: number;
  tax: number;
  balance: number;
  status: InvoiceStatus;
  sent_at: string | null;
  paid_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  line_items: LineItem[];
}

/**
 * Parameters for listing invoices
 */
export interface InvoiceListParams extends ListParams {
  /** Filter by customer ID */
  customer_id?: number;
  /** Filter by status */
  status?: InvoiceStatus;
  /** Filter invoices since date */
  since_date?: string;
  /** Search query */
  query?: string;
}

/**
 * Data for creating an invoice
 */
export interface InvoiceCreateData {
  customer_id: number;
  date?: string;
  due_date?: string;
  notes?: string;
}

/**
 * Data for updating an invoice
 */
export interface InvoiceUpdateData extends Partial<Omit<InvoiceCreateData, 'customer_id'>> {}

/**
 * Data for emailing an invoice
 */
export interface InvoiceEmailData {
  cc_emails?: string;
  subject?: string;
  message?: string;
}

/**
 * Response from listing invoices
 */
export interface InvoiceListResponse {
  invoices: Invoice[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single invoice
 */
export interface InvoiceResponse {
  invoice: Invoice;
}
