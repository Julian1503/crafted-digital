/**
 * @fileoverview Type definitions for Service data.
 */
import * as react from "react";
import { LucideProps } from "lucide-react";

/**
 * Represents a service offering displayed in the Services section.
 */
export interface Service {
    /** Display title of the service */
    title: string;
    /** Detailed description of what the service includes */
    description: string;
    /** Short outcome statement (e.g., "Ship fast with a scalable foundation.") */
    outcome: string;
    /** List of key features or deliverables included in the service */
    bullets: string[];
    /** Lucide icon component to display with the service */
    icon: react.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
}