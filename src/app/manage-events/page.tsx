"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { CalendarDays, ClipboardList, Heart, MapPin, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@heroui/react";

import EditEventDialog from "@/components/Home/EditEventDialog/page";
import PrivateRoute from "@/components/Home/PrivateRoute/page";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import type { EventItem } from "@/lib/types";


// Same badge colours as the event cards
const typeColors: Record<string, string> = {
  Cleanup: "bg-emerald-600",
  Plantation: "bg-green-600",
  Donation: "bg-orange-500",
  Education: "bg-blue-600",
  "Health Camp": "bg-rose-500",
  "Food Distribution": "bg-amber-500",
  Other: "bg-slate-600",
};

// Dates are saved as UTC midnight, so we read them as UTC to show the right day
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function isPastEvent(date: string) {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  return new Date(date) < startOfToday;
}

// A grey placeholder row shown while the list loads
function RowSkeleton() {
  return (
    <div className="glass-panel flex flex-col overflow-hidden rounded-[2rem] sm:flex-row">
      <div className="h-44 animate-pulse bg-slate-200 dark:bg-zinc-800 sm:h-auto sm:w-56" />
      <div className="flex-1 space-y-4 p-6">
        <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-10 w-48 animate-pulse rounded-full bg-slate-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

type RowProps = {
  event: EventItem;
  onEdit: () => void;
  onDelete: () => void;
};

function EventRow({ event, onEdit, onDelete }: RowProps) {
  const router = useRouter();
  
  // If the thumbnail link changes (after an update), try loading the image again
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const imageFailed = failedUrl === event.thumbnail;


  const past = isPastEvent(event.eventDate);
  const badgeColor = typeColors[event.eventType] || typeColors.Other;

  return (
    <div className="glass-panel flex flex-col overflow-hidden rounded-[2rem] transition-shadow duration-300 hover:shadow-xl sm:flex-row">
      {/* Photo */}
      <div className="relative h-48 shrink-0 sm:h-auto sm:w-56">
        {imageFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
            <Heart className="h-10 w-10 text-white/80" fill="currentColor" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.thumbnail}
            alt={event.title}
            onError={() => setFailedUrl(event.thumbnail)}
            className="h-full w-full object-cover"
          />
        )}
        <Badge className={`absolute left-4 top-4 border-0 text-xs font-semibold text-white shadow-md ${badgeColor}`}>
          {event.eventType}
        </Badge>
      </div>

      {/* Details and actions */}
      <div className="flex flex-1 flex-col justify-between gap-5 p-6">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h2 className="line-clamp-1 text-xl font-semibold">{event.title}</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                past
                  ? "bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`}
            >
              {past ? "Completed" : "Upcoming"}
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 shrink-0 text-blue-500" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 shrink-0 text-blue-500" />
              <span>{formatDate(event.eventDate)}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 shrink-0 text-blue-500" />
              <span>
                {event.volunteersCount} {event.volunteersCount === 1 ? "volunteer" : "volunteers"} joined
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onPress={() => router.push(`/events/${event._id}`)}
            className="h-11 rounded-full border border-slate-300 bg-transparent px-6 text-sm font-medium text-slate-900 dark:border-zinc-600 dark:text-white"
          >
            View
          </Button>
          <Button
            onPress={onEdit}
            className="h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
          >
            <Pencil className="h-4 w-4" />
            Update
          </Button>
          <Button
            onPress={onDelete}
            className="h-11 rounded-full border border-red-300 bg-transparent px-6 text-sm font-medium text-red-600 dark:border-red-900 dark:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// The list itself. It only renders for logged-in users, because PrivateRoute wraps it.
function ManageList() {
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user.email;

  const [events, setEvents] = useState<EventItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [editing, setEditing] = useState<EventItem | null>(null);

  useEffect(() => {
    async function loadMine() {
      if (!userEmail) return;

      try {
        // For now the browser sends the email. JWT will replace this later.
        const res = await apiFetch("/events/mine");
        if (!res.ok) throw new Error("Request failed");

        const data: EventItem[] = await res.json();
        setEvents(data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    loadMine();
  }, [userEmail]);

  async function handleDelete(event: EventItem) {
    // Ask first, with a SweetAlert dialog (matches the current theme)
    const isDark = document.documentElement.classList.contains("dark");
    const result = await Swal.fire({
      title: "Delete this event?",
      text: `"${event.title}" and its joined volunteers will be removed. This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Keep it",
      confirmButtonColor: "#dc2626",
      background: isDark ? "#18181b" : "#ffffff",
      color: isDark ? "#fafafa" : "#0f172a",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await apiFetch(
        `/events/${event._id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Could not delete the event.");
        return;
      }

      setEvents((current) => current.filter((item) => item._id !== event._id));
      toast.success("Event deleted.");
    } catch {
      toast.error("Could not reach the server. Please try again.");
    }
  }

  function handleSaved(updated: EventItem) {
    // Swap the edited event into the list and close the pop-up
    setEvents((current) =>
      current
        .map((item) => (item._id === updated._id ? updated : item))
        .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    );
    setEditing(null);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
          <ClipboardList className="h-7 w-7 text-white" />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Manage Events</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Update or delete the events you have created.
        </p>
      </div>

      {/* Loading */}
      {status === "loading" && (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <RowSkeleton key={n} />
          ))}
        </div>
      )}

      {/* Could not reach the server */}
      {status === "error" && (
        <p className="glass-panel rounded-2xl p-8 text-center text-slate-600 dark:text-slate-400">
          We could not load your events right now. Please refresh the page in a moment.
        </p>
      )}

      {/* Nothing created yet */}
      {status === "ready" && events.length === 0 && (
        <div className="glass-panel rounded-3xl p-10 text-center">
          <ClipboardList className="mx-auto mb-4 h-10 w-10 text-slate-400" />
          <h2 className="mb-2 text-xl font-semibold">You have not created any events yet</h2>
          <p className="mb-6 text-slate-500 dark:text-slate-400">
            Organize your first community service event and invite volunteers.
          </p>
          <Button
            onPress={() => router.push("/create-event")}
            className="h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
          >
            Create an Event
          </Button>
        </div>
      )}

      {/* The events */}
      {status === "ready" && events.length > 0 && (
        <>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            You have created {events.length} {events.length === 1 ? "event" : "events"}
          </p>
          <div className="space-y-6">
            {events.map((event) => (
              <EventRow
                key={event._id}
                event={event}
                onEdit={() => setEditing(event)}
                onDelete={() => handleDelete(event)}
              />
            ))}
          </div>
        </>
      )}

      {/* Edit pop-up. The key makes the form start fresh for each event. */}
      {editing && userEmail && (
        <EditEventDialog
          key={editing._id}
          event={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default function ManageEventsPage() {
  return (
    <PrivateRoute>
      <ManageList />
    </PrivateRoute>
  );
}