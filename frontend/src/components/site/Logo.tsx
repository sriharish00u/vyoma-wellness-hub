import { Link } from "@tanstack/react-router";

export function Logo({
  className = "",
  showText = true,
  imageSize = "h-9 w-9",
}: {
  className?: string;
  showText?: boolean;
  imageSize?: string;
}) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Mivora Academy home">
      <div className={`relative ${imageSize} shrink-0 overflow-hidden rounded-xl border border-border/80 bg-card p-0.5 shadow-xs transition-transform group-hover:scale-105`}>
        <img
          src="/logo.png"
          alt="Mivora Academy Logo"
          className="h-full w-full rounded-lg object-cover"
        />
        <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-emerald border-2 border-background" />
      </div>
      {showText && (
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          MIVORA<span className="ml-1 text-emerald">·</span>
          <span className="ml-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Academy</span>
        </span>
      )}
    </Link>
  );
}
