/**
 * Assets resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Asset,
  AssetListParams,
  AssetCreateData,
  AssetUpdateData,
  AssetListResponse,
  AssetResponse,
} from '../types/assets.js';

/**
 * Assets resource operations
 */
export class AssetsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List assets
   */
  async list(params?: AssetListParams): Promise<AssetListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.customer_id !== undefined) queryParams['customer_id'] = params.customer_id;
    if (params?.asset_type !== undefined) queryParams['asset_type'] = params.asset_type;
    if (params?.query !== undefined) queryParams['query'] = params.query;
    if (params?.asset_serial !== undefined) queryParams['asset_serial'] = params.asset_serial;

    return this.httpClient.request<AssetListResponse>('/customer_assets', {
      params: queryParams,
    });
  }

  /**
   * List all assets with automatic pagination
   */
  listAll(params?: Omit<AssetListParams, 'page'>): PaginatedIterable<Asset> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.customer_id !== undefined) additionalParams['customer_id'] = params.customer_id;
    if (params?.asset_type !== undefined) additionalParams['asset_type'] = params.asset_type;
    if (params?.query !== undefined) additionalParams['query'] = params.query;
    if (params?.asset_serial !== undefined) additionalParams['asset_serial'] = params.asset_serial;

    return createPaginatedIterable<Asset>(
      this.httpClient,
      this.config.baseUrl,
      '/customer_assets',
      'assets',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get an asset by ID
   */
  async get(id: number): Promise<Asset> {
    const response = await this.httpClient.request<AssetResponse>(`/customer_assets/${id}`);
    return response.asset;
  }

  /**
   * Create an asset
   */
  async create(data: AssetCreateData): Promise<Asset> {
    const response = await this.httpClient.request<AssetResponse>('/customer_assets', {
      method: 'POST',
      body: data,
    });
    return response.asset;
  }

  /**
   * Update an asset
   */
  async update(id: number, data: AssetUpdateData): Promise<Asset> {
    const response = await this.httpClient.request<AssetResponse>(`/customer_assets/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.asset;
  }

  /**
   * Delete an asset
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/customer_assets/${id}`, {
      method: 'DELETE',
    });
  }
}
