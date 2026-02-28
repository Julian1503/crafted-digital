import { z } from "zod";

export type ApiErrorCode =
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "VALIDATION_ERROR"
    | "BAD_REQUEST"
    | "INTERNAL_ERROR";

export type ApiErrorResponse = {
    error: {
        code: ApiErrorCode;
        message: string;
        fieldErrors?: Record<string, string[]>;
        issues?: Array<{ path: string; message: string; code?: string }>;
    };
};

type ValidationIssue = { path: string; message: string; code?: string };

function pathToString(path: Array<PropertyKey>) {
    return path.map(String).join(".");
}

function unique(items: string[]) {
    return Array.from(new Set(items));
}

export function toValidationError(err: z.ZodError) {
    const issues: ValidationIssue[] = err.issues.map((i) => ({
        path: pathToString(i.path),
        message: i.message,
        code: i.code,
    }));

    const fieldErrors: Record<string, string[]> = {};
    for (const i of issues) {
        const key = i.path || "_";
        fieldErrors[key] = fieldErrors[key] ?? [];
        fieldErrors[key].push(i.message);
    }
    for (const k of Object.keys(fieldErrors)) fieldErrors[k] = unique(fieldErrors[k]);

    // Para toast: top N mensajes (únicos) + contador real
    const uniqueMessages = unique(issues.map((i) => i.message));
    const TOP = 3;
    const topMessages = uniqueMessages.slice(0, TOP);
    const remaining = Math.max(0, uniqueMessages.length - TOP);

    const summary =
        uniqueMessages.length === 0
            ? "Validation error"
            : remaining > 0
                ? `${topMessages[0]} (+${remaining} more)`
                : topMessages[0];

    return {
        error: {
            code: "VALIDATION_ERROR" as const,
            message: summary,          // si querés un solo string
            messages: remaining > 0 ? [...topMessages, `+${remaining} more`] : topMessages, // mejor UX
            fieldErrors,
            issues,
        },
    };
}

export function simpleError(code: ApiErrorCode, message: string): ApiErrorResponse {
    return { error: { code, message } };
}