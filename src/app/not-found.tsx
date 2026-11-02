"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@heroui/react";

import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <Card className="glass-panel w-full gap-0 rounded-[2rem] py-0">
        <CardContent className="flex flex-col items-center p-10 text-center sm:p-14">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
            <Compass className="h-8 w-8 text-white" />
          </div>

          <p className="mb-2 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-7xl font-bold tracking-tight text-transparent sm:text-8xl">
            404
          </p>

          <h1 className="mb-3 text-3xl font-bold tracking-tight">This page could not be found</h1>
          <p className="mb-8 max-w-md text-slate-500 dark:text-slate-400">
            The link may be broken, or the page may have moved. Head back home, or find an event
            that needs your help.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onPress={() => router.push("/")}
              className="h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
            >
              Back to Home
            </Button>
            <Button
              onPress={() => router.push("/events")}
              className="group h-11 rounded-full border border-slate-300 bg-transparent px-6 text-sm font-medium text-slate-900 dark:border-zinc-600 dark:text-white"
            >
              Browse Events
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}