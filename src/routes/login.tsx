import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Vyoma Wellness" }, { name: "description", content: "Login to Vyoma Wellness." }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-8 animate-fade-up">
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue your practice.</p>
        <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Sign in</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Vyoma? <Link to="/signup" className="font-medium text-foreground hover:text-primary">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
