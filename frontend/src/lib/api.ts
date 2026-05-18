const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

function getToken() {
  return localStorage.getItem("vyoma_token");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const { headers: initHeaders, ...restInit } = init ?? {};
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(initHeaders as Record<string, string> | undefined),
    },
    ...restInit,
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
    setup: (data: { name: string; password: string }) =>
      request<{ token: string; user: AuthUser }>("/auth/setup", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  programs: {
    list: (tag?: string) =>
      request<Program[]>(`/programs${tag && tag !== "All" ? `?tag=${tag}` : ""}`),
    get: (slug: string) => request<Program>(`/programs/${slug}`),
    create: (data: ProgramInput) =>
      request<Program>("/programs", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<ProgramInput>) =>
      request<Program>(`/programs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/programs/${id}`, { method: "DELETE" }),
  },
  contact: {
    send: (data: { name: string; email: string; subject: string; message: string }) =>
      request<{ success: boolean; message: string }>("/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  admin: {
    users: (page = 1) =>
      request<{ users: AdminUser[]; total: number; page: number; pages: number }>(`/admin/users?page=${page}`),
    contacts: (page = 1) =>
      request<{ contacts: ContactMessage[]; total: number; page: number; pages: number }>(`/admin/contacts?page=${page}`),
    verifyUser: (id: string) =>
      request<{ id: string; isVerified: boolean }>(`/admin/users/${id}/verify`, { method: "PATCH" }),
    banUser: (id: string) =>
      request<{ id: string; isBanned: boolean }>(`/admin/users/${id}/ban`, { method: "PATCH" }),
    deleteUser: (id: string) =>
      request<{ success: boolean }>(`/admin/users/${id}?confirm=true`, { method: "DELETE" }),
    updatePlan: (id: string, plan: string) =>
      request<AdminUser>(`/admin/users/${id}/plan`, { method: "PATCH", body: JSON.stringify({ plan }) }),
    create: (data: { name: string; email: string; password: string; role?: string }) =>
      request<AdminUser>("/admin/users", { method: "POST", body: JSON.stringify(data) }),
  },
  sessions: {
    list: () => request<Session[]>("/sessions"),
    get: (id: string) => request<Session>(`/sessions/${id}`),
    create: (data: Partial<Session>) =>
      request<Session>("/sessions", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Session>) =>
      request<Session>(`/sessions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/sessions/${id}`, { method: "DELETE" }),
  },
  stats: {
    get: () => request<Stats>("/admin/stats"),
  },
  quotes: {
    list: () => request<Quote[]>("/quotes"),
    create: (text: string) => request<Quote>("/quotes", { method: "POST", body: JSON.stringify({ text }) }),
    delete: (id: string) => request<{ success: boolean }>(`/quotes/${id}`, { method: "DELETE" }),
  },
  settings: {
    get: (key: string) => request<{ key: string; value: unknown }>(`/settings?key=${key}`),
    update: (key: string, value: unknown) =>
      request<{ key: string; value: unknown }>(`/settings/${key}`, { method: "PUT", body: JSON.stringify({ value }) }),
  },
  events: {
    list: (status?: string) =>
      request<Event[]>(`/events${status ? `?status=${status}` : ""}`),
    get: (id: string) => request<Event>(`/events/${id}`),
    create: (data: Partial<Event>) =>
      request<Event>("/events", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Event>) =>
      request<Event>(`/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    attachRecording: (id: string, recordingUrl: string) =>
      request<Event>(`/events/${id}/recording`, { method: "PATCH", body: JSON.stringify({ recordingUrl }) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/events/${id}`, { method: "DELETE" }),
  },
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "starter" | "member" | "annual";
  streak?: number;
  sessionsCompleted?: number;
  isVerified?: boolean;
  needsSetup?: boolean;
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
  order: number;
};

export type ProgramInput = {
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "All levels";
  duration: string;
  tag: "Yoga" | "Fitness" | "Breathwork" | "Meditation" | "Motivation";
  desc: string;
  icon: string;
  order?: number;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: string;
  streak: number;
  sessionsCompleted: number;
  createdAt: string;
  isVerified: boolean;
  isBanned: boolean;
};

export type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type Session = {
  _id: string;
  title: string;
  description: string;
  programSlug: string;
  coach: string;
  scheduledAt: string;
  durationMin: number;
  joinLink: string;
  isLive: boolean;
  order: number;
};

export type Event = {
  _id: string;
  title: string;
  description: string;
  type: "workshop" | "challenge" | "webinar" | "community";
  scheduledAt: string;
  durationMin: number;
  mode: "online" | "offline";
  joinLink: string;
  place: string;
  status: "upcoming" | "live" | "completed";
  recordingUrl: string;
  coverImage: string;
  order: number;
};

export type Stats = {
  users: number;
  admins: number;
  verified: number;
  sessions: number;
  programs: number;
  events: number;
  daysSinceLaunch: number;
};

export type Quote = {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
};
