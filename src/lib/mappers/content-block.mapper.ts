interface ContentBlock {
    title: string | null;
    content: string | null;
    active: boolean;
}

export interface AboutPrinciple {
    title: string;
    description: string;
}

export interface AboutStoryBlock {
    title: string;
    body: string;
}

export function toAboutPrinciples(blocks: ContentBlock[]): AboutPrinciple[] {
    return blocks
        .filter((b) => b.active)
        .map((b) => ({
            title: b.title ?? "",
            description: b.content ?? "",
        }));
}

export function toAboutHighlights(blocks: ContentBlock[]): string[] {
    return blocks
        .filter((b) => b.active)
        .map((b) => b.content ?? "");
}

export function toAboutStoryBlocks(blocks: ContentBlock[]): AboutStoryBlock[] {
    return blocks
        .filter((b) => b.active)
        .map((b) => ({
            title: b.title ?? "",
            body: b.content ?? "",
        }));
}
