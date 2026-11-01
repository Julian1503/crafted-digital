/**
 * @fileoverview Process section.
 *
 * Phones, tablets, reduced motion and the server render get the linear list.
 * The sticky scroll scene (and framer-motion with it) is a desktop
 * enhancement loaded on demand, so it costs nothing on mobile.
 */
"use client";

import dynamic from "next/dynamic";
import { StaticSteps } from "@/components/sections/StaticSteps";
import { useMediaQuery, DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "@/hooks/use-media-query";
import { PROCESS_STATIC_STEPS } from "@/components/sections/Process/process-data";

function ProcessList() {
    return (
        <StaticSteps
            id="process"
            label="003 · Process"
            heading="How a project runs"
            intro="Four phases, weekly demos, and a handover you own. Most websites ship in 2 to 6 weeks; custom software in 6 to 12."
            steps={PROCESS_STATIC_STEPS}
            theme="dark"
        />
    );
}

// While the scene's code downloads, the list keeps the section in place.
const ProcessScene = dynamic(
    () => import("@/components/sections/Process/ProcessScene").then((m) => m.ProcessScene),
    { ssr: false, loading: ProcessList }
);

export function Process() {
    const isDesktop      = useMediaQuery(DESKTOP_QUERY, false);
    const reducedByQuery = useMediaQuery(REDUCED_MOTION_QUERY, false);
    return !isDesktop || reducedByQuery ? <ProcessList /> : <ProcessScene />;
}
