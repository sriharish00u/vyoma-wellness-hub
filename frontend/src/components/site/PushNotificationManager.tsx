import { useEffect } from "react";
import { pushManager } from "@/lib/push";
import { PushNotificationBanner } from "./PushNotificationBanner";

export function PushNotificationManager() {
  useEffect(() => {
    if (pushManager.isSupported()) {
      pushManager.registerServiceWorker();
    }
  }, []);

  return <PushNotificationBanner />;
}
