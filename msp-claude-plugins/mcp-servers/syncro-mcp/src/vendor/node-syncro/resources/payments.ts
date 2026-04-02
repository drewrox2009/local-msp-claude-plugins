/**
 * Payments resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Payment,
  PaymentListParams,
  PaymentCreateData,
  PaymentUpdateData,
  PaymentListResponse,
  PaymentResponse,
} from '../types/payments.js';

/**
 * Payments resource operations
 */
export class PaymentsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List payments
   */
  async list(params?: PaymentListParams): Promise<PaymentListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.customer_id !== undefined) queryParams['customer_id'] = params.customer_id;
    if (params?.invoice_id !== undefined) queryParams['invoice_id'] = params.invoice_id;
    if (params?.since_date !== undefined) queryParams['since_date'] = params.since_date;

    return this.httpClient.request<PaymentListResponse>('/payments', {
      params: queryParams,
    });
  }

  /**
   * List all payments with automatic pagination
   */
  listAll(params?: Omit<PaymentListParams, 'page'>): PaginatedIterable<Payment> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.customer_id !== undefined) additionalParams['customer_id'] = params.customer_id;
    if (params?.invoice_id !== undefined) additionalParams['invoice_id'] = params.invoice_id;
    if (params?.since_date !== undefined) additionalParams['since_date'] = params.since_date;

    return createPaginatedIterable<Payment>(
      this.httpClient,
      this.config.baseUrl,
      '/payments',
      'payments',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a payment by ID
   */
  async get(id: number): Promise<Payment> {
    const response = await this.httpClient.request<PaymentResponse>(`/payments/${id}`);
    return response.payment;
  }

  /**
   * Create a payment
   */
  async create(data: PaymentCreateData): Promise<Payment> {
    const response = await this.httpClient.request<PaymentResponse>('/payments', {
      method: 'POST',
      body: data,
    });
    return response.payment;
  }

  /**
   * Update a payment
   */
  async update(id: number, data: PaymentUpdateData): Promise<Payment> {
    const response = await this.httpClient.request<PaymentResponse>(`/payments/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.payment;
  }

  /**
   * Delete a payment
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/payments/${id}`, {
      method: 'DELETE',
    });
  }
}
