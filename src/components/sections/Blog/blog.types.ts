/**
 * Blog post preview model.
 * Used for blog listing pages, search results, and related content sections.
 */
export interface BlogPost {
    /** Cover image or thumbnail URL */
    image: string;

    /** URL-friendly unique identifier */
    slug: string;

    /** Public title of the blog post */
    title: string;

    /** Short summary or teaser used in previews and SEO */
    excerpt: string;

    /** Content category or topic */
    category: string;

    /** Estimated reading time (e.g. "5 min read") */
    readTime: string;

    /** Publication date in ISO 8601 format */
    publishedAt: string;

    /** Author name */
    author: string;
}
