/**
 * Settings resource operations
 */

import type { HttpClient } from '../http.js';
import type {
  Settings,
  SettingsResponse,
} from '../types/settings.js';

/**
 * Settings resource operations
 */
export class SettingsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get company settings
   */
  async get(): Promise<Settings> {
    const response = await this.httpClient.request<SettingsResponse>('/settings');
    return response.settings;
  }
}
