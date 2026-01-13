/**
 * @fileoverview Type definitions for Pricing plan data.
 */

/**
 * Represents a pricing plan/package displayed in the Pricing section.
 */
export interface Pricing {
    /** Display name of the pricing tier (e.g., "Starter Build", "MVP Sprint") */
    name: string;
    /** Price string with currency (e.g., "AUD 3,000+") */
    price: string;
    /** Short tagline describing ideal use case */
    tagline: string;
    /** Detailed description of what's included */
    description: string;
    /** Typical project timeline (e.g., "1–2 weeks", "Monthly") */
    timeline: string;
    /** List of features included in the package */
    features: string[];
    /** Call-to-action button text */
    cta: string;
    /** Whether this is the recommended/featured plan */
    featured: boolean;
}