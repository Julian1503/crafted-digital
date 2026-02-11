"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface AdminEmptyStateProps {
  icon: ElementType;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
  children?: ReactNode;
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  children,
}: AdminEmptyStateProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center",
        !prefersReduced && "animate-[fadeIn_0.4s_ease-out_both]",
        className
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} className="mt-6" size="sm">
          {action.label}
        </Button>
      )}
      {children}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
