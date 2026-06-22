import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, Pencil, Plus, Trash2, ArrowRight, Star, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { plans as staticPlans } from "@/data/content";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Mivora Academy" },
      { name: "description", content: "Simple, transparent pricing for Mivora Academy members." },
    ],
  }),
  component: PricingPage,
});

type Plan = { name: string; price: string; period: string; features: string[]; cta: string; highlight: boolean };

function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>(staticPlans);
  const [editOpen, setEditOpen] = useState(false);
  const [editPlans, setEditPlans] = useState<Plan[]>([]);
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [annual, setAnnual] = useState(false);
  const isAdmin = auth.isAdmin();

  useEffect(() => {
    api.settings.get("pricing").then((res) => {
      if (res.value) setPlans(res.value as Plan[]);
    }).catch(() => {});
  }, []);

  const handleEdit = () => {
    setEditPlans(plans.map((p) => ({ ...p, features: [...p.features] })));
    setEditFeatures(plans.map((p) => p.features.join("\n")));
    setEditOpen(true);
  };

  const updatePlan = (idx: number, field: keyof Plan, value: unknown) => {
    setEditPlans((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };

  const addPlan = () => {
    setEditPlans((prev) => [...prev, { name: "", price: "", period: "", features: [], cta: "Sign up", highlight: false }]);
    setEditFeatures((prev) => [...prev, ""]);
  };

  const removePlan = (idx: number) => {
    setEditPlans((prev) => prev.filter((_, i) => i !== idx));
    setEditFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const finalPlans = editPlans.map((p, i) => ({
        ...p,
        features: editFeatures[i].split("\n").map((f) => f.trim()).filter(Boolean),
      }));
      await api.settings.update("pricing", finalPlans);
      setPlans(finalPlans);
      toast.success("Pricing updated");
      setEditOpen(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const reasons = [
    { icon: Star, title: "Top-rated platform", desc: "4.9 average rating from thousands of members across India." },
    { icon: Users, title: "Community-driven", desc: "Practice alongside a supportive community and certified coaches." },
    { icon: Shield, title: "Cancel anytime", desc: "No long-term contracts. Pause or cancel whenever you need." },
  ];

  const faq = [
    { q: "Can I try before I buy?", a: "Yes. Start with a free week of live sessions and full library access — no card required." },
    { q: "Can I switch plans?", a: "Upgrade or downgrade anytime. Changes take effect at the start of your next billing cycle." },
    { q: "Is there a discount for annual plans?", a: "Yes! The Annual plan gives you two months free compared to the monthly Member plan." },
    { q: "What if I miss a session?", a: "All live sessions are recorded. You can catch up anytime from the library." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* HERO */}
      <header className="mx-auto max-w-2xl text-center animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          Free week included — no card required
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Simple plans,<br />
          <span className="text-emerald">real practice.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto">
          Get started with a free week. Upgrade only when you are ready.
          No hidden fees, no long-term contracts.
        </p>
      </header>

      {/* PLANS */}
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`hover-lift flex flex-col rounded-2xl border p-8 ${
              p.highlight ? "border-primary bg-primary text-primary-foreground relative" : "border-border bg-card"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-orange px-3 py-1 text-xs font-medium text-orange-foreground">
                <Star className="h-3 w-3 fill-current" />
                Most popular
              </span>
            )}
            <p className={`text-sm font-semibold uppercase tracking-widest ${p.highlight ? "text-emerald-foreground" : "text-emerald"}`}>
              {p.name}
            </p>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold">{p.price}</span>
              <span className={p.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}>{p.period}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${p.highlight ? "text-emerald" : "text-emerald"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`mt-8 ${
                p.highlight
                  ? "bg-orange text-orange-foreground hover:bg-orange/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <Link to="/signup">{p.cta} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        ))}
      </div>

      {/* ADMIN EDIT BUTTON */}
      {isAdmin && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" size="sm" onClick={handleEdit} className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Edit pricing plans
          </Button>
        </div>
      )}

      {/* WHY CHOOSE US */}
      <section className="mt-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Why Mivora Academy</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            More than just a platform.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="hover-lift rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Got questions? We have answers.
          </h2>
        </div>
        <div className="mt-12 mx-auto max-w-3xl space-y-4">
          {faq.map((item) => (
            <details key={item.q} className="group rounded-xl border border-border bg-card">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-medium text-foreground">
                {item.q}
                <span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-border px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 overflow-hidden rounded-2xl bg-primary px-6 py-14 text-primary-foreground sm:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Start your free week today.
            </h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Full access to live sessions, program library, and community. No card required — cancel anytime.
            </p>
          </div>
          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {["7 days free access", "All programs included", "Live & recorded sessions", "Cancel anytime"].map((i) => (
              <li key={i} className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald" /> {i}</li>
            ))}
          </ul>
          <div className="lg:col-span-2">
            <Button asChild size="lg" className="bg-orange text-orange-foreground hover:bg-orange/90">
              <Link to="/signup">Start free trial <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ADMIN EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={(o) => !o && setEditOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pricing Plans</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {editPlans.map((p, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plan {idx + 1}</span>
                  <button onClick={() => removePlan(idx)} className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Name</Label>
                    <Input value={p.name} onChange={(e) => updatePlan(idx, "name", e.target.value)} placeholder="Starter" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">CTA</Label>
                    <Input value={p.cta} onChange={(e) => updatePlan(idx, "cta", e.target.value)} placeholder="Get started" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Price</Label>
                    <Input value={p.price} onChange={(e) => updatePlan(idx, "price", e.target.value)} placeholder="₹499" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Period</Label>
                    <Input value={p.period} onChange={(e) => updatePlan(idx, "period", e.target.value)} placeholder="/ month" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Features (one per line)</Label>
                  <Textarea
                    value={editFeatures[idx] ?? ""}
                    onChange={(e) => setEditFeatures((prev) => prev.map((s, i) => (i === idx ? e.target.value : s)))}
                    placeholder="Daily live sessions&#10;Full library..."
                    rows={4}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={p.highlight} onChange={(e) => updatePlan(idx, "highlight", e.target.checked)} className="rounded" />
                  Highlight (featured plan)
                </label>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addPlan} className="gap-1.5 w-full">
              <Plus className="h-4 w-4" /> Add Plan
            </Button>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
