import Link from "next/link";
import Image from "next/image";
import {CaseStudyBase} from "@/components/sections/Case-study/case-study.types";

type CaseStudyCardProps = {
    study: CaseStudyBase;
}

export function CaseStudyCard({study} : CaseStudyCardProps) {
    return(
        <Link
            key={study.slug}
            href={`/case-studies/${study.slug}`}
            className="group rounded-3xl border border-border bg-card overflow-hidden transition-all hover:shadow-xl hover:border-secondary/50"
        >
            <div className="aspect-video relative overflow-hidden">
                <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-background/90 text-xs font-medium">
                        {study.category}
                    </span>
                </div>
            </div>
            <div className="p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    {study.client}
                </p>
                <h2 className="text-xl font-semibold mb-3 group-hover:text-secondary transition-colors">
                    {study.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {study.description}
                </p>
            </div>
        </Link>
    );
}