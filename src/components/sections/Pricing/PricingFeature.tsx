import {Check} from "lucide-react";

type PricingFeatureProps = {
    features: string[];
}

export default function PricingFeature({features} : PricingFeatureProps) {
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