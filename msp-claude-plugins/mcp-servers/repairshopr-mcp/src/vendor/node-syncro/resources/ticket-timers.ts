/**
 * Ticket timers resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  TicketTimerEntry,
  TicketTimerListParams,
  TicketTimerCreateData,
  TicketTimerEntryUpdateData,
  TicketTimerListResponse,
  TicketTimerEntryResponse,
} from '../types/ticket-timers.js';

/**
 * Ticket timers resource operations
 */
export class TicketTimersResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List ticket timers
   */
  async list(params?: TicketTimerListParams): Promise<TicketTimerListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.ticket_id !== undefined) queryParams['ticket_id'] = params.ticket_id;
    if (params?.user_id !== undefined) queryParams['user_id'] = params.user_id;
    if (params?.since !== undefined) queryParams['since'] = params.since;

    return this.httpClient.request<TicketTimerListResponse>('/ticket_timers', {
      params: queryParams,
    });
  }

  /**
   * List all ticket timers with automatic pagination
   */
  listAll(params?: Omit<TicketTimerListParams, 'page'>): PaginatedIterable<TicketTimerEntry> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.ticket_id !== undefined) additionalParams['ticket_id'] = params.ticket_id;
    if (params?.user_id !== undefined) additionalParams['user_id'] = params.user_id;
    if (params?.since !== undefined) additionalParams['since'] = params.since;

    return createPaginatedIterable<TicketTimerEntry>(
      this.httpClient,
      this.config.baseUrl,
      '/ticket_timers',
      'ticket_timers',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a ticket timer by ID
   */
  async get(id: number): Promise<TicketTimerEntry> {
    const response = await this.httpClient.request<TicketTimerEntryResponse>(`/ticket_timers/${id}`);
    return response.ticket_timer;
  }

  /**
   * Create a ticket timer entry
   */
  async create(data: TicketTimerCreateData): Promise<TicketTimerEntry> {
    const response = await this.httpClient.request<TicketTimerEntryResponse>('/ticket_timers', {
      method: 'POST',
      body: data,
    });
    return response.ticket_timer;
  }

  /**
   * Update a ticket timer entry
   */
  async update(id: number, data: TicketTimerEntryUpdateData): Promise<TicketTimerEntry> {
    const response = await this.httpClient.request<TicketTimerEntryResponse>(`/ticket_timers/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.ticket_timer;
  }

  /**
   * Delete a ticket timer entry
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/ticket_timers/${id}`, {
      method: 'DELETE',
    });
  }
}
