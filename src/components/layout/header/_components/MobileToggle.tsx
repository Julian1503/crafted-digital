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
            className="md:hidden p-2 ml-auto"
            style={{ color: isLight ?  "#0a0a0a"  : "hsl(var(--primary-foreground) / 0.75)" }}
            onClick={onClick}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-haspopup="true"
        >
            {isOpen
                ? <X aria-hidden="true" />
                : <Menu aria-hidden="true" />
            }
        </button>
    );
}
