import { motion, AnimatePresence } from "framer-motion";

export interface ServiceMedia { type: "image" | "video"; src: string; poster?: string; }

const MEDIA_FILTER  = "saturate(0.9) brightness(0.88)";
const GRADIENT_LEFT = "linear-gradient(to right, hsl(var(--background)) 0%, hsla(var(--background) / 0.55) 28%, transparent 55%)";
const GRADIENT_TB   = "linear-gradient(to bottom, hsla(var(--background) / 0.4) 0%, transparent 20%, transparent 80%, hsla(var(--background) / 0.5) 100%)";

import Image from "next/image";

export function MediaAsset({
                               media,
                               alt,
                           }: {
    media: ServiceMedia;
    alt: string;
}) {
    if (media.type === "video") {
        return (
            <video
                key={media.src}
                autoPlay
                muted
                poster={media.poster}
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: MEDIA_FILTER }}
            >
                <source src={media.src} type="video/webm" />
            </video>
        );
    }

    return (
        <Image
            src={media.src}
            alt={alt}
            fill
            sizes="100vw"
            priority
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: MEDIA_FILTER }}
        />
    );
}

export function ImagePanel({ media, alt }: { media: ServiceMedia; alt: string }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={media.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
                <MediaAsset media={media} alt={alt} />
                <div className="absolute inset-0" style={{ background: GRADIENT_LEFT }} />
                <div className="absolute inset-0" style={{ background: GRADIENT_TB }} />
            </motion.div>
        </AnimatePresence>
    );
}
