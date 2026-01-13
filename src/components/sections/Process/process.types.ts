/**
 * @fileoverview Type definitions for Process step data.
 */

/**
 * Represents a step in the development process displayed in the Process section.
 */
export interface Process {
    /** Display title of the process step */
    title: string;
    /** Time range for the step (e.g., "1–3 days", "1–6 weeks") */
    range: string;
    /** Description of what happens during this phase */
    description: string;
    /** Key deliverables or activities in this phase */
    bullets: string[];
    /** Icon component to display with the step */
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}