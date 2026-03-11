import * as React from "react";

function parsePrice(price: string): number | null {
    const n = Number(price.replace(/[^0-9]/g, ""));
    return isNaN(n) || n === 0 ? null : n;
}

interface AnimatedPriceProps {
    price:   string;
    trigger: boolean;
}

export function AnimatedPrice({ price, trigger }: AnimatedPriceProps) {
    const numeric = parsePrice(price);
    const [display, setDisplay] = React.useState(0);
    const hasRun = React.useRef(false);
    const rafRef = React.useRef<number>(0);

    React.useEffect(() => {
        if (!trigger || hasRun.current || numeric === null) return;
        hasRun.current = true;
        const DURATION = 1000;
        const start = performance.now();
        const tick = (now: number) => {
            const t    = Math.min((now - start) / DURATION, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(numeric * ease));
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [trigger, numeric]);

    const symbol = price.match(/^[^0-9]*/)?.[0] ?? "";
    const suffix = price.match(/[^0-9,]*$/)?.[0] ?? "";

    if (numeric === null) return <>{price}</>;
    return <>{symbol}{display.toLocaleString()}{suffix}</>;
}
