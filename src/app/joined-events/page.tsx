"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Heart, MapPin, Ticket } from "lucide-react";
import { Button } from "@heroui/react";

import { apiFetch } from "@/lib/api";
import PrivateRoute from "@/components/Home/PrivateRoute/page";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import type { JoinedEventItem } from "@/lib/types";

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
        <div className="h-10 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

function JoinedCard({ item }: { item: JoinedEventItem }) {
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false);

  const past = isPastEvent(item.eventDate);
  const badgeColor = typeColors[item.eventType] || typeColors.Other;

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
            src={item.thumbnail}
            alt={item.title}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
        <Badge
          className={`absolute left-4 top-4 border-0 text-xs font-semibold text-white shadow-md ${badgeColor}`}
        >
          {item.eventType}
        </Badge>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-5 p-6">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h2 className="line-clamp-1 text-xl font-semibold">{item.title}</h2>
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
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 shrink-0 text-blue-500" />
              <span>{formatDate(item.eventDate)}</span>
            </div>
          </div>
        </div>

        <div>
          <Button
            onPress={() => router.push(`/events/${item.eventId}`)}
            className="group h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
          >
            View Event
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// The list itself. It only renders for logged-in users, because PrivateRoute wraps it.
function JoinedList() {
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user.email;

  const [items, setItems] = useState<JoinedEventItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    async function loadJoined() {
      if (!userEmail) return;

      try {
        // For now the browser sends the email. JWT will replace this later.
        const res = await apiFetch(`/joined-events`);
        if (!res.ok) throw new Error("Request failed");

        const data: JoinedEventItem[] = await res.json();
        setItems(data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    loadJoined();
  }, [userEmail]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
          <Ticket className="h-7 w-7 text-white" />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Joined Events
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          The events you have signed up for, with the soonest first.
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
          We could not load your joined events right now. Please refresh the
          page in a moment.
        </p>
      )}

      {/* Nothing joined yet */}
      {status === "ready" && items.length === 0 && (
        <div className="glass-panel rounded-3xl p-10 text-center">
          <Ticket className="mx-auto mb-4 h-10 w-10 text-slate-400" />
          <h2 className="mb-2 text-xl font-semibold">
            You have not joined any events yet
          </h2>
          <p className="mb-6 text-slate-500 dark:text-slate-400">
            Browse upcoming events and join one that matters to you.
          </p>
          <Button
            onPress={() => router.push("/events")}
            className="h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
          >
            Browse Upcoming Events
          </Button>
        </div>
      )}

      {/* The joined events */}
      {status === "ready" && items.length > 0 && (
        <>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            You have joined {items.length}{" "}
            {items.length === 1 ? "event" : "events"}
          </p>
          <div className="space-y-6">
            {items.map((item) => (
              <JoinedCard key={item._id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function JoinedEventsPage() {
  return (
    <PrivateRoute>
      <JoinedList />
    </PrivateRoute>
  );
}
