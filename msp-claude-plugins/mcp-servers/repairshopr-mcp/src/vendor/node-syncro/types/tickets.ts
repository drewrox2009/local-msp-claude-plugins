/**
 * Ticket types for the Syncro MSP API
 */

import type { ListParams, Properties, PaginationMeta } from './common.js';

/**
 * Ticket comment
 */
export interface TicketComment {
  id: number;
  subject: string;
  body: string;
  hidden: boolean;
  do_not_email: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
}

/**
 * Ticket entity
 */
export interface Ticket {
  id: number;
  number: string;
  subject: string;
  customer_id: number;
  contact_id: number | null;
  problem_type: string;
  status: string;
  resolved_at: string | null;
  start_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: number | null;
  ticket_type_id: number | null;
  location_id: number | null;
  asset_ids: number[];
  comments: TicketComment[];
  properties: Properties;
}

/**
 * Parameters for listing tickets
 */
export interface TicketListParams extends ListParams {
  /** Filter by customer ID */
  customer_id?: number;
  /** Filter by contact ID */
  contact_id?: number;
  /** Filter by status */
  status?: string;
  /** Filter by assigned user ID */
  user_id?: number;
  /** Filter tickets created/updated since date (ISO 8601) */
  since?: string;
  /** Filter by problem type */
  problem_type?: string;
  /** Search query */
  query?: string;
  /** Filter resolved tickets */
  resolved?: boolean;
}

/**
 * Data for creating a ticket
 */
export interface TicketCreateData {
  customer_id: number;
  subject: string;
  problem_type?: string;
  status?: string;
  contact_id?: number;
  user_id?: number;
  ticket_type_id?: number;
  location_id?: number;
  due_date?: string;
  start_at?: string;
  asset_ids?: number[];
  properties?: Properties;
  /** Initial comment body */
  comment_body?: string;
  /** Initial comment subject */
  comment_subject?: string;
}

/**
 * Data for updating a ticket
 */
export interface TicketUpdateData extends Partial<Omit<TicketCreateData, 'customer_id'>> {}

/**
 * Data for adding a comment to a ticket
 */
export interface TicketCommentData {
  subject?: string;
  body: string;
  hidden?: boolean;
  do_not_email?: boolean;
}

/**
 * Ticket timer
 */
export interface TicketTimer {
  id: number;
  ticket_id: number;
  user_id: number;
  started_at: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

/**
 * Data for starting a ticket timer
 */
export interface TicketTimerStartData {
  notes?: string;
}

/**
 * Data for updating a ticket timer
 */
export interface TicketTimerUpdateData {
  notes?: string;
}

/**
 * Response from listing tickets
 */
export interface TicketListResponse {
  tickets: Ticket[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single ticket
 */
export interface TicketResponse {
  ticket: Ticket;
}

/**
 * Response from getting a ticket timer
 */
export interface TicketTimerResponse {
  timer: TicketTimer;
}
