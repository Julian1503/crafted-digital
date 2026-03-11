/**
 * @fileoverview Shared date formatting utilities.
 */

/**
 * Formats a date string as a long-form date (e.g. "8 March 2026").
 * Uses en-AU locale for consistency across server and client.
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a date string as a short date with time (e.g. "8 Mar 2026, 02:30 pm").
 * Uses en-AU locale for consistency across server and client.
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

