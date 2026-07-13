import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  MessageCircle,
  BookOpen,
  ArrowRight,
  Compass,
  HeartHandshake,
  Target,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/site/FAQSection";

export const Route = createFileRoute("/mental-wellness")({
  head: () => ({
    meta: [
      { title: "Mental Wellness — Mivora Academy" },
      {
        name: "description",
        content:
          "Life skills, counseling and mental wellness programs at Mivora Academy — build resilience, clarity and emotional strength.",
      },
    ],
  }),
  component: MentalWellnessPage,
});

const mentalFAQs = [
  {
    question: "What is mental wellness at Mivora Academy?",
    answer:
      "Mental wellness at Mivora covers three pillars: Life Skills (emotional intelligence, communication, decision-making), Professional Counseling (one-on-one and group sessions with licensed professionals), and Mindfulness & Reflection (journaling, guided reflections, mindfulness exercises).",
  },
  {
    question: "How does meditation help with mental health?",
    answer:
      "Regular meditation practice has been shown to boost concentration, lower stress levels, improve emotional health, and enhance self-awareness. Our guided sessions make it easy to build a consistent practice.",
  },
  {
    question: "Do you offer professional counseling?",
    answer:
      "Yes. We offer one-on-one and group counseling sessions with licensed professionals. It's a safe, judgment-free space with complete confidentiality and personalized care plans.",
  },
  {
    question: "Is mental wellness suitable for beginners?",
    answer:
      "Absolutely. All our mental wellness programs are designed for all levels. Whether you're new to mindfulness or experienced in self-reflection, our coaches meet you where you are.",
  },
  {
    question: "What results can I expect?",
    answer:
      "85% of members report reduced anxiety, members experience 2x better emotional resilience, and 90% would recommend our programs to a friend. The average program rating is 4.8.",
  },
];

function MentalWellnessPage() {
  const programs = [
    {
      icon: Brain,
      title: "Life Skills",
      tag: "Personal Growth",
      audience: "Ages 16+",
      desc: "Practical skills for resilience, emotional intelligence, communication, and decision-making. Build the tools to navigate life with clarity and confidence.",
      benefits: [
        "Emotional intelligence mastery",
        "Effective communication",
        "Decision-making frameworks",
        "Stress management techniques",
      ],
    },
    {
      icon: MessageCircle,
      title: "Counseling",
      tag: "Professional Support",
      audience: "Confidential",
      desc: "One-on-one and group counseling sessions with licensed professionals. A safe, judgment-free space to explore thoughts, feelings, and personal growth.",
      benefits: [
        "Licensed counselors",
        "Flexible session formats",
        "Complete confidentiality",
        "Personalized care plans",
      ],
    },
    {
      icon: BookOpen,
      title: "Mindfulness & Reflection",
      tag: "Daily Practice",
      audience: "All levels",
      desc: "Journaling prompts, guided reflections, and mindfulness exercises to develop self-awareness, emotional balance, and a deeper connection with yourself.",
      benefits: [
        "Guided journaling",
        "Daily mindfulness prompts",
        "Emotional regulation",
        "Self-discovery tools",
      ],
    },
  ];

  const steps = [
    {
      icon: Compass,
      title: "Assess where you are",
      desc: "Start with a self-reflection or a chat with a counselor. Understand what you need and what you want to work on.",
    },
    {
      icon: HeartHandshake,
      title: "Learn & practice",
      desc: "Work through structured modules, counseling sessions, and daily mindfulness exercises at your own pace.",
    },
    {
      icon: Target,
      title: "Apply & grow",
      desc: "Take what you learn into your daily life. Build healthier relationships, stronger boundaries, and a calmer mind.",
    },
  ];

  const benefits = [
    { value: "85%", label: "Report reduced anxiety" },
    { value: "2x", label: "Better emotional resilience" },
    { value: "90%", label: "Would recommend to a friend" },
    { value: "4.8", label: "Average program rating" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* HERO */}
      <header className="max-w-4xl animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          Free introductory counseling session available
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          A healthy mind is the
          <br />
          <span className="text-emerald">foundation of everything.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Develop life skills, seek guidance through professional counseling, and build emotional
          resilience — because mental wellness matters as much as physical health. Start your
          journey to a clearer, calmer mind today.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/signup">
              Begin your journey <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/pricing">See programs</Link>
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
            Three pillars of mental wellness.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Whether you are building life skills, seeking counseling, or cultivating mindfulness —
            we have a path for you.
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
            Your path to a calmer mind.
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
      <FAQSection title="Mental Wellness FAQs" items={mentalFAQs} jsonLdId="faq-mental" />

      {/* CTA */}
      <section className="mt-24 overflow-hidden rounded-2xl bg-primary px-6 py-14 text-primary-foreground sm:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Your mind deserves care.
            </h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Start with a free introductory session. No commitment — just a conversation that could
              change everything.
            </p>
          </div>
          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              "Free introductory session",
              "Licensed counselors",
              "Flexible scheduling",
              "100% confidential",
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
                Start your journey <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
