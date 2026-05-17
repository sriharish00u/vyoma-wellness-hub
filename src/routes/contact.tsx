import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vyoma Wellness" },
      { name: "description", content: "Get in touch with the Vyoma Wellness team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Contact</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">We'd love to hear from you.</h1>
        <p className="mt-4 text-muted-foreground">Questions about programs, membership or partnerships — we usually reply within a day.</p>
      </header>

      <div className="mt-14 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-5">
          {[
            { icon: Mail, title: "Email", value: "hello@vyomawellness.com" },
            { icon: MessageCircle, title: "Support", value: "support@vyomawellness.com" },
            { icon: MapPin, title: "Studio", value: "Bengaluru, India" },
          ].map((c) => (
            <div key={c.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald text-emerald-foreground">
                <Check className="h-6 w-6" />
              </div>
              <p className="mt-4 font-display text-xl font-semibold">Message received</p>
              <p className="mt-1 text-sm text-muted-foreground">We'll get back to you shortly.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="you@example.com" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required placeholder="How can we help?" rows={6} />
              </div>
              <Button type="submit" className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Send message
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
