/**
 * Custom error classes for the Syncro MSP client
 */

/**
 * Base error class for all Syncro errors
 */
export class SyncroError extends Error {
  /** HTTP status code if applicable */
  readonly statusCode: number;
  /** Raw response data if available */
  readonly response: unknown;

  constructor(message: string, statusCode: number = 0, response?: unknown) {
    super(message);
    this.name = 'SyncroError';
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, SyncroError.prototype);
  }
}

/**
 * Authentication error (401, 403)
 */
export class SyncroAuthenticationError extends SyncroError {
  constructor(message: string, statusCode: number = 401, response?: unknown) {
    super(message, statusCode, response);
    this.name = 'SyncroAuthenticationError';
    Object.setPrototypeOf(this, SyncroAuthenticationError.prototype);
  }
}

/**
 * Resource not found error (404)
 */
export class SyncroNotFoundError extends SyncroError {
  constructor(message: string, response?: unknown) {
    super(message, 404, response);
    this.name = 'SyncroNotFoundError';
    Object.setPrototypeOf(this, SyncroNotFoundError.prototype);
  }
}

/**
 * Validation error (422)
 */
export class SyncroValidationError extends SyncroError {
  /** Validation error details */
  readonly errors: Array<{ field: string; message: string }>;

  constructor(message: string, errors: Array<{ field: string; message: string }> = [], response?: unknown) {
    super(message, 422, response);
    this.name = 'SyncroValidationError';
    this.errors = errors;
    Object.setPrototypeOf(this, SyncroValidationError.prototype);
  }
}

/**
 * Rate limit exceeded error (429)
 */
export class SyncroRateLimitError extends SyncroError {
  /** Suggested retry delay in milliseconds */
  readonly retryAfter: number;

  constructor(message: string, retryAfter: number = 5000, response?: unknown) {
    super(message, 429, response);
    this.name = 'SyncroRateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, SyncroRateLimitError.prototype);
  }
}

/**
 * Server error (500+)
 */
export class SyncroServerError extends SyncroError {
  constructor(message: string, statusCode: number = 500, response?: unknown) {
    super(message, statusCode, response);
    this.name = 'SyncroServerError';
    Object.setPrototypeOf(this, SyncroServerError.prototype);
  }
}
