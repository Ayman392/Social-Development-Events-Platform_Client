"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { Button } from "@heroui/react";

import { Input } from "@/components/ui/input";
import { validateEmail } from "@/lib/validators";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateEmail(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // No backend for this section, so we only show a message
    toast.success("Thanks for subscribing! Watch your inbox for new causes.");
    setEmail("");
  }

  return (
    <section className="pt-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 px-6 py-14 dark:from-zinc-900 dark:via-slate-900 dark:to-blue-950 md:px-16 md:py-20">
        {/* Soft colour glows behind the glass card */}
        <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl dark:bg-blue-600/20" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-600/20" />

        {/* Frosted glass card */}
        <div className="glass-panel relative z-10 mx-auto max-w-xl rounded-[2rem] px-6 py-10 text-center shadow-xl md:px-12">
          {/* App-icon style badge */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-b from-[#34AADC] to-[#007AFF] shadow-lg shadow-blue-500/30">
            <Mail className="h-8 w-8 text-white" />
          </div>

          <h2 className="mb-3 text-3xl font-bold tracking-tight">
            Stay Updated on New Causes
          </h2>
          <p className="mb-8 text-slate-500 dark:text-slate-400">
            Get weekly updates on volunteering opportunities and community
            impact stories.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {/* Grey rounded field, like an iOS text input */}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              className="h-12 rounded-2xl border-0 bg-slate-200/60 px-5 text-base placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#007AFF]/50 dark:bg-zinc-800/80"
            />

            {/* iOS system blue button */}
            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-slate-900 px-6 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
