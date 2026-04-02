/**
 * Lazy-loaded RepairShopr client
 *
 * RepairShopr is wired through the vendored Syncro client because the API shape
 * is closely related. We override the base URL to target repairshopr.com.
 */

import type { SyncroClient } from "../vendor/node-syncro/index.js";

export interface RepairShoprCredentials {
  apiKey: string;
  subdomain?: string;
}

let _client: SyncroClient | null = null;
let _credentials: RepairShoprCredentials | null = null;

/**
 * Get credentials from environment variables
 */
export function getCredentials(): RepairShoprCredentials | null {
  const apiKey = process.env.REPAIRSHOPR_API_KEY;
  const subdomain = process.env.REPAIRSHOPR_SUBDOMAIN;

  if (!apiKey) {
    return null;
  }

  return { apiKey, subdomain };
}

/**
 * Get or create the RepairShopr client (lazy initialization)
 */
export async function getClient(): Promise<SyncroClient> {
  const creds = getCredentials();

  if (!creds) {
    throw new Error(
      "No API credentials provided. Please configure REPAIRSHOPR_API_KEY environment variable."
    );
  }

  // If credentials changed, invalidate the cached client
  if (
    _client &&
    _credentials &&
    (creds.apiKey !== _credentials.apiKey ||
      creds.subdomain !== _credentials.subdomain)
  ) {
    _client = null;
  }

  if (!_client) {
    const { SyncroClient } = await import("../vendor/node-syncro/index.js");
    _client = new SyncroClient({
      apiKey: creds.apiKey,
      baseUrl: creds.subdomain
        ? `https://${creds.subdomain}.repairshopr.com`
        : "https://repairshopr.com",
    });
    _credentials = creds;
  }

  return _client;
}

/**
 * Clear the cached client (useful for testing)
 */
export function clearClient(): void {
  _client = null;
  _credentials = null;
}
