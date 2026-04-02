/**
 * Estimates resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Estimate,
  EstimateListParams,
  EstimateCreateData,
  EstimateUpdateData,
  EstimateEmailData,
  EstimateListResponse,
  EstimateResponse,
} from '../types/estimates.js';
import type { Invoice, InvoiceResponse } from '../types/invoices.js';

/**
 * Estimates resource operations
 */
export class EstimatesResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List estimates
   */
  async list(params?: EstimateListParams): Promise<EstimateListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.customer_id !== undefined) queryParams['customer_id'] = params.customer_id;
    if (params?.status !== undefined) queryParams['status'] = params.status;
    if (params?.query !== undefined) queryParams['query'] = params.query;

    return this.httpClient.request<EstimateListResponse>('/estimates', {
      params: queryParams,
    });
  }

  /**
   * List all estimates with automatic pagination
   */
  listAll(params?: Omit<EstimateListParams, 'page'>): PaginatedIterable<Estimate> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.customer_id !== undefined) additionalParams['customer_id'] = params.customer_id;
    if (params?.status !== undefined) additionalParams['status'] = params.status;
    if (params?.query !== undefined) additionalParams['query'] = params.query;

    return createPaginatedIterable<Estimate>(
      this.httpClient,
      this.config.baseUrl,
      '/estimates',
      'estimates',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get an estimate by ID
   */
  async get(id: number): Promise<Estimate> {
    const response = await this.httpClient.request<EstimateResponse>(`/estimates/${id}`);
    return response.estimate;
  }

  /**
   * Create an estimate
   */
  async create(data: EstimateCreateData): Promise<Estimate> {
    const response = await this.httpClient.request<EstimateResponse>('/estimates', {
      method: 'POST',
      body: data,
    });
    return response.estimate;
  }

  /**
   * Update an estimate
   */
  async update(id: number, data: EstimateUpdateData): Promise<Estimate> {
    const response = await this.httpClient.request<EstimateResponse>(`/estimates/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.estimate;
  }

  /**
   * Delete an estimate
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/estimates/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Email an estimate
   */
  async email(id: number, data?: EstimateEmailData): Promise<void> {
    await this.httpClient.request(`/estimates/${id}/email`, {
      method: 'POST',
      body: data || {},
    });
  }

  /**
   * Convert an estimate to an invoice
   */
  async convertToInvoice(id: number): Promise<Invoice> {
    const response = await this.httpClient.request<InvoiceResponse>(`/estimates/${id}/convert_to_invoice`, {
      method: 'POST',
    });
    return response.invoice;
  }
}
