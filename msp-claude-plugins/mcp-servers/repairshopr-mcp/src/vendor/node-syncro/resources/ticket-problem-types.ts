/**
 * Ticket problem types resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  TicketProblemType,
  TicketProblemTypeListParams,
  TicketProblemTypeListResponse,
  TicketProblemTypeResponse,
} from '../types/ticket-problem-types.js';

/**
 * Ticket problem types resource operations
 */
export class TicketProblemTypesResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List ticket problem types
   */
  async list(params?: TicketProblemTypeListParams): Promise<TicketProblemTypeListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.query !== undefined) queryParams['query'] = params.query;

    return this.httpClient.request<TicketProblemTypeListResponse>('/ticket_problem_types', {
      params: queryParams,
    });
  }

  /**
   * List all ticket problem types with automatic pagination
   */
  listAll(params?: Omit<TicketProblemTypeListParams, 'page'>): PaginatedIterable<TicketProblemType> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.query !== undefined) additionalParams['query'] = params.query;

    return createPaginatedIterable<TicketProblemType>(
      this.httpClient,
      this.config.baseUrl,
      '/ticket_problem_types',
      'ticket_problem_types',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a ticket problem type by ID
   */
  async get(id: number): Promise<TicketProblemType> {
    const response = await this.httpClient.request<TicketProblemTypeResponse>(`/ticket_problem_types/${id}`);
    return response.ticket_problem_type;
  }
}
