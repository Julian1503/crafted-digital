export default function CaseStudiesLoading() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="pt-24">
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-3xl mb-16">
                            <div className="h-4 w-32 bg-muted rounded animate-pulse mb-6" />
                            <div className="h-12 w-80 bg-muted rounded animate-pulse mb-6" />
                            <div className="h-6 w-full bg-muted rounded animate-pulse" />
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="rounded-3xl border border-border bg-card overflow-hidden">
                                    <div className="aspect-video bg-muted animate-pulse" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                        <div className="h-6 w-full bg-muted rounded animate-pulse" />
                                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
