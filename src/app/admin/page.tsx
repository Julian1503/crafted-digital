"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Briefcase,
  UserPlus,
  Calendar,
  Plus,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/admin/AdminSkeleton";
import { cn } from "@/lib/utils";

interface Metrics {
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
  totalCaseStudies: number;
  leadsThisMonth: number;
  upcomingBookings: number;
}

interface ActivityEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  createdAt: string;
  actor: { id: string; name: string | null; email: string } | null;
}

const metricCards = [
  { key: "publishedPosts" as const, label: "Published Posts", icon: FileText },
  { key: "draftPosts" as const, label: "Draft Posts", icon: BookOpen },
  { key: "scheduledPosts" as const, label: "Scheduled Posts", icon: Calendar },
  { key: "totalCaseStudies" as const, label: "Total Case Studies", icon: Briefcase },
  { key: "leadsThisMonth" as const, label: "Leads This Month", icon: UserPlus },
  { key: "upcomingBookings" as const, label: "Upcoming Bookings", icon: Calendar },
];

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then((data) => {
        setMetrics(data.metrics);
        setActivity(data.recentActivity ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="size-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : metricCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className={cn(
                    "rounded-lg border bg-card p-6 shadow-sm",
                    "animate-[fadeIn_0.4s_ease-out_both]"
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {card.label}
                    </span>
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-3xl font-bold">
                    {metrics?.[card.key] ?? 0}
                  </p>
                </div>
              );
            })}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href="/admin/blog?action=new">
            <Plus className="mr-2 size-4" />
            New Blog Post
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/case-studies?action=new">
            <Plus className="mr-2 size-4" />
            New Case Study
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/media?action=upload">
            <Upload className="mr-2 size-4" />
            Upload Media
          </Link>
        </Button>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        {loading ? (
          <CardSkeleton />
        ) : activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <div className="rounded-lg border">
            <ul className="divide-y">
              {activity.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span>
                    <span className="font-medium">
                      {entry.actor?.name ?? entry.actor?.email ?? "System"}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {entry.action}
                    </span>{" "}
                    <span className="font-medium">{entry.entity}</span>
                    {entry.entityId && (
                      <span className="text-muted-foreground">
                        {" "}
                        {entry.entityId.slice(0, 8)}
                      </span>
                    )}
                  </span>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {relativeTime(entry.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
