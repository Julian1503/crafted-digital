import * as React from "react";

export interface BlobConfig {
    x: number; y: number; r: number; color: string;
    speedX: number; speedY: number;
    freqX: number; freqY: number;
    phaseX: number; phaseY: number;
}

interface WaveCanvasProps {
    blobs:     BlobConfig[];
    baseColor: string;
    opacity?:  number;
    mouseRef:  React.RefObject<{ x: number; y: number; active: boolean }>;
}

export function WaveCanvas({ blobs, baseColor, opacity = 1, mouseRef }: WaveCanvasProps) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const rafRef    = React.useRef<number>(0);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let startTime: number | null = null;

        const resize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width  = width  * devicePixelRatio;
            canvas.height = height * devicePixelRatio;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const draw = (ts: number) => {
            if (startTime === null) startTime = ts;
            const t = (ts - startTime) / 1000;
            const W = canvas.width, H = canvas.height;
            const diag = Math.sqrt(W * W + H * H);
            const mouse = mouseRef.current;
            const mx = mouse.active ? mouse.x : 0.5;
            const my = mouse.active ? mouse.y : 0.5;
            const strength = mouse.active ? 1 : 0;

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, W, H);

            for (const b of blobs) {
                const bx = b.x + Math.sin(t * b.freqX + b.phaseX) * b.speedX;
                const by = b.y + Math.sin(t * b.freqY + b.phaseY) * b.speedY;
                const dx = bx - mx, dy = by - my;
                const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
                const repulsion = strength * 0.22 * Math.exp(-dist * 3.5);
                const cx = (bx + (dx / dist) * repulsion) * W;
                const cy = (by + (dy / dist) * repulsion) * H;
                const r  = b.r * diag;
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                grad.addColorStop(0,   b.color);
                grad.addColorStop(0.5, b.color.replace(/[\d.]+\)$/, "0.18)"));
                grad.addColorStop(1,   b.color.replace(/[\d.]+\)$/, "0)"));
                ctx.globalCompositeOperation = "lighter";
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
            }

            if (mouse.active) {
                const glowX = mx * W, glowY = my * H, glowR = diag * 0.28;
                const glow  = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowR);
                glow.addColorStop(0,   "rgba(255,255,255,0.055)");
                glow.addColorStop(0.4, "rgba(255,255,255,0.018)");
                glow.addColorStop(1,   "rgba(255,255,255,0)");
                ctx.globalCompositeOperation = "lighter";
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(glowX, glowY, glowR, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalCompositeOperation = "source-over";
            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
    }, [blobs, baseColor, mouseRef]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full rounded-[inherit]"
            style={{ opacity }}
        />
    );
}

// ─── Blob palettes ────────────────────────────────────────────────────────────

export const BLOBS_STARTER: BlobConfig[] = [
    { x: 0.18, y: 0.25, r: 0.45, color: "rgba(42,34,32,0.42)",  speedX: 0.12, speedY: 0.09, freqX: 0.38, freqY: 0.27, phaseX: 0,   phaseY: 1.2 },
    { x: 0.75, y: 0.60, r: 0.40, color: "rgba(30,24,23,0.36)",  speedX: 0.10, speedY: 0.13, freqX: 0.44, freqY: 0.33, phaseX: 2.1, phaseY: 0.8 },
    { x: 0.50, y: 0.82, r: 0.35, color: "rgba(68,40,37,0.28)",  speedX: 0.09, speedY: 0.08, freqX: 0.31, freqY: 0.41, phaseX: 0.7, phaseY: 3.1 },
    { x: 0.85, y: 0.15, r: 0.30, color: "rgba(92,42,36,0.22)",  speedX: 0.14, speedY: 0.07, freqX: 0.52, freqY: 0.22, phaseX: 4.2, phaseY: 1.5 },
];

export const BLOBS_GROWTH: BlobConfig[] = [
    { x: 0.22, y: 0.35, r: 0.50, color: "rgba(134,33,25,0.34)", speedX: 0.11, speedY: 0.10, freqX: 0.36, freqY: 0.29, phaseX: 0,   phaseY: 0.5 },
    { x: 0.70, y: 0.55, r: 0.42, color: "rgba(104,34,29,0.28)", speedX: 0.13, speedY: 0.08, freqX: 0.45, freqY: 0.38, phaseX: 1.8, phaseY: 2.4 },
    { x: 0.40, y: 0.80, r: 0.38, color: "rgba(74,28,26,0.22)",  speedX: 0.08, speedY: 0.12, freqX: 0.28, freqY: 0.44, phaseX: 3.2, phaseY: 0.9 },
    { x: 0.80, y: 0.18, r: 0.32, color: "rgba(192,57,43,0.18)", speedX: 0.15, speedY: 0.09, freqX: 0.55, freqY: 0.25, phaseX: 5.0, phaseY: 1.1 },
    { x: 0.15, y: 0.70, r: 0.28, color: "rgba(56,22,21,0.24)",  speedX: 0.10, speedY: 0.14, freqX: 0.42, freqY: 0.32, phaseX: 2.6, phaseY: 3.8 },
];

export const BLOBS_STUDIO: BlobConfig[] = [
    { x: 0.20, y: 0.30, r: 0.52, color: "rgba(28,24,23,0.42)",  speedX: 0.09, speedY: 0.10, freqX: 0.32, freqY: 0.28, phaseX: 0,   phaseY: 1.8 },
    { x: 0.72, y: 0.60, r: 0.44, color: "rgba(18,16,15,0.48)",  speedX: 0.12, speedY: 0.08, freqX: 0.42, freqY: 0.35, phaseX: 2.5, phaseY: 0.4 },
    { x: 0.50, y: 0.85, r: 0.36, color: "rgba(52,38,35,0.26)",  speedX: 0.08, speedY: 0.13, freqX: 0.27, freqY: 0.46, phaseX: 1.1, phaseY: 2.9 },
    { x: 0.85, y: 0.20, r: 0.30, color: "rgba(134,33,25,0.12)", speedX: 0.14, speedY: 0.07, freqX: 0.50, freqY: 0.22, phaseX: 4.4, phaseY: 1.3 },
];

export interface CardConfig {
    blobs:    BlobConfig[];
    baseFill: string;
    light:    boolean;
    accent:   string;
}

export const CARD_CONFIGS: CardConfig[] = [
    { blobs: BLOBS_STARTER, baseFill: "#0d0f18", light: true, accent: "rgba(120,140,210,0.92)" },
    { blobs: BLOBS_GROWTH,  baseFill: "#130806", light: true, accent: "rgba(230,110,60,0.96)"  },
    { blobs: BLOBS_STUDIO,  baseFill: "#090909", light: true, accent: "rgba(255,255,255,0.90)" },
];
