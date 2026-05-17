import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Vyoma Wellness home">
      <span className="relative grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M4 4l8 16 8-16" />
          <path d="M8 4l4 8 4-8" className="opacity-60" />
        </svg>
        <span className="absolute -right-0.5 -bottom-0.5 h-1.5 w-1.5 rounded-full bg-orange" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        VYOMA<span className="ml-1 text-emerald">·</span>
        <span className="ml-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Wellness</span>
      </span>
    </Link>
  );
}
