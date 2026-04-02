/**
 * node-syncro
 * Comprehensive, fully-typed Node.js/TypeScript library for the Syncro MSP API
 */

// Main client
export { SyncroClient } from './client.js';

// Configuration
export type { SyncroConfig, RateLimitConfig } from './config.js';
export { DEFAULT_RATE_LIMIT_CONFIG } from './config.js';

// Error classes
export {
  SyncroError,
  SyncroAuthenticationError,
  SyncroNotFoundError,
  SyncroValidationError,
  SyncroRateLimitError,
  SyncroServerError,
} from './errors.js';

// Pagination
export type { PaginationParams, PaginatedIterable } from './pagination.js';

// Types
export * from './types/index.js';
