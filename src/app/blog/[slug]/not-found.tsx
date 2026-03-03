import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogPostNotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold">Blog Post Not Found</h1>
                <p className="text-muted-foreground text-lg">
                    The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-secondary hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to all articles
                </Link>
            </div>
        </div>
    );
}
