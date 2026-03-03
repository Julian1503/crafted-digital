export default function BlogPostLoading() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="pt-24">
                <article className="py-12 md:py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            <div className="flex gap-3">
                                <div className="h-6 w-32 bg-muted rounded-full animate-pulse" />
                                <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                            </div>
                            <div className="h-12 w-full bg-muted rounded animate-pulse" />
                            <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                            <div className="border-b border-border pb-8 flex gap-6">
                                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-4 w-full bg-muted rounded animate-pulse" />
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
