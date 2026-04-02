/**
 * Customer types for the Syncro MSP API
 */

import type { ListParams, Properties, PaginationMeta } from './common.js';

/**
 * Customer entity
 */
export interface Customer {
  id: number;
  business_name: string;
  business_and_full_name: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  address_2: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  notes: string;
  referred_by: string;
  ref_customer_id: number | null;
  tax_rate_id: number | null;
  notification_email: string;
  invoice_cc_emails: string;
  invoice_term_id: number | null;
  no_email: boolean;
  taxable: boolean;
  disabled: boolean;
  created_at: string;
  updated_at: string;
  properties: Properties;
}

/**
 * Parameters for listing customers
 */
export interface CustomerListParams extends ListParams {
  /** Filter by customer ID */
  id?: number;
  /** Search query (matches business name, contact name, etc.) */
  query?: string;
  /** Include disabled customers */
  include_disabled?: boolean;
  /** Filter by business name */
  business_name?: string;
  /** Filter by email */
  email?: string;
  /** Filter by phone */
  phone?: string;
}

/**
 * Data for creating a customer
 */
export interface CustomerCreateData {
  business_name?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
  referred_by?: string;
  no_email?: boolean;
  taxable?: boolean;
  invoice_cc_emails?: string;
  invoice_term_id?: number;
  properties?: Properties;
}

/**
 * Data for updating a customer
 */
export interface CustomerUpdateData extends Partial<CustomerCreateData> {}

/**
 * Response from listing customers
 */
export interface CustomerListResponse {
  customers: Customer[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single customer
 */
export interface CustomerResponse {
  customer: Customer;
}
