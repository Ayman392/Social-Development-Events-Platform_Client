"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative h-[500px] w-full overflow-hidden rounded-[2rem] shadow-2xl">
      {/* Background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=2000"
        alt="Volunteers working together in a community"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay so the white text is easy to read */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Text and button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className="glass-panel mb-6 rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-sm">
          Join a community of changemakers
        </span>

        <h1 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight text-white drop-shadow-md md:text-6xl">
          Empower Our Community, <br className="hidden md:block" /> Shape The Future
        </h1>

        <p className="mb-10 max-w-xl text-lg text-slate-200 drop-shadow">
          Discover local community service events in Bangladesh. Join a cause near you, or create
          an event and bring your neighbours together.
        </p>

        <Button
          onPress={() => router.push("/events")}
          className="h-auto rounded-full bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-xl transition-all hover:scale-105 hover:bg-slate-100 active:scale-95"
        >
          Explore Events
        </Button>
      </div>
    </section>
  );
}