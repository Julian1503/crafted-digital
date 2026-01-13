"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import RotatingWord from "@/components/ui/RotatingWord";
import RevealSection from "@/components/ui/RevealSection";

export default function HeroContent() {
    return (
        <RevealSection delay={0} variant="left" className="flex flex-col space-y-8 text-left">
            <div className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium"
                >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Launch your business in 14 days</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                    Stop worrying about tech. <br />
                    <span className="text-secondary flex w-full">
                        <RotatingWord words={[
                            "Bring to life",
                            "Build and launch",
                            "Take to market",
                            "Validate and grow",
                            "Scale confidently",
                        ]} />
                    </span>{" "}
                    your idea.
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                    I build your custom software from start to finish. You dont need to know how to code—you just need a vision.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-secondary/20">
                    Work with me
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                {/*<div className="flex flex-col justify-center px-2">*/}
                {/*    <div className="flex">*/}
                {/*        {["SOVOS", "mDEVZ"].map(i => (*/}
                {/*            <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted">*/}
                {/*                <h1>{i}</h1>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*    <p className="text-xs text-muted-foreground mt-1 font-medium">Worked with this companies</p>*/}
                {/*</div>*/}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                    "Launch-ready MVP in weeks",
                    "Clear fixed-price scope",
                    "Weekly visual demos",
                    "Post-launch support included",
                ].map((text) => (
                    <div key={text} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{text}</span>
                    </div>
                ))}
            </div>
        </RevealSection>
    );
};