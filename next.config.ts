import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        optimizeCss: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "cdn.jsdelivr.net",
            },
            {
                protocol: "https",
                hostname: "www.actian.com",
            },
            {
                protocol: "https",
                hostname: "zpesystems.com",
            },

        ],
        // Reduce quality for smaller file sizes (default is 75)
        qualities: [75, 50, 35],
        // Define specific device sizes for responsive images
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Use modern formats
        formats: ['image/avif', 'image/webp'],
    },
};

export default nextConfig;
