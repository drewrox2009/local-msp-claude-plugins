/**
 * Pagination utilities for the Syncro MSP API
 *
 * Syncro uses page-based pagination with `page` and `per_page` query parameters.
 * Responses include pagination metadata in a `meta` object.
 */

import type { HttpClient } from './http.js';
import type { PaginatedResponse, PaginationMeta } from './types/common.js';

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Results per page (max typically 100) */
  perPage?: number;
}

/**
 * Async iterable wrapper for paginated results
 */
export class PaginatedIterable<T> implements AsyncIterable<T> {
  private readonly httpClient: HttpClient;
  private readonly baseUrl: string;
  private readonly path: string;
  private readonly itemsKey: string;
  private readonly params?: PaginationParams;
  private readonly additionalParams?: Record<string, string | number | boolean | undefined>;

  constructor(
    httpClient: HttpClient,
    baseUrl: string,
    path: string,
    itemsKey: string,
    params?: PaginationParams,
    additionalParams?: Record<string, string | number | boolean | undefined>
  ) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
    this.path = path;
    this.itemsKey = itemsKey;
    this.params = params;
    this.additionalParams = additionalParams;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    let currentPage = this.params?.page ?? 1;
    let totalPages = 1;

    do {
      // Build URL for current page
      const searchParams = new URLSearchParams();
      searchParams.append('page', String(currentPage));

      if (this.params?.perPage) {
        searchParams.append('per_page', String(this.params.perPage));
      }

      // Add any additional filter params
      if (this.additionalParams) {
        for (const [key, value] of Object.entries(this.additionalParams)) {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        }
      }

      const url = `${this.baseUrl}/api/v1${this.path}?${searchParams.toString()}`;
      const response = await this.httpClient.requestUrl<PaginatedResponse<T>>(url);

      // Get items from the response using the itemsKey
      const items = (response as Record<string, unknown>)[this.itemsKey] as T[] | undefined;

      if (items) {
        for (const item of items) {
          yield item;
        }
      }

      // Get pagination metadata
      const meta = response.meta as PaginationMeta | undefined;
      if (meta) {
        totalPages = meta.total_pages;
      } else {
        // No more pages if no meta
        break;
      }

      currentPage++;
    } while (currentPage <= totalPages);
  }

  /**
   * Collect all items into an array
   */
  async toArray(): Promise<T[]> {
    const items: T[] = [];
    for await (const item of this) {
      items.push(item);
    }
    return items;
  }
}

/**
 * Create a paginated iterable for a resource
 */
export function createPaginatedIterable<T>(
  httpClient: HttpClient,
  baseUrl: string,
  path: string,
  itemsKey: string,
  params?: PaginationParams,
  additionalParams?: Record<string, string | number | boolean | undefined>
): PaginatedIterable<T> {
  return new PaginatedIterable<T>(
    httpClient,
    baseUrl,
    path,
    itemsKey,
    params,
    additionalParams
  );
}

/**
 * Convert pagination params to API query params
 */
export function buildPaginationParams(params?: PaginationParams): Record<string, string | number | undefined> {
  if (!params) {
    return {};
  }
  return {
    page: params.page,
    per_page: params.perPage,
  };
}
