import { ImageResponse } from "next/og";
import { HERO_HEADLINE } from "@/components/sections/Hero/hero.constants";

export const alt = "Julian Delgado: custom software, AI automation and websites for Australian small businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card for every page that does not set its own image. */
export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px 80px",
                    background: "linear-gradient(135deg, #0c0c0c 0%, #1a1210 100%)",
                    color: "#ffffff",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "Arial, Helvetica, sans-serif" }}>
                    <div style={{ width: 14, height: 14, borderRadius: 999, background: "#c0392b" }} />
                    <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "rgba(255,255,255,0.72)" }}>
                        Julian Delgado · Toowoomba, QLD
                    </div>
                </div>

                <div style={{ display: "flex", fontSize: 68, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>
                    {HERO_HEADLINE}
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: 26,
                        color: "rgba(255,255,255,0.72)",
                    }}
                >
                    <div>juliandelgado.com.au</div>
                    <div style={{ color: "#e8705f" }}>Book a 30-minute call</div>
                </div>
            </div>
        ),
        size
    );
}
