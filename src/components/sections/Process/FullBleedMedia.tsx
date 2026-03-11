import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Step { title: string; image?: string; video?: string; }

const BG = "#0c0c0c";

export function FullBleedMedia({ step }: { step: Step }) {
    const hasVideo = !!step.video;
    const hasImage = !!step.image;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step.title}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
            >
                {hasVideo && (
                    <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ filter: "saturate(0.75) brightness(0.55)" }}>
                        <source src={step.video} type="video/mp4" />
                    </video>
                )}
                {!hasVideo && hasImage && (
                    <Image src={step.image!} alt={step.title} fill sizes="100vw" className="object-cover" style={{ filter: "saturate(0.75) brightness(0.55)" }} priority />
                )}
                {!hasVideo && !hasImage && (
                    <div className="absolute inset-0" style={{ background: BG, backgroundImage: "radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)" }} />
            </motion.div>
        </AnimatePresence>
    );
}
