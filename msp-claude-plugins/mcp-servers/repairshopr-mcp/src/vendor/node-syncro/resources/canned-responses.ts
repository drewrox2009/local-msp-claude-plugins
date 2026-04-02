/**
 * Canned responses resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  CannedResponse,
  CannedResponseListParams,
  CannedResponseListResponse,
  CannedResponseResponse,
} from '../types/canned-responses.js';

/**
 * Canned responses resource operations
 */
export class CannedResponsesResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List canned responses
   */
  async list(params?: CannedResponseListParams): Promise<CannedResponseListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.query !== undefined) queryParams['query'] = params.query;
    if (params?.category !== undefined) queryParams['category'] = params.category;

    return this.httpClient.request<CannedResponseListResponse>('/canned_responses', {
      params: queryParams,
    });
  }

  /**
   * List all canned responses with automatic pagination
   */
  listAll(params?: Omit<CannedResponseListParams, 'page'>): PaginatedIterable<CannedResponse> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.query !== undefined) additionalParams['query'] = params.query;
    if (params?.category !== undefined) additionalParams['category'] = params.category;

    return createPaginatedIterable<CannedResponse>(
      this.httpClient,
      this.config.baseUrl,
      '/canned_responses',
      'canned_responses',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a canned response by ID
   */
  async get(id: number): Promise<CannedResponse> {
    const response = await this.httpClient.request<CannedResponseResponse>(`/canned_responses/${id}`);
    return response.canned_response;
  }
}
