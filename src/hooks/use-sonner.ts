"use client";

import * as React from "react";
import { toast as sonnerToast } from "sonner";
import type { ToastActionElement } from "@/components/ui/sonner";

type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "loading";

export type ToastInput = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    variant?: ToastVariant;
    action?: ToastActionElement;
    duration?: number;
    id?: string | number;
};

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

// API parecida a shadcn viejo
function toast(input: ToastInput) {
    const toastId = showToast(input);

    return {
        id: toastId,
        dismiss: () => sonnerToast.dismiss(toastId),
        update: (next: ToastInput) =>
            showToast({
                ...next,
                id: toastId, // Sonner actualiza por id
            }),
    };
}

// Si tenías código que hacía `const { toast } = useToast()`
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
