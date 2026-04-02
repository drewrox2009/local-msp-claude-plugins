/**
 * Leads resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Lead,
  LeadListParams,
  LeadCreateData,
  LeadUpdateData,
  LeadConvertData,
  LeadListResponse,
  LeadResponse,
  LeadConvertResponse,
} from '../types/leads.js';

/**
 * Leads resource operations
 */
export class LeadsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List leads
   */
  async list(params?: LeadListParams): Promise<LeadListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.query !== undefined) queryParams['query'] = params.query;
    if (params?.status !== undefined) queryParams['status'] = params.status;
    if (params?.source !== undefined) queryParams['source'] = params.source;
    if (params?.converted !== undefined) queryParams['converted'] = params.converted;

    return this.httpClient.request<LeadListResponse>('/leads', {
      params: queryParams,
    });
  }

  /**
   * List all leads with automatic pagination
   */
  listAll(params?: Omit<LeadListParams, 'page'>): PaginatedIterable<Lead> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.query !== undefined) additionalParams['query'] = params.query;
    if (params?.status !== undefined) additionalParams['status'] = params.status;
    if (params?.source !== undefined) additionalParams['source'] = params.source;
    if (params?.converted !== undefined) additionalParams['converted'] = params.converted;

    return createPaginatedIterable<Lead>(
      this.httpClient,
      this.config.baseUrl,
      '/leads',
      'leads',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a lead by ID
   */
  async get(id: number): Promise<Lead> {
    const response = await this.httpClient.request<LeadResponse>(`/leads/${id}`);
    return response.lead;
  }

  /**
   * Create a lead
   */
  async create(data: LeadCreateData): Promise<Lead> {
    const response = await this.httpClient.request<LeadResponse>('/leads', {
      method: 'POST',
      body: data,
    });
    return response.lead;
  }

  /**
   * Update a lead
   */
  async update(id: number, data: LeadUpdateData): Promise<Lead> {
    const response = await this.httpClient.request<LeadResponse>(`/leads/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.lead;
  }

  /**
   * Delete a lead
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Convert a lead to a customer
   */
  async convert(id: number, data?: LeadConvertData): Promise<LeadConvertResponse> {
    return this.httpClient.request<LeadConvertResponse>(`/leads/${id}/convert`, {
      method: 'POST',
      body: data || {},
    });
  }
}
