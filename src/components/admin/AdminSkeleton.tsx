"use client";

import { cn } from "@/lib/utils";

/* Shimmer bar base */
function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-[shimmer_1.5s_infinite] rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
        className
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Table skeleton                                                    */
/* ------------------------------------------------------------------ */

export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="w-full overflow-hidden rounded-lg border">
      {/* Header */}
      <div className="flex gap-4 border-b bg-muted/30 px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Shimmer key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b px-4 py-3 last:border-b-0">
          {Array.from({ length: columns }).map((_, c) => (
            <Shimmer key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card skeleton                                                     */
/* ------------------------------------------------------------------ */

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border p-6", className)}>
      <Shimmer className="mb-4 h-5 w-1/3" />
      <Shimmer className="mb-2 h-4 w-full" />
      <Shimmer className="mb-2 h-4 w-4/5" />
      <Shimmer className="h-4 w-2/3" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form skeleton                                                     */
/* ------------------------------------------------------------------ */

export function FormSkeleton({
  fields = 4,
  className,
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-9 w-full" />
        </div>
      ))}
      <Shimmer className="h-10 w-32" />
    </div>
  );
}
