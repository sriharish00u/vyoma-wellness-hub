import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vyoma Wellness" },
      { name: "description", content: "Get in touch with the Vyoma Wellness team." },
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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
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
          onSubmit={handleSubmit(onSubmit)}
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
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required placeholder="What is this about?" {...register("subject")} aria-invalid={!!errors.subject} />
                {errors.subject && (
                  <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required placeholder="How can we help?" rows={6} {...register("message")} aria-invalid={!!errors.message} />
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting} className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Sending…
                  </span>
                ) : "Send message"}
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
