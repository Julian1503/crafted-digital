import {Header} from "@/components/layout/Header";
import Hero from "@/components/sections/Hero/Hero";
import {Work} from "@/components/sections/Work/Work";
import {SkipLink} from "@/components/ui/skip-link";
import dynamic from "next/dynamic";
import {FAQSchema} from "@/components/seo/FAQSchema";

export default function Home() {
    // Dynamically import below-the-fold components to reduce initial JS bundle
    // These components are not visible on initial load and can be loaded asynchronously
    const Services = dynamic(() => import("@/components/sections/Services/Services").then(mod => ({ default: mod.Services })), {
        loading: () => <section className="py-24 bg-muted/30" aria-hidden="true" />,
    });

    const TechStack = dynamic(() => import("@/components/sections/TechStack"), {
        loading: () => <section className="py-16 bg-primary" aria-hidden="true" />,
    });

    const Process = dynamic(() => import("@/components/sections/Process/Process").then(mod => ({ default: mod.Process })), {
        loading: () => <section className="py-24 bg-background" aria-hidden="true" />,
    });

    const Pricing = dynamic(() => import("@/components/sections/Pricing/Pricing").then(mod => ({ default: mod.Pricing })), {
        loading: () => <section className="py-24 bg-muted/30" aria-hidden="true" />,
    });

    const FAQ = dynamic(() => import("@/components/sections/FAQ").then(mod => ({ default: mod.FAQ })), {
        loading: () => <section className="py-24 bg-background" aria-hidden="true" />,
    });

    const Contact = dynamic(() => import("@/components/sections/Contact/Contact").then(mod => ({ default: mod.Contact })), {
        loading: () => <section className="py-24 bg-muted/30" aria-hidden="true" />,
    });

    const Footer = dynamic(() => import("@/components/layout/Footer").then(mod => ({ default: mod.Footer })), {
        loading: () => <footer className="py-16 bg-foreground" aria-hidden="true" />,
    });


    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
            <SkipLink/>
            <Header/>
            <main id="main-content">
                <FAQSchema />
                <Hero/>
                <Work/>
                <Services/>
                <Process/>
                <Pricing/>
                <FAQ/>
                <Contact/>
            </main>
            <Footer/>
        </div>
    );
}
