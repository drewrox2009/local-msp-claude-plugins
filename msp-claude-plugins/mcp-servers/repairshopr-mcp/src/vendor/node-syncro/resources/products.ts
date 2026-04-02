/**
 * Products resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import { createPaginatedIterable, buildPaginationParams, type PaginatedIterable } from '../pagination.js';
import type {
  Product,
  ProductListParams,
  ProductCreateData,
  ProductUpdateData,
  ProductListResponse,
  ProductResponse,
} from '../types/products.js';

/**
 * Products resource operations
 */
export class ProductsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List products
   */
  async list(params?: ProductListParams): Promise<ProductListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...buildPaginationParams(params),
    };

    if (params?.query !== undefined) queryParams['query'] = params.query;
    if (params?.category !== undefined) queryParams['category'] = params.category;

    return this.httpClient.request<ProductListResponse>('/products', {
      params: queryParams,
    });
  }

  /**
   * List all products with automatic pagination
   */
  listAll(params?: Omit<ProductListParams, 'page'>): PaginatedIterable<Product> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.query !== undefined) additionalParams['query'] = params.query;
    if (params?.category !== undefined) additionalParams['category'] = params.category;

    return createPaginatedIterable<Product>(
      this.httpClient,
      this.config.baseUrl,
      '/products',
      'products',
      { perPage: params?.perPage },
      additionalParams
    );
  }

  /**
   * Get a product by ID
   */
  async get(id: number): Promise<Product> {
    const response = await this.httpClient.request<ProductResponse>(`/products/${id}`);
    return response.product;
  }

  /**
   * Create a product
   */
  async create(data: ProductCreateData): Promise<Product> {
    const response = await this.httpClient.request<ProductResponse>('/products', {
      method: 'POST',
      body: data,
    });
    return response.product;
  }

  /**
   * Update a product
   */
  async update(id: number, data: ProductUpdateData): Promise<Product> {
    const response = await this.httpClient.request<ProductResponse>(`/products/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.product;
  }

  /**
   * Delete a product
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }
}
