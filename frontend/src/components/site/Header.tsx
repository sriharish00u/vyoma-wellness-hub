import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, LogOut, ShieldCheck, BadgeCheck } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const user = auth.getUser();
  const loggedIn = auth.isLoggedIn();
  const isAdmin = auth.isAdmin();

  if (path.startsWith("/admin")) return null;

  const handleSignOut = () => {
    auth.clear();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loggedIn ? (
            <>
              {isAdmin && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin" className="gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-orange" />
                    Admin
                  </Link>
                </Button>
              )}
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                {user?.name}
                {user?.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-emerald" />}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-border md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 px-1">
                {loggedIn ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-orange hover:bg-secondary">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Admin
                      </Link>
                    )}
                    <div className="flex items-center gap-1.5 px-3 py-2 text-sm text-foreground">
                      {user?.name}
                      {user?.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-emerald" />}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start gap-1.5"
                      onClick={() => { setOpen(false); handleSignOut(); }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1 bg-primary text-primary-foreground">
                      <Link to="/signup" onClick={() => setOpen(false)}>Get started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
