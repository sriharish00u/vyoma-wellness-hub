import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Compass, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Vyoma Wellness" },
      { name: "description", content: "Vyoma Wellness is a modern academy built around calm, disciplined daily practice." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const values = [
    { icon: Leaf, title: "Calm over loud", desc: "We build slow, lasting practices — not hype." },
    { icon: Compass, title: "Discipline over motivation", desc: "Show up daily. Outcomes follow naturally." },
    { icon: Heart, title: "Care over scale", desc: "Coaches who know your name, not just your stats." },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-3xl animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald">About</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          A wellness ecosystem built for daily life.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Vyoma began with a simple idea: practice should feel calm, structured and within reach.
          Today, we guide tens of thousands of members through yoga, fitness, breathwork and meditation —
          one daily session at a time.
        </p>
      </header>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="hover-lift rounded-xl border border-border bg-card p-6">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
              <v.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">{v.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-20 grid gap-10 rounded-2xl bg-secondary/40 p-8 md:grid-cols-2 md:p-12">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Our approach</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We believe wellness is built through consistency, not intensity. Every Vyoma program is
            designed by certified coaches and structured around short, daily sessions that fit real
            schedules.
          </p>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Who it's for</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Beginners building a first habit. Practitioners returning after a break. Anyone who wants
            a calmer, more disciplined daily routine.
          </p>
        </div>
      </section>
    </div>
  );
}
