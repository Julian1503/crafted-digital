import { useCallback, useEffect, useRef, useState } from "react";

export interface Vec2 { x: number; y: number; }

/**
 * Spring-lagged cursor position — makes the floating preview feel elastic.
 */
export function useSpringCursor(stiffness = 0.1): [Vec2, (e: React.MouseEvent) => void] {
    const target  = useRef<Vec2>({ x: 0, y: 0 });
    const current = useRef<Vec2>({ x: 0, y: 0 });
    const raf     = useRef<number>(0);
    const [pos, setPos] = useState<Vec2>({ x: 0, y: 0 });

    useEffect(() => {
        const loop = () => {
            const dx = target.current.x - current.current.x;
            const dy = target.current.y - current.current.y;
            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                current.current.x += dx * stiffness;
                current.current.y += dy * stiffness;
                setPos({ x: current.current.x, y: current.current.y });
            }
            raf.current = requestAnimationFrame(loop);
        };
        raf.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf.current);
    }, [stiffness]);

    const onMove = useCallback((e: React.MouseEvent) => {
        target.current = { x: e.clientX, y: e.clientY };
    }, []);

    return [pos, onMove];
}
