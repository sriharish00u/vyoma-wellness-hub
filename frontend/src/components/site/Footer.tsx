import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { SOCIAL_LINKS } from "@/lib/seo";

export function Footer() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  if (path.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Mivora Academy — a holistic platform for physical wellness, mental wellness, and
            technical services.
          </p>
          <div className="mt-5 flex gap-2">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">Platform</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/events" className="hover:text-foreground">
                Events
              </Link>
            </li>
            <li>
              <Link to="/physical-wellness" className="hover:text-foreground">
                Physical Wellness
              </Link>
            </li>
            <li>
              <Link to="/mental-wellness" className="hover:text-foreground">
                Mental Wellness
              </Link>
            </li>
            <li>
              <Link to="/technical-services" className="hover:text-foreground">
                Technical Services
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-foreground">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">Account</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/login" className="hover:text-foreground">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-foreground">
                Create account
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Mivora Academy. All rights reserved.</p>
          <p>Made for calm, disciplined practice.</p>
        </div>
      </div>
    </footer>
  );
}
