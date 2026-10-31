"use client";

import * as React from "react";
import Link from "next/link";
import { track, type AnalyticsEvent } from "@/lib/analytics";

interface TrackedLinkProps extends React.ComponentProps<typeof Link> {
    event: AnalyticsEvent;
    eventProps?: Record<string, string | number | boolean>;
}

/** next/link that pushes an analytics event on click. */
export function TrackedLink({ event, eventProps, onClick, ...rest }: TrackedLinkProps) {
    return (
        <Link
            {...rest}
            onClick={(e) => {
                track(event, eventProps);
                onClick?.(e);
            }}
        />
    );
}
