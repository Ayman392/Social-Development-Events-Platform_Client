import Features from "@/components/Home/Features/page";
import EventExplorer from "@/components/Home/EventExplorer/page";
import Gallery from "@/components/Home/Gallery/page";
import Hero from "@/components/Home/Hero/page";
import HowItWorks from "@/components/Home/HowItWorks/page";
import Newsletter from "@/components/Home/NewsLetter/page";
import UpcomingEvents from "@/components/Home/UpcomingEvents/page";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-24 px-4 py-8 sm:px-6 lg:px-8">
      <Hero />
      <Features/>
      <HowItWorks/>
      <EventExplorer />
      <UpcomingEvents/>
      <Gallery/>
      <Newsletter/>
    </div>
  );
}