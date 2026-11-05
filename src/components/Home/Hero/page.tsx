"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@heroui/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

// Add or change slides here. Each slide has its own photo, heading, text and button.
const slides = [
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=2000",
    badge: "Join a community of changemakers",
    title: "Empower Our Community, Shape The Future",
    text: "Discover local community service events in Bangladesh. Join a cause near you, or create an event and bring your neighbours together.",
    button: "Explore Events",
    href: "/events",
  },
  {
    src: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=2000",
    badge: "Every hand helps",
    title: "Small Acts, Big Change",
    text: "Cleanups, plantations, donation drives, and health camps. Find the kind of event that matches your time and skills.",
    button: "Browse Events",
    href: "/events",
  },
  {
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=2000",
    badge: "Start something good",
    title: "Bring Your Neighbours Together",
    text: "Have an idea for a community event? Create it in minutes and invite volunteers to join.",
    button: "Create an Event",
    href: "/create-event",
  },
];

type Slide = (typeof slides)[number];

// One slide. It has its own fallback, so one broken photo never breaks the others.
function HeroSlide({ slide, first }: { slide: Slide; first: boolean }) {
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="relative h-[500px] w-full">
      {imageFailed ? (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.src}
          alt=""
          loading={first ? "eager" : "lazy"}
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Dark layer so the white text is easy to read */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-10 text-center">
        <span className="glass-panel mb-6 rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-sm">
          {slide.badge}
        </span>

        <h1 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight text-white drop-shadow-md md:text-6xl">
          {slide.title}
        </h1>

        <p className="mb-10 max-w-xl text-lg text-slate-200 drop-shadow">
          {slide.text}
        </p>

        <Button
          onPress={() => router.push(slide.href)}
          className="h-auto rounded-full bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-xl transition-all hover:scale-105 hover:bg-slate-100 active:scale-95"
        >
          {slide.button}
        </Button>
      </div>
    </div>
  );
}

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Changes slide every 5 seconds, and pauses while the mouse is over the banner
  const [autoplay] = useState(() =>
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  // Keep track of the active slide so the dots can highlight it
  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="relative w-full overflow-hidden rounded-[2rem] shadow-2xl">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.title} className="pl-0">
              <HeroSlide slide={slide} first={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows (hidden on small screens) */}
        <CarouselPrevious className="left-4 hidden border-white/30 bg-white/10 text-white hover:bg-white/25 hover:text-white sm:inline-flex" />
        <CarouselNext className="right-4 hidden border-white/30 bg-white/10 text-white hover:bg-white/25 hover:text-white sm:inline-flex" />
      </Carousel>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              current === index
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
