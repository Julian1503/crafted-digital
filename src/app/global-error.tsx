"use client";

/**
 * Last-resort boundary for errors thrown by the root layout itself.
 * It must render its own <html> and <body>; no app CSS is guaranteed here.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="en-AU">
            <body style={{ margin: 0, background: "#0c0c0c", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
                <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "0 24px" }}>
                    <div style={{ maxWidth: 560, margin: "0 auto" }}>
                        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>
                            Something broke on my side.
                        </h1>
                        <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.75)", marginBottom: 32 }}>
                            Try again in a moment, or email julianedelgado@hotmail.com and I will reply within 24 hours.
                            {error.digest ? ` Reference: ${error.digest}` : ""}
                        </p>
                        <button
                            type="button"
                            onClick={reset}
                            style={{ minHeight: 44, borderRadius: 999, padding: "12px 24px", background: "#c0392b", color: "#fff", border: 0, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
                        >
                            Try again
                        </button>
                    </div>
                </main>
            </body>
        </html>
    );
}
