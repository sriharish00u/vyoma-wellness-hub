import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
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
      { title: "Pricing — Vyoma Wellness" },
      { name: "description", content: "Simple, transparent pricing for Vyoma Wellness members." },
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-2xl text-center animate-fade-up">
        <div className="flex items-center justify-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Pricing</p>
          {isAdmin && (
            <button onClick={handleEdit} className="grid h-6 w-6 place-items-center rounded-md bg-secondary text-muted-foreground hover:text-foreground" title="Edit pricing">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Simple plans, real practice.
        </h1>
        <p className="mt-4 text-muted-foreground">Get started. Upgrade only when you're ready.</p>
      </header>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`hover-lift flex flex-col rounded-2xl border p-8 ${
              p.highlight ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
            }`}
          >
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
                  <Check className={`mt-0.5 h-4 w-4 ${p.highlight ? "text-emerald" : "text-emerald"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`mt-8 ${p.highlight ? "bg-orange text-orange-foreground hover:bg-orange/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
            >
              <Link to="/signup">{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>

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
