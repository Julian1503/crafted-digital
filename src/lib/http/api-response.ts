import { NextResponse } from "next/server";
import { z } from "zod";
import { simpleError, toValidationError } from "./api-errors";

export function ok<T>(data: T, status = 200) {
    return NextResponse.json(data as unknown, { status });
}

export function fail(code: Parameters<typeof simpleError>[0], message: string, status: number) {
    return NextResponse.json(simpleError(code, message), { status });
}

export function validationFail(err: z.ZodError, status = 400) {
    return NextResponse.json(toValidationError(err), { status });
}