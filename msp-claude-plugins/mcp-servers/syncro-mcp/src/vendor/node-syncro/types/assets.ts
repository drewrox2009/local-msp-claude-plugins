/**
 * Asset types for the Syncro MSP API
 */

import type { ListParams, Properties, PaginationMeta } from './common.js';

/**
 * Asset entity
 */
export interface Asset {
  id: number;
  customer_id: number;
  contact_id: number | null;
  name: string;
  asset_type: string;
  asset_serial: string;
  manufacturer: string;
  model: string;
  purchase_date: string | null;
  warranty_expires: string | null;
  notes: string;
  syncro_uuid: string | null;
  rmm_computer_id: number | null;
  kabesco_enabled: boolean;
  created_at: string;
  updated_at: string;
  properties: Properties;
}

/**
 * Parameters for listing assets
 */
export interface AssetListParams extends ListParams {
  /** Filter by customer ID */
  customer_id?: number;
  /** Filter by asset type */
  asset_type?: string;
  /** Search query */
  query?: string;
  /** Filter by serial number */
  asset_serial?: string;
}

/**
 * Data for creating an asset
 */
export interface AssetCreateData {
  customer_id: number;
  name: string;
  asset_type?: string;
  asset_serial?: string;
  manufacturer?: string;
  model?: string;
  contact_id?: number;
  purchase_date?: string;
  warranty_expires?: string;
  notes?: string;
  properties?: Properties;
}

/**
 * Data for updating an asset
 */
export interface AssetUpdateData extends Partial<Omit<AssetCreateData, 'customer_id'>> {}

/**
 * Response from listing assets
 */
export interface AssetListResponse {
  assets: Asset[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single asset
 */
export interface AssetResponse {
  asset: Asset;
}
