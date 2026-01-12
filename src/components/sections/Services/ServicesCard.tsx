import {cn} from "@/lib/utils";
import {Service} from "@/components/sections/Services/services.types";
import {CheckCircle2} from "lucide-react";

type ServiceCardProps = {
    service: Service;
    isVisible: boolean;
    index: number;
}

export default function ServicesCard({isVisible, service, index} : ServiceCardProps) {
    return (
        <div
        key={service.title}
        className={cn(
            "p-8 rounded-3xl bg-card border border-border/70 transition-all duration-500 hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/5 group reveal-on-scroll",
            isVisible && "is-visible"
        )}
        style={{ transitionDelay: `${index * 120}ms` }}
    >
        <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
            <service.icon size={28} />
        </div>

        <h3 className="text-2xl font-semibold">{service.title}</h3>
        <p className="mt-2 text-sm text-secondary font-medium">{service.outcome}</p>
        <p className="mt-4 text-muted-foreground leading-relaxed">{service.description}</p>

        <div className="mt-6 space-y-3">
            {service.bullets.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    {b}
                </div>
            ))}
        </div>
    </div>);
}