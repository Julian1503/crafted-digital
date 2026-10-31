/**
 * @fileoverview Client-side analytics helper.
 *
 * Pushes events to the GTM dataLayer (the single measurement path). GTM owns
 * the GA4 tag, so nothing here talks to gtag directly. Safe to call on the
 * server or without GTM loaded: it becomes a no-op.
 *
 * Event names follow object_action in snake_case; see docs/audits/action-plan.md (MEAS-02).
 */

type Primitive = string | number | boolean | null | undefined;

export type AnalyticsParams = Record<string, Primitive | Primitive[]>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export type AnalyticsEvent =
  | "cta_clicked"
  | "plan_cta_clicked"
  | "contact_form_started"
  | "contact_form_submitted"
  | "contact_form_failed"
  | "fit_call_booked"
  | "faq_opened"
  | "outbound_clicked"
  | "email_clicked";

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...params });
  } catch {
    // Analytics must never break the page.
  }
}
