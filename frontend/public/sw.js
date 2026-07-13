self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "Mivora Academy", body: event.data.text() };
  }

  const options = {
    body: data.body || "New update from Mivora Academy",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    vibrate: [100, 50, 100],
    data: data.url || "/",
    actions: data.actions || [],
    tag: data.tag || "mivora-notification",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title || "Mivora Academy", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    }),
  );
});
