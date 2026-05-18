const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

function getToken() {
  return localStorage.getItem("vyoma_token");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      request<{ token: string; user: AuthUser }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => request<AuthUser>("/auth/me"),
  },
  programs: {
    list: (tag?: string) =>
      request<Program[]>(`/programs${tag && tag !== "All" ? `?tag=${tag}` : ""}`),
    get: (slug: string) => request<Program>(`/programs/${slug}`),
  },
  contact: {
    send: (data: { name: string; email: string; subject: string; message: string }) =>
      request<{ success: boolean; message: string }>("/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  plan: "starter" | "member" | "annual";
  streak?: number;
  sessionsCompleted?: number;
};

export type Program = {
  _id: string;
  slug: string;
  title: string;
  level: string;
  duration: string;
  tag: string;
  desc: string;
  icon: string;
};
