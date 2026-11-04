"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { CalendarDays, List, Map as MapIcon, MapPin, Search, X } from "lucide-react";
import Link from "next/link";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { hasValidEventCoordinates, type EventItem } from "@/lib/types";

const EventMap = dynamic(
  () => import("@/components/Home/EventExplorer/map").then((module) => module.EventMap),
  { ssr: false, loading: () => <MapLoading /> }
);

const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Health Camp",
  "Food Distribution",
  "Other",
];

type ViewMode = "map" | "calendar" | "list";
type LoadStatus = "loading" | "ready" | "error";

function MapLoading() {
  return (
    <div className="flex h-[24rem] items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500 dark:bg-zinc-800 dark:text-slate-400 sm:h-[30rem]">
      Loading map…
    </div>
  );
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateForKey(key: string) {
  const [year, month, day] = key.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatEventDate(value: string) {
  return new Date(value).toLocaleDateString("en-BD", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatSelectedDate(date: Date) {
  return formatEventDate(`${toDateKey(date)}T00:00:00.000Z`);
}

function ExplorerEventRow({ event }: { event: EventItem }) {
  return (
    <Link
      href={`/events/${event._id}`}
      className="glass-panel flex min-w-0 items-center gap-4 rounded-2xl p-3 transition-shadow hover:shadow-md sm:p-4"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={event.thumbnail}
        alt=""
        loading="lazy"
        className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-28"
      />
      <span className="min-w-0 flex-1">
        <span className="mb-1 block truncate text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          {event.eventType}
        </span>
        <span className="block line-clamp-2 font-semibold">{event.title}</span>
        <span className="mt-1 flex items-center gap-1 truncate text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {event.location}
        </span>
        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
          {formatEventDate(event.eventDate)}
        </span>
      </span>
    </Link>
  );
}

export default function EventExplorer() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [view, setView] = useState<ViewMode>("map");
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not configured.");

        const response = await fetch(`${apiUrl}/events/upcoming`);
        if (!response.ok) throw new Error(`Could not load events (${response.status}).`);

        const data: EventItem[] = await response.json();
        if (active) {
          setEvents(data);
          setStatus("ready");
        }
      } catch {
        if (active) setStatus("error");
      }
    }

    loadEvents();
    return () => {
      active = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const dateKey = selectedDate ? toDateKey(selectedDate) : null;

    return events.filter((event) => {
      const matchesType = activeType === "All" || event.eventType === activeType;
      const matchesSearch =
        !query ||
        event.title.toLocaleLowerCase().includes(query) ||
        event.location.toLocaleLowerCase().includes(query) ||
        event.description.toLocaleLowerCase().includes(query);
      const matchesDate = !dateKey || event.eventDate.slice(0, 10) === dateKey;
      return matchesType && matchesSearch && matchesDate;
    });
  }, [activeType, events, search, selectedDate]);

  const eventDates = useMemo(
    () =>
      [...new Set(filteredEvents.map((event) => event.eventDate.slice(0, 10)))].map(dateForKey),
    [filteredEvents]
  );
  const mappableEvents = filteredEvents.filter((event) => hasValidEventCoordinates(event.coordinates));

  return (
    <section id="event-explorer" className="scroll-mt-24 pt-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
            Oikyo Event Explorer
          </p>
          <h2 className="text-3xl font-bold tracking-tight">Find a way to make a difference</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Explore community events by place, date, and cause.
          </p>
        </div>
        <div className="flex rounded-full bg-slate-200/70 p-1 dark:bg-zinc-800">
          {([
            ["map", "Map", MapIcon],
            ["calendar", "Calendar", CalendarDays],
            ["list", "List", List],
          ] as const).map(([mode, label, Icon]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              aria-label={`Switch to ${label} view`}
              aria-pressed={view === mode}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                view === mode
                  ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-950 dark:text-white"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel mb-6 space-y-4 rounded-3xl p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events, locations, or causes"
            aria-label="Search events"
            className="h-12 rounded-full border-0 bg-slate-200/60 pl-11 dark:bg-zinc-800/80"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...eventTypes].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              aria-pressed={activeType === type}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeType === type
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-200/60 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800/80 dark:text-slate-300 dark:hover:bg-zinc-700"
              }`}
            >
              {type}
            </button>
          ))}
          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate(undefined)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              {formatSelectedDate(selectedDate)}
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {status === "loading" && (
        <div className="glass-panel rounded-3xl p-10 text-center text-slate-500 dark:text-slate-400">
          Loading upcoming events…
        </div>
      )}
      {status === "error" && (
        <div role="alert" className="glass-panel rounded-3xl p-10 text-center text-slate-600 dark:text-slate-300">
          We could not load events right now. Please try again in a moment.
        </div>
      )}
      {status === "ready" && (
        <>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
            Showing {filteredEvents.length} events
            {view === "map" && ` · ${mappableEvents.length} with confirmed map locations`}
          </p>

          {filteredEvents.length === 0 ? (
            <div className="glass-panel rounded-3xl p-10 text-center text-slate-600 dark:text-slate-300">
              No events match these filters.
            </div>
          ) : (
            <>
              {view === "map" && (
                <div className="glass-panel isolate overflow-hidden rounded-3xl p-2 sm:p-3">
                  {mappableEvents.length > 0 ? (
                    <EventMap events={mappableEvents} />
                  ) : (
                    <div className="flex h-80 items-center justify-center rounded-2xl bg-slate-100 px-6 text-center text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                      No events in this selection have organizer-confirmed map coordinates yet.
                    </div>
                  )}
                  {filteredEvents.length > mappableEvents.length && (
                    <p className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                      {filteredEvents.length - mappableEvents.length} event
                      {filteredEvents.length - mappableEvents.length === 1 ? "" : "s"} without coordinates
                      remain available in Calendar and List views.
                    </p>
                  )}
                </div>
              )}
              {view === "calendar" && (
                <div className="grid gap-6 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
                  <div className="glass-panel flex justify-center rounded-3xl p-4 sm:p-6">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      modifiers={{ hasEvents: eventDates }}
                      modifiersClassNames={{
                        hasEvents:
                          "after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-blue-500",
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold">
                      {selectedDate ? `Events on ${formatSelectedDate(selectedDate)}` : "Upcoming events"}
                    </h3>
                    {filteredEvents.map((event) => (
                      <ExplorerEventRow key={event._id} event={event} />
                    ))}
                  </div>
                </div>
              )}
              {view === "list" && (
                <div className="space-y-3">
                  {filteredEvents.map((event) => (
                    <ExplorerEventRow key={event._id} event={event} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
