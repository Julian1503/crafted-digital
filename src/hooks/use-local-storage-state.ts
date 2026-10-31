"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const EVENT = "local-storage-state";

function subscribe(onChange: () => void) {
    window.addEventListener("storage", onChange);
    window.addEventListener(EVENT, onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(EVENT, onChange);
    };
}

function readRaw(key: string): string | null {
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
}

/**
 * `useState` persisted in localStorage, read through `useSyncExternalStore`
 * so the first client render matches the server (fallback) and later renders
 * follow storage without a setState-in-effect round trip. Values are JSON.
 */
export function useLocalStorageState<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
    const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => null);

    const value = useMemo<T>(() => {
        if (raw === null) return fallback;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return fallback;
        }
    }, [raw, fallback]);

    const setValue = useCallback(
        (next: T | ((prev: T) => T)) => {
            const resolved = typeof next === "function" ? (next as (prev: T) => T)(value) : next;
            try {
                window.localStorage.setItem(key, JSON.stringify(resolved));
            } catch {
                // Storage unavailable (private mode, quota): the UI still updates below.
            }
            window.dispatchEvent(new Event(EVENT));
        },
        [key, value]
    );

    return [value, setValue];
}
