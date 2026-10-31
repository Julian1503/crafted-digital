import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            // /login stays crawlable so its noindex meta tag is honoured.
            disallow: ["/api/", "/admin/"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
