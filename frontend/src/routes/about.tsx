import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Compass, Heart, ArrowRight, Users, Award, Clock, Quote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mivora Academy" },
      { name: "description", content: "Mivora Academy is a holistic platform for physical wellness, mental wellness & technical services." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const values = [
    { icon: Leaf, title: "Calm over loud", desc: "We build slow, lasting practices — not hype. No flashy gimmicks, just consistent growth." },
    { icon: Compass, title: "Discipline over motivation", desc: "Show up daily. Outcomes follow naturally. Motivation fades, but discipline compounds." },
    { icon: Heart, title: "Care over scale", desc: "Coaches who know your name, not just your stats. Every member is seen, heard, and supported." },
  ];

  const stats = [
    { value: "5,000+", label: "Active members" },
    { value: "50,000+", label: "Sessions completed" },
    { value: "60+", label: "Certified coaches" },
    { value: "4.9", label: "Average rating" },
  ];

  const story = [
    { year: "2022", title: "The idea", desc: "Mivora Academy was conceived as a response to the chaos of modern wellness — too many apps, too much noise, not enough consistency." },
    { year: "2023", title: "First cohort", desc: "We launched with a single morning yoga cohort. 12 members showed up. By month three, every single one had a 30-day streak." },
    { year: "2024", title: "Expanded to three pillars", desc: "Members asked for more. We added mental wellness programs and technical services — growing from a fitness platform into a holistic ecosystem." },
    { year: "2025", title: "Global community", desc: "Today, thousands of members across India practice daily with Mivora Academy. And we are just getting started." },
  ];

  const teamHighlights = [
    { icon: Users, title: "Certified coaches", desc: "Every Mivora coach holds recognized certifications in their field — yoga, fitness, counseling, or technology." },
    { icon: Award, title: "Proven methodology", desc: "Our programs are built on behavioural science. Small daily actions that compound into lasting change." },
    { icon: Clock, title: "Built for real life", desc: "Short sessions (10–35 min) that fit into your morning, lunch break, or evening — no excuses needed." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* HERO */}
      <header className="max-w-4xl animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          Serving 5,000+ members since 2022
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          A wellness ecosystem<br />
          <span className="text-emerald">built for daily life.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Mivora Academy began with a simple idea: growth should be holistic — covering body, mind, and skills.
          Today, we guide thousands of members through physical wellness, mental wellness, and technical services —
          one step at a time.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/signup">Join Mivora Academy <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/events">See our events</Link>
          </Button>
        </div>
      </header>

      {/* STATS */}
      <section className="mt-20 grid grid-cols-2 gap-y-8 rounded-2xl border border-border bg-secondary/50 px-6 py-10 sm:grid-cols-4 sm:px-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-bold text-foreground sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      {/* VALUES */}
      <section className="mt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Our Values</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three principles that guide everything we do.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="hover-lift rounded-xl border border-border bg-card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="mt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Our Story</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From a small idea to a growing community.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {story.map((s) => (
            <div key={s.year} className="relative rounded-xl border border-border bg-card p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2.5 py-1 text-xs font-medium text-emerald">
                {s.year}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APPROACH & TEAM */}
      <section className="mt-24 grid gap-10 rounded-2xl bg-secondary/40 p-8 md:grid-cols-2 md:p-12">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Our approach</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We believe growth is built through consistency, not intensity. Every Mivora Academy program is
            designed by certified coaches and structured around short, daily sessions that fit real
            schedules.
          </p>
          <ul className="mt-6 space-y-3">
            {["Evidence-based program design", "Short daily sessions (10–35 min)", "Personalized progress tracking", "Supportive community of peers"].map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-emerald shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Who it's for</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Beginners building a first habit. Practitioners returning after a break. Professionals
            looking for calm in a busy schedule. Anyone who wants a calmer, more disciplined daily routine.
          </p>
          <ul className="mt-6 space-y-3">
            {["Busy professionals seeking balance", "Fitness beginners building their first habit", "Wellness practitioners returning after a break", "Anyone craving calm & consistency"].map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-emerald shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TEAM HIGHLIGHTS */}
      <section className="mt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Why Mivora</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built by experts, backed by science.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {teamHighlights.map((t) => (
            <div key={t.title} className="hover-lift rounded-xl border border-border bg-card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 overflow-hidden rounded-2xl bg-primary px-6 py-14 text-primary-foreground sm:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Become part of the story.
            </h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Join thousands of members who have made Mivora Academy a part of their daily routine.
              Start with a free week — no card required.
            </p>
          </div>
          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {["Daily live sessions", "Full program library", "Certified coaches", "No card required"].map((i) => (
              <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald" /> {i}</li>
            ))}
          </ul>
          <div className="lg:col-span-2">
            <Button asChild size="lg" className="bg-orange text-orange-foreground hover:bg-orange/90">
              <Link to="/signup">Get started free <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
