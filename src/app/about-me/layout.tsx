import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Julian Delgado | Web Developer & Software Engineer in Australia",
    description:
        "Meet Julian Delgado — a web developer and software engineer based in Toowoomba, QLD. I help Australian service businesses build premium websites, web apps, and MVPs that convert and scale.",
    openGraph: {
        title: "About Julian Delgado | Web Developer & Software Engineer in Australia",
        description:
            "Based in Toowoomba, QLD — working with Australian businesses to build custom web solutions that drive growth.",
        type: "profile",
        url: "https://juliandelgado.com.au/about-me",
    },
    alternates: {
        canonical: "https://juliandelgado.com.au/about-me",
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
