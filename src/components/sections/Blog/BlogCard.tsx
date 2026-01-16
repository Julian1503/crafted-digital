import Link from "next/link";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {Calendar, Clock, User} from "lucide-react";
import {BlogPost} from "@/components/sections/Blog/blog.types";
import {formatDate} from "@/lib/formatDate";

type BlogCardProps = {
    post: BlogPost;
}

export default function BlogCard({post} : BlogCardProps) {
    return (
        <article
            key={post.slug}
            aria-labelledby={`post-${post.slug}-heading`}
            aria-describedby={`post-${post.slug}-excerpt`}
            className={cn(
                "group w-full overflow-hidden rounded-3xl border border-border bg-card transition-all",
                "hover:shadow-xl hover:border-secondary/50",
                "grid grid-cols-1 md:grid-cols-6 md:aspect-[5/2]"
            )}
        >
            <Link href={`/blog/${post.slug}`} >
                {/* Image */}
                <div
                    className={cn(
                        "relative w-full overflow-hidden",
                        "h-52 sm:h-64",
                        "md:col-span-2 md:h-auto",
                        "md:rounded-2xl"
                    )}
                >
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        aria-hidden="true"
                        className="object-cover transition duration-500 ease-out will-change-transform group-hover:scale-[1.06] group-hover:rotate-[0.5deg]"
                    />
                    <div
                        className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/15"
                        aria-hidden="true"
                    />
                </div>

                {/* Content */}
                <div className="block p-6 sm:p-8 md:col-span-4">
                    <div className="max-w-prose">
                        <div className="flex items-center gap-3 mb-4">
                                                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                                                    {post.category}
                                                    </span>

                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" aria-hidden="true" />
                                {post.readTime}
                            </span>
                        </div>

                        <h2
                            id={`post-${post.slug}-heading`}
                            className="text-xl font-semibold mb-3 transition-colors group-hover:text-secondary"
                            tabIndex={-1}
                        >
                            {post.title}
                        </h2>

                        <p
                            id={`post-${post.slug}-excerpt`}
                            className="text-muted-foreground text-sm leading-relaxed mb-6"
                        >
                            {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span
                                className="flex items-center gap-1"
                                aria-label={`Written by ${post.author}`}
                            >
                                <User className="h-3 w-3" aria-hidden="true" />
                                {post.author}
                            </span>

                            <span
                                className="flex items-center gap-1"
                                aria-label={`Published on ${formatDate(post.publishedAt)}`}
                            >
                                <Calendar className="h-3 w-3" aria-hidden="true" />
                                {formatDate(post.publishedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    )
}