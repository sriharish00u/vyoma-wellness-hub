import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Video, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { auth } from "@/lib/auth";
import { api, type Program, type ProgramInput, type Session, type Event } from "@/lib/api";

type EntityType = "program" | "session" | "event";

const programFormSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  title: z.string().min(3),
  level: z.enum(["Beginner", "Intermediate", "All levels"]),
  duration: z.string().min(2),
  tag: z.enum(["Yoga", "Fitness", "Breathwork", "Meditation", "Motivation"]),
  desc: z.string().min(10),
  icon: z.string().min(1),
  order: z.coerce.number().int().positive().optional(),
});

type ProgramFormData = z.infer<typeof programFormSchema>;

const sessionFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  programSlug: z.string().min(2),
  coach: z.string().min(2),
  scheduledAt: z.string().min(1, "Date/time required"),
  durationMin: z.coerce.number().int().positive(),
  joinLink: z.string().optional(),
  isLive: z.boolean().optional(),
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

const eventFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(["workshop", "challenge", "webinar", "community"]),
  scheduledAt: z.string().min(1),
  durationMin: z.coerce.number().int().positive(),
  mode: z.enum(["online", "offline"]),
  joinLink: z.string().optional(),
  place: z.string().optional(),
  status: z.enum(["upcoming", "live", "completed"]).optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

const PROGRAM_ICON_OPTIONS = ["Sunrise", "Dumbbell", "Wind", "Brain", "HeartPulse", "Sparkles", "Users", "ShieldCheck", "Trophy"];
const PROGRAM_LEVEL_OPTIONS = ["Beginner", "Intermediate", "All levels"] as const;
const PROGRAM_TAG_OPTIONS = ["Yoga", "Fitness", "Breathwork", "Meditation", "Motivation"] as const;
const EVENT_TYPE_OPTIONS = ["workshop", "challenge", "webinar", "community"] as const;
const EVENT_STATUS_OPTIONS = ["upcoming", "live", "completed"] as const;

// --- ProgramFormDialog ---

interface ProgramFormDialogProps {
  program: Program | null;
  onClose: () => void;
}

export function ProgramFormDialog({ program, onClose }: ProgramFormDialogProps) {
  const qc = useQueryClient();
  const isEdit = !!program;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProgramFormData>({
    resolver: zodResolver(programFormSchema),
    defaultValues: program
      ? { slug: program.slug, title: program.title, level: program.level as ProgramFormData["level"], duration: program.duration, tag: program.tag as ProgramFormData["tag"], desc: program.desc, icon: program.icon, order: program.order }
      : { level: "All levels", tag: "Yoga", icon: "Sunrise" },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProgramInput) => api.programs.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["programs"] }); toast.success("Program created"); onClose(); },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<ProgramInput>) => api.programs.update(program!._id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["programs"] }); toast.success("Program updated"); onClose(); },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (data: ProgramFormData) => {
    if (isEdit) updateMutation.mutate(data);
    else createMutation.mutate(data as ProgramInput);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Program" : "New Program"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-title">Title</Label>
              <Input id="p-title" placeholder="Morning Yoga Flow" {...register("title")} aria-invalid={!!errors.title} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-slug">Slug</Label>
              <Input id="p-slug" placeholder="morning-yoga" {...register("slug")} aria-invalid={!!errors.slug} />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-desc">Description</Label>
            <Input id="p-desc" placeholder="Short description..." {...register("desc")} aria-invalid={!!errors.desc} />
            {errors.desc && <p className="text-xs text-destructive">{errors.desc.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-tag">Category</Label>
              <select id="p-tag" {...register("tag")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {PROGRAM_TAG_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-level">Level</Label>
              <select id="p-level" {...register("level")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {PROGRAM_LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-duration">Duration</Label>
              <Input id="p-duration" placeholder="20 min" {...register("duration")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-icon">Icon</Label>
              <select id="p-icon" {...register("icon")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {PROGRAM_ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-order">Order</Label>
              <Input id="p-order" type="number" min={1} placeholder="7" {...register("order")} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground">
              {isSubmitting ? (isEdit ? "Saving…" : "Creating…") : isEdit ? "Save changes" : "Create program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- SessionFormDialog ---

interface SessionFormDialogProps {
  session: Session | null;
  onClose: () => void;
}

export function SessionFormDialog({ session, onClose }: SessionFormDialogProps) {
  const qc = useQueryClient();
  const isEdit = !!session;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: session ? {
      title: session.title, description: session.description, programSlug: session.programSlug,
      coach: session.coach, scheduledAt: new Date(session.scheduledAt).toISOString().slice(0, 16),
      durationMin: session.durationMin, joinLink: session.joinLink, isLive: session.isLive,
    } : { isLive: false },
  });

  const createMutation = useMutation({
    mutationFn: (data: SessionFormData) => api.sessions.create({ ...data, scheduledAt: new Date(data.scheduledAt).toISOString() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sessions"] }); toast.success("Session created"); onClose(); },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: SessionFormData) => api.sessions.update(session!._id, { ...data, scheduledAt: new Date(data.scheduledAt).toISOString() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sessions"] }); toast.success("Session updated"); onClose(); },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (data: SessionFormData) => {
    if (isEdit) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Session" : "New Session"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="s-title">Title</Label>
            <Input id="s-title" {...register("title")} aria-invalid={!!errors.title} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-description">Description</Label>
            <Textarea id="s-description" rows={3} {...register("description")} aria-invalid={!!errors.description} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-programSlug">Program Slug</Label>
              <Input id="s-programSlug" {...register("programSlug")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-coach">Coach</Label>
              <Input id="s-coach" {...register("coach")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-scheduledAt">Date & Time</Label>
              <Input id="s-scheduledAt" type="datetime-local" {...register("scheduledAt")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-durationMin">Duration (min)</Label>
              <Input id="s-durationMin" type="number" {...register("durationMin")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-joinLink">Join Link</Label>
            <Input id="s-joinLink" placeholder="https://zoom.us/..." {...register("joinLink")} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground">
              {isSubmitting ? "Saving…" : isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- EventFormDialog ---

interface EventFormDialogProps {
  event: Event | null;
  onClose: () => void;
}

export function EventFormDialog({ event, onClose }: EventFormDialogProps) {
  const qc = useQueryClient();
  const isEdit = !!event;

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event ? {
      title: event.title, description: event.description, type: event.type,
      scheduledAt: new Date(event.scheduledAt).toISOString().slice(0, 16),
      durationMin: event.durationMin, mode: event.mode,
      joinLink: event.joinLink, place: event.place, status: event.status,
    } : { type: "workshop", status: "upcoming", mode: "online" },
  });

  const watchMode = watch("mode");

  const createMutation = useMutation({
    mutationFn: (data: EventFormData) => api.events.create({ ...data, scheduledAt: new Date(data.scheduledAt).toISOString() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["events"] }); toast.success("Event created"); onClose(); },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: EventFormData) => api.events.update(event!._id, { ...data, scheduledAt: new Date(data.scheduledAt).toISOString() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["events"] }); toast.success("Event updated"); onClose(); },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (data: EventFormData) => {
    if (isEdit) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Event" : "New Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="e-title">Title</Label>
            <Input id="e-title" {...register("title")} aria-invalid={!!errors.title} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-description">Description</Label>
            <Textarea id="e-description" rows={3} {...register("description")} aria-invalid={!!errors.description} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="e-type">Type</Label>
              <select id="e-type" {...register("type")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {EVENT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-status">Status</Label>
              <select id="e-status" {...register("status")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {EVENT_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="e-scheduledAt">Date & Time</Label>
              <Input id="e-scheduledAt" type="datetime-local" {...register("scheduledAt")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-durationMin">Duration (min)</Label>
              <Input id="e-durationMin" type="number" {...register("durationMin")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-mode">Mode</Label>
            <select id="e-mode" {...register("mode")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          {watchMode === "online" ? (
            <div className="space-y-1.5">
              <Label htmlFor="e-joinLink">Meeting Link</Label>
              <Input id="e-joinLink" placeholder="https://zoom.us/..." {...register("joinLink")} />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="e-place">Place</Label>
              <Input id="e-place" placeholder="Studio name, address..." {...register("place")} />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground">
              {isSubmitting ? "Saving…" : isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- RecordingDialog ---

function RecordingDialog({ eventId, onClose }: { eventId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [url, setUrl] = useState("");

  const mutation = useMutation({
    mutationFn: (recordingUrl: string) => api.events.attachRecording(eventId, recordingUrl),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["events"] }); toast.success("Recording attached"); onClose(); },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach Recording</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recording-url">Recording URL</Label>
            <Input id="recording-url" placeholder="https://youtube.com/..." value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => mutation.mutate(url)} disabled={!url || mutation.isPending} className="bg-orange text-orange-foreground">
              {mutation.isPending ? "Saving…" : "Attach"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- AdminCardActions ---

interface AdminCardActionsProps {
  entity: EntityType;
  itemId: string;
  queryKey: string[];
  onEdit: () => void;
}

export function AdminCardActions({ entity, itemId, queryKey, onEdit }: AdminCardActionsProps) {
  const qc = useQueryClient();
  const [recordingOpen, setRecordingOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (entity === "program") return api.programs.delete(itemId);
      if (entity === "session") return api.sessions.delete(itemId);
      return api.events.delete(itemId);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey }); toast.success(`${entity} deleted`); },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!auth.isAdmin()) return null;

  return (
    <>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90"
          title="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="grid h-7 w-7 place-items-center rounded-md bg-destructive text-destructive-foreground shadow hover:bg-destructive/90"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {entity}?</AlertDialogTitle>
              <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMutation.mutate()} className="bg-destructive text-destructive-foreground">
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {entity === "event" && (
          <button
            onClick={(e) => { e.stopPropagation(); setRecordingOpen(true); }}
            className="grid h-7 w-7 place-items-center rounded-md bg-orange text-orange-foreground shadow hover:bg-orange/90"
            title="Add Recording"
          >
            <Video className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {recordingOpen && <RecordingDialog eventId={itemId} onClose={() => setRecordingOpen(false)} />}
    </>
  );
}

// --- AdminFloatingBar ---

interface AdminFloatingBarProps {
  onAdd: () => void;
}

export function AdminFloatingBar({ onAdd }: AdminFloatingBarProps) {
  if (!auth.isAdmin()) return null;

  return (
    <button
      onClick={onAdd}
      className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      title="Add new"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
