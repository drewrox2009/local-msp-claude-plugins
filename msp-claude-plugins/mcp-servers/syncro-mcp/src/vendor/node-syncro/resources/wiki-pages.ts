/**
 * Wiki pages resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  WikiPage,
  WikiPageListParams,
  WikiPageCreateData,
  WikiPageUpdateData,
  WikiPageListResponse,
  WikiPageResponse,
} from '../types/wiki-pages.js';

/**
 * Wiki pages resource operations
 */
export class WikiPagesResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List wiki pages
   */
  async list(params?: WikiPageListParams): Promise<WikiPageListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.customer_id !== undefined) queryParams['customer_id'] = params.customer_id;
    if (params?.query !== undefined) queryParams['query'] = params.query;
    if (params?.public !== undefined) queryParams['public'] = params.public;

    return this.httpClient.request<WikiPageListResponse>('/wiki_pages', {
      params: queryParams,
    });
  }

  /**
   * List all wiki pages with automatic pagination
   */
  listAll(params?: Omit<WikiPageListParams, 'page'>): PaginatedIterable<WikiPage> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.customer_id !== undefined) additionalParams['customer_id'] = params.customer_id;
    if (params?.query !== undefined) additionalParams['query'] = params.query;
    if (params?.public !== undefined) additionalParams['public'] = params.public;

    return createPaginatedIterable<WikiPage>(
      this.httpClient,
      this.config.baseUrl,
      '/wiki_pages',
      'wiki_pages',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a wiki page by ID
   */
  async get(id: number): Promise<WikiPage> {
    const response = await this.httpClient.request<WikiPageResponse>(`/wiki_pages/${id}`);
    return response.wiki_page;
  }

  /**
   * Create a wiki page
   */
  async create(data: WikiPageCreateData): Promise<WikiPage> {
    const response = await this.httpClient.request<WikiPageResponse>('/wiki_pages', {
      method: 'POST',
      body: data,
    });
    return response.wiki_page;
  }

  /**
   * Update a wiki page
   */
  async update(id: number, data: WikiPageUpdateData): Promise<WikiPage> {
    const response = await this.httpClient.request<WikiPageResponse>(`/wiki_pages/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.wiki_page;
  }

  /**
   * Delete a wiki page
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/wiki_pages/${id}`, {
      method: 'DELETE',
    });
  }
}
