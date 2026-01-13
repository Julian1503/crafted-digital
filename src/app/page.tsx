import {Header} from "@/components/layout/Header";
import Hero from "@/components/sections/Hero/Hero";
import {Services} from "@/components/sections/Services/Services";
import {Work} from "@/components/sections/Work/Work";
import {Process} from "@/components/sections/Process/Process";
import {Pricing} from "@/components/sections/Pricing/Pricing";
import {FAQ} from "@/components/sections/FAQ";
import {Contact} from "@/components/sections/Contact/Contact";
import {Footer} from "@/components/layout/Footer";
import TechStack from "@/components/sections/TechStack";
import {SkipLink} from "@/components/ui/skip-link";

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
            <SkipLink />
            <Header/>
            <main id="main-content">
                <Hero/>
                <Work/>
                <Services/>
                <TechStack/>
                <Process/>
                <Pricing/>
                <FAQ/>
                <Contact/>
            </main>
            <Footer/>
        </div>
    );
}
