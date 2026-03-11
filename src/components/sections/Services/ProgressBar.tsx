import {motion, useSpring} from "framer-motion";
import {useTransform} from "framer-motion";
import {L} from "@/components/sections/Services/services-data";

export default function ProgressBar({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useSpring> }) {
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
    return (
        <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: L.border }}
        >
            <motion.div
                className="h-full origin-left"
                style={{ scaleX, background: L.accent }}
            />
        </div>
    );
}