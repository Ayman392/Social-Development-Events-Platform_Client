"use client";

import { useState } from "react";
import { Heart, ZoomIn } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Photo = { src: string; alt: string };

// Static photos of different community service events. Add or swap photos here.
const photos: Photo[] = [
  // Buriganga Riverbank Cleanup
  {
    src: "https://images.unsplash.com/photo-1565341771319-d8ecd5693fd2?ixid=M3wxMTIyMzkwfDB8MXxzZWFyY2h8Mnx8cml2ZXIlMjBjbGVhbnVwJTIwdm9sdW50ZWVycyUyMEJhbmdsYWRlc2h8ZW58MHwwfHx8MTc5MzcxMDYxNHww&ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    alt: "Buriganga Riverbank Cleanup",
  },
  // Rooftop Garden Workshop
  {
    src: "https://images.unsplash.com/photo-1672561924208-7762120e7077?ixid=M3wxMTIyMzkwfDB8MXxzZWFyY2h8MXx8cm9vZnRvcCUyMHZlZ2V0YWJsZSUyMGdhcmRlbiUyMEJhbmdsYWRlc2h8ZW58MHwwfHx8MTc5MzcxMDYxNXww&ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    alt: "Rooftop Garden Workshop",
  },
  // School Supplies for Village Children
  {
    src: "https://images.unsplash.com/photo-1777725770744-e66b802dbf60?ixid=M3wxMTIyMzkwfDB8MXxzZWFyY2h8MXx8c2Nob29sJTIwY2hpbGRyZW4lMjBib29rcyUyMEJhbmdsYWRlc2h8ZW58MHwwfHx8MTc5MzcxMDYxNnww&ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    alt: "School Supplies for Village Children",
  },
  // Cox's Bazar Beach Cleanup
  {
    src: "https://images.unsplash.com/photo-1767713200716-4ec5f1fe6547?ixid=M3wxMTIyMzkwfDB8MXxzZWFyY2h8Mnx8YmVhY2glMjBjbGVhbnVwJTIwdm9sdW50ZWVycyUyMEJhbmdsYWRlc2h8ZW58MHwwfHx8MTc5MzcxMDYxNnww&ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    alt: "Cox's Bazar Beach Cleanup",
  },
  // Eye Care Camp for Elders
  {
    src: "https://images.unsplash.com/photo-1595743826997-87eb67a31872?ixid=M3wxMTIyMzkwfDB8MXxzZWFyY2h8MXx8ZXllJTIwY2hlY2t1cCUyMGVsZGVybHklMjBCYW5nbGFkZXNofGVufDB8MHx8fDE3OTM3MTA2MTd8MA&ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    alt: "Eye Care Camp for Elders",
  },
  // Hill Tree Plantation Drive
  {
    src: "https://images.unsplash.com/photo-1631959408508-53628bec0434?ixid=M3wxMTIyMzkwfDB8MXxzZWFyY2h8MXx8aGlsbCUyMGZvcmVzdCUyMHBsYW50aW5nJTIwQmFuZ2xhZGVzaHxlbnwwfDB8fHwxNzkzNzEwNjE3fDA&ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    alt: "Hill Tree Plantation Drive",
  },
];

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
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <section id="gallery" className="scroll-mt-24 pt-8">
      {/* Section heading */}
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">
          Community in Action
        </h2>
        <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400">
          A look at the people and moments that make our community events worth
          showing up for.
        </p>
      </div>

      {/* Equal-size photo grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {photos.map((photo) => (
          <GalleryTile
            key={photo.src}
            photo={photo}
            onOpen={() => setSelected(photo)}
          />
        ))}
      </div>

      {/* Large view */}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="p-2 sm:max-w-4xl">
          <DialogTitle className="sr-only">{selected?.alt}</DialogTitle>

          {selected && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.src}
              alt={selected.alt}
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
