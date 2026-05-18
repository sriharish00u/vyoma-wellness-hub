import { createRootRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router"
import { Component, useState, type ReactNode } from "react"
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query"

import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { auth } from "@/lib/auth"
import { toast } from "sonner"

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: RootComponent,
})

function SetupDialog() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const user = auth.getUser();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user?.needsSetup) return null;

  const handleSubmit = async () => {
    if (name.length < 2) { toast.error("Name must be at least 2 characters"); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setSaving(true);
    try {
      const res = await api.auth.setup({ name, password });
      auth.setSession(res.token, res.user);
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Account setup complete");
      navigate({ to: "/" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!user?.needsSetup} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Complete your account</DialogTitle>
          <DialogDescription>Set your name and a new password to continue.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="setup-name">Full name</Label>
            <Input id="setup-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setup-password">New password</Label>
            <Input id="setup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setup-confirm">Repeat password</Label>
            <Input id="setup-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
          </div>
          <Button onClick={handleSubmit} disabled={saving} className="w-full bg-primary text-primary-foreground">
            {saving ? "Saving…" : "Complete setup"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-8">
          <div className="max-w-md text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">An unexpected error occurred. Please try again.</p>
            <Button
              onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }}
              className="mt-6"
            >
              Go home
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
      <SetupDialog />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
