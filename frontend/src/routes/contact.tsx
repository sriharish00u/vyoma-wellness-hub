import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, MapPin, MessageCircle, Check, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

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

const defaultContacts = [
  { icon: Mail, title: "Email", value: "hello@vyomawellness.com" },
  { icon: MessageCircle, title: "Support", value: "support@vyomawellness.com" },
  { icon: MapPin, title: "Studio", value: "Bengaluru, India" },
];

type ContactInfo = { email: string; support: string; studio: string };

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ email: "hello@vyomawellness.com", support: "support@vyomawellness.com", studio: "Bengaluru, India" });
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<ContactInfo>(contactInfo);
  const [saving, setSaving] = useState(false);
  const isAdmin = auth.isAdmin();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api.settings.get("contact").then((res) => {
      if (res.value) setContactInfo(res.value as ContactInfo);
    }).catch(() => {});
  }, []);

  const contacts = defaultContacts.map((c) => {
    if (c.title === "Email") return { ...c, value: contactInfo.email };
    if (c.title === "Support") return { ...c, value: contactInfo.support };
    if (c.title === "Studio") return { ...c, value: contactInfo.studio };
    return c;
  });

  const handleEdit = () => {
    setEditData(contactInfo);
    setEditOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.settings.update("contact", editData);
      setContactInfo(editData);
      toast.success("Contact info updated");
      setEditOpen(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

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
          {contacts.map((c) => (
            <div key={c.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.value}</p>
              </div>
              {isAdmin && c.title === "Email" && (
                <button onClick={handleEdit} className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground hover:text-foreground self-start shrink-0" title="Edit contact info">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
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
              <button
                onClick={() => setSent(false)}
                className="mt-5 text-sm font-medium text-primary hover:underline"
              >
                Send another message →
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required placeholder="Your name" {...register("name")} aria-invalid={!!errors.name} />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="you@example.com" {...register("email")} aria-invalid={!!errors.email} />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required placeholder="What is this about?" {...register("subject")} aria-invalid={!!errors.subject} />
                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required placeholder="How can we help?" rows={6} {...register("message")} aria-invalid={!!errors.message} />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
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

      <Dialog open={editOpen} onOpenChange={(o) => !o && setEditOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Contact Info</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ce-email">Email</Label>
              <Input id="ce-email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ce-support">Support</Label>
              <Input id="ce-support" value={editData.support} onChange={(e) => setEditData({ ...editData, support: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ce-studio">Studio</Label>
              <Input id="ce-studio" value={editData.studio} onChange={(e) => setEditData({ ...editData, studio: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">{saving ? "Saving…" : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
