import Link from "next/link";
import s from "@/components/lab/lab.module.css";
import { FIT_CALL_LABEL } from "@/lib/constants/site";

/** Film grain used by the current home hero, so the prototypes sit in the same world. */
export function Grain() {
    return <div aria-hidden="true" className={s.grain} />;
}

/** The two hero actions, styled like the live site's call button. */
export function HeroActions() {
    return (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/contact#book" className={s.cta}>
                <span>{FIT_CALL_LABEL}</span>
                <span className={s.ctaIcon} aria-hidden="true">↗</span>
            </Link>
            <Link href="/case-studies" className={s.textLink}>See the work</Link>
        </div>
    );
}
