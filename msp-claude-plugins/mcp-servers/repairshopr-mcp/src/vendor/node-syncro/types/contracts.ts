/**
 * Contract types for the Syncro MSP API
 */

import type { ListParams, PaginationMeta } from './common.js';

/**
 * Contract entity
 */
export interface Contract {
  id: number;
  customer_id: number;
  name: string;
  contract_type: string;
  start_date: string;
  end_date: string;
  value: number;
  billing_frequency: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

/**
 * Parameters for listing contracts
 */
export interface ContractListParams extends ListParams {
  /** Filter by customer ID */
  customer_id?: number;
  /** Search query */
  query?: string;
}

/**
 * Data for creating a contract
 */
export interface ContractCreateData {
  customer_id: number;
  name: string;
  contract_type?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  billing_frequency?: string;
  notes?: string;
}

/**
 * Data for updating a contract
 */
export interface ContractUpdateData extends Partial<Omit<ContractCreateData, 'customer_id'>> {}

/**
 * Response from listing contracts
 */
export interface ContractListResponse {
  contracts: Contract[];
  meta: PaginationMeta;
}

/**
 * Response from getting a single contract
 */
export interface ContractResponse {
  contract: Contract;
}
