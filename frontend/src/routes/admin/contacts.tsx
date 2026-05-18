import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api, type ContactMessage } from "@/lib/api";

export const Route = createFileRoute("/admin/contacts")({
  head: () => ({ meta: [{ title: "Messages — Admin" }] }),
  component: AdminContacts,
});

function AdminContacts() {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "contacts", page],
    queryFn: () => api.admin.contacts(page),
  });

  return (
    <div className="px-6 py-8">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Contact Messages</h1>
          {data && <p className="text-sm text-muted-foreground">{data.total} total</p>}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : isError ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-destructive">
            Failed to load messages.
          </div>
        ) : (data?.contacts ?? []).length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">No contact messages yet.</p>
          </div>
        ) : (
          (data?.contacts ?? []).map((c: ContactMessage) => (
            <div key={c._id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === c._id ? null : c._id)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {c.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                      <span className="text-muted-foreground hidden sm:inline">·</span>
                      <p className="text-xs text-muted-foreground hidden sm:block truncate">{c.email}</p>
                    </div>
                    <p className="text-sm font-medium text-foreground mt-0.5 truncate">{c.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-xs text-muted-foreground hidden md:block">
                    {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  {expanded === c._id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expanded === c._id && (
                <div className="border-t border-border px-5 py-4 bg-secondary/20">
                  <p className="text-xs font-medium text-muted-foreground mb-1">From: {c.email}</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{c.message}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Received {new Date(c.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>
          ))
        )}

        {data && data.pages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">Page {data.page} of {data.pages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === data.pages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
