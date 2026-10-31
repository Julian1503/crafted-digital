import { ChapterLabelProps } from "@/components/sections/Case-study/case-study.types";
import { DARK, LIGHT, ACCENT } from "@/components/sections/Case-study/case-study.constants";

export function ChapterLabel({ index, label, theme = "dark" }: ChapterLabelProps) {
  const T = theme === "light" ? LIGHT : DARK;
  return (
    <div className="flex items-center gap-3 mb-10 md:mb-14">
      <span
        className="font-mono text-[0.7rem] tracking-[0.3em] uppercase"
        style={{ color: ACCENT }}
      >
        {index}
      </span>
      <span
        className="h-px w-8 shrink-0"
        style={{ background: T.border }}
        aria-hidden="true"
      />
      <span
        className="text-[0.7rem] tracking-[0.24em] uppercase"
        style={{ color: T.label }}
      >
        {label}
      </span>
    </div>
  );
}
