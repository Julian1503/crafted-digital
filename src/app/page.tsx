import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
        <Header />
        <main>
          <Hero />
          <SocialProof />
          <Services />
          <Work />
          <Process />
          <Pricing />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
  );
}
