"use client";

import { useState } from "react";
import { ZoomIn } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Replace these with your own photos and descriptions whenever you like
const photos = [
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
    alt: "Children smiling together at a community event",
  },
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800",
    alt: "Volunteers working together in a community",
  },
  {
    src: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    alt: "Volunteers at a food donation drive",
  },
  {
    src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
    alt: "Volunteers taking part in a community activity",
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800",
    alt: "People gathered for a community cleanup",
  },
  {
    src: "https://images.unsplash.com/photo-1593113593332-cd288d649433?auto=format&fit=crop&q=80&w=800",
    alt: "Volunteers handing out supplies to families",
  },
];

export default function Gallery() {
  // The photo currently shown in the large view (null means closed)
  const [selected, setSelected] = useState<(typeof photos)[number] | null>(null);

  return (
    <section id="gallery" className="scroll-mt-24 pt-8">
      {/* Section heading */}
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Community in Action</h2>
        <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400">
          A look at the people and moments that make our community events worth showing up for.
        </p>
      </div>

      {/* Equal-size photo grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {photos.map((photo) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setSelected(photo)}
            className="group relative aspect-square overflow-hidden rounded-3xl shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`View larger: ${photo.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Dark layer with a zoom icon, shown on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
              <div className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <ZoomIn className="h-5 w-5" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Large view */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="p-2 sm:max-w-4xl">
          <DialogTitle className="sr-only">{selected?.alt}</DialogTitle>
          {selected && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.src.replace("w=800", "w=1600")}
              alt={selected.alt}
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}