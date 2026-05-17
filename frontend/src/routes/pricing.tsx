import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans } from "@/data/content";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Vyoma Wellness" },
      { name: "description", content: "Simple, transparent pricing for Vyoma Wellness members." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-2xl text-center animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Pricing</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Simple plans, real practice.
        </h1>
        <p className="mt-4 text-muted-foreground">Start free. Upgrade only when you're ready.</p>
      </header>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`hover-lift flex flex-col rounded-2xl border p-8 ${
              p.highlight ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
            }`}
          >
            <p className={`text-sm font-semibold uppercase tracking-widest ${p.highlight ? "text-emerald" : "text-emerald"}`}>
              {p.name}
            </p>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold">{p.price}</span>
              <span className={p.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}>{p.period}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className={`mt-0.5 h-4 w-4 ${p.highlight ? "text-emerald" : "text-emerald"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`mt-8 ${p.highlight ? "bg-orange text-orange-foreground hover:bg-orange/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
            >
              <Link to="/signup">{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
