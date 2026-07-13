import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pushManager } from "@/lib/push";
import { auth } from "@/lib/auth";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

export function PushNotificationBanner() {
  const [visible, setVisible] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (!pushManager.isSupported()) return;
    if (pushManager.isDismissed()) return;
    if (!auth.isLoggedIn()) return;

    pushManager.getPermission().then((perm) => {
      if (perm === "default") {
        const timer = setTimeout(() => setVisible(true), 5000);
        return () => clearTimeout(timer);
      }
    });
  }, []);

  if (!visible) return null;

  const handleAllow = async () => {
    if (!VAPID_PUBLIC_KEY) {
      setVisible(false);
      return;
    }
    setSubscribing(true);
    const subscription = await pushManager.subscribe(VAPID_PUBLIC_KEY);
    if (subscription) {
      await pushManager.sendSubscriptionToServer(subscription);
    }
    setVisible(false);
    setSubscribing(false);
  };

  const handleDismiss = () => {
    pushManager.dismiss();
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-fade-up">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm font-semibold text-foreground">Stay updated</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Get notified about upcoming events, new programs, and community updates.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={handleAllow}
                disabled={subscribing}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
              >
                {subscribing ? "Enabling…" : "Enable notifications"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-xs text-muted-foreground"
              >
                Not now
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
