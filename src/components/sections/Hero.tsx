"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Rocket, Sparkles, Zap } from "lucide-react";
import { scrollToId } from "@/lib/utils";

type Particle = {
    id: number;
    x: number;
    y: number;
    size: number;
    dur: number;
    delay: number;
    opacity: number;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function Hero() {
    const [typedText, setTypedText] = useState("");
    const fullText = "Your idea. Live online. In weeks.";
    const [isHover, setIsHover] = useState(false);

    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setTypedText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 70);
        return () => clearInterval(timer);
    }, []);

    const particles = useMemo<Particle[]>(() => {
        // Determinístico para evitar re renders raros
        let seed = 2026;
        const rand = () => {
            seed = (seed * 48271) % 2147483647;
            return seed / 2147483647;
        };
        return Array.from({ length: 10 }).map((_, i) => ({
            id: i,
            x: rand() * 100,
            y: rand() * 100,
            size: 2 + Math.floor(rand() * 3),
            dur: 6 + rand() * 6,
            delay: rand() * 2,
            opacity: 0.15 + rand() * 0.25,
        }));
    }, []);

    const onMouseMove = (e: React.MouseEvent) => {
        const el = wrapRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;

        const ry = (px - 0.5) * 16; // rotateY
        const rx = (0.5 - py) * 12; // rotateX
        const tx = (px - 0.5) * 16; // translate
        const ty = (py - 0.5) * 16;

        setTilt({ rx, ry, tx, ty });
    };

    const onMouseLeave = () => {
        setTilt({ rx: 0, ry: 0, tx: 0, ty: 0 });
        setIsHover(false);
    };

    return (
        <section className="relative isolate overflow-hidden bg-background">
            {/* Background gradients */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_10%,hsl(var(--secondary)/0.18),transparent_60%),radial-gradient(900px_500px_at_85%_35%,hsl(var(--primary)/0.14),transparent_60%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]" />
                <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(hsl(var(--foreground)/0.10)_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            {/* Floating particles */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute rounded-full bg-secondary"
                        style={{
                            top: `${p.y}%`,
                            left: `${p.x}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            opacity: p.opacity,
                            animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite`,
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 py-10 sm:py-16 md:px-6">
                {/* Card shell like your reference */}
                <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-background/55 backdrop-blur-xl shadow-[0_20px_70px_-35px_rgba(0,0,0,0.45)]">
                    {/* Orange wedge vibe (but using your theme tokens) */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -right-24 top-[-90px] h-[480px] w-[480px] rounded-full bg-secondary/25 blur-3xl" />
                        <div className="absolute right-0 top-0 h-full w-[46%] bg-[linear-gradient(120deg,transparent_0%,hsl(var(--secondary)/0.10)_30%,hsl(var(--secondary)/0.22)_70%,hsl(var(--secondary)/0.10)_100%)]" />
                    </div>

                    <div className="relative grid gap-10 px-6 py-10 sm:px-10 md:grid-cols-2 md:items-center md:gap-6 md:py-14">
                        {/* Left content */}
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-xs text-muted-foreground">
                                <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_18px_hsl(var(--secondary)/0.45)]" />
                                Crafted Digital for startups and teams
                            </div>

                            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/75 bg-clip-text text-transparent">
                  {typedText}
                </span>
                                <span className="ml-1 inline-block h-[0.9em] w-1 animate-pulse bg-secondary align-[-0.1em]" />
                            </h1>

                            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                Premium web experiences with speed, clarity, and measurable outcomes.
                                We design and build modern products that convert and scale.
                            </p>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Button
                                    size="lg"
                                    className="group h-12 rounded-full px-7 text-base font-semibold shadow-[0_0_40px_-14px] shadow-secondary/45 hover:shadow-secondary/65 hover:scale-[1.03] transition-all"
                                    onClick={() => scrollToId("contact")}
                                >
                                    Book a free intro call
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 rounded-full px-7 text-base border-2 hover:bg-muted/40 hover:scale-[1.03] transition-all"
                                    onClick={() => scrollToId("work")}
                                >
                                    See real projects
                                </Button>
                            </div>

                            {/* Stats row like the reference */}
                            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {[
                                    { icon: <Rocket className="h-5 w-5" />, value: "2–4", label: "weeks" },
                                    { icon: <Zap className="h-5 w-5" />, value: "100%", label: "custom" },
                                    { icon: <Code2 className="h-5 w-5" />, value: "24–48h", label: "response" },
                                    { icon: <Sparkles className="h-5 w-5" />, value: "∞", label: "scalable" },
                                ].map((s, i) => (
                                    <div
                                        key={i}
                                        className="rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur-sm transition-all hover:border-secondary/45 hover:bg-secondary/5"
                                    >
                                        <div className="flex items-center gap-2 text-secondary">{s.icon}</div>
                                        <div className="mt-2 text-2xl font-bold">{s.value}</div>
                                        <div className="text-xs font-semibold text-muted-foreground">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right interactive 3D scene */}
                        <div className="relative">
                            <div
                                ref={wrapRef}
                                onMouseMove={onMouseMove}
                                onMouseEnter={() => setIsHover(true)}
                                onMouseLeave={onMouseLeave}
                                className="relative mx-auto aspect-[4/3] w-full max-w-[520px] rounded-[26px] border border-border/60 bg-background/35 backdrop-blur-xl"
                                style={{ perspective: "1200px" }}
                            >
                                {/* Scene */}
                                <div
                                    className="absolute inset-0 rounded-[26px] overflow-hidden"
                                    style={{
                                        transform: `translate3d(${tilt.tx}px, ${tilt.ty}px, 0px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                                        transformStyle: "preserve-3d",
                                        transition: isHover ? "none" : "transform 500ms ease",
                                    }}
                                >
                                    {/* Orbit rings */}
                                    <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10 [transform:translateZ(10px)] animate-[spin_28s_linear_infinite]" />
                                    <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10 [transform:translateZ(16px)] animate-[spin_42s_linear_infinite_reverse]" />
                                    <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10 [transform:translateZ(22px)] animate-[spin_55s_linear_infinite]" />

                                    {/* Main 3D "rocket" card shape */}
                                    <div
                                        className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-[34px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.38),transparent_55%),radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.35),transparent_55%),linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] ring-1 ring-white/10 shadow-[0_35px_85px_-35px_rgba(0,0,0,0.65)]"
                                        style={{
                                            transform: "translateZ(46px) rotate(-10deg)",
                                        }}
                                    >
                                        {/* "Rocket" silhouette */}
                                        <div className="absolute left-1/2 top-1/2 h-[160px] w-[70px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/10 ring-1 ring-white/10" />
                                        <div className="absolute left-1/2 top-[30%] h-[34px] w-[34px] -translate-x-1/2 rounded-full bg-secondary/25 ring-1 ring-secondary/30 shadow-[0_0_24px_-8px_hsl(var(--secondary)/0.8)]" />
                                        <div className="absolute bottom-[18%] left-1/2 h-[16px] w-[60px] -translate-x-1/2 rounded-full bg-secondary/20 blur-[0.5px]" />
                                    </div>

                                    {/* Floating spheres */}
                                    <div
                                        className="absolute right-[16%] top-[18%] h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.40),transparent_55%),radial-gradient(circle_at_70%_75%,hsl(var(--primary)/0.22),transparent_60%)] ring-1 ring-white/10 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)]"
                                        style={{ transform: "translateZ(30px)" }}
                                    />
                                    <div
                                        className="absolute left-[14%] bottom-[18%] h-10 w-10 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.38),transparent_55%),radial-gradient(circle_at_70%_75%,hsl(var(--secondary)/0.22),transparent_60%)] ring-1 ring-white/10"
                                        style={{ transform: "translateZ(26px)" }}
                                    />
                                    <div
                                        className="absolute left-[22%] top-[22%] h-6 w-6 rounded-full bg-white/20 ring-1 ring-white/10"
                                        style={{ transform: "translateZ(18px)" }}
                                    />

                                    {/* Mini info card like the reference */}
                                    <div
                                        className="absolute bottom-5 right-5 w-[210px] rounded-2xl border border-border/60 bg-background/55 p-4 backdrop-blur-xl shadow-[0_25px_70px_-45px_rgba(0,0,0,0.8)]"
                                        style={{ transform: "translateZ(54px)" }}
                                    >
                                        <div className="text-xs text-muted-foreground">Next milestone</div>
                                        <div className="mt-1 text-sm font-semibold">
                                            MVP ready in 2 to 4 weeks
                                        </div>
                                        <div className="mt-2 h-2 w-full rounded-full bg-foreground/10">
                                            <div className="h-2 w-[62%] rounded-full bg-secondary/70" />
                                        </div>
                                    </div>

                                    {/* Subtle light sweep */}
                                    <div className="absolute inset-0 opacity-60 [transform:translateZ(6px)]">
                                        <div className="absolute -left-40 top-0 h-full w-72 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[sweep_5.5s_ease-in-out_infinite]" />
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-center text-xs text-muted-foreground">
                                Move your mouse over the scene
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }
        @keyframes sweep {
          0% {
            transform: translateX(-120px) rotate(12deg);
            opacity: 0;
          }
          35% {
            opacity: 0.55;
          }
          70% {
            opacity: 0.2;
          }
          100% {
            transform: translateX(820px) rotate(12deg);
            opacity: 0;
          }
        }
      `}</style>
        </section>
    );
}
