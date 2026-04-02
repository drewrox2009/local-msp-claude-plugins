/**
 * Ticket timer types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Standalone ticket timer entity (from /ticket_timers endpoint)
 */
export interface TicketTimerEntry {
  id: number;
  ticket_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  notes: string;
  billable: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing ticket timers
 */
export interface TicketTimerListParams extends ListParams {
  /** Filter by ticket ID */
  ticket_id?: number;
  /** Filter by user ID */
  user_id?: number;
  /** Filter timers since date */
  since?: string;
}

/**
 * Data for creating a ticket timer entry
 */
export interface TicketTimerCreateData {
  ticket_id: number;
  start_time: string;
  end_time: string;
  notes?: string;
  billable?: boolean;
  user_id?: number;
}

/**
 * Data for updating a ticket timer entry
 */
export interface TicketTimerEntryUpdateData extends Partial<Omit<TicketTimerCreateData, 'ticket_id'>> {}

/**
 * Response from listing ticket timers
 */
export interface TicketTimerListResponse {
  ticket_timers: TicketTimerEntry[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single ticket timer
 */
export interface TicketTimerEntryResponse {
  ticket_timer: TicketTimerEntry;
}
