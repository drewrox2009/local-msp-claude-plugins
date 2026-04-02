/**
 * Settings types for the Syncro MSP API
 */

/**
 * Company settings from /settings endpoint
 */
export interface Settings {
  business_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  timezone: string;
  currency: string;
  date_format: string;
  time_format: string;
}

/**
 * User info from /me endpoint
 */
export interface Me {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

/**
 * Response from /settings endpoint
 */
export interface SettingsResponse {
  settings: Settings;
}

/**
 * Response from /me endpoint
 */
export interface MeResponse {
  user: Me;
}
