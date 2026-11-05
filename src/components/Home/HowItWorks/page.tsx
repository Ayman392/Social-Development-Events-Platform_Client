"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  CalendarPlus,
  ClipboardList,
  LogIn,
  Search,
  Ticket,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@heroui/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const volunteerSteps = [
  {
    icon: UserPlus,
    title: "Create your account",
    description:
      "Sign up with your name, email, and a profile photo. It takes less than a minute.",
  },
  {
    icon: Search,
    title: "Find an event",
    description:
      "Browse upcoming events and filter them by type, from cleanups to health camps.",
  },
  {
    icon: CalendarCheck,
    title: "Join with one click",
    description:
      "Open an event, read the details and guidelines, then press Join Event.",
  },
  {
    icon: Ticket,
    title: "Track your impact",
    description:
      "See every event you have joined, sorted by date, on your Joined Events page.",
  },
];

const organizerSteps = [
  {
    icon: LogIn,
    title: "Log in",
    description: "Sign in to your account. Any member can organize an event.",
  },
  {
    icon: CalendarPlus,
    title: "Create your event",
    description:
      "Add a title, type, photo, location, and a future date. Guidelines are optional.",
  },
  {
    icon: Users,
    title: "Welcome volunteers",
    description:
      "Your event appears on the Upcoming Events page and volunteers can join right away.",
  },
  {
    icon: ClipboardList,
    title: "Manage it",
    description:
      "Update the details or delete your event any time from Manage Events.",
  },
];

type Step = (typeof volunteerSteps)[number];

// Four step cards, all the same height
function StepGrid({ steps }: { steps: Step[] }) {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map(({ icon: Icon, title, description }, index) => (
        <Card
          key={title}
          className="glass-panel h-full gap-0 rounded-[2rem] py-0 transition-shadow duration-300 hover:shadow-lg"
        >
          <CardContent className="flex h-full flex-col p-8">
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-2xl bg-blue-50 p-3 dark:bg-blue-900/20">
                <Icon className="h-7 w-7 text-blue-500" />
              </div>
              <span className="text-4xl font-bold text-slate-200 dark:text-zinc-800">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <Badge variant="secondary" className="mb-3 w-fit rounded-full">
              Step {index + 1}
            </Badge>
            <h3 className="mb-3 text-xl font-semibold">{title}</h3>
            <p className="flex-grow leading-relaxed text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Tab buttons: dark pill when selected (works for both Radix and Base UI versions of shadcn)
const triggerClass =
  "rounded-full px-6 py-2.5 text-sm font-medium text-slate-600 transition-colors dark:text-slate-300 " +
  "data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-none " +
  "dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 " +
  "data-active:bg-slate-900 data-active:text-white data-active:shadow-none " +
  "dark:data-active:bg-white dark:data-active:text-slate-900";

export default function HowItWorks() {
  const router = useRouter();

  return (
    <section id="how-it-works" className="scroll-mt-24 pt-8">
      {/* Section heading */}
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">How It Works</h2>
        <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400">
          Whether you want to give your time or bring people together, getting
          started takes just a few steps.
        </p>
      </div>

      <Tabs defaultValue="volunteers" className="items-center gap-10">
        <TabsList className="glass-panel h-auto gap-1 rounded-full p-1.5">
          <TabsTrigger value="volunteers" className={triggerClass}>
            For Volunteers
          </TabsTrigger>
          <TabsTrigger value="organizers" className={triggerClass}>
            For Organizers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="volunteers" className="w-full">
          <StepGrid steps={volunteerSteps} />
          <div className="mt-10 flex justify-center">
            <Button
              onPress={() => router.push("/events")}
              className="group h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
            >
              Find an event
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="organizers" className="w-full">
          <StepGrid steps={organizerSteps} />
          <div className="mt-10 flex justify-center">
            <Button
              onPress={() => router.push("/create-event")}
              className="group h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
            >
              Create an event
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
