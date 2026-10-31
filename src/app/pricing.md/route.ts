import { SITE_URL } from "@/lib/constants/site";
import { getActivePlans } from "@/lib/services/plans";
import { toPricingCardProps } from "@/lib/mappers/plan.mapper";

export const revalidate = 3600;

/** Markdown version of the pricing page for AI assistants and quick sharing. */
export async function GET() {
    const plans = (await getActivePlans()).map(toPricingCardProps);

    const sections = plans.map((plan) =>
        [
            `## ${plan.name}${plan.featured ? " (most popular)" : ""}`,
            "",
            `**Price:** ${plan.price}`,
            plan.timeline ? `**Timeline:** ${plan.timeline}` : "",
            plan.bestFor ? `**Best for:** ${plan.bestFor}` : "",
            plan.description || "",
            "",
            ...plan.features.map((f) => `- ${f}`),
            "",
        ]
            .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
            .join("\n")
    );

    const body = [
        "# Pricing",
        "",
        `Fixed prices in Australian dollars. Every package lists what is included and the delivery timeline. 50% deposit to lock in the start date, 50% on completion and approval. Custom software is quoted as a fixed price after a short discovery workshop.`,
        "",
        `Source: ${SITE_URL}/pricing`,
        "",
        ...sections,
        "## Next step",
        "",
        `Book a 20-minute call: ${SITE_URL}/contact`,
        "",
    ].join("\n");

    return new Response(body, {
        headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
}
