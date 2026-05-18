import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard, Users, MessageSquare, LogOut, ShieldCheck,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — Vyoma Wellness" }] }),
  component: AdminLayout,
});

const adminNav = [
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/contacts", label: "Messages", icon: MessageSquare },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = auth.getUser();

  useEffect(() => {
    if (!auth.isAdmin()) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  if (!auth.isAdmin()) return null;

  const handleSignOut = () => {
    auth.clear();
    window.location.href = "/";
  };

  const isHome = pathname === "/admin" || pathname === "/admin/";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-foreground">Admin</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {adminNav.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-3 py-4">
          <div className="mb-3 px-3">
            <p className="text-xs font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
          <a
            href="/"
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            View site
          </a>
        </div>
      </aside>

      <div className="flex w-full flex-col md:hidden">
        <header className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <span className="font-display text-sm font-bold text-foreground">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            Out
          </Button>
        </header>
        <nav className="flex gap-1 border-b border-border px-2 py-2 overflow-x-auto">
          {adminNav.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1 overflow-auto">
        {isHome && (
          <div className="px-6 py-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-sm text-muted-foreground mb-8">Welcome, {user?.name}.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link to="/admin/users" className="rounded-xl border border-border bg-card p-6 hover:bg-secondary/50 transition-colors">
                <Users className="h-6 w-6 text-primary mb-3" />
                <p className="font-medium text-foreground">Manage Users</p>
                <p className="text-xs text-muted-foreground mt-1">Verify, ban, or remove users</p>
              </Link>
              <Link to="/admin/contacts" className="rounded-xl border border-border bg-card p-6 hover:bg-secondary/50 transition-colors">
                <MessageSquare className="h-6 w-6 text-primary mb-3" />
                <p className="font-medium text-foreground">Contact Messages</p>
                <p className="text-xs text-muted-foreground mt-1">View messages from the contact form</p>
              </Link>
            </div>
          </div>
        )}
        {!isHome && <Outlet />}
      </main>
    </div>
  );
}
