export default function CaseStudyLoading() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="pt-24">
                <section className="py-12 md:py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse mb-8" />
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="h-6 w-32 bg-muted rounded-full animate-pulse" />
                                    <div className="h-6 w-40 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="h-12 w-full bg-muted rounded animate-pulse" />
                                <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                            </div>
                            <div className="rounded-3xl aspect-video bg-muted animate-pulse" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
