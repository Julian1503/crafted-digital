/**
 * @fileoverview Custom error classes for consistent API error handling.
 * Provides structured error types with HTTP status codes and error metadata.
 */

import { z } from "zod";

/**
 * Base API error class that all custom errors extend.
 * Provides structured error information for API responses.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts error to JSON response format.
   */
  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}

/**
 * Error thrown when authentication is required but not provided.
 * HTTP 401 Unauthorized
 */
export class UnauthorizedError extends ApiError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

/**
 * Error thrown when user lacks required permissions.
 * HTTP 403 Forbidden
 */
export class ForbiddenError extends ApiError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
  }
}

/**
 * Error thrown when a requested resource is not found.
 * HTTP 404 Not Found
 */
export class NotFoundError extends ApiError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, "NOT_FOUND");
  }
}

/**
 * Error thrown when request validation fails.
 * HTTP 400 Bad Request
 */
export class ValidationError extends ApiError {
  public readonly fieldErrors?: Record<string, string[]>;
  public readonly issues?: Array<{ path: string; message: string; code?: string }>;

  constructor(
    message: string,
    fieldErrors?: Record<string, string[]>,
    issues?: Array<{ path: string; message: string; code?: string }>
  ) {
    super(message, 400, "VALIDATION_ERROR");
    this.fieldErrors = fieldErrors;
    this.issues = issues;
  }

  /**
   * Creates a ValidationError from a Zod validation error.
   */
  static fromZodError(err: z.ZodError): ValidationError {
    const issues = err.issues.map((i) => ({
      path: i.path.map(String).join("."),
      message: i.message,
      code: i.code,
    }));

    const fieldErrors: Record<string, string[]> = {};
    for (const issue of issues) {
      const key = issue.path || "_";
      fieldErrors[key] = fieldErrors[key] ?? [];
      fieldErrors[key].push(issue.message);
    }

    // Deduplicate field error messages
    for (const key of Object.keys(fieldErrors)) {
      fieldErrors[key] = Array.from(new Set(fieldErrors[key]));
    }

    const uniqueMessages = Array.from(new Set(issues.map((i) => i.message)));
    const TOP = 3;
    const topMessages = uniqueMessages.slice(0, TOP);
    const remaining = Math.max(0, uniqueMessages.length - TOP);

    const summary =
      uniqueMessages.length === 0
        ? "Validation failed"
        : remaining > 0
          ? `${topMessages[0]} (+${remaining} more)`
          : topMessages[0];

    return new ValidationError(summary, fieldErrors, issues);
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        fieldErrors: this.fieldErrors,
        issues: this.issues,
      },
    };
  }
}

/**
 * Error thrown when request data is malformed or invalid.
 * HTTP 400 Bad Request
 */
export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400, "BAD_REQUEST");
  }
}

/**
 * Error thrown when a resource already exists (e.g., duplicate slug).
 * HTTP 409 Conflict
 */
export class ConflictError extends ApiError {
  constructor(resource: string, identifier: string) {
    super(
      `${resource} with identifier '${identifier}' already exists`,
      409,
      "CONFLICT"
    );
  }
}

/**
 * Error thrown for unexpected server errors.
 * HTTP 500 Internal Server Error
 */
export class InternalServerError extends ApiError {
  constructor(message = "An unexpected error occurred", isOperational = false) {
    super(message, 500, "INTERNAL_ERROR", isOperational);
  }
}

/**
 * Error thrown when a service or dependency is unavailable.
 * HTTP 503 Service Unavailable
 */
export class ServiceUnavailableError extends ApiError {
  constructor(service: string) {
    super(`${service} is currently unavailable`, 503, "SERVICE_UNAVAILABLE");
  }
}

/**
 * Error thrown when rate limit is exceeded.
 * HTTP 429 Too Many Requests
 */
export class RateLimitError extends ApiError {
  public readonly retryAfter?: number;

  constructor(retryAfter?: number) {
    const message = retryAfter
      ? `Rate limit exceeded. Retry after ${retryAfter} seconds`
      : "Rate limit exceeded";
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.retryAfter = retryAfter;
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        retryAfter: this.retryAfter,
      },
    };
  }
}

/**
 * Type guard to check if an error is an ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Extracts a safe error message from any error type.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}
