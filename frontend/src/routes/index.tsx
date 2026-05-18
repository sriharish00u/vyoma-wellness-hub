import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { features, stats, testimonials } from "@/data/content";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getIcon } from "@/lib/icons";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vyoma Wellness — Calm. Disciplined. Daily." },
      { name: "description", content: "Modern wellness academy. Daily yoga, fitness, breathwork and motivation in one calm, premium platform." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: programs = [] } = useQuery({
    queryKey: ["programs", "All"],
    queryFn: () => api.programs.list(),
  });

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: api.auth.me,
    enabled: auth.isLoggedIn(),
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
              New cohort starting Monday
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Calm body.<br />
              Disciplined mind.<br />
              <span className="text-emerald">Daily practice.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Vyoma Wellness is a modern academy for yoga, fitness, breathwork and motivation —
              built around daily live sessions and quiet, lasting habits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/signup">Start your free week <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/programs">Browse programs</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-orange text-orange" />
                ))}
                <span className="ml-1 font-medium text-foreground">4.9</span>
              </div>
              <span>Loved by 120,000+ practitioners</span>
            </div>
          </div>

          {/* Visual block — flat, no gradients */}
          <div className="relative animate-fade-up">
            <div className="grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4">
              <div className="col-span-4 row-span-3 rounded-2xl bg-primary p-6 text-primary-foreground hover-lift">
                <p className="text-xs font-medium uppercase tracking-widest opacity-70">Today · Live</p>
                <p className="mt-3 font-display text-2xl font-bold leading-tight">Morning Yoga Flow</p>
                <p className="mt-1 text-sm opacity-80">06:30 · 20 min · with Coach Ananya</p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                  In session
                </div>
              </div>
              <div className="col-span-2 row-span-3 rounded-2xl bg-emerald p-5 text-emerald-foreground hover-lift">
                <p className="text-xs font-medium uppercase tracking-widest opacity-80">Streak</p>
                <p className="mt-3 font-display text-4xl font-bold">{me?.streak ?? 42}</p>
                <p className="text-sm opacity-85">days strong</p>
              </div>
              <div className="col-span-3 row-span-3 rounded-2xl border border-border bg-card p-5 hover-lift">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">This week</p>
                <p className="mt-3 font-display text-2xl font-bold text-foreground">{me?.sessionsCompleted ?? 6} / 7</p>
                <p className="text-sm text-muted-foreground">sessions completed</p>
                <div className="mt-4 flex gap-1.5">
                  {[1,1,1,1,1,1,0].map((d, i) => (
                    <span key={i} className={`h-2 flex-1 rounded-full ${d ? "bg-primary" : "bg-border"}`} />
                  ))}
                </div>
              </div>
              <div className="col-span-3 row-span-3 rounded-2xl bg-ink p-5 text-background hover-lift">
                <p className="text-xs font-medium uppercase tracking-widest opacity-70">Next up</p>
                <p className="mt-3 font-display text-lg font-bold">Pranayama Basics</p>
                <p className="mt-1 text-sm opacity-80">07:00 · 15 min</p>
                <div className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange text-orange-foreground">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-foreground sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Why Vyoma</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A calm, structured way to show up every day.
          </h2>
          <p className="mt-4 text-muted-foreground">
            No flashy gym energy. No overwhelm. Just disciplined daily practice with coaches who care.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="hover-lift rounded-xl border border-border bg-card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Programs</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Find a practice that fits your day.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/programs">View all programs <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programs.slice(0, 6).map((p) => {
              const ProgramIcon = getIcon(p.icon);
              return (
                <article key={p.slug} className="hover-lift group flex flex-col rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                      {p.tag}
                    </span>
                    <span className="text-xs text-muted-foreground">{p.duration}</span>
                  </div>
                  <div className="mt-6 grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <ProgramIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
                    <span className="text-muted-foreground">{p.level}</span>
                    <span className="inline-flex items-center gap-1 font-medium text-foreground group-hover:text-primary">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Members</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Quiet progress, every day.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="hover-lift rounded-xl border border-border bg-card p-6">
              <Quote className="h-5 w-5 text-emerald" />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-primary px-6 py-14 text-primary-foreground sm:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Start your free week.
              </h2>
              <p className="mt-3 max-w-md text-primary-foreground/80">
                Seven days of live sessions, full library access and a coach in your corner.
              </p>
            </div>
            <ul className="grid gap-3 text-sm sm:grid-cols-2">
              {["Daily live sessions","Full program library","Habit tracker","No card required"].map((i) => (
                <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald" /> {i}</li>
              ))}
            </ul>
            <div className="lg:col-span-2">
              <Button asChild size="lg" className="bg-orange text-orange-foreground hover:bg-orange/90">
                <Link to="/signup">Start free <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
