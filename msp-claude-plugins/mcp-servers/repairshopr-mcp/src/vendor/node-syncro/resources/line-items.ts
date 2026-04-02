/**
 * Line items resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  LineItem,
  LineItemListParams,
  LineItemCreateData,
  LineItemUpdateData,
  LineItemListResponse,
  LineItemResponse,
} from '../types/line-items.js';

/**
 * Line items resource operations
 */
export class LineItemsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List line items
   */
  async list(params?: LineItemListParams): Promise<LineItemListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.invoice_id !== undefined) queryParams['invoice_id'] = params.invoice_id;
    if (params?.estimate_id !== undefined) queryParams['estimate_id'] = params.estimate_id;

    return this.httpClient.request<LineItemListResponse>('/line_items', {
      params: queryParams,
    });
  }

  /**
   * List all line items with automatic pagination
   */
  listAll(params?: Omit<LineItemListParams, 'page'>): PaginatedIterable<LineItem> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.invoice_id !== undefined) additionalParams['invoice_id'] = params.invoice_id;
    if (params?.estimate_id !== undefined) additionalParams['estimate_id'] = params.estimate_id;

    return createPaginatedIterable<LineItem>(
      this.httpClient,
      this.config.baseUrl,
      '/line_items',
      'line_items',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a line item by ID
   */
  async get(id: number): Promise<LineItem> {
    const response = await this.httpClient.request<LineItemResponse>(`/line_items/${id}`);
    return response.line_item;
  }

  /**
   * Create a line item
   */
  async create(data: LineItemCreateData): Promise<LineItem> {
    const response = await this.httpClient.request<LineItemResponse>('/line_items', {
      method: 'POST',
      body: data,
    });
    return response.line_item;
  }

  /**
   * Update a line item
   */
  async update(id: number, data: LineItemUpdateData): Promise<LineItem> {
    const response = await this.httpClient.request<LineItemResponse>(`/line_items/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.line_item;
  }

  /**
   * Delete a line item
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/line_items/${id}`, {
      method: 'DELETE',
    });
  }
}
