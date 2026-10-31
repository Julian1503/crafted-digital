import * as React from "react";
import { Menu, X } from "lucide-react";

interface MobileToggleProps {
    isOpen:   boolean;
    isLight: boolean;
    onClick:  () => void;
    buttonRef:React.RefObject<HTMLButtonElement>;
}

export function MobileToggle({ isOpen, onClick, buttonRef, isLight }: MobileToggleProps) {
    return (
        <button
            ref={buttonRef}
            className="lg:hidden p-2 ml-auto min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            style={{ color: isLight ?  "#0a0a0a"  : "hsl(var(--primary-foreground) / 0.75)" }}
            onClick={onClick}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
        >
            {isOpen
                ? <X aria-hidden="true" />
                : <Menu aria-hidden="true" />
            }
        </button>
    );
}
