/**
 * Customers resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Customer,
  CustomerListParams,
  CustomerCreateData,
  CustomerUpdateData,
  CustomerListResponse,
  CustomerResponse,
} from '../types/customers.js';

/**
 * Customers resource operations
 */
export class CustomersResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List customers
   */
  async list(params?: CustomerListParams): Promise<CustomerListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.id !== undefined) queryParams['id'] = params.id;
    if (params?.query !== undefined) queryParams['query'] = params.query;
    if (params?.include_disabled !== undefined) queryParams['include_disabled'] = params.include_disabled;
    if (params?.business_name !== undefined) queryParams['business_name'] = params.business_name;
    if (params?.email !== undefined) queryParams['email'] = params.email;
    if (params?.phone !== undefined) queryParams['phone'] = params.phone;

    return this.httpClient.request<CustomerListResponse>('/customers', {
      params: queryParams,
    });
  }

  /**
   * List all customers with automatic pagination
   */
  listAll(params?: Omit<CustomerListParams, 'page'>): PaginatedIterable<Customer> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.id !== undefined) additionalParams['id'] = params.id;
    if (params?.query !== undefined) additionalParams['query'] = params.query;
    if (params?.include_disabled !== undefined) additionalParams['include_disabled'] = params.include_disabled;
    if (params?.business_name !== undefined) additionalParams['business_name'] = params.business_name;
    if (params?.email !== undefined) additionalParams['email'] = params.email;
    if (params?.phone !== undefined) additionalParams['phone'] = params.phone;

    return createPaginatedIterable<Customer>(
      this.httpClient,
      this.config.baseUrl,
      '/customers',
      'customers',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a customer by ID
   */
  async get(id: number): Promise<Customer> {
    const response = await this.httpClient.request<CustomerResponse>(`/customers/${id}`);
    return response.customer;
  }

  /**
   * Create a customer
   */
  async create(data: CustomerCreateData): Promise<Customer> {
    const response = await this.httpClient.request<CustomerResponse>('/customers', {
      method: 'POST',
      body: data,
    });
    return response.customer;
  }

  /**
   * Update a customer
   */
  async update(id: number, data: CustomerUpdateData): Promise<Customer> {
    const response = await this.httpClient.request<CustomerResponse>(`/customers/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.customer;
  }

  /**
   * Delete a customer
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/customers/${id}`, {
      method: 'DELETE',
    });
  }
}
