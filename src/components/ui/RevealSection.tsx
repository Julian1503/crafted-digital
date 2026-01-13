import {useScrollAnimation} from "@/lib/use-scroll-animation";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";

type RevealVariant = "up" | "left" | "right" | "scale";

export default function RevealSection({
                           children,
                           className,
                           delay = 0,
                           variant = "up",
                       }: {
    children: ReactNode;
    className?: string;
    delay?: number;
    variant?: RevealVariant;
}) {
    const { ref, isVisible } = useScrollAnimation();
    const variantClass =
        variant === "left"
            ? "reveal-left"
            : variant === "right"
                ? "reveal-right"
                : variant === "scale"
                    ? "reveal-scale"
                    : "";

    return (
        <div
            ref={ref}
            style={{ ["--reveal-delay" as never]: `${delay}ms` }}
            className={cn("reveal-on-scroll", variantClass, isVisible && "is-visible", className)}
        >
            {children}
        </div>
    );
}