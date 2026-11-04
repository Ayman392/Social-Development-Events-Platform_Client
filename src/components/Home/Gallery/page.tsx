"use client";

import { useEffect, useState } from "react";
import { Heart, ZoomIn } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { EventItem } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Photo = { src: string; alt: string };

// One photo for each type of event, so the gallery shows different kinds of work
const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Health Camp",
  "Food Distribution",
];

// Pick up to 6 different photos from the events
function pickPhotos(events: EventItem[]): Photo[] {
  const used = new Set<string>();
  const photos: Photo[] = [];

  // First, one event of each type
  for (const type of eventTypes) {
    const event = events.find(
      (e) => e.eventType === type && e.thumbnail && !used.has(e.thumbnail)
    );
    if (event) {
      used.add(event.thumbnail);
      photos.push({ src: event.thumbnail, alt: event.title });
    }
  }

  // If a type had no event, fill the rest with any other events
  for (const event of events) {
    if (photos.length >= 6) break;
    if (event.thumbnail && !used.has(event.thumbnail)) {
      used.add(event.thumbnail);
      photos.push({ src: event.thumbnail, alt: event.title });
    }
  }

  return photos;
}

// One photo tile. If its photo fails to load, it shows a blue fallback instead of a broken icon.
function GalleryTile({ photo, onOpen }: { photo: Photo; onOpen: () => void }) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={failed ? undefined : onOpen}
      className="group relative aspect-square overflow-hidden rounded-3xl shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label={failed ? photo.alt : `View larger: ${photo.alt}`}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
          <Heart className="h-12 w-12 text-white/80" fill="currentColor" />
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Zoom icon on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
            <div className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <ZoomIn className="h-5 w-5" />
            </div>
          </div>
        </>
      )}
    </button>
  );
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [selected, setSelected] = useState<Photo | null>(null);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const res = await fetch(`${API_URL}/events/upcoming`);
        if (!res.ok) throw new Error("Request failed");

        const events: EventItem[] = await res.json();
        setPhotos(pickPhotos(events));
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    loadPhotos();
  }, []);

  return (
    <section id="gallery" className="scroll-mt-24 pt-8">
      {/* Section heading */}
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Community in Action</h2>
        <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400">
          A look at the people and moments that make our community events worth showing up for.
        </p>
      </div>

      {/* Loading */}
      {status === "loading" && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="aspect-square animate-pulse rounded-3xl bg-slate-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      )}

      {/* Could not load, or no events yet */}
      {(status === "error" || (status === "ready" && photos.length === 0)) && (
        <p className="glass-panel rounded-2xl p-8 text-center text-slate-600 dark:text-slate-400">
          Photos from our community events will appear here soon.
        </p>
      )}

      {/* Equal-size photo grid */}
      {status === "ready" && photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {photos.map((photo) => (
            <GalleryTile key={photo.src} photo={photo} onOpen={() => setSelected(photo)} />
          ))}
        </div>
      )}

      {/* Large view */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="p-2 sm:max-w-4xl">
          <DialogTitle className="sr-only">{selected?.alt}</DialogTitle>

          {selected && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.src.replace(/w=\d+/, "w=1600")}
              alt={selected.alt}
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}