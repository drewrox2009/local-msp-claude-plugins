/**
 * Ticket problem type types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Ticket problem type entity
 */
export interface TicketProblemType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing ticket problem types
 */
export interface TicketProblemTypeListParams extends ListParams {
  /** Search query */
  query?: string;
}

/**
 * Response from listing ticket problem types
 */
export interface TicketProblemTypeListResponse {
  ticket_problem_types: TicketProblemType[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single ticket problem type
 */
export interface TicketProblemTypeResponse {
  ticket_problem_type: TicketProblemType;
}
