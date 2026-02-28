/**
 * @fileoverview Toast notification hook using Sonner.
 * Provides a standardized API for displaying toast notifications.
 */
"use client";

import * as React from "react";
import { toast as sonnerToast } from "sonner";
import type { ToastActionElement } from "@/components/ui/sonner";

/** Available toast variant styles */
type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "loading";

/**
 * Configuration options for displaying a toast notification.
 */
export interface ToastInput {
    /** Main title text of the toast */
    title?: React.ReactNode;
    /** Additional description text below the title */
    description?: React.ReactNode;
    /** Visual style variant. Default: "default" */
    variant?: ToastVariant;
    /** Optional action button to display in the toast */
    action?: ToastActionElement;
    /** Duration in milliseconds before auto-dismiss */
    duration?: number;
    /** Unique identifier for the toast (used for updates) */
    id?: string | number;
}

/** Error shape coming from backend */
export type ApiError = {
    code?: string;
    message?: string; // resumen
    messages?: string[]; // lista (ideal para toast)
    fieldErrors?: Record<string, string[]>;
    issues?: Array<{ path: string; message: string; code?: string }>;
};

export type ToastErrorModel = {
    title: string;
    items: string[];
    remaining: number;
    summary: string;
};

// ─────────────────────────────────────────────────────────────
// Base toast
// ─────────────────────────────────────────────────────────────

function showToast({ title, description, variant = "default", action, duration, id }: ToastInput) {
    const message = title ?? "";
    const options = { description, action, duration, id };

    switch (variant) {
        case "success":
            return sonnerToast.success(message, options);
        case "error":
            return sonnerToast.error(message, options);
        case "warning":
            return sonnerToast.warning(message, options);
        case "info":
            return sonnerToast.info(message, options);
        case "loading":
            return sonnerToast.loading(message, options);
        default:
            return sonnerToast(message, options);
    }
}

function toast(input: ToastInput) {
    const toastId = showToast(input);

    return {
        id: toastId,
        dismiss: () => sonnerToast.dismiss(toastId),
        update: (next: ToastInput) => showToast({ ...next, id: toastId }),
    };
}

// ─────────────────────────────────────────────────────────────
// API error -> model (PURE, no React rendering)
// ─────────────────────────────────────────────────────────────

function uniq(arr: string[]) {
    return Array.from(new Set(arr));
}

function extractApiErrorMessages(err: ApiError | undefined | null): string[] {
    if (!err) return ["Something went wrong"];
    if (err.messages?.length) return uniq(err.messages);
    if (err.issues?.length) return uniq(err.issues.map((i) => i.message));
    if (err.fieldErrors) return uniq(Object.values(err.fieldErrors).flat());
    if (err.message) return [err.message];
    return ["Something went wrong"];
}

function buildToastErrorModel(
    err: ApiError | undefined | null,
    opts?: { title?: string; maxItems?: number }
): ToastErrorModel {
    const title = opts?.title ?? "Please fix the following";
    const maxItems = opts?.maxItems ?? 3;

    const messages = extractApiErrorMessages(err);
    const items = messages.slice(0, maxItems);
    const remaining = Math.max(0, messages.length - maxItems);

    const summary =
        messages.length <= 1
            ? messages[0]
            : remaining > 0
                ? `${items[0]} (+${remaining} more)`
                : items[0];

    return { title, items, remaining, summary };
}

// ─────────────────────────────────────────────────────────────
// Render (visual) part but WITHOUT JSX to keep this file "functions"
// Still returns ReactNode for Sonner description.
// ─────────────────────────────────────────────────────────────

function renderErrorDescription(model: ToastErrorModel): React.ReactNode {
    const list = React.createElement(
        "ul",
        { className: "mt-1 list-disc pl-5 space-y-0.5" },
        model.items.map((m, i) =>
            React.createElement("li", { key: i, className: "text-sm leading-snug" }, m)
        )
    );

    const more =
        model.remaining > 0
            ? React.createElement(
                "div",
                { className: "mt-1 text-sm opacity-80" },
                `+${model.remaining} more`
            )
            : null;

    return React.createElement("div", null, list, more);
}

/**
 * Specialized toast for API errors (validation, etc.)
 * Ready for toast usage: shows up to N items + "+X more".
 */
function toastApiError(
    err: ApiError | undefined | null,
    opts?: {
        title?: string;
        maxItems?: number;
        action?: ToastActionElement;
        duration?: number;
    }
) {
    const model = buildToastErrorModel(err, { title: opts?.title, maxItems: opts?.maxItems });

    return toast({
        variant: "error",
        title: model.title,
        description: renderErrorDescription(model),
        action: opts?.action,
        duration: opts?.duration,
    });
}

function useToast() {
    return React.useMemo(
        () => ({
            toast,
            toastApiError,
            dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
        }),
        []
    );
}

export { toast, toastApiError, useToast };
export type { ToastActionElement };