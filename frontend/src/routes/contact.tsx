import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Check, Clock, Users, ArrowRight, Headphones } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { SOCIAL_LINKS } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mivora Academy" },
      { name: "description", content: "Get in touch with the Mivora Academy team." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

function ContactPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.contact.send(data);
      setSent(true);
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const stats = [
    { icon: Clock, value: "< 24 hrs", label: "Avg. response time" },
    { icon: Users, value: "5,000+", label: "Members served" },
    { icon: Headphones, value: "99%", label: "Satisfaction rate" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* HERO */}
      <header className="max-w-4xl animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          We usually reply within a day
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          We'd love to hear
          <br />
          <span className="text-emerald">from you.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Questions about programs, membership, partnerships, or technical services — our team is
          here to help. Reach out and we will get back to you within 24 hours.
        </p>
      </header>

      {/* STATS */}
      <section className="mt-14 grid grid-cols-3 gap-6 rounded-2xl border border-border bg-secondary/50 px-6 py-8 sm:px-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary">
              <s.icon className="h-4 w-4" />
            </div>
            <p className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl">
              {s.value}
            </p>
            <p className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* CONTACT INFO + FORM */}
      <div className="mt-14 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex gap-4 rounded-xl border border-border bg-card p-5 hover-lift transition-all">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">Email</p>
              <a href="mailto:mivoraacedamy@gmail.com" className="text-sm text-muted-foreground hover:text-foreground break-all">
                mivoraacedamy@gmail.com
              </a>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl border border-border bg-card p-5 hover-lift transition-all">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">Studio</p>
              <p className="text-sm text-muted-foreground">Bengaluru, India</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-sm font-semibold text-foreground">Working hours</h3>
            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <p>Mon – Fri: 6:00 AM – 8:00 PM IST</p>
              <p>Saturday: 7:00 AM – 6:00 PM IST</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-sm font-semibold text-foreground">Follow us</h3>
            <div className="mt-3 flex gap-3">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          {sent ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald text-emerald-foreground">
                <Check className="h-7 w-7" />
              </div>
              <p className="mt-5 font-display text-xl font-semibold text-foreground">
                Message received
              </p>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Thank you for reaching out. We typically respond within 24 hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Send another message <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Send us a message
                  </h2>
                  <p className="text-sm text-muted-foreground">We'd love to hear from you</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    required
                    placeholder="Your name"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  required
                  placeholder="What is this about?"
                  {...register("subject")}
                  aria-invalid={!!errors.subject}
                />
                {errors.subject && (
                  <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  placeholder="How can we help? Tell us about your inquiry..."
                  rows={6}
                  {...register("message")}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Sending…
                  </span>
                ) : (
                  <>
                    Send message <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
