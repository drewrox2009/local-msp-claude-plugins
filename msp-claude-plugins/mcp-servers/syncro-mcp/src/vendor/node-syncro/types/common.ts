/**
 * Common types shared across the Syncro MSP API
 */

/**
 * Pagination metadata from Syncro API responses
 */
export interface PaginationMeta {
  /** Total number of pages */
  total_pages: number;
  /** Total number of entries */
  total_entries: number;
  /** Results per page */
  per_page: number;
  /** Current page number */
  page: number;
}

/**
 * Base paginated response structure
 */
export interface PaginatedResponse<T> {
  /** Pagination metadata */
  meta?: PaginationMeta;
  /** The key for items varies by endpoint */
  [key: string]: T[] | PaginationMeta | undefined;
}

/**
 * Common list parameters
 */
export interface ListParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Results per page */
  perPage?: number;
}

/**
 * Properties/custom fields (key-value pairs)
 */
export type Properties = Record<string, string>;

/**
 * Standard timestamps
 */
export interface Timestamps {
  /** Creation timestamp (ISO 8601) */
  created_at: string;
  /** Last update timestamp (ISO 8601) */
  updated_at: string;
}
