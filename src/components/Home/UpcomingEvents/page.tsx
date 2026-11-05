"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@heroui/react";

import EventCard from "@/components/Home/EventCard/page";
import type { EventItem } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// A grey placeholder card shown while events are loading
function CardSkeleton() {
  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden rounded-[2rem]">
      <div className="h-52 animate-pulse bg-slate-200 dark:bg-zinc-800" />
      <div className="space-y-4 p-6">
        <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-11 w-full animate-pulse rounded-full bg-slate-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export default function UpcomingEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${API_URL}/events/upcoming?limit=6`);
        if (!res.ok) throw new Error("Request failed");

        const data: EventItem[] = await res.json();
        setEvents(data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    loadEvents();
  }, []);

  return (
    <section id="events" className="scroll-mt-24 pt-8">
      {/* Section heading */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            Upcoming Events
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Join ongoing initiatives across the country.
          </p>
        </div>

        <Button
          onPress={() => router.push("/events")}
          className="group h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
        >
          View all events
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Loading */}
      {status === "loading" && (
        <div className="grid auto-rows-fr grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <CardSkeleton key={n} />
          ))}
        </div>
      )}

      {/* Could not reach the server */}
      {status === "error" && (
        <p className="glass-panel rounded-2xl p-8 text-center text-slate-600 dark:text-slate-400">
          We could not load events right now. Please refresh the page in a
          moment.
        </p>
      )}

      {/* No events yet */}
      {status === "ready" && events.length === 0 && (
        <div className="glass-panel rounded-2xl p-8 text-center">
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            No upcoming events yet. Be the first to organize one.
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
        <div className="grid auto-rows-fr grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
