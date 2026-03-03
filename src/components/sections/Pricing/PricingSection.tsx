import { getPlans } from "@/lib/services/plans";
import { toPricingCardProps } from "@/lib/mappers/plan.mapper";
import { Pricing } from "@/components/sections/Pricing/Pricing";
import type { Pricing as PricingType } from "@/components/sections/Pricing/pricing.types";

export async function PricingSection() {
    let pricingPlans: PricingType[];
    try {
        const dbPlans = await getPlans();
        const activePlans = dbPlans.filter((p) => p.active);
        pricingPlans = activePlans.length > 0 ? activePlans.map(toPricingCardProps) : [];
    } catch {
        pricingPlans = [];
    }

    return <Pricing plans={pricingPlans} />;
}
