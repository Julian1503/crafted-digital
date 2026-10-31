"use client";

import * as React from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { track } from "@/lib/analytics";
import { CAL_LINK } from "@/lib/constants/site";

const NAMESPACE = "fit-call";

/**
 * Inline Cal.com calendar. The embed script is loaded by the library from
 * app.cal.com (allowed in the CSP); a booking fires `fit_call_booked`.
 */
export function CalBooking() {
    React.useEffect(() => {
        let cancelled = false;
        (async () => {
            const cal = await getCalApi({ namespace: NAMESPACE });
            if (cancelled) return;
            cal("ui", {
                theme: "light",
                hideEventTypeDetails: false,
                layout: "month_view",
                cssVarsPerTheme: { light: { "cal-brand": "#c0392b" }, dark: { "cal-brand": "#e8705f" } },
            });
            cal("on", {
                action: "bookingSuccessful",
                callback: () => track("fit_call_booked", { source: "contact_page" }),
            });
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <Cal
            namespace={NAMESPACE}
            calLink={CAL_LINK}
            style={{ width: "100%", height: "100%", overflow: "auto" }}
            config={{ layout: "month_view", theme: "light" }}
        />
    );
}
