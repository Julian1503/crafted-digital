import type { Metadata } from "next";

export const metadata: Metadata = {
    title: { absolute: "Sign in | Julian Delgado admin" },
    description: "Admin sign-in.",
    robots: { index: false, follow: false, nocache: true },
    alternates: { canonical: undefined },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
