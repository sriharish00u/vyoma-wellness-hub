import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Clock, Copy, ExternalLink, Youtube, Plus } from "lucide-react";
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
      { title: "Events — Vyoma Wellness" },
      { name: "description", content: "Join yoga, fitness, breathwork, meditation and motivation events." },
      { name: "description", content: "Join yoga, fitness, breathwork, meditation and motivation events." },
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
      <header className="max-w-2xl animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Events</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Events & Workshops
        </h1>
        <p className="mt-4 text-muted-foreground">
          Join live events, workshops, and challenges.
        </p>
      </header>

      <div className="mt-10 flex gap-2">
        {(["upcoming", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-display text-xl font-semibold text-foreground capitalize">{tab} Events</h2>
          {isAdmin && (
            <button onClick={() => setCreateTarget("event")} className="grid h-6 w-6 place-items-center rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90" title="Add event">
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {eLoad ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 font-display text-lg font-semibold text-foreground">
              No {tab} events
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {tab === "upcoming" ? "Check back soon for upcoming events." : "Completed event recordings will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <article key={e._id} className="relative group rounded-xl border border-border bg-card p-6 hover-lift">
                <AdminCardActions entity="event" itemId={e._id} queryKey={["events", tab]} onEdit={() => setEditEvent(e)} />
                <div className="flex gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground capitalize">{e.type}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${e.mode === "online" ? "bg-blue-500/10 text-blue-500" : "bg-orange/10 text-orange"}`}>
                    {e.mode === "online" ? "Online" : "Offline"}
                  </span>
                  {e.status === "live" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2.5 py-1 text-xs font-medium text-emerald">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{e.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(e.scheduledAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{e.durationMin} min</span>
                </div>
                {tab === "upcoming" && e.mode === "online" && e.joinLink ? (
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <a href={e.joinLink} target="_blank" rel="noopener noreferrer">Join <ExternalLink className="ml-1 h-3.5 w-3.5" /></a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyLink(e.joinLink)}><Copy className="h-3.5 w-3.5" /></Button>
                  </div>
                ) : tab === "upcoming" && e.mode === "offline" && e.place ? (
                  <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>📍</span>
                    <span>{e.place}</span>
                  </div>
                ) : tab === "completed" && e.recordingUrl ? (
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" className={isYouTube(e.recordingUrl) ? "bg-orange text-orange-foreground hover:bg-orange/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}>
                      <a href={e.recordingUrl} target="_blank" rel="noopener noreferrer">
                        {isYouTube(e.recordingUrl) ? <><Youtube className="mr-1 h-3.5 w-3.5" /> Watch</> : "Recording"}
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyLink(e.recordingUrl)}><Copy className="h-3.5 w-3.5" /></Button>
                  </div>
                ) : tab === "completed" && e.mode === "offline" && e.place ? (
                  <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>📍</span>
                    <span>{e.place}</span>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-secondary/50 p-6">
        <p className="text-sm text-muted-foreground">New to Vyoma? Start with a free week and find your rhythm.</p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/signup">Start free week</Link>
        </Button>
      </div>

      {createTarget === "event" && <EventFormDialog event={null} onClose={() => setCreateTarget(null)} />}
      {editEvent && <EventFormDialog event={editEvent} onClose={() => setEditEvent(null)} />}
    </div>
  );
}
