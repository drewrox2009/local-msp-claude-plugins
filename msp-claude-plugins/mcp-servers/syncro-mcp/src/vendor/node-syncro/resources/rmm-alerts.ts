/**
 * RMM Alerts resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  RmmAlert,
  RmmAlertListParams,
  RmmAlertListResponse,
  RmmAlertResponse,
} from '../types/rmm-alerts.js';

/**
 * RMM Alerts resource operations
 */
export class RmmAlertsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List RMM alerts
   */
  async list(params?: RmmAlertListParams): Promise<RmmAlertListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.customer_id !== undefined) queryParams['customer_id'] = params.customer_id;
    if (params?.asset_id !== undefined) queryParams['asset_id'] = params.asset_id;
    if (params?.status !== undefined) queryParams['status'] = params.status;
    if (params?.severity !== undefined) queryParams['severity'] = params.severity;

    return this.httpClient.request<RmmAlertListResponse>('/rmm_alerts', {
      params: queryParams,
    });
  }

  /**
   * List all RMM alerts with automatic pagination
   */
  listAll(params?: Omit<RmmAlertListParams, 'page'>): PaginatedIterable<RmmAlert> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.customer_id !== undefined) additionalParams['customer_id'] = params.customer_id;
    if (params?.asset_id !== undefined) additionalParams['asset_id'] = params.asset_id;
    if (params?.status !== undefined) additionalParams['status'] = params.status;
    if (params?.severity !== undefined) additionalParams['severity'] = params.severity;

    return createPaginatedIterable<RmmAlert>(
      this.httpClient,
      this.config.baseUrl,
      '/rmm_alerts',
      'rmm_alerts',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get an RMM alert by ID
   */
  async get(id: number): Promise<RmmAlert> {
    const response = await this.httpClient.request<RmmAlertResponse>(`/rmm_alerts/${id}`);
    return response.rmm_alert;
  }

  /**
   * Mute an RMM alert
   */
  async mute(id: number): Promise<RmmAlert> {
    const response = await this.httpClient.request<RmmAlertResponse>(`/rmm_alerts/${id}/mute`, {
      method: 'PUT',
    });
    return response.rmm_alert;
  }

  /**
   * Resolve an RMM alert
   */
  async resolve(id: number): Promise<RmmAlert> {
    const response = await this.httpClient.request<RmmAlertResponse>(`/rmm_alerts/${id}/resolve`, {
      method: 'PUT',
    });
    return response.rmm_alert;
  }
}
