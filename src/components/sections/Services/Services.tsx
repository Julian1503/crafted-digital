/**
 * @fileoverview Services section.
 *
 * Phones, tablets, reduced motion and the server render get the linear list.
 * The sticky scroll scene (and framer-motion with it) is a desktop
 * enhancement loaded on demand, so it costs nothing on mobile.
 */
"use client";

import dynamic from "next/dynamic";
import { StaticSteps } from "@/components/sections/StaticSteps";
import { Marquee } from "@/components/sections/Services/Marquee";
import { useMediaQuery, DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "@/hooks/use-media-query";
import { L, SERVICE_STATIC_STEPS, ADD_ONS } from "@/components/sections/Services/services-data";

function ServicesList() {
    return (
        <>
            <StaticSteps
                id="services"
                label="002 · Services"
                heading="What I build"
                intro="Three ways to work together, from a fixed-price website to custom software with AI in the loop."
                steps={SERVICE_STATIC_STEPS}
                theme="light"
            />
            <div style={{ background: L.bg }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-12">
                    <Marquee items={ADD_ONS} />
                </div>
            </div>
        </>
    );
}

// While the scene's code downloads, the list keeps the section in place.
const ServicesScene = dynamic(
    () => import("@/components/sections/Services/ServicesScene").then((m) => m.ServicesScene),
    { ssr: false, loading: ServicesList }
);

export function Services() {
    const isDesktop      = useMediaQuery(DESKTOP_QUERY, false);
    const reducedByQuery = useMediaQuery(REDUCED_MOTION_QUERY, false);
    return !isDesktop || reducedByQuery ? <ServicesList /> : <ServicesScene />;
}
