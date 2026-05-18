import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Start free — Vyoma Wellness" }, { name: "description", content: "Create your Vyoma Wellness account." }] }),
  component: SignupPage,
});

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

function SignupPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.auth.register(data);
      auth.setSession(res.token, res.user);
      toast.success(`Welcome, ${res.user.name}!`);
      navigate({ to: "/" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
    }
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required placeholder="Your name" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@example.com" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required placeholder="At least 8 characters" {...register("password")} aria-invalid={!!errors.password} />
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Creating account…
              </span>
            ) : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already a member? <Link to="/login" className="font-medium text-foreground hover:text-primary">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
