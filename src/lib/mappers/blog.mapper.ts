import type { BlogPost } from "@/components/sections/Blog/blog.types";

interface PrismaBlogPost {
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    categories: string | null;
    publishedAt: Date | null;
    createdAt: Date;
    author: { id: string; name: string | null; email: string } | null;
}

export function toBlogCardProps(post: PrismaBlogPost): BlogPost {
    return {
        image: post.coverImage ?? "/placeholder-blog.jpg",
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? "",
        category: post.categories ?? "General",
        readTime: estimateReadTime(post.content),
        publishedAt: post.publishedAt?.toISOString().split("T")[0] ?? post.createdAt.toISOString().split("T")[0],
        author: post.author?.name ?? "Julian Delgado",
    };
}

function estimateReadTime(content: string): string {
    const words = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
}
