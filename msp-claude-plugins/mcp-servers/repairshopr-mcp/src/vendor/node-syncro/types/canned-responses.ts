/**
 * Canned response types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Canned response entity
 */
export interface CannedResponse {
  id: number;
  name: string;
  body: string;
  category: string;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing canned responses
 */
export interface CannedResponseListParams extends ListParams {
  /** Search query */
  query?: string;
  /** Filter by category */
  category?: string;
}

/**
 * Response from listing canned responses
 */
export interface CannedResponseListResponse {
  canned_responses: CannedResponse[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single canned response
 */
export interface CannedResponseResponse {
  canned_response: CannedResponse;
}
