/**
 * Configuration types and defaults for the Syncro MSP client
 */

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  /** Whether rate limiting is enabled (default: true) */
  enabled: boolean;
  /** Maximum requests per window (default: 180) */
  maxRequests: number;
  /** Window duration in milliseconds (default: 60000) */
  windowMs: number;
  /** Threshold percentage to start throttling (default: 0.8 = 80%) */
  throttleThreshold: number;
  /** Delay between retries on 429 (default: 5000ms) */
  retryAfterMs: number;
  /** Maximum retry attempts on rate limit errors (default: 3) */
  maxRetries: number;
}

/**
 * Default rate limit configuration for Syncro (180 req/min)
 */
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  enabled: true,
  maxRequests: 180,
  windowMs: 60_000,
  throttleThreshold: 0.8,
  retryAfterMs: 5_000,
  maxRetries: 3,
};

/**
 * Configuration for the Syncro MSP client
 */
export interface SyncroConfig {
  /** API Key for authentication */
  apiKey: string;
  /** Subdomain for your Syncro instance (e.g., 'mycompany' for mycompany.syncromsp.com) */
  subdomain?: string;
  /** Explicit base URL (alternative to subdomain) */
  baseUrl?: string;
  /** Rate limiting configuration */
  rateLimit?: Partial<RateLimitConfig>;
}

/**
 * Resolved configuration with all defaults applied
 */
export interface ResolvedConfig {
  apiKey: string;
  baseUrl: string;
  rateLimit: RateLimitConfig;
}

/**
 * Resolves a configuration object by applying defaults
 */
export function resolveConfig(config: SyncroConfig): ResolvedConfig {
  // Validate required fields
  if (!config.apiKey) {
    throw new Error('apiKey is required');
  }

  // Determine base URL
  let baseUrl: string;
  if (config.baseUrl) {
    baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
  } else if (config.subdomain) {
    baseUrl = `https://${config.subdomain}.syncromsp.com`;
  } else {
    throw new Error('Either subdomain or baseUrl must be provided');
  }

  return {
    apiKey: config.apiKey,
    baseUrl,
    rateLimit: {
      ...DEFAULT_RATE_LIMIT_CONFIG,
      ...config.rateLimit,
    },
  };
}
