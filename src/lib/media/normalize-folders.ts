export function normalizeFolder(input: string | null | undefined): string {
    const fallback = "general";
    if (!input) return fallback;

    // basic cleanup
    let s = input.trim();
    if (!s) return fallback;

    // normalize separators
    s = s.replace(/\\/g, "/");

    // remove leading/trailing slashes
    s = s.replace(/^\/+|\/+$/g, "");

    // collapse multiple spaces
    s = s.replace(/\s+/g, " ");

    // collapse multiple slashes
    s = s.replace(/\/{2,}/g, "/");

    // remove dot segments / traversal attempts
    // split and validate segments
    const segments = s
        .split("/")
        .map((seg) => seg.trim())
        .filter(Boolean);

    const safeSegments: string[] = [];
    for (const seg of segments) {
        if (seg === "." || seg === "..") continue;
        if (seg.includes("..")) continue;

        // keep only safe chars, convert spaces to hyphen
        let cleaned = seg
            .toLowerCase()
            .replace(/[^a-z0-9 _-]/g, "") // allow space, underscore, hyphen
            .trim()
            .replace(/\s+/g, "-");

        cleaned = cleaned.replace(/-+/g, "-"); // collapse hyphens
        cleaned = cleaned.replace(/^[-_]+|[-_]+$/g, ""); // trim separators

        if (cleaned) safeSegments.push(cleaned);
    }

    const out = safeSegments.join("/");
    return out || fallback;
}
