import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getIcon } from "@/lib/icons";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Vyoma Wellness" },
      { name: "description", content: "Yoga, fitness, breathwork, meditation and motivation programs for every level." },
    ],
  }),
  component: ProgramsPage,
});

const tags = ["All", "Yoga", "Fitness", "Breathwork", "Meditation", "Motivation"] as const;

function ProgramsPage() {
  const [active, setActive] = useState<(typeof tags)[number]>("All");

  const { data: list = [], isLoading, isError } = useQuery({
    queryKey: ["programs", active],
    queryFn: () => api.programs.list(active),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="max-w-2xl animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Programs</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Practice with intention.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Short, structured sessions designed for everyday discipline. Filter by what you need today.
          </p>
        </header>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mt-16 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="font-display text-lg font-semibold text-foreground">Failed to load programs</p>
          <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        </div>
      </div>
    );
  }

  const IconComp = list.length > 0 ? getIcon(list[0].icon) : Search;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Programs</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Practice with intention.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Short, structured sessions designed for everyday discipline. Filter by what you need today.
        </p>
      </header>

      <div className="mt-10 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold">No programs in this category yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a different filter or check back soon.</p>
          <button onClick={() => setActive("All")} className="mt-5 text-sm font-medium text-primary hover:underline">
            View all programs →
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => {
            const ProgramIcon = getIcon(p.icon);
            return (
              <article key={p.slug} className="hover-lift group flex flex-col rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{p.tag}</span>
                  <span className="text-xs text-muted-foreground">{p.duration}</span>
                </div>
                <div className="mt-6 grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <ProgramIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="text-muted-foreground">{p.level}</span>
                  <span className="inline-flex items-center gap-1 font-medium text-foreground group-hover:text-primary">
                    Start <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-secondary/50 p-6">
        <p className="text-sm text-muted-foreground">New to Vyoma? Start with a free week and find your rhythm.</p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/signup">Start free week</Link>
        </Button>
      </div>
    </div>
  );
}
