import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Globe,
  Smartphone,
  Share2,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  Palette,
  Code,
  Rocket,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/site/FAQSection";

export const Route = createFileRoute("/technical-services")({
  head: () => ({
    meta: [
      { title: "Technical Services — Mivora Academy" },
      {
        name: "description",
        content:
          "Website creation, app development, social media maintenance and digital marketing services at Mivora Academy.",
      },
    ],
  }),
  component: TechnicalServicesPage,
});

const techFAQs = [
  {
    question: "What technical services does Mivora Academy offer?",
    answer:
      "We offer four core services: Website Creation (custom responsive websites with modern frameworks), App Development (cross-platform mobile apps for iOS and Android), Social Media Maintenance (content creation, scheduling, community management), and Digital Marketing (SEO, paid ads, email marketing, conversion optimization).",
  },
  {
    question: "Do you build mobile apps?",
    answer:
      "Yes. We develop cross-platform mobile applications for both iOS and Android using React Native and Flutter. Our apps deliver native-quality experiences with efficient development timelines.",
  },
  {
    question: "How much do technical services cost?",
    answer:
      "We offer free consultations to understand your project needs. Pricing depends on scope, complexity, and timeline. We provide transparent quotes with no hidden fees and work within your budget.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer:
      "Yes. We offer post-launch support, maintenance, and optimization. Most of our client relationships last an average of 3 years, with ongoing updates and improvements.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines vary by project scope. A landing page may take 1–2 weeks, while a full-scale platform or mobile app may take 2–4 months. We work in agile sprints with regular check-ins.",
  },
];

function TechnicalServicesPage() {
  const services = [
    {
      icon: Globe,
      title: "Website Creation",
      tag: "Frontend & Backend",
      desc: "Custom websites built with modern frameworks. Responsive, fast, and tailored to your brand — from landing pages to full-scale platforms with CMS integration.",
      features: [
        "Responsive design for all devices",
        "SEO-optimized architecture",
        "CMS integration (Sanity, Strapi)",
        "Performance-first development",
      ],
    },
    {
      icon: Smartphone,
      title: "App Development",
      tag: "iOS & Android",
      desc: "Cross-platform mobile applications for iOS and Android. Native-quality experiences built efficiently using React Native, Flutter, and modern mobile tooling.",
      features: [
        "Cross-platform development",
        "Native device API integration",
        "App store deployment",
        "Ongoing maintenance & updates",
      ],
    },
    {
      icon: Share2,
      title: "Social Media Maintenance",
      tag: "Content & Community",
      desc: "End-to-end social media management — content creation, scheduling, community engagement, and performance analytics. Keep your presence active without the daily effort.",
      features: [
        "Content calendar management",
        "Community engagement & moderation",
        "Analytics & monthly reports",
        "Brand voice consistency",
      ],
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      tag: "Growth & Strategy",
      desc: "Data-driven marketing that connects your brand with the right audience. SEO, paid advertising, email campaigns, and comprehensive growth strategy.",
      features: [
        "Search engine optimization (SEO)",
        "Paid ad management (Google, Meta)",
        "Email marketing automation",
        "Conversion rate optimization",
      ],
    },
  ];

  const process = [
    {
      icon: Lightbulb,
      title: "Discover",
      desc: "We learn about your vision, audience, and goals. This foundation ensures every decision serves your real objectives.",
    },
    {
      icon: Palette,
      title: "Design",
      desc: "Wireframes, prototypes, and visual design that align with your brand and delight your users from the first click.",
    },
    {
      icon: Code,
      title: "Build & Develop",
      desc: "Agile development with regular check-ins. You see progress every step of the way, not just at the end.",
    },
    {
      icon: Rocket,
      title: "Launch & Scale",
      desc: "Deployment, testing, and post-launch support. We stay with you to optimize, maintain, and grow your digital presence.",
    },
  ];

  const reasons = [
    { value: "50+", label: "Projects delivered" },
    { value: "98%", label: "Client satisfaction" },
    { value: "4.9", label: "Average rating" },
    { value: "3 yrs", label: "Avg. client relationship" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* HERO */}
      <header className="max-w-4xl animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          Free consultation — let's discuss your project
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Technology that moves
          <br />
          <span className="text-emerald">your vision forward.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          From websites and mobile apps to social media management and digital marketing — we
          provide end-to-end technical services that help you build, grow, and scale your digital
          presence.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/contact">
              Get a free quote <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contact">Talk to our team</Link>
          </Button>
        </div>
      </header>

      {/* STATS */}
      <section className="mt-20 grid grid-cols-2 gap-y-8 rounded-2xl border border-border bg-secondary/50 px-6 py-10 sm:grid-cols-4 sm:px-10">
        {reasons.map((r) => (
          <div key={r.label} className="text-center">
            <p className="font-display text-3xl font-bold text-foreground sm:text-4xl">{r.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              {r.label}
            </p>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section className="mt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
            Our Services
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to grow online.
          </h2>
          <p className="mt-4 text-muted-foreground">
            From the first line of code to the last click of a campaign — we cover your entire
            digital ecosystem.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="group hover-lift flex flex-col rounded-xl border border-border bg-card p-6 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                  {s.tag}
                </span>
              </div>
              <div className="mt-5 grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <ul className="mt-4 grid grid-cols-2 gap-1.5">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-emerald shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-foreground group-hover:text-emerald transition-colors">
                Learn more <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="mt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
            Our Process
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From idea to impact — in four steps.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((s, i) => (
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
      <FAQSection title="Technical Services FAQs" items={techFAQs} jsonLdId="faq-tech" />

      {/* CTA */}
      <section className="mt-24 overflow-hidden rounded-2xl bg-primary px-6 py-14 text-primary-foreground sm:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Let's build something great together.
            </h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Tell us about your project. We will give you a clear timeline, transparent pricing,
              and a plan that fits your budget.
            </p>
          </div>
          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              "Free consultation",
              "Transparent pricing",
              "Dedicated project manager",
              "Post-launch support",
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
              <Link to="/contact">
                Get your free quote <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
