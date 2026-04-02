/**
 * Contact types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Contact entity
 */
export interface Contact {
  id: number;
  customer_id: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  mobile: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing contacts
 */
export interface ContactListParams extends ListParams {
  /** Filter by customer ID */
  customer_id?: number;
  /** Search query */
  query?: string;
}

/**
 * Data for creating a contact
 */
export interface ContactCreateData {
  customer_id: number;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
}

/**
 * Data for updating a contact
 */
export interface ContactUpdateData extends Partial<Omit<ContactCreateData, 'customer_id'>> {}

/**
 * Response from listing contacts
 */
export interface ContactListResponse {
  contacts: Contact[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single contact
 */
export interface ContactResponse {
  contact: Contact;
}
