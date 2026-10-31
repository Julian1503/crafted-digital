import type { Metadata, Viewport } from "next";
import { DM_Serif_Text, Fira_Sans } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import {Providers} from "@/components/ui/providers";
import {StructuredData} from "@/components/seo/StructuredData";
import React from "react";

const dmSerif = DM_Serif_Text({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    variable: "--font-dm-serif",
    display: "swap",
});

const firaSans = Fira_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    style: ["normal"],
    variable: "--font-fira-sans",
    display: "swap",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    colorScheme: "light",
    themeColor: "#f9fafb",
};

export const metadata: Metadata = {
    metadataBase: new URL("https://juliandelgado.com.au"),
    title: {
        default: "Custom Software, AI Automation and Websites for Australian Small Businesses | Julian Delgado",
        template: "%s | Julian Delgado"
    },
    description:
        "Julian Delgado builds custom software, AI automation and websites for Australian small businesses: fixed prices in AUD, weekly demos, 30 days of support. Based in Toowoomba, QLD, clients Australia-wide.",
    keywords: [
        "custom software developer Queensland",
        "small business automation Australia",
        "custom CRM for small business",
        "AI automation for NDIS providers",
        "web developer Toowoomba",
        "web developer Australia",
        "Next.js developer",
        "website for tradies",
        "business website Australia"
    ],
    authors: [{ name: "Julian Delgado", url: "https://juliandelgado.com.au" }],
    creator: "Julian Delgado",
    publisher: "Julian Delgado",
    icons: {
        icon: [{ url: "/favicon.ico", sizes: "any" }],
    },
    openGraph: {
        title: "Julian Delgado | Custom Software, AI Automation and Websites for Australian Small Businesses",
        description:
            "One senior engineer from discovery to launch: custom software, AI automation with a human approval step, and websites that bring enquiries. Fixed prices in AUD, Toowoomba, QLD, clients Australia-wide.",
        type: "website",
        url: "https://juliandelgado.com.au",
        siteName: "Julian Delgado",
        locale: "en_AU",
    },
    twitter: {
        card: "summary_large_image",
        title: "Julian Delgado | Custom Software, AI Automation and Websites",
        description:
            "Custom software, AI automation and websites for Australian small businesses. Based in Toowoomba, clients Australia-wide.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "https://juliandelgado.com.au",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '';
    const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || '';
    return (
        <html lang="en-AU">
            {googleTagManagerId && <GoogleTagManager gtmId={googleTagManagerId} />}
            <head>
                <StructuredData />
                {/* The hero slides and section videos come from Cloudinary */}
                <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
            </head>
            <body
                className={`${dmSerif.variable} ${firaSans.variable} antialiased`}
            >
                <Providers>
                    {children}
                </Providers>
                {googleAnalyticsId && !googleTagManagerId && <GoogleAnalytics gaId={googleAnalyticsId} />}
            </body>
        </html>
    );
}
