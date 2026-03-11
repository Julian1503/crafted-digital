/**
 * @fileoverview Application-wide enums and constants.
 * Centralizes magic strings and provides type-safe alternatives.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Content Status
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Status values for blog posts and case studies.
 */
export const ContentStatus = {
  PUBLISHED: "published",
  DRAFT: "draft",
  SCHEDULED: "scheduled",
} as const;

export type ContentStatusType = (typeof ContentStatus)[keyof typeof ContentStatus];

/**
 * CSS classes for content status badges (blog, case-studies).
 */
export const CONTENT_STATUS_BADGE: Record<ContentStatusType, string> = {
  published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

// ─────────────────────────────────────────────────────────────────────────────
// Lead Status
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Status values for customer leads.
 */
export const LeadStatus = {
  NEW: "new",
  CONTACTED: "contacted",
  QUALIFIED: "qualified",
  WON: "won",
  LOST: "lost",
} as const;

export type LeadStatusType = (typeof LeadStatus)[keyof typeof LeadStatus];

/**
 * CSS classes for lead status badges.
 */
export const LEAD_STATUS_BADGE: Record<LeadStatusType, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  contacted: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  qualified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  won: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ─────────────────────────────────────────────────────────────────────────────
// Booking Status
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Status values for bookings.
 */
export const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type BookingStatusType = (typeof BookingStatus)[keyof typeof BookingStatus];

/**
 * CSS classes for booking status badges.
 */
export const BOOKING_STATUS_BADGE: Record<BookingStatusType, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ─────────────────────────────────────────────────────────────────────────────
// User Roles
// ─────────────────────────────────────────────────────────────────────────────

/**
 * System user roles.
 */
export const UserRole = {
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// ─────────────────────────────────────────────────────────────────────────────
// Sort Order Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Default gap between sortOrder values for new items.
 * Allows efficient reordering without updating all records.
 */
export const SORT_ORDER_GAP = 1000;

/**
 * Minimum gap threshold before renormalization is triggered.
 * When gaps fall below this value, all sortOrders are recalculated.
 */
export const SORT_ORDER_MIN_GAP = 1;

// ─────────────────────────────────────────────────────────────────────────────
// Pagination Defaults
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Default page size for paginated API responses.
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Maximum allowed page size to prevent performance issues.
 */
export const MAX_PAGE_SIZE = 100;

// ─────────────────────────────────────────────────────────────────────────────
// Media Providers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Supported media storage providers.
 */
export const MediaProvider = {
  CLOUDINARY: "cloudinary",
  IMAGEKIT: "imagekit",
  LOCAL: "local",
} as const;

export type MediaProviderType = (typeof MediaProvider)[keyof typeof MediaProvider];

// ─────────────────────────────────────────────────────────────────────────────
// Audit Actions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard audit log action types.
 */
export const AuditAction = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  REORDER: "reorder",
  RENORMALIZE: "renormalize",
  TOGGLE: "toggle",
  TOGGLE_FEATURED: "toggle_featured",
  BULK_STATUS: "bulk_status",
} as const;

export type AuditActionType = (typeof AuditAction)[keyof typeof AuditAction];
