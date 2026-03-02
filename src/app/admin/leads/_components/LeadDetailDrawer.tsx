"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { LEAD_STATUS_COLORS } from "@/lib/constants";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";
import type { Lead } from "./lead.types";

const statusTransitions: Record<string, { label: string; next: string }> = {
  new: { label: "Mark as Contacted", next: "contacted" },
  contacted: { label: "Mark as Qualified", next: "qualified" },
  qualified: { label: "Mark as Won", next: "won" },
};

interface LeadDetailDrawerProps {
  lead: Lead | null;
  loading: boolean;
  onClose: () => void;
  onStatusChange: (lead: Lead, newStatus: string) => void;
  onNoteAdded: () => void;
}

export function LeadDetailDrawer({
  lead,
  loading,
  onClose,
  onStatusChange,
  onNoteAdded,
}: LeadDetailDrawerProps) {
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // Reset note content when lead changes
  useEffect(() => {
    setNoteContent("");
  }, [lead?.id]);

  // Close drawer on escape
  useEffect(() => {
    if (!lead) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lead, onClose]);

  const handleAddNote = async () => {
    if (!lead || !noteContent.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch("/api/admin/leads/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, content: noteContent.trim() }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Note added", variant: "success" });
      setNoteContent("");
      onNoteAdded();
    } catch {
      toast({ title: "Failed to add note", variant: "error" });
    } finally {
      setAddingNote(false);
    }
  };

  if (!lead) return null;

  return (
    <>
      {/* Backdrop */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col border-l bg-background shadow-xl animate-[slideIn_0.3s_ease-out_both]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{lead.name}</h2>
          <Button size="icon-sm" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {loading ? (
            <TableSkeleton rows={3} columns={2} />
          ) : (
            <>
              {/* Lead Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                  <dt className="font-medium">Name</dt>
                  <dd>{lead.name}</dd>
                  <dt className="font-medium">Email</dt>
                  <dd>{lead.email}</dd>
                  <dt className="font-medium">Phone</dt>
                  <dd>{lead.phone ?? "—"}</dd>
                  <dt className="font-medium">Source</dt>
                  <dd className="capitalize">{lead.source}</dd>
                  {lead.message && (
                    <>
                      <dt className="font-medium">Message</dt>
                      <dd className="whitespace-pre-wrap">{lead.message}</dd>
                    </>
                  )}
                </dl>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <span
                  className={cn(
                    "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    LEAD_STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-700"
                  )}
                >
                  {lead.status}
                </span>
                {statusTransitions[lead.status] && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onStatusChange(
                          lead,
                          statusTransitions[lead.status].next
                        )
                      }
                    >
                      <ArrowRight className="mr-2 size-4" />
                      {statusTransitions[lead.status].label}
                    </Button>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                {lead.notes && lead.notes.length > 0 ? (
                  <div className="space-y-3">
                    {[...lead.notes]
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((note) => (
                        <div
                          key={note.id}
                          className="rounded-md border bg-muted/20 p-3 text-sm"
                        >
                          <p className="whitespace-pre-wrap">{note.content}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {note.author?.name ?? note.author?.email ?? "System"} ·{" "}
                            {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes yet.</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Add Note */}
        <div className="border-t px-6 py-4 space-y-2">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add a note…"
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            size="sm"
            onClick={handleAddNote}
            disabled={addingNote || !noteContent.trim()}
          >
            <MessageSquare className="mr-2 size-4" />
            {addingNote ? "Adding…" : "Add Note"}
          </Button>
        </div>
      </div>
    </>
  );
}
