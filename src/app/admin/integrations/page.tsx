"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Plug,
  Settings,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  X,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Integration {
  id: string;
  name: string;
  enabled: boolean;
  config: string | null;
  lastSync: string | null;
  status: "connected" | "disconnected" | "error";
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Dialog                                                             */
/* ------------------------------------------------------------------ */

function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const timer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("textarea")?.focus();
    }, 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-xl animate-[dialogIn_0.2s_ease-out_both]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button size="icon-sm" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status badge                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: Integration["status"] }) {
  const config = {
    connected: {
      dot: "bg-green-500",
      text: "text-green-700 dark:text-green-400",
      label: "Connected",
      Icon: CheckCircle,
    },
    disconnected: {
      dot: "bg-gray-400",
      text: "text-muted-foreground",
      label: "Disconnected",
      Icon: XCircle,
    },
    error: {
      dot: "bg-red-500",
      text: "text-red-700 dark:text-red-400",
      label: "Error",
      Icon: AlertTriangle,
    },
  }[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", config.text)}>
      <span className={cn("inline-block size-2 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Configure dialog
  const [configTarget, setConfigTarget] = useState<Integration | null>(null);
  const [configValue, setConfigValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Test connection
  const [testingId, setTestingId] = useState<string | null>(null);

  // Toggle loading
  const [togglingId, setTogglingId] = useState<string | null>(null);

  /* ---------- Fetch ---------- */

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/integrations");
      if (!res.ok) throw new Error("Failed to load integrations");
      const data = await res.json();
      setIntegrations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------- Toggle enabled ---------- */

  const handleToggle = async (integration: Integration) => {
    setTogglingId(integration.id);
    try {
      const res = await fetch(`/api/admin/integrations/${integration.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !integration.enabled }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          typeof err?.error === "string" ? err.error : "Failed to update"
        );
      }
      toast({
        title: `${integration.name} ${integration.enabled ? "disabled" : "enabled"}`,
        variant: "success",
      });
      fetchData();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setTogglingId(null);
    }
  };

  /* ---------- Configure ---------- */

  const openConfigure = (integration: Integration) => {
    setConfigTarget(integration);
    setConfigValue(integration.config ?? "");
  };

  const handleSaveConfig = async () => {
    if (!configTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/integrations/${configTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: configValue }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          typeof err?.error === "string" ? err.error : "Failed to save"
        );
      }
      toast({ title: "Configuration saved", variant: "success" });
      setConfigTarget(null);
      fetchData();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Test Connection ---------- */

  const handleTest = async (integration: Integration) => {
    setTestingId(integration.id);
    try {
      const res = await fetch(
        `/api/admin/integrations/${integration.id}/test`,
        { method: "POST" }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          typeof err?.error === "string" ? err.error : "Test failed"
        );
      }
      const data = await res.json();
      toast({
        title:
          data.status === "connected"
            ? "Connection successful"
            : "Connection failed",
        variant: data.status === "connected" ? "success" : "error",
      });
      fetchData();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Test failed",
        variant: "error",
      });
    } finally {
      setTestingId(null);
    }
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Plug className="size-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : integrations.length === 0 ? (
        <AdminEmptyState
          icon={Plug}
          title="No integrations"
          description="No integrations have been configured yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="rounded-lg border bg-card p-5 shadow-sm"
            >
              {/* Card header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {integration.status === "connected" ? (
                    <Wifi className="size-4 text-green-600" />
                  ) : (
                    <WifiOff className="size-4 text-muted-foreground" />
                  )}
                  <h3 className="font-semibold">{integration.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(integration)}
                  disabled={togglingId === integration.id}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  title={integration.enabled ? "Disable" : "Enable"}
                >
                  {integration.enabled ? (
                    <ToggleRight className="size-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="size-6" />
                  )}
                </button>
              </div>

              {/* Status */}
              <div className="mb-3">
                <StatusBadge status={integration.status} />
              </div>

              {/* Last sync */}
              {integration.lastSync && (
                <p className="mb-3 text-xs text-muted-foreground">
                  Last sync:{" "}
                  {new Date(integration.lastSync).toLocaleString()}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openConfigure(integration)}
                >
                  <Settings className="mr-1.5 size-3.5" />
                  Configure
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTest(integration)}
                  disabled={testingId === integration.id}
                >
                  {testingId === integration.id ? (
                    <RefreshCw className="mr-1.5 size-3.5 animate-spin" />
                  ) : (
                    <Zap className="mr-1.5 size-3.5" />
                  )}
                  {testingId === integration.id ? "Testing…" : "Test"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Configure Dialog */}
      <Dialog
        open={!!configTarget}
        onClose={() => setConfigTarget(null)}
        title={`Configure ${configTarget?.name ?? ""}`}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="integration-config"
              className="mb-1 block text-sm font-medium"
            >
              Configuration
            </label>
            <textarea
              id="integration-config"
              value={configValue}
              onChange={(e) => setConfigValue(e.target.value)}
              rows={8}
              placeholder='{"apiKey": "...", "endpoint": "..."}'
              className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfigTarget(null)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveConfig} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
