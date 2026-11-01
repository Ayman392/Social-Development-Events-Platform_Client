"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { Button } from "@heroui/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EventItem } from "@/lib/types";

// Each event type gets its own badge color
const typeColors: Record<string, string> = {
  Cleanup: "bg-emerald-600",
  Plantation: "bg-green-600",
  Donation: "bg-orange-500",
  Education: "bg-blue-600",
  "Health Camp": "bg-rose-500",
  "Food Distribution": "bg-amber-500",
  Other: "bg-slate-600",
};

// Dates are saved as UTC midnight, so we read them as UTC to avoid showing the wrong day
function getDateParts(date: string) {
  const d = new Date(date);
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit", timeZone: "UTC" }),
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    year: d.toLocaleDateString("en-US", { year: "numeric", timeZone: "UTC" }),
  };
}

export default function EventCard({ event }: { event: EventItem }) {
  const router = useRouter();
  const { day, month, year } = getDateParts(event.eventDate);
  const badgeColor = typeColors[event.eventType] || typeColors.Other;

  return (
    <Card className="glass-panel group h-full gap-0 overflow-hidden rounded-[2rem] py-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      {/* Photo */}
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Soft shadow at the bottom of the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Date block, top left */}
        <div className="absolute left-4 top-4 flex min-w-14 flex-col items-center rounded-2xl bg-white/90 px-3 py-2 text-center shadow-md backdrop-blur dark:bg-zinc-900/90">
          <span className="text-xl font-bold leading-none">{day}</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {month}
          </span>
        </div>

        {/* Event type, top right */}
        <Badge className={`absolute right-4 top-4 border-0 px-3 py-1 text-xs font-semibold text-white shadow-md ${badgeColor}`}>
          {event.eventType}
        </Badge>
      </div>

      {/* Details */}
      <CardContent className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-xl font-semibold leading-snug">
          {event.title}
        </h3>

        <p className="mb-5 line-clamp-2 flex-grow text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {event.description}
        </p>

        <div className="mb-6 space-y-2.5 border-t border-slate-200/60 pt-4 text-sm text-slate-600 dark:border-zinc-700/60 dark:text-slate-300">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 shrink-0 text-blue-500" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 shrink-0 text-blue-500" />
            <span>
              {event.volunteersCount} {event.volunteersCount === 1 ? "volunteer" : "volunteers"} joined
              <span className="text-slate-400"> · {year}</span>
            </span>
          </div>
        </div>

        <Button
          onPress={() => router.push(`/events/${event._id}`)}
          className="h-11 w-full rounded-full bg-slate-900 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
        >
          View Event
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}