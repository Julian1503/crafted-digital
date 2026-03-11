import { motion } from "framer-motion";
import {L} from "@/components/sections/Services/services-data";

export default function StepIndicator({ total, active }: { total: number; active: number }) {
    return (
        <div className="flex flex-col items-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
                <motion.div
                    key={i}
                    className="rounded-full"
                    animate={{
                        height: i === active ? "20px" : "4px",
                        width: "4px",
                        backgroundColor:
                            i === active
                                ? L.accent
                                : i < active
                                    ? "rgba(10,10,10,0.25)"
                                    : "rgba(10,10,10,0.1)",
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
            ))}
        </div>
    );
}