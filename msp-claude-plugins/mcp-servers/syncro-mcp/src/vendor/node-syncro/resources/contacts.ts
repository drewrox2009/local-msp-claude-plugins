/**
 * Contacts resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Contact,
  ContactListParams,
  ContactCreateData,
  ContactUpdateData,
  ContactListResponse,
  ContactResponse,
} from '../types/contacts.js';

/**
 * Contacts resource operations
 */
export class ContactsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List contacts
   */
  async list(params?: ContactListParams): Promise<ContactListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.customer_id !== undefined) queryParams['customer_id'] = params.customer_id;
    if (params?.query !== undefined) queryParams['query'] = params.query;

    return this.httpClient.request<ContactListResponse>('/contacts', {
      params: queryParams,
    });
  }

  /**
   * List all contacts with automatic pagination
   */
  listAll(params?: Omit<ContactListParams, 'page'>): PaginatedIterable<Contact> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.customer_id !== undefined) additionalParams['customer_id'] = params.customer_id;
    if (params?.query !== undefined) additionalParams['query'] = params.query;

    return createPaginatedIterable<Contact>(
      this.httpClient,
      this.config.baseUrl,
      '/contacts',
      'contacts',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a contact by ID
   */
  async get(id: number): Promise<Contact> {
    const response = await this.httpClient.request<ContactResponse>(`/contacts/${id}`);
    return response.contact;
  }

  /**
   * Create a contact
   */
  async create(data: ContactCreateData): Promise<Contact> {
    const response = await this.httpClient.request<ContactResponse>('/contacts', {
      method: 'POST',
      body: data,
    });
    return response.contact;
  }

  /**
   * Update a contact
   */
  async update(id: number, data: ContactUpdateData): Promise<Contact> {
    const response = await this.httpClient.request<ContactResponse>(`/contacts/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.contact;
  }

  /**
   * Delete a contact
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/contacts/${id}`, {
      method: 'DELETE',
    });
  }
}
