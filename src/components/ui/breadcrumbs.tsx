import Link from "next/link";
import { safeJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/constants/site";

export interface Crumb {
    name: string;
    /** Site path, e.g. `/services`. The last crumb is the current page. */
    href: string;
}

export function breadcrumbJsonLd(items: Crumb[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${SITE_URL}${item.href === "/" ? "" : item.href}`,
        })),
    };
}

interface BreadcrumbsProps {
    items: Crumb[];
    /** Text colour; defaults to the light-surface muted tone. */
    color?: string;
    className?: string;
}

/** Visible breadcrumb trail plus its BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items, color = "rgba(10,10,10,0.62)", className = "" }: BreadcrumbsProps) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd(items)) }} />
            <nav aria-label="Breadcrumb" className={className}>
                <ol className="flex flex-wrap items-center gap-2 text-[0.7rem] tracking-[0.16em] uppercase" style={{ color }}>
                    {items.map((item, i) => {
                        const isLast = i === items.length - 1;
                        return (
                            <li key={item.href} className="flex items-center gap-2">
                                {isLast
                                    ? <span aria-current="page">{item.name}</span>
                                    : <Link href={item.href} className="underline-offset-4 hover:underline focus-visible:underline">{item.name}</Link>}
                                {!isLast && <span aria-hidden="true" className="opacity-60">/</span>}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
