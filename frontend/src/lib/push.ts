const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const pushManager = {
  isSupported(): boolean {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  },

  async getPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return "denied";
    return Notification.permission;
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return "denied";
    return Notification.requestPermission();
  },

  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported()) return null;
    try {
      return await navigator.serviceWorker.register("/sw.js");
    } catch {
      return null;
    }
  },

  async subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (!this.isSupported()) return null;
    const permission = await this.requestPermission();
    if (permission !== "granted") return null;

    const registration = await this.registerServiceWorker();
    if (!registration) return null;

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      return subscription;
    } catch {
      return null;
    }
  },

  async sendSubscriptionToServer(subscription: PushSubscription): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const res = await fetch(`${API_URL}/push/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async unsubscribe(): Promise<boolean> {
    if (!this.isSupported()) return false;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return true;

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`${API_URL}/push/unsubscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      } catch {
        /* ignore */
      }
    }

    return subscription.unsubscribe();
  },

  isDismissed(): boolean {
    const dismissed = localStorage.getItem("push_dismissed");
    if (!dismissed) return false;
    const dismissedDate = new Date(dismissed);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return dismissedDate > thirtyDaysAgo;
  },

  dismiss(): void {
    localStorage.setItem("push_dismissed", new Date().toISOString());
  },
};
