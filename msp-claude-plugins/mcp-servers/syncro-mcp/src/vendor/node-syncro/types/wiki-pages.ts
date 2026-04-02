/**
 * Wiki page types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Wiki page entity
 */
export interface WikiPage {
  id: number;
  customer_id: number | null;
  title: string;
  body: string;
  public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing wiki pages
 */
export interface WikiPageListParams extends ListParams {
  /** Filter by customer ID */
  customer_id?: number;
  /** Search query */
  query?: string;
  /** Filter by public/private */
  public?: boolean;
}

/**
 * Data for creating a wiki page
 */
export interface WikiPageCreateData {
  title: string;
  body: string;
  customer_id?: number;
  public?: boolean;
}

/**
 * Data for updating a wiki page
 */
export interface WikiPageUpdateData extends Partial<WikiPageCreateData> {}

/**
 * Response from listing wiki pages
 */
export interface WikiPageListResponse {
  wiki_pages: WikiPage[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single wiki page
 */
export interface WikiPageResponse {
  wiki_page: WikiPage;
}
