/**
 * Appointment types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Appointment entity
 */
export interface Appointment {
  id: number;
  customer_id: number;
  ticket_id: number | null;
  start_at: string;
  end_at: string;
  all_day: boolean;
  notes: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing appointments
 */
export interface AppointmentListParams extends ListParams {
  /** Filter by customer ID */
  customer_id?: number;
  /** Filter by ticket ID */
  ticket_id?: number;
  /** Filter by user ID */
  user_id?: number;
  /** Filter appointments starting after date */
  start_date?: string;
  /** Filter appointments ending before date */
  end_date?: string;
}

/**
 * Data for creating an appointment
 */
export interface AppointmentCreateData {
  customer_id?: number;
  ticket_id?: number;
  start_at: string;
  end_at: string;
  all_day?: boolean;
  notes?: string;
  user_id?: number;
}

/**
 * Data for updating an appointment
 */
export interface AppointmentUpdateData extends Partial<AppointmentCreateData> {}

/**
 * Response from listing appointments
 */
export interface AppointmentListResponse {
  appointments: Appointment[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single appointment
 */
export interface AppointmentResponse {
  appointment: Appointment;
}
