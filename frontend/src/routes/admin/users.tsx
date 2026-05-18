import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, ChevronLeft, ChevronRight, ShieldCheck, Ban, Trash2, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { api, type AdminUser } from "@/lib/api";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
  component: AdminUsers,
});

const PLAN_OPTIONS = ["starter", "member", "annual"] as const;

function AdminUsers() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => api.admin.users(page),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => api.admin.verifyUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "users"] }); toast.success("Verification toggled"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const banMutation = useMutation({
    mutationFn: (id: string) => api.admin.banUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "users"] }); toast.success("Ban toggled"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const planMutation = useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: string }) => api.admin.updatePlan(id, plan),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "users"] }); toast.success("Plan updated"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.deleteUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "users"] }); toast.success("User deleted"); setDeleteTarget(null); },
    onError: (err: Error) => toast.error(err.message),
  });

  const planBadge = (plan: string) => {
    const colors: Record<string, string> = {
      starter: "bg-secondary text-secondary-foreground",
      member: "bg-emerald/10 text-emerald",
      annual: "bg-primary/10 text-primary",
    };
    return colors[plan] ?? "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="px-6 py-8">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Users</h1>
          {data && <p className="text-sm text-muted-foreground">{data.total} total</p>}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-destructive">Failed to load users.</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Plan</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Streak</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Joined</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data?.users ?? []).map((u: AdminUser, idx: number) => (
                  <tr key={u._id} className={`border-b border-border last:border-0 ${idx % 2 === 0 ? "" : "bg-secondary/20"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{u.name}</span>
                          <div className="flex gap-1.5 mt-0.5">
                            {u.isVerified && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald">
                                <BadgeCheck className="h-3 w-3" /> Verified
                              </span>
                            )}
                            {u.isBanned && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
                                <Ban className="h-3 w-3" /> Banned
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {u.role === "admin" ? (
                        <span className="rounded-full bg-orange/10 px-2 py-0.5 text-xs font-semibold text-orange">Admin</span>
                      ) : (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">User</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <select
                        value={u.plan}
                        onChange={(e) => planMutation.mutate({ id: u._id, plan: e.target.value })}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize border-0 cursor-pointer ${planBadge(u.plan)}`}
                      >
                        {PLAN_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{u.streak} days</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => verifyMutation.mutate(u._id)} className="h-7 w-7 p-0 text-muted-foreground hover:text-emerald" title="Toggle verify">
                          <BadgeCheck className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => banMutation.mutate(u._id)} className="h-7 w-7 p-0 text-muted-foreground hover:text-orange" title="Toggle ban">
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(u._id)} className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data && data.pages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3">
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
          </>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the user. Cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)} className="bg-destructive text-destructive-foreground">
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
