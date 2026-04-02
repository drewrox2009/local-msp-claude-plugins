/**
 * Assets resource operations
 */

import type { HttpClient } from '../http.js';
import type {
  Asset,
  AssetListParams,
  AssetCreateData,
  AssetUpdateData,
} from '../types/assets.js';

export class AssetsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async list(params?: AssetListParams): Promise<Asset[]> {
    const response = await this.httpClient.request<{ assets: Asset[] }>('/api/v1/assets', {
      params: this.buildParams(params),
    });
    return response.assets;
  }

  async listAll(params?: AssetListParams): Promise<Asset[]> {
    const allItems: Asset[] = [];
    let page = 1;
    const pageSize = params?.page_size ?? 25;

    while (true) {
      const items = await this.list({ ...params, page, page_size: pageSize });
      allItems.push(...items);
      if (items.length < pageSize) break;
      page++;
    }
    return allItems;
  }

  async get(id: number): Promise<Asset> {
    const response = await this.httpClient.request<{ asset: Asset }>(`/api/v1/assets/${id}`);
    return response.asset;
  }

  async create(data: AssetCreateData): Promise<Asset> {
    const response = await this.httpClient.request<{ asset: Asset }>('/api/v1/assets', {
      method: 'POST',
      body: { asset: data },
    });
    return response.asset;
  }

  async update(id: number, data: AssetUpdateData): Promise<Asset> {
    const response = await this.httpClient.request<{ asset: Asset }>(`/api/v1/assets/${id}`, {
      method: 'PUT',
      body: { asset: data },
    });
    return response.asset;
  }

  async delete(id: number): Promise<void> {
    await this.httpClient.request<void>(`/api/v1/assets/${id}`, {
      method: 'DELETE',
    });
  }

  async archive(id: number): Promise<void> {
    await this.httpClient.request<void>(`/api/v1/assets/${id}/archive`, {
      method: 'PUT',
    });
  }

  private buildParams(params?: object): Record<string, string | number | boolean | undefined> {
    if (!params) return {};
    const result: Record<string, string | number | boolean | undefined> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        result[key] = value as string | number | boolean;
      }
    }
    return result;
  }
}
