import type { Metadata, Viewport } from "next";
import { DM_Serif_Text, Fira_Sans } from "next/font/google";
import "./globals.css";
import {Providers} from "@/components/ui/providers";

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
    maximumScale: 1,
    colorScheme: "light"
};

export const metadata: Metadata = {
    title: "Julian Delgado | Software Services Studio",
    description:
        "Julian Delgado is a software engineer that brings services studio building premium digital experiences. We turn complex problems into elegant, crafted solutions.",
    icons: {
        icon: [{ url: "/favicon.png", type: "image/png" }],
    },
    openGraph: {
        title: "Cr | Software Services Studio",
        description:
            "Premium software services studio. We build websites, apps, and digital products with craft and care.",
        type: "website",
        url: "https://crafted-digital.replit.app",
    },
    twitter: {
        card: "summary_large_image",
        title: "Crafted Digital",
        description:
            "Premium software services studio. Building digital products with craft and care.",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSerif.variable} ${firaSans.variable} antialiased`}
      >
      <Providers>{children}</Providers>
      </body>
    </html>
  );
}
