"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Heart,
  MapPin,
  SearchX,
  Users,
} from "lucide-react";
import { Button } from "@heroui/react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import type { EventItem } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    weekday: "long",
    month: "long",
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

// Grey placeholder shown while the event loads
function DetailsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
      <div className="h-72 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-zinc-800 md:h-96" />
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        </div>
        <div className="h-64 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">(
    "loading",
  );
  const [imageFailed, setImageFailed] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);

  const eventId = params.id;
  const userEmail = session?.user.email;

  // Load the event
  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`${API_URL}/events/${eventId}`);
        if (!res.ok) {
          setStatus("notfound");
          return;
        }

        const data: EventItem = await res.json();
        setEvent(data);
        setStatus("ready");
      } catch {
        setStatus("notfound");
      }
    }

    loadEvent();
  }, [eventId]);

  // Once we know who is logged in, check if they already joined
  useEffect(() => {
    async function checkJoined() {
      if (!userEmail) return;

      try {
        const res = await apiFetch(`/events/${eventId}/is-joined`);
        const data = await res.json();
        setJoined(Boolean(data.joined));
      } catch {
        // If this check fails, the server still blocks double joins
      }
    }

    checkJoined();
  }, [eventId, userEmail]);

  async function handleJoin() {
    // Not logged in: ask them to log in first
    if (!session) {
      toast.error("Please log in to join this event.");
      router.push("/login");
      return;
    }

    setJoining(true);
    try {
      const res = await apiFetch(`/events/${eventId}/join`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        toast.error(data.message || "Could not join the event.");
        // 409 means they had already joined, so show the joined state
        if (res.status === 409) setJoined(true);
        return;
      }

      toast.success("You have joined this event. Thank you!");
      setJoined(true);
      setEvent((current) =>
        current
          ? { ...current, volunteersCount: current.volunteersCount + 1 }
          : current,
      );
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setJoining(false);
    }
  }

  if (status === "loading") {
    return <DetailsSkeleton />;
  }

  if (status === "notfound" || !event) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <SearchX className="mb-4 h-12 w-12 text-slate-400" />
        <h1 className="mb-2 text-2xl font-bold">Event not found</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">
          This event may have been removed, or the link is not correct.
        </p>
        <Button
          onPress={() => router.push("/events")}
          className="h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
        >
          Browse upcoming events
        </Button>
      </div>
    );
  }

  const past = isPastEvent(event.eventDate);
  const badgeColor = typeColors[event.eventType] || typeColors.Other;
  const organizerName = event.creatorName || "Event organizer";

  // Work out what the join button should say and do
  let buttonLabel = "Join Event";
  if (joining) buttonLabel = "Joining...";
  if (isPending) buttonLabel = "Loading...";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/events"
        className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to events
      </Link>

      {/* Banner photo */}
      <div className="relative h-72 overflow-hidden rounded-[2rem] shadow-xl md:h-96">
        {imageFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
            <Heart className="h-20 w-20 text-white/80" fill="currentColor" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.thumbnail}
            alt={event.title}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <Badge
          className={`absolute left-6 top-6 border-0 px-4 py-1.5 text-sm font-semibold text-white shadow-md ${badgeColor}`}
        >
          {event.eventType}
        </Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left: the details */}
        <div className="lg:col-span-2">
          <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-4xl">
            {event.title}
          </h1>

          <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 text-slate-600 dark:text-slate-300">
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-blue-500" />
              {event.location}
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-blue-500" />
              {formatDate(event.eventDate)}
            </div>
          </div>

          <h2 className="mb-3 text-xl font-semibold">About this Initiative</h2>
          <p className="mb-10 whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-400">
            {event.description}
          </p>

          {event.guidelines && event.guidelines.length > 0 && (
            <>
              <h2 className="mb-4 text-xl font-semibold">
                Volunteer Guidelines
              </h2>
              <ul className="space-y-3">
                {event.guidelines.map((line) => (
                  <li
                    key={line}
                    className="flex items-start text-slate-600 dark:text-slate-400"
                  >
                    <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    {line}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Right: join card and organizer */}
        <aside className="lg:col-span-1">
          <div className="glass-panel sticky top-24 rounded-[2rem] p-6 shadow-lg">
            <div className="mb-6 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">
                  {event.volunteersCount}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {event.volunteersCount === 1
                    ? "Volunteer joined"
                    : "Volunteers joined"}
                </p>
              </div>
            </div>

            {past ? (
              <Button
                isDisabled
                className="h-12 w-full rounded-full bg-slate-300 text-base font-semibold text-slate-600 dark:bg-zinc-700 dark:text-zinc-400"
              >
                This event has ended
              </Button>
            ) : joined ? (
              <Button
                isDisabled
                className="h-12 w-full rounded-full bg-emerald-600 text-base font-semibold text-white"
              >
                <CheckCircle2 className="h-5 w-5" />
                Already Joined
              </Button>
            ) : (
              <Button
                onPress={handleJoin}
                isDisabled={joining || isPending}
                className="h-12 w-full rounded-full bg-slate-900 text-base font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                {buttonLabel}
              </Button>
            )}

            {!session && !isPending && !past && (
              <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                You need to log in before you can join.
              </p>
            )}

            {/* Organizer */}
            <div className="mt-6 border-t border-slate-200/60 pt-6 dark:border-zinc-700/60">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Organized by
              </p>
              <div className="flex items-center">
                <Avatar className="mr-3 h-11 w-11">
                  <AvatarImage
                    src={event.creatorPhoto || undefined}
                    alt={organizerName}
                  />
                  <AvatarFallback className="bg-blue-600 font-semibold text-white">
                    {organizerName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{organizerName}</p>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {event.creatorEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
