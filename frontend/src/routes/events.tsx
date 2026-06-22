import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Clock, Copy, ExternalLink, Youtube, Plus, ArrowRight, Users, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { AdminCardActions, EventFormDialog } from "@/components/AdminOverlay";
import type { Event } from "@/lib/api";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Mivora Academy" },
      { name: "description", content: "Join yoga, fitness, breathwork, meditation and motivation events at Mivora Academy." },
    ],
  }),
  component: EventsPage,
});

type Tab = "upcoming" | "completed";

function EventsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [createTarget, setCreateTarget] = useState<"event" | null>(null);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const isAdmin = auth.isAdmin();

  const { data: events = [], isLoading: eLoad } = useQuery({
    queryKey: ["events", tab],
    queryFn: () => api.events.list(tab),
  });

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied"));
  };

  const isYouTube = (url: string) => /youtube\.com|youtu\.be/i.test(url);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* HERO */}
      <header className="max-w-4xl animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          New workshops added weekly
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Events & Workshops<br />
          <span className="text-emerald">to keep you growing.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Join live yoga sessions, guided meditations, breathwork workshops, fitness challenges,
          and motivational talks — led by expert coaches in real time.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/signup">Join an event <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/pricing">View membership</Link>
          </Button>
        </div>
      </header>

      {/* EVENT STATS */}
      <section className="mt-20 grid grid-cols-2 gap-y-8 rounded-2xl border border-border bg-secondary/50 px-6 py-10 sm:grid-cols-4 sm:px-10">
        {[
          { icon: Calendar, value: "12+", label: "Events / month" },
          { icon: Users, value: "200+", label: "Avg. attendees" },
          { icon: Sparkles, value: "4.9", label: "Avg. rating" },
          { icon: Clock, value: "35 min", label: "Avg. duration" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary">
              <s.icon className="h-4 w-4" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">{s.value}</p>
            <p className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      {/* TAB FILTERS */}
      <div className="mt-14 flex gap-2">
        {(["upcoming", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition-all ${
              tab === t
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* EVENTS GRID */}
      <section className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground capitalize">{tab} Events</h2>
          {isAdmin && (
            <button
              onClick={() => setCreateTarget("event")}
              className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors"
              title="Add event"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {eLoad ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-14 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-5 font-display text-xl font-semibold text-foreground">
              No {tab} events
            </p>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
              {tab === "upcoming"
                ? "Check back soon for upcoming events. New workshops are added every week."
                : "Completed event recordings and resources will appear here."}
            </p>
            {tab === "upcoming" && (
              <Button asChild variant="outline" className="mt-6">
                <Link to="/signup">Get notified <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <article key={e._id} className="relative group flex flex-col rounded-xl border border-border bg-card p-6 hover-lift transition-all">
                <AdminCardActions entity="event" itemId={e._id} queryKey={["events", tab]} onEdit={() => setEditEvent(e)} />
                <div className="flex gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground capitalize">{e.type}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    e.mode === "online" ? "bg-blue-500/10 text-blue-500" : "bg-orange/10 text-orange"
                  }`}>
                    {e.mode === "online" ? "Online" : "Offline"}
                  </span>
                  {e.status === "live" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2.5 py-1 text-xs font-medium text-emerald">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{e.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(e.scheduledAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {e.durationMin} min
                  </span>
                  {e.mode === "offline" && e.place && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {e.place}
                    </span>
                  )}
                </div>
                <div className="mt-5 pt-4 border-t border-border">
                  {tab === "upcoming" && e.mode === "online" && e.joinLink ? (
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <a href={e.joinLink} target="_blank" rel="noopener noreferrer">Join <ExternalLink className="ml-1 h-3.5 w-3.5" /></a>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyLink(e.joinLink)}><Copy className="h-3.5 w-3.5" /></Button>
                    </div>
                  ) : tab === "upcoming" && e.mode === "offline" ? (
                    <p className="text-xs text-muted-foreground">📍 {e.place}</p>
                  ) : tab === "completed" && e.recordingUrl ? (
                    <div className="flex gap-2">
                      <Button asChild size="sm" className={isYouTube(e.recordingUrl) ? "bg-orange text-orange-foreground hover:bg-orange/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}>
                        <a href={e.recordingUrl} target="_blank" rel="noopener noreferrer">
                          {isYouTube(e.recordingUrl) ? <><Youtube className="mr-1 h-3.5 w-3.5" /> Watch recording</> : "View recording"}
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyLink(e.recordingUrl)}><Copy className="h-3.5 w-3.5" /></Button>
                    </div>
                  ) : tab === "completed" && e.mode === "offline" ? (
                    <p className="text-xs text-muted-foreground">📍 {e.place}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mt-24 overflow-hidden rounded-2xl bg-primary px-6 py-14 text-primary-foreground sm:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Never miss an event.
            </h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Become a member and get access to all live events, workshop recordings, and exclusive community sessions.
            </p>
          </div>
          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {["Unlimited live events", "Workshop recordings", "Member-only workshops", "Cancel anytime"].map((i) => (
              <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald" /> {i}</li>
            ))}
          </ul>
          <div className="lg:col-span-2">
            <Button asChild size="lg" className="bg-orange text-orange-foreground hover:bg-orange/90">
              <Link to="/signup">Become a member <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ADMIN DIALOGS */}
      {createTarget === "event" && <EventFormDialog event={null} onClose={() => setCreateTarget(null)} />}
      {editEvent && <EventFormDialog event={editEvent} onClose={() => setEditEvent(null)} />}
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
