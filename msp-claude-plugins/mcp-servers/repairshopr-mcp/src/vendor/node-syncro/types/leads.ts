/**
 * Lead types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Lead entity
 */
export interface Lead {
  id: number;
  business_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  address_2: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
  status: string;
  source: string;
  converted: boolean;
  converted_at: string | null;
  customer_id: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing leads
 */
export interface LeadListParams extends ListParams {
  /** Search query */
  query?: string;
  /** Filter by status */
  status?: string;
  /** Filter by source */
  source?: string;
  /** Filter converted leads */
  converted?: boolean;
}

/**
 * Data for creating a lead
 */
export interface LeadCreateData {
  business_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
  status?: string;
  source?: string;
}

/**
 * Data for updating a lead
 */
export interface LeadUpdateData extends Partial<LeadCreateData> {}

/**
 * Data for converting a lead to a customer
 */
export interface LeadConvertData {
  /** Create a ticket for the new customer */
  create_ticket?: boolean;
  /** Ticket subject if creating a ticket */
  ticket_subject?: string;
}

/**
 * Response from listing leads
 */
export interface LeadListResponse {
  leads: Lead[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single lead
 */
export interface LeadResponse {
  lead: Lead;
}

/**
 * Response from converting a lead
 */
export interface LeadConvertResponse {
  customer_id: number;
  ticket_id?: number;
}
