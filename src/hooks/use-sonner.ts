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

/**
 * Displays a toast notification using the configured variant.
 *
 * @param options - Toast configuration options
 * @returns The toast ID for later reference
 */
function showToast({ title, description, variant = "default", action, duration, id }: ToastInput) {
    const message = title ?? "";
    const options = {
        description,
        action,
        duration,
        id,
    };

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

/**
 * Creates and displays a toast notification with control methods.
 *
 * @param input - Toast configuration options
 * @returns Object with toast ID, dismiss, and update methods
 *
 * @example
 * ```tsx
 * const { dismiss } = toast({ title: "Saved!", variant: "success" });
 * // Later: dismiss();
 * ```
 */
function toast(input: ToastInput) {
    const toastId = showToast(input);

    return {
        id: toastId,
        dismiss: () => sonnerToast.dismiss(toastId),
        update: (next: ToastInput) =>
            showToast({
                ...next,
                id: toastId,
            }),
    };
}

/**
 * Hook providing toast notification functionality.
 * Returns memoized toast and dismiss functions for efficient re-renders.
 *
 * @returns Object with toast and dismiss functions
 *
 * @example
 * ```tsx
 * const { toast } = useToast();
 * toast({ title: "Hello!", description: "Welcome to the app" });
 * ```
 */
function useToast() {
    return React.useMemo(
        () => ({
            toast,
            dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
        }),
        []
    );
}

export { toast, useToast };
export type { ToastActionElement };
