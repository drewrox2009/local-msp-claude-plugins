/**
 * RMM Alert types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * RMM Alert status
 */
export type RmmAlertStatus = 'active' | 'muted' | 'resolved';

/**
 * RMM Alert entity
 */
export interface RmmAlert {
  id: number;
  customer_id: number;
  asset_id: number;
  alert_type: string;
  description: string;
  status: RmmAlertStatus;
  severity: string;
  triggered_at: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing RMM alerts
 */
export interface RmmAlertListParams extends ListParams {
  /** Filter by customer ID */
  customer_id?: number;
  /** Filter by asset ID */
  asset_id?: number;
  /** Filter by status */
  status?: RmmAlertStatus;
  /** Filter by severity */
  severity?: string;
}

/**
 * Response from listing RMM alerts
 */
export interface RmmAlertListResponse {
  rmm_alerts: RmmAlert[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single RMM alert
 */
export interface RmmAlertResponse {
  rmm_alert: RmmAlert;
}
