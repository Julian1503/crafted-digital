import {ChapterLabelProps} from "@/components/sections/Case-study/case-study.types";
import {C} from "@/components/sections/Case-study/case-study.constants";

export function ChapterLabel({ index, label }: ChapterLabelProps) {
    return (
        <div className="flex items-center gap-3 mb-10 md:mb-14">
            <span className="font-mono text-[0.58rem] tracking-[0.28em] uppercase" style={{ color: C.label }}>{index}</span>
            <span className="h-px w-7 shrink-0" style={{ background: C.border }} aria-hidden="true" />
            <span className="text-[0.58rem] tracking-[0.22em] uppercase" style={{ color: C.label }}>{label}</span>
        </div>
    );
}
