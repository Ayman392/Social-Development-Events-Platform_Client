"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";
import { Button } from "@heroui/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { validateUrl } from "@/lib/validators";
import type { EventItem } from "@/lib/types";
import type { EventCoordinates } from "@/lib/types";

const LocationPicker = dynamic(
  () =>
    import("@/components/Home/EventExplorer/map").then(
      (module) => module.LocationPicker,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-zinc-800 sm:h-72" />
    ),
  },
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
    | "title"
    | "description"
    | "eventType"
    | "thumbnail"
    | "location"
    | "eventDate"
    | "guidelines"
    | "coordinates",
    string
  >
>;

type Props = {
  event: EventItem;
  onClose: () => void;
  onSaved: (updated: EventItem) => void;
};

// Tomorrow as yyyy-mm-dd, the earliest date the form accepts
function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

const inputClass =
  "h-12 rounded-2xl border-0 bg-slate-200/60 px-5 dark:bg-zinc-800/80";

export default function EditEventDialog({ event, onClose, onSaved }: Props) {
  // The form starts filled with the current event data
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [eventType, setEventType] = useState(event.eventType);
  const [thumbnail, setThumbnail] = useState(event.thumbnail);
  const [location, setLocation] = useState(event.location);
  const [coordinates, setCoordinates] = useState<EventCoordinates | null>(
    event.coordinates ?? null,
  );
  const [coordinatesChanged, setCoordinatesChanged] = useState(false);
  const [eventDate, setEventDate] = useState(event.eventDate.slice(0, 10));
  const [guidelinesText, setGuidelinesText] = useState(
    (event.guidelines ?? []).join("\n"),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const tomorrow = getTomorrow();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const guidelines = guidelinesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    // Same checks as the Create Event form
    const newErrors: FormErrors = {};

    if (title.trim().length < 3 || title.trim().length > 100) {
      newErrors.title = "Title must be between 3 and 100 characters.";
    }
    if (description.trim().length < 20 || description.trim().length > 1000) {
      newErrors.description =
        "Description must be between 20 and 1000 characters.";
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
    if (
      guidelines.length > 6 ||
      guidelines.some((line) => line.length < 3 || line.length > 150)
    ) {
      newErrors.guidelines =
        "Add up to 6 guidelines, each 3 to 150 characters.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch(`/events/${event._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventType,
          thumbnail: thumbnail.trim(),
          location: location.trim(),
          ...(coordinatesChanged ? { coordinates: coordinates ?? null } : {}),
          eventDate,
          guidelines,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        toast.error(data.message || "Could not update the event.");
        return;
      }

      toast.success("Event updated successfully!");
      onSaved({
        ...event,
        title: title.trim(),
        description: description.trim(),
        eventType,
        thumbnail: thumbnail.trim(),
        location: location.trim(),
        coordinates: coordinates ?? undefined,
        eventDate: `${eventDate}T00:00:00.000Z`,
        guidelines,
      });
    } catch {
      toast.error("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Update Event</DialogTitle>
          <DialogDescription>
            Change the details below. The event date must be tomorrow or later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Event title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={Boolean(errors.title)}
              className={inputClass}
            />
            {errors.title && (
              <p className="px-2 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Type and date */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-type">Event type</Label>
              <div className="relative">
                <select
                  id="edit-type"
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
                <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              </div>
              {errors.eventType && (
                <p className="px-2 text-sm text-red-500">{errors.eventType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Event date</Label>
              <Input
                id="edit-date"
                type="date"
                min={tomorrow}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                aria-invalid={Boolean(errors.eventDate)}
                className={inputClass}
              />
              {errors.eventDate && (
                <p className="px-2 text-sm text-red-500">{errors.eventDate}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-invalid={Boolean(errors.location)}
              className={inputClass}
            />
            {errors.location && (
              <p className="px-2 text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <Label>Map location (optional)</Label>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select the event location on the map to confirm its pin. The
                address is not geocoded automatically.
              </p>
            </div>
            <LocationPicker
              value={coordinates}
              onChange={(value) => {
                setCoordinates(value);
                setCoordinatesChanged(true);
              }}
            />
            {coordinates ? (
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>
                  Confirmed pin: {coordinates.latitude.toFixed(5)},{" "}
                  {coordinates.longitude.toFixed(5)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCoordinates(null);
                    setCoordinatesChanged(true);
                  }}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Remove pin
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No map pin selected. The event remains available in Calendar and
                List views.
              </p>
            )}
            {errors.coordinates && (
              <p className="px-2 text-sm text-red-500">{errors.coordinates}</p>
            )}
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label htmlFor="edit-thumbnail">Thumbnail image URL</Label>
            <Input
              id="edit-thumbnail"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              aria-invalid={Boolean(errors.thumbnail)}
              className={inputClass}
            />
            {errors.thumbnail && (
              <p className="px-2 text-sm text-red-500">{errors.thumbnail}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-description">Description</Label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {description.trim().length}/1000
              </span>
            </div>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              aria-invalid={Boolean(errors.description)}
              className="rounded-2xl border-0 bg-slate-200/60 px-5 py-3 dark:bg-zinc-800/80"
            />
            {errors.description && (
              <p className="px-2 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Guidelines */}
          <div className="space-y-2">
            <Label htmlFor="edit-guidelines">
              Volunteer guidelines (one per line, optional)
            </Label>
            <Textarea
              id="edit-guidelines"
              value={guidelinesText}
              onChange={(e) => setGuidelinesText(e.target.value)}
              rows={4}
              aria-invalid={Boolean(errors.guidelines)}
              className="rounded-2xl border-0 bg-slate-200/60 px-5 py-3 dark:bg-zinc-800/80"
            />
            {errors.guidelines && (
              <p className="px-2 text-sm text-red-500">{errors.guidelines}</p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onPress={onClose}
              className="h-12 rounded-full border border-slate-300 bg-transparent px-8 text-base font-semibold text-slate-900 dark:border-zinc-600 dark:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={loading}
              className="h-12 rounded-full bg-slate-900 px-8 text-base font-semibold text-white dark:bg-white dark:text-slate-900"
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
