import { getActivePlans } from "@/lib/services/plans";
import { toPricingCardProps } from "@/lib/mappers/plan.mapper";
import { Pricing } from "@/components/sections/Pricing/Pricing";
import type { Pricing as PricingType } from "@/components/sections/Pricing/pricing.types";

export async function PricingSection() {
    // No try/catch on purpose: a DB failure must surface rather than publish a
    // pricing section with no plans.
    const activePlans = await getActivePlans();
    const pricingPlans: PricingType[] = activePlans.map(toPricingCardProps);
    return <Pricing plans={pricingPlans} />;
}
