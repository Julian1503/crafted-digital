import Image from "next/image";

interface ImageBreakProps {
  src: string;
  alt: string;
  caption?: string;
  /** Section background: dark sections or the light overview/approach band. */
  tone?: "dark" | "light";
}

/**
 * A product screenshot shown whole, inside a frame, with a caption. Replaces
 * the earlier full-bleed parallax crop, which cut screenshots arbitrarily and
 * darkened them into texture.
 */
export function ImageBreak({ src, alt, caption, tone = "dark" }: ImageBreakProps) {
  const dark = tone === "dark";
  return (
    <figure
      className="px-5 sm:px-8 md:px-14 lg:px-20 py-14 md:py-20"
      style={{ background: dark ? "#0c0c0b" : "hsl(var(--background))" }}
    >
      <div className="mx-auto max-w-6xl">
        <div
          className="relative w-full overflow-hidden rounded-xl border"
          style={{
            aspectRatio: "16 / 10",
            borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(10,10,10,0.1)",
            background:  dark ? "#141414" : "#ffffff",
          }}
        >
          <Image src={src} alt={alt} fill sizes="(min-width: 1152px) 1100px, 100vw" className="object-contain" loading="lazy" />
        </div>
        {caption && (
          <figcaption
            className="mt-4 text-[0.8rem] tracking-[0.02em]"
            style={{ color: dark ? "rgba(255,255,255,0.62)" : "rgba(10,10,10,0.62)" }}
          >
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
