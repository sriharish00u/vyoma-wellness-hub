import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  if (path.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Mivora Academy — a holistic platform for physical wellness, mental wellness, and technical services.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">Platform</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/events" className="hover:text-foreground">Events</Link></li>
            <li><Link to="/physical-wellness" className="hover:text-foreground">Physical Wellness</Link></li>
            <li><Link to="/mental-wellness" className="hover:text-foreground">Mental Wellness</Link></li>
            <li><Link to="/technical-services" className="hover:text-foreground">Technical Services</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">Account</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/login" className="hover:text-foreground">Login</Link></li>
            <li><Link to="/signup" className="hover:text-foreground">Create account</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Mivora Academy. All rights reserved.</p>
          <p>Made for calm, disciplined practice.</p>
        </div>
      </div>
    </footer>
  );
}
