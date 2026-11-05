"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Search, SearchX } from "lucide-react";
import { Button } from "@heroui/react";

import EventCard from "@/components/Home/EventCard/page";
import { Input } from "@/components/ui/input";
import type { EventItem } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const eventTypes = [
  "All",
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Health Camp",
  "Food Distribution",
  "Other",
];

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

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${API_URL}/events/upcoming`);
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

  // Keep only the events that match the chosen type and the search words
  const searchText = search.trim().toLowerCase();
  const filteredEvents = events.filter((event) => {
    const typeMatches = activeType === "All" || event.eventType === activeType;
    const searchMatches =
      searchText === "" ||
      event.title.toLowerCase().includes(searchText) ||
      event.location.toLowerCase().includes(searchText);

    return typeMatches && searchMatches;
  });

  function clearFilters() {
    setActiveType("All");
    setSearch("");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 px-6 py-14 text-center dark:from-zinc-900 dark:via-slate-900 dark:to-blue-950">
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sky-300/40 blur-3xl dark:bg-blue-600/20" />
        <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-600/20" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="glass-panel mb-5 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
            Find your next cause
          </span>
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            Upcoming Events
          </h1>
          <p className="mb-8 text-slate-600 dark:text-slate-400">
            Browse community service events that are still to come. Events that
            have already taken place are hidden automatically.
          </p>

          <Button
            onPress={() => router.push("/create-event")}
            className="h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
          >
            <CalendarPlus className="h-4 w-4" />
            Create an Event
          </Button>
        </div>
      </section>

      {/* Search and filters */}
      <section className="glass-panel mt-8 space-y-4 rounded-3xl p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event name or location"
            aria-label="Search events"
            className="h-12 rounded-full border-0 bg-slate-200/60 pl-11 dark:bg-zinc-800/80"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeType === type
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-200/60 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800/80 dark:text-slate-300 dark:hover:bg-zinc-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="mt-8">
        {status === "ready" && (
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredEvents.length} of {events.length} upcoming events
          </p>
        )}

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

        {/* Nothing matches, or no events at all */}
        {status === "ready" && filteredEvents.length === 0 && (
          <div className="glass-panel rounded-3xl p-10 text-center">
            <SearchX className="mx-auto mb-4 h-10 w-10 text-slate-400" />
            <h2 className="mb-2 text-xl font-semibold">No events found</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              {events.length === 0
                ? "There are no upcoming events yet. Be the first to organize one."
                : "Try a different search or pick another event type."}
            </p>

            {events.length === 0 ? (
              <Button
                onPress={() => router.push("/create-event")}
                className="h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
              >
                Create an Event
              </Button>
            ) : (
              <Button
                onPress={clearFilters}
                className="h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {/* The events */}
        {status === "ready" && filteredEvents.length > 0 && (
          <div className="grid auto-rows-fr grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
