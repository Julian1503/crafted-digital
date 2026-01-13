/**
 * @fileoverview Pricing feature list component.
 * Displays a list of features included in a pricing plan.
 */
import { Check } from "lucide-react";

/**
 * Props for the PricingFeature component.
 */
interface PricingFeatureProps {
    /** List of feature descriptions to display */
    features: string[];
}

/**
 * Pricing feature list component.
 * Renders a list of features with checkmark icons.
 *
 * @param props - Array of feature strings
 * @returns An unordered list of features with icons
 */
export default function PricingFeature({ features }: PricingFeatureProps) {
    return(
        <ul className="flex-1 space-y-4 mb-8">
            {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-secondary shrink-0"/>
                    <span className="text-background/80">{feature}</span>
                </li>
            ))}
        </ul>
    );
}