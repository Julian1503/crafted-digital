import type { NextConfig } from "next";

/**
 * Content Security Policy.
 * `script-src` keeps 'unsafe-inline' because GTM/GA and the JSON-LD blocks are
 * inline and the app does not yet thread a per-request nonce (tracked as a
 * follow-up in docs/audits/action-plan.md). Every other directive is strict.
 */
const isProd = process.env.NODE_ENV === "production";

const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    // 'unsafe-eval' is required by React/Turbopack in development only.
    `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://www.googletagmanager.com https://*.google-analytics.com https://*.googletagmanager.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "media-src 'self' https://res.cloudinary.com blob:",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com https://res.cloudinary.com https://ik.imagekit.io https://upload.imagekit.io https://api.cloudinary.com" + (isProd ? "" : " ws: wss:"),
    "frame-src https://www.googletagmanager.com https://*.g.doubleclick.net",
    "worker-src 'self' blob:",
    ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
    { key: "Content-Security-Policy", value: csp },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
    poweredByHeader: false,
    experimental: {
        optimizePackageImports: ["lucide-react", "framer-motion"],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: securityHeaders,
            },
        ];
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "res.cloudinary.com", pathname: "/dpnkr4r6w/**" },
            { protocol: "https", hostname: "ik.imagekit.io" },
        ],
        qualities: [75, 50, 35],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ["image/avif", "image/webp"],
    },
};

export default nextConfig;
