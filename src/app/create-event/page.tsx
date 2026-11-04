"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarPlus, ChevronDown, Heart } from "lucide-react";
import { Button } from "@heroui/react";

import PrivateRoute from "@/components/Home/PrivateRoute/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { validateUrl } from "@/lib/validators";
import type { EventCoordinates } from "@/lib/types";

const LocationPicker = dynamic(
  () => import("@/components/Home/EventExplorer/map").then((module) => module.LocationPicker),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-zinc-800 sm:h-72" /> }
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

type FormErrors = Partial<
  Record<
    "title" | "description" | "eventType" | "thumbnail" | "location" | "eventDate" | "guidelines" | "coordinates",
    string
  >
>;

// Tomorrow as yyyy-mm-dd, the earliest date the form accepts
function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

const inputClass = "h-12 rounded-2xl border-0 bg-slate-200/60 px-5 dark:bg-zinc-800/80";

export default function CreateEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<EventCoordinates | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [guidelinesText, setGuidelinesText] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const tomorrow = getTomorrow();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // One guideline per line, empty lines are ignored
    const guidelines = guidelinesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    // Check every field and collect the messages
    const newErrors: FormErrors = {};

    if (title.trim().length < 3 || title.trim().length > 100) {
      newErrors.title = "Title must be between 3 and 100 characters.";
    }
    if (description.trim().length < 20 || description.trim().length > 1000) {
      newErrors.description = "Description must be between 20 and 1000 characters.";
    }
    if (!eventType) {
      newErrors.eventType = "Please choose an event type.";
    }
    if (!validateUrl(thumbnail.trim())) {
      newErrors.thumbnail = "Please enter a valid image URL.";
    }
    if (location.trim().length < 3 || location.trim().length > 120) {
      newErrors.location = "Location must be between 3 and 120 characters.";
    }
    if (!eventDate) {
      newErrors.eventDate = "Please choose an event date.";
    } else if (eventDate < tomorrow) {
      newErrors.eventDate = "The event date must be in the future.";
    }
    if (guidelines.length > 6 || guidelines.some((line) => line.length < 3 || line.length > 150)) {
      newErrors.guidelines = "Add up to 6 guidelines, each 3 to 150 characters.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch(`/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventType,
          thumbnail: thumbnail.trim(),
          location: location.trim(),
          ...(coordinates ? { coordinates } : {}),
          eventDate,
          guidelines,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // The server also checks everything and sends back its own messages
        if (data.errors) setErrors(data.errors);
        toast.error(data.message || "Could not create the event.");
        return;
      }

      toast.success("Event created successfully!");
      router.push("/events");
    } catch {
      toast.error("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PrivateRoute>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
            <CalendarPlus className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Create an Event</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Organize a community service event and invite volunteers to join.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel space-y-6 rounded-[2rem] p-6 shadow-xl sm:p-8" noValidate>
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Riverside Cleanup Morning"
              aria-invalid={Boolean(errors.title)}
              className={inputClass}
            />
            {errors.title && <p className="px-2 text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Type and date, side by side on wide screens */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventType">Event type</Label>
<div className="relative">
  <select
    id="eventType"
    value={eventType}
    onChange={(e) => setEventType(e.target.value)}
    aria-invalid={Boolean(errors.eventType)}
    className="h-12 w-full appearance-none rounded-2xl border-0 bg-slate-200/60 pl-5 pr-12 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:bg-zinc-800/80"
  >
    <option value="">Choose a type</option>
    {eventTypes.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>

  {/* Our own arrow, with space from the edge */}
  <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
</div>
              {errors.eventType && <p className="px-2 text-sm text-red-500">{errors.eventType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Event date</Label>
              <Input
                id="eventDate"
                type="date"
                min={tomorrow}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                aria-invalid={Boolean(errors.eventDate)}
                className={inputClass}
              />
              {errors.eventDate && <p className="px-2 text-sm text-red-500">{errors.eventDate}</p>}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Example: Dhanmondi Lake, Dhaka"
              aria-invalid={Boolean(errors.location)}
              className={inputClass}
            />
            {errors.location && <p className="px-2 text-sm text-red-500">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <div>
              <Label>Map location (optional)</Label>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select the event location on the map to add an accurate pin. No coordinates are inferred from the address.
              </p>
            </div>
            <LocationPicker value={coordinates} onChange={setCoordinates} />
            {coordinates ? (
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>
                  Confirmed pin: {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
                </span>
                <button
                  type="button"
                  onClick={() => setCoordinates(null)}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Remove pin
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No map pin selected. The event can still be created and will appear in Calendar and List views.
              </p>
            )}
            {errors.coordinates && <p className="px-2 text-sm text-red-500">{errors.coordinates}</p>}
          </div>

          {/* Thumbnail with preview */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail image URL</Label>
            <Input
              id="thumbnail"
              value={thumbnail}
              onChange={(e) => {
                setThumbnail(e.target.value);
                setImageFailed(false);
              }}
              placeholder="https://example.com/photo.jpg"
              aria-invalid={Boolean(errors.thumbnail)}
              className={inputClass}
            />
            {errors.thumbnail && <p className="px-2 text-sm text-red-500">{errors.thumbnail}</p>}

            {validateUrl(thumbnail.trim()) && (
              <div className="mt-3 h-44 overflow-hidden rounded-2xl">
                {imageFailed ? (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Heart className="h-12 w-12 text-white/80" fill="currentColor" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnail.trim()}
                    alt="Thumbnail preview"
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {description.trim().length}/1000
              </span>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will volunteers do, and why does it matter?"
              rows={5}
              aria-invalid={Boolean(errors.description)}
              className="rounded-2xl border-0 bg-slate-200/60 px-5 py-3 dark:bg-zinc-800/80"
            />
            {errors.description && <p className="px-2 text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Guidelines (optional) */}
          <div className="space-y-2">
            <Label htmlFor="guidelines">Volunteer guidelines (optional)</Label>
            <Textarea
              id="guidelines"
              value={guidelinesText}
              onChange={(e) => setGuidelinesText(e.target.value)}
              placeholder={"Write one guideline per line, up to 6.\nArrive 15 minutes early.\nWear comfortable shoes."}
              rows={4}
              aria-invalid={Boolean(errors.guidelines)}
              className="rounded-2xl border-0 bg-slate-200/60 px-5 py-3 dark:bg-zinc-800/80"
            />
            {errors.guidelines && <p className="px-2 text-sm text-red-500">{errors.guidelines}</p>}
          </div>

          <Button
            type="submit"
            isDisabled={loading}
            className="h-12 w-full rounded-full bg-slate-900 text-base font-semibold text-white dark:bg-white dark:text-slate-900"
          >
            {loading ? "Creating event..." : "Create Event"}
          </Button>
        </form>
      </div>
    </PrivateRoute>
  );
}