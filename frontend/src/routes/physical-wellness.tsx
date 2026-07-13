import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Wind, Heart, ArrowRight, Star, Sun, Moon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/site/FAQSection";

export const Route = createFileRoute("/physical-wellness")({
  head: () => ({
    meta: [
      { title: "Physical Wellness — Mivora Academy" },
      {
        name: "description",
        content:
          "Yoga, meditation and physical wellness programs at Mivora Academy — build strength, flexibility and inner calm.",
      },
    ],
  }),
  component: PhysicalWellnessPage,
});

const physicalFAQs = [
  {
    question: "What physical wellness programs does Mivora Academy offer?",
    answer:
      "We offer Yoga (Hatha and Vinyasa flows), Meditation (guided mindfulness sessions), and Holistic Fitness (breathwork, mobility drills, and bodyweight routines). Each program is designed by certified coaches for all levels.",
  },
  {
    question: "Do I need prior yoga or fitness experience?",
    answer:
      "No. All our physical wellness programs are designed for all levels — from complete beginners to experienced practitioners. Our coaches provide modifications for every body and every level.",
  },
  {
    question: "How long are the sessions?",
    answer:
      "Sessions range from 10 to 35 minutes. We believe short, consistent daily practice is more effective than occasional long sessions.",
  },
  {
    question: "What are the benefits of physical wellness at Mivora?",
    answer:
      "Members report 60% stress reduction in 30 days, 94% report better sleep, and the minimum session length for results is just 15 minutes. Our average member rating is 4.9.",
  },
  {
    question: "Can I do these programs at home?",
    answer:
      "Yes! All online sessions can be done from home. You just need a yoga mat and a quiet space. Our offline sessions are held at our studio in Bengaluru.",
  },
];

function PhysicalWellnessPage() {
  const programs = [
    {
      icon: Sparkles,
      title: "Yoga",
      tag: "Flexibility & Strength",
      audience: "All levels",
      desc: "Traditional and modern yoga practices to build flexibility, strength, and inner peace. Our sessions range from gentle Hatha to dynamic Vinyasa flows.",
      benefits: [
        "Improves posture & flexibility",
        "Builds core strength",
        "Reduces stress & anxiety",
        "Enhances body awareness",
      ],
    },
    {
      icon: Wind,
      title: "Meditation",
      tag: "Mindfulness & Calm",
      audience: "All levels",
      desc: "Guided meditation sessions designed to calm the mind, sharpen focus, and cultivate lasting mindfulness in your daily routine.",
      benefits: [
        "Boosts concentration",
        "Lowers stress levels",
        "Improves emotional health",
        "Enhances self-awareness",
      ],
    },
    {
      icon: Heart,
      title: "Holistic Fitness",
      tag: "Strength & Mobility",
      audience: "Beginner — Intermediate",
      desc: "Breathwork, mobility drills, and bodyweight routines that complement your wellness journey and build functional fitness for everyday life.",
      benefits: [
        "Improves cardiovascular health",
        "Increases mobility",
        "Builds functional strength",
        "Boosts energy levels",
      ],
    },
  ];

  const steps = [
    {
      icon: Sun,
      title: "Choose your practice",
      desc: "Pick from yoga, meditation or fitness — whatever fits your goal and mood for the day.",
    },
    {
      icon: Star,
      title: "Show up daily",
      desc: "Short, guided sessions from 10–35 minutes. Consistency over intensity, every single day.",
    },
    {
      icon: Moon,
      title: "Grow consistently",
      desc: "Track your streaks, feel the progress, and watch small daily habits transform your body and mind.",
    },
  ];

  const benefits = [
    { value: "60%", label: "Stress reduction in 30 days" },
    { value: "15 min", label: "Minimum session for results" },
    { value: "94%", label: "Members report better sleep" },
    { value: "4.9", label: "Average member rating" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* HERO */}
      <header className="max-w-4xl animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          30-day beginner challenge starting soon
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Strength in body.
          <br />
          <span className="text-emerald">Stillness in mind.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Move, breathe, and grow. Our physical wellness programs combine yoga, meditation, and
          fitness to help you build a body that feels alive and a mind that stays calm — no matter
          where you start.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/signup">
              Start your practice <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/pricing">View plans</Link>
          </Button>
        </div>
      </header>

      {/* STATS */}
      <section className="mt-20 grid grid-cols-2 gap-y-8 rounded-2xl border border-border bg-secondary/50 px-6 py-10 sm:grid-cols-4 sm:px-10">
        {benefits.map((b) => (
          <div key={b.label} className="text-center">
            <p className="font-display text-3xl font-bold text-foreground sm:text-4xl">{b.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              {b.label}
            </p>
          </div>
        ))}
      </section>

      {/* PROGRAMS */}
      <section className="mt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
            Our Programs
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Find the practice that moves you.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three pillars of physical wellness — each designed to meet you at your level and grow
            with you.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {programs.map((p) => (
            <div
              key={p.title}
              className="group hover-lift flex flex-col rounded-xl border border-border bg-card p-6 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                  {p.tag}
                </span>
                <span className="text-xs text-muted-foreground">{p.audience}</span>
              </div>
              <div className="mt-5 grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <ul className="mt-4 space-y-2">
                {p.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-foreground group-hover:text-emerald transition-colors">
                Explore {p.title} <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
            How It Works
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three steps to a stronger you.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-xl border border-border bg-card p-6">
              <span className="absolute -top-3 -left-3 grid h-8 w-8 place-items-center rounded-full bg-emerald text-xs font-bold text-emerald-foreground">
                {i + 1}
              </span>
              <div className="mt-2 grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQSection title="Physical Wellness FAQs" items={physicalFAQs} jsonLdId="faq-physical" />

      {/* CTA */}
      <section className="mt-24 overflow-hidden rounded-2xl bg-primary px-6 py-14 text-primary-foreground sm:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to move?
            </h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Start with a free week of live sessions, full library access, and a coach who knows
              your name.
            </p>
          </div>
          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              "Daily live sessions",
              "Full program library",
              "Habit tracker",
              "No card required",
            ].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald" /> {i}
              </li>
            ))}
          </ul>
          <div className="lg:col-span-2">
            <Button
              asChild
              size="lg"
              className="bg-orange text-orange-foreground hover:bg-orange/90"
            >
              <Link to="/signup">
                Get started free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
