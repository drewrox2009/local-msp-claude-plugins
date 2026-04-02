/**
 * Tickets resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Ticket,
  TicketListParams,
  TicketCreateData,
  TicketUpdateData,
  TicketCommentData,
  TicketTimerStartData,
  TicketTimerUpdateData,
  TicketListResponse,
  TicketResponse,
  TicketTimer,
  TicketTimerResponse,
} from '../types/tickets.js';

/**
 * Tickets resource operations
 */
export class TicketsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List tickets
   */
  async list(params?: TicketListParams): Promise<TicketListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.customer_id !== undefined) queryParams['customer_id'] = params.customer_id;
    if (params?.contact_id !== undefined) queryParams['contact_id'] = params.contact_id;
    if (params?.status !== undefined) queryParams['status'] = params.status;
    if (params?.user_id !== undefined) queryParams['user_id'] = params.user_id;
    if (params?.since !== undefined) queryParams['since'] = params.since;
    if (params?.problem_type !== undefined) queryParams['problem_type'] = params.problem_type;
    if (params?.query !== undefined) queryParams['query'] = params.query;
    if (params?.resolved !== undefined) queryParams['resolved'] = params.resolved;

    return this.httpClient.request<TicketListResponse>('/tickets', {
      params: queryParams,
    });
  }

  /**
   * List all tickets with automatic pagination
   */
  listAll(params?: Omit<TicketListParams, 'page'>): PaginatedIterable<Ticket> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.customer_id !== undefined) additionalParams['customer_id'] = params.customer_id;
    if (params?.contact_id !== undefined) additionalParams['contact_id'] = params.contact_id;
    if (params?.status !== undefined) additionalParams['status'] = params.status;
    if (params?.user_id !== undefined) additionalParams['user_id'] = params.user_id;
    if (params?.since !== undefined) additionalParams['since'] = params.since;
    if (params?.problem_type !== undefined) additionalParams['problem_type'] = params.problem_type;
    if (params?.query !== undefined) additionalParams['query'] = params.query;
    if (params?.resolved !== undefined) additionalParams['resolved'] = params.resolved;

    return createPaginatedIterable<Ticket>(
      this.httpClient,
      this.config.baseUrl,
      '/tickets',
      'tickets',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a ticket by ID
   */
  async get(id: number): Promise<Ticket> {
    const response = await this.httpClient.request<TicketResponse>(`/tickets/${id}`);
    return response.ticket;
  }

  /**
   * Create a ticket
   */
  async create(data: TicketCreateData): Promise<Ticket> {
    const response = await this.httpClient.request<TicketResponse>('/tickets', {
      method: 'POST',
      body: data,
    });
    return response.ticket;
  }

  /**
   * Update a ticket
   */
  async update(id: number, data: TicketUpdateData): Promise<Ticket> {
    const response = await this.httpClient.request<TicketResponse>(`/tickets/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.ticket;
  }

  /**
   * Delete a ticket
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/tickets/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Add a comment to a ticket
   */
  async addComment(id: number, data: TicketCommentData): Promise<Ticket> {
    const response = await this.httpClient.request<TicketResponse>(`/tickets/${id}/comment`, {
      method: 'POST',
      body: data,
    });
    return response.ticket;
  }

  /**
   * Get the active timer for a ticket
   */
  async getTimer(id: number): Promise<TicketTimer> {
    const response = await this.httpClient.request<TicketTimerResponse>(`/tickets/${id}/timer`);
    return response.timer;
  }

  /**
   * Start a timer on a ticket
   */
  async startTimer(id: number, data?: TicketTimerStartData): Promise<TicketTimer> {
    const response = await this.httpClient.request<TicketTimerResponse>(`/tickets/${id}/timer`, {
      method: 'POST',
      body: data || {},
    });
    return response.timer;
  }

  /**
   * Update the timer on a ticket
   */
  async updateTimer(id: number, data: TicketTimerUpdateData): Promise<TicketTimer> {
    const response = await this.httpClient.request<TicketTimerResponse>(`/tickets/${id}/timer`, {
      method: 'PUT',
      body: data,
    });
    return response.timer;
  }

  /**
   * Delete/stop the timer on a ticket
   */
  async deleteTimer(id: number): Promise<void> {
    await this.httpClient.request(`/tickets/${id}/timer`, {
      method: 'DELETE',
    });
  }
}
