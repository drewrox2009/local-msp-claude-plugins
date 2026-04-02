/**
 * Appointments resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Appointment,
  AppointmentListParams,
  AppointmentCreateData,
  AppointmentUpdateData,
  AppointmentListResponse,
  AppointmentResponse,
} from '../types/appointments.js';

/**
 * Appointments resource operations
 */
export class AppointmentsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List appointments
   */
  async list(params?: AppointmentListParams): Promise<AppointmentListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.customer_id !== undefined) queryParams['customer_id'] = params.customer_id;
    if (params?.ticket_id !== undefined) queryParams['ticket_id'] = params.ticket_id;
    if (params?.user_id !== undefined) queryParams['user_id'] = params.user_id;
    if (params?.start_date !== undefined) queryParams['start_date'] = params.start_date;
    if (params?.end_date !== undefined) queryParams['end_date'] = params.end_date;

    return this.httpClient.request<AppointmentListResponse>('/appointments', {
      params: queryParams,
    });
  }

  /**
   * List all appointments with automatic pagination
   */
  listAll(params?: Omit<AppointmentListParams, 'page'>): PaginatedIterable<Appointment> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.customer_id !== undefined) additionalParams['customer_id'] = params.customer_id;
    if (params?.ticket_id !== undefined) additionalParams['ticket_id'] = params.ticket_id;
    if (params?.user_id !== undefined) additionalParams['user_id'] = params.user_id;
    if (params?.start_date !== undefined) additionalParams['start_date'] = params.start_date;
    if (params?.end_date !== undefined) additionalParams['end_date'] = params.end_date;

    return createPaginatedIterable<Appointment>(
      this.httpClient,
      this.config.baseUrl,
      '/appointments',
      'appointments',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get an appointment by ID
   */
  async get(id: number): Promise<Appointment> {
    const response = await this.httpClient.request<AppointmentResponse>(`/appointments/${id}`);
    return response.appointment;
  }

  /**
   * Create an appointment
   */
  async create(data: AppointmentCreateData): Promise<Appointment> {
    const response = await this.httpClient.request<AppointmentResponse>('/appointments', {
      method: 'POST',
      body: data,
    });
    return response.appointment;
  }

  /**
   * Update an appointment
   */
  async update(id: number, data: AppointmentUpdateData): Promise<Appointment> {
    const response = await this.httpClient.request<AppointmentResponse>(`/appointments/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.appointment;
  }

  /**
   * Delete an appointment
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }
}
