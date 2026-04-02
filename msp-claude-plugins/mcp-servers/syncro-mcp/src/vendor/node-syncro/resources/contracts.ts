/**
 * Contracts resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Contract,
  ContractListParams,
  ContractCreateData,
  ContractUpdateData,
  ContractListResponse,
  ContractResponse,
} from '../types/contracts.js';

/**
 * Contracts resource operations
 */
export class ContractsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List contracts
   */
  async list(params?: ContractListParams): Promise<ContractListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.customer_id !== undefined) queryParams['customer_id'] = params.customer_id;
    if (params?.query !== undefined) queryParams['query'] = params.query;

    return this.httpClient.request<ContractListResponse>('/contracts', {
      params: queryParams,
    });
  }

  /**
   * List all contracts with automatic pagination
   */
  listAll(params?: Omit<ContractListParams, 'page'>): PaginatedIterable<Contract> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.customer_id !== undefined) additionalParams['customer_id'] = params.customer_id;
    if (params?.query !== undefined) additionalParams['query'] = params.query;

    return createPaginatedIterable<Contract>(
      this.httpClient,
      this.config.baseUrl,
      '/contracts',
      'contracts',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a contract by ID
   */
  async get(id: number): Promise<Contract> {
    const response = await this.httpClient.request<ContractResponse>(`/contracts/${id}`);
    return response.contract;
  }

  /**
   * Create a contract
   */
  async create(data: ContractCreateData): Promise<Contract> {
    const response = await this.httpClient.request<ContractResponse>('/contracts', {
      method: 'POST',
      body: data,
    });
    return response.contract;
  }

  /**
   * Update a contract
   */
  async update(id: number, data: ContractUpdateData): Promise<Contract> {
    const response = await this.httpClient.request<ContractResponse>(`/contracts/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.contract;
  }

  /**
   * Delete a contract
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/contracts/${id}`, {
      method: 'DELETE',
    });
  }
}
