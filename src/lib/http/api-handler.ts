/**
 * @fileoverview Improved API handler utilities for consistent response handling.
 * Provides type-safe response builders and error handling middleware.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ValidationError,
  BadRequestError,
  InternalServerError,
  isApiError,
} from "@/lib/errors/api-error";

/**
 * Success response builder with consistent formatting.
 *
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with JSON data
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Error response builder that handles ApiError instances and generic errors.
 *
 * @param error - The error to convert to a response
 * @returns NextResponse with error details
 */
export function errorResponse(error: unknown): NextResponse {
  // Log all errors for monitoring (replace with proper logging service)
  console.error("[API Error]", error);

  if (isApiError(error)) {
    return NextResponse.json(error.toJSON(), { status: error.statusCode });
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const validationError = ValidationError.fromZodError(error);
    return NextResponse.json(validationError.toJSON(), {
      status: validationError.statusCode,
    });
  }

  // Generic error fallback
  const internalError = new InternalServerError();
  return NextResponse.json(internalError.toJSON(), {
    status: internalError.statusCode,
  });
}

/**
 * Route handler wrapper that provides consistent error handling.
 *
 * @param handler - The async route handler function
 * @returns Wrapped handler with error handling
 *
 * @example
 * ```ts
 * export const GET = withErrorHandling(async (req) => {
 *   const data = await fetchData();
 *   return successResponse(data);
 * });
 * ```
 */
export function withErrorHandling(
  handler: (req: NextRequest, context?: unknown) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: unknown): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

/**
 * Validates request JSON body against a Zod schema.
 * Throws ValidationError if validation fails.
 *
 * @param req - NextRequest instance
 * @param schema - Zod schema to validate against
 * @returns Parsed and validated data
 */
export async function validateRequestBody<T extends z.ZodTypeAny>(
  req: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch (parseError) {
    console.error("[API] JSON parse error:", parseError);
    throw new BadRequestError("Invalid or malformed JSON in request body");
  }
  return schema.parse(body); // Will throw ZodError on failure
}

/**
 * Validates request search params against a Zod schema.
 * Throws ValidationError if validation fails.
 *
 * @param req - NextRequest instance
 * @param schema - Zod schema to validate against
 * @returns Parsed and validated params
 */
export function validateSearchParams<T extends z.ZodTypeAny>(
  req: NextRequest,
  schema: T
): z.infer<T> {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  return schema.parse(params); // Will throw ZodError on failure
}

/**
 * Paginated response builder with consistent format.
 *
 * @param data - Array of items
 * @param total - Total count of items
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Formatted paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return successResponse({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}
