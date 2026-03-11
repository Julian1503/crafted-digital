import * as React from "react";

interface MobileMenuState {
    isOpen:          boolean;
    setIsOpen:       React.Dispatch<React.SetStateAction<boolean>>;
    menuRef:         React.RefObject<HTMLDivElement | null>;
    toggleButtonRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Manages mobile menu open/close state, keyboard handling (Escape),
 * and focus management (auto-focus first item on open).
 */
export function useMobileMenu(): MobileMenuState {
    const [isOpen,          setIsOpen]          = React.useState(false);
    const menuRef         = React.useRef<HTMLDivElement>(null);
    const toggleButtonRef = React.useRef<HTMLButtonElement>(null);

    // Close on Escape and return focus to toggle button
    React.useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
                toggleButtonRef.current?.focus();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    // Auto-focus first interactive element when menu opens
    React.useEffect(() => {
        if (isOpen && menuRef.current) {
            const first = menuRef.current.querySelector<HTMLElement>("a, button");
            first?.focus();
        }
    }, [isOpen]);

    return { isOpen, setIsOpen, menuRef, toggleButtonRef };
}
