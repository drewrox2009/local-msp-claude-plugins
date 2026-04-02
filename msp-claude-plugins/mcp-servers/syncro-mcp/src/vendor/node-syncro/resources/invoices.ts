/**
 * Invoices resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Invoice,
  InvoiceListParams,
  InvoiceCreateData,
  InvoiceUpdateData,
  InvoiceEmailData,
  InvoiceListResponse,
  InvoiceResponse,
} from '../types/invoices.js';

/**
 * Invoices resource operations
 */
export class InvoicesResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List invoices
   */
  async list(params?: InvoiceListParams): Promise<InvoiceListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.customer_id !== undefined) queryParams['customer_id'] = params.customer_id;
    if (params?.status !== undefined) queryParams['status'] = params.status;
    if (params?.since_date !== undefined) queryParams['since_date'] = params.since_date;
    if (params?.query !== undefined) queryParams['query'] = params.query;

    return this.httpClient.request<InvoiceListResponse>('/invoices', {
      params: queryParams,
    });
  }

  /**
   * List all invoices with automatic pagination
   */
  listAll(params?: Omit<InvoiceListParams, 'page'>): PaginatedIterable<Invoice> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.customer_id !== undefined) additionalParams['customer_id'] = params.customer_id;
    if (params?.status !== undefined) additionalParams['status'] = params.status;
    if (params?.since_date !== undefined) additionalParams['since_date'] = params.since_date;
    if (params?.query !== undefined) additionalParams['query'] = params.query;

    return createPaginatedIterable<Invoice>(
      this.httpClient,
      this.config.baseUrl,
      '/invoices',
      'invoices',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get an invoice by ID
   */
  async get(id: number): Promise<Invoice> {
    const response = await this.httpClient.request<InvoiceResponse>(`/invoices/${id}`);
    return response.invoice;
  }

  /**
   * Create an invoice
   */
  async create(data: InvoiceCreateData): Promise<Invoice> {
    const response = await this.httpClient.request<InvoiceResponse>('/invoices', {
      method: 'POST',
      body: data,
    });
    return response.invoice;
  }

  /**
   * Update an invoice
   */
  async update(id: number, data: InvoiceUpdateData): Promise<Invoice> {
    const response = await this.httpClient.request<InvoiceResponse>(`/invoices/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.invoice;
  }

  /**
   * Delete an invoice
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Email an invoice
   */
  async email(id: number, data?: InvoiceEmailData): Promise<void> {
    await this.httpClient.request(`/invoices/${id}/email`, {
      method: 'POST',
      body: data || {},
    });
  }

  /**
   * Print an invoice (returns PDF URL or data)
   */
  async print(id: number): Promise<{ pdf_url: string }> {
    return this.httpClient.request<{ pdf_url: string }>(`/invoices/${id}/print`, {
      method: 'POST',
    });
  }

  /**
   * Mark an invoice as sent
   */
  async markSent(id: number): Promise<Invoice> {
    const response = await this.httpClient.request<InvoiceResponse>(`/invoices/${id}/mark_sent`, {
      method: 'PUT',
    });
    return response.invoice;
  }
}
