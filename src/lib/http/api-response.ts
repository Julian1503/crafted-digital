/**
 * @fileoverview Legacy API response helpers for backward compatibility.
 * @deprecated Prefer using api-handler.ts for new code.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { simpleError, toValidationError } from "./api-errors";

/**
 * @deprecated Use successResponse from @/lib/http/api-handler instead
 */
export function ok<T>(data: T, status = 200) {
    return NextResponse.json(data as unknown, { status });
}

/**
 * @deprecated Use throw new ApiError or errorResponse from @/lib/http/api-handler instead
 */
export function fail(code: Parameters<typeof simpleError>[0], message: string, status: number) {
    return NextResponse.json(simpleError(code, message), { status });
}

/**
 * @deprecated Use ValidationError.fromZodError or errorResponse from @/lib/http/api-handler instead
 */
export function validationFail(err: z.ZodError, status = 400) {
    return NextResponse.json(toValidationError(err), { status });
}