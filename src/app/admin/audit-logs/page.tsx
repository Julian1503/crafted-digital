"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  ScrollText,
  Eye,
  X,
  Clock,
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Actor {
  id: string;
  name: string | null;
  email: string;
}

interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  actor: Actor;
}

interface PaginatedAuditLogs {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ENTITIES = [
  "All",
  "User",
  "BlogPost",
  "CaseStudy",
  "Booking",
  "Plan",
  "Coupon",
  "Integration",
  "SiteSetting",
  "MediaAsset",
  "Lead",
  "Role",
] as const;

const ACTIONS = [
  "All",
  "create",
  "update",
  "delete",
  "toggle",
] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString();
}

function truncateId(id: string, len = 8) {
  return id.length > len ? `${id.slice(0, len)}…` : id;
}

function prettyJson(raw: string | null): string {
  if (!raw) return "—";
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<PaginatedAuditLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filters
  const [entityFilter, setEntityFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Drawer
  const [drawerLog, setDrawerLog] = useState<AuditLog | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  /* ---------- Fetch ---------- */

  const fetchLogs = useCallback(
    async (
      p: number,
      entity: string,
      action: string,
      from: string,
      to: string,
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: "20",
        });
        if (entity !== "All") params.set("entity", entity);
        if (action !== "All") params.set("action", action);
        if (from) params.set("from", from);
        if (to) params.set("to", to);

        const res = await fetch(`/api/admin/audit-logs?${params}`);
        if (!res.ok) throw new Error("Failed to load audit logs");
        const data: PaginatedAuditLogs = await res.json();
        setLogs(data);
      } catch {
        toast({ title: "Failed to load audit logs", variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchLogs(page, entityFilter, actionFilter, fromDate, toDate);
  }, [page, entityFilter, actionFilter, fromDate, toDate, fetchLogs]);

  /* ---------- Drawer ---------- */

  const openDrawer = (log: AuditLog) => setDrawerLog(log);
  const closeDrawer = useCallback(() => setDrawerLog(null), []);

  useEffect(() => {
    if (!drawerLog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerLog, closeDrawer]);

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ScrollText className="size-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Filter className="size-4" />
          <span>Filters</span>
        </div>

        <select
          value={entityFilter}
          onChange={(e) => {
            setEntityFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          {ENTITIES.map((e) => (
            <option key={e} value={e}>
              {e === "All" ? "All Entities" : e}
            </option>
          ))}
        </select>

        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          {ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a === "All" ? "All Actions" : a}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
            className="h-9 w-auto"
            aria-label="From date"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
            className="h-9 w-auto"
            aria-label="To date"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : !logs || logs.data.length === 0 ? (
        <AdminEmptyState
          icon={ScrollText}
          title="No audit logs found"
          description="Adjust your filters or check back later."
        />
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Timestamp</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Actor</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Action</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Entity</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Entity ID</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.data.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b transition-colors hover:bg-muted/20 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {formatTimestamp(log.createdAt)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <User className="size-3.5 text-muted-foreground" />
                        {log.actor?.name ?? log.actor?.email ?? "—"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          log.action === "delete"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : log.action === "create"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        )}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">
                      {log.entity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                      {truncateId(log.entityId)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => openDrawer(log)}
                        title="View details"
                      >
                        <Eye className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {logs.page} of {logs.totalPages} ({logs.total} total)
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="mr-1 size-4" />
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= logs.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Detail Drawer */}
      {drawerLog && (
        <>
          {/* Backdrop */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={closeDrawer}
          />
          {/* Panel */}
          <div
            ref={drawerRef}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col border-l bg-background shadow-xl animate-[slideIn_0.3s_ease-out_both]"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Log Details</h2>
              <Button size="icon-sm" variant="ghost" onClick={closeDrawer}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                  <dt className="font-medium">Timestamp</dt>
                  <dd>{formatTimestamp(drawerLog.createdAt)}</dd>

                  <dt className="font-medium">Actor</dt>
                  <dd>
                    {drawerLog.actor?.name
                      ? `${drawerLog.actor.name} (${drawerLog.actor.email})`
                      : drawerLog.actor?.email ?? "—"}
                  </dd>

                  <dt className="font-medium">Action</dt>
                  <dd className="capitalize">{drawerLog.action}</dd>

                  <dt className="font-medium">Entity</dt>
                  <dd>{drawerLog.entity}</dd>

                  <dt className="font-medium">Entity ID</dt>
                  <dd className="break-all font-mono text-xs">{drawerLog.entityId}</dd>

                  <dt className="font-medium">IP Address</dt>
                  <dd className="font-mono text-xs">{drawerLog.ip ?? "—"}</dd>

                  <dt className="font-medium">User Agent</dt>
                  <dd className="break-all text-xs">{drawerLog.userAgent ?? "—"}</dd>
                </dl>
              </div>

              {/* Metadata */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Metadata</h3>
                <pre className="overflow-x-auto rounded-md border bg-muted/30 p-3 font-mono text-xs whitespace-pre-wrap">
                  {prettyJson(drawerLog.metadata)}
                </pre>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
