import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Start free — Vyoma Wellness" }, { name: "description", content: "Create your Vyoma Wellness account." }] }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16">
      <div className="animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Start free</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Seven days. Daily practice. No card.
        </h1>
        <ul className="mt-8 space-y-3 text-sm text-foreground">
          {["Daily live sessions","Full program library","Coach Q&A","Habit tracker","Cancel anytime"].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald text-emerald-foreground">
                <Check className="h-3 w-3" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 animate-fade-up">
        <h2 className="font-display text-xl font-semibold">Create your account</h2>
        <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required placeholder="At least 8 characters" />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Create account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already a member? <Link to="/login" className="font-medium text-foreground hover:text-primary">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
