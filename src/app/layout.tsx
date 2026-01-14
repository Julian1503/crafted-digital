import type { Metadata, Viewport } from "next";
import { DM_Serif_Text, Fira_Sans } from "next/font/google";
import "./globals.css";
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
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    variable: "--font-fira-sans",
    display: "swap",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    colorScheme: "light"
};

export const metadata: Metadata = {
    metadataBase: new URL("https://juliandelgado.com.au"),
    title: {
        default: "Julian Delgado | Web Development & Software Solutions for Australian Businesses",
        template: "%s | Julian Delgado"
    },
    description:
        "Julian Delgado helps Australian service businesses launch custom websites, web apps, and MVPs. Based in Toowoomba, QLD — working with clients Australia-wide. Get a premium digital product built fast.",
    keywords: [
        "web developer Australia",
        "software developer Queensland",
        "Next.js developer",
        "custom web application",
        "MVP development Australia",
        "website for tradies",
        "business website Australia",
        "React developer Australia",
        "Toowoomba web developer"
    ],
    authors: [{ name: "Julian Delgado", url: "https://juliandelgado.com.au" }],
    creator: "Julian Delgado",
    publisher: "Julian Delgado",
    icons: {
        icon: [{ url: "/favicon.png", type: "image/png" }],
    },
    openGraph: {
        title: "Julian Delgado | Web Development & Software Solutions for Australian Businesses",
        description:
            "Custom websites, web apps, and MVPs for Australian service businesses. Based in Toowoomba, QLD — working with clients Australia-wide.",
        type: "website",
        url: "https://juliandelgado.com.au",
        siteName: "Julian Delgado",
        locale: "en_AU",
    },
    twitter: {
        card: "summary_large_image",
        title: "Julian Delgado | Web Development for Australian Businesses",
        description:
            "Custom websites and web apps for Australian service businesses. Based in Toowoomba, servicing Australia-wide.",
        creator: "@juliandelgado",
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
  return (
    <html lang="en-AU">
      <head>
        <StructuredData />
          <title>Julian Delgado</title>
          {/* Preload the LCP hero image for faster discovery */}
          <link
            rel="preload"
            href="/hero-poster.webp"
            as="image"
            type="image/webp"
            fetchPriority="high"
          />
      </head>
      <body
        className={`${dmSerif.variable} ${firaSans.variable} antialiased`}
      >
      <Providers>{children}</Providers>
      </body>
    </html>
  );
}
