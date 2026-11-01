"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button as HeroButton } from "@heroui/react";
import {
  CalendarPlus,
  ChevronDown,
  ClipboardList,
  Heart,
  LogOut,
  Menu,
  Moon,
  Sun,
  Ticket,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";

const navLinks = [
  { href: "/events", label: "Upcoming Events" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#gallery", label: "Gallery" },
];

const menuLinks = [
  { href: "/create-event", label: "Create Event", icon: CalendarPlus },
  { href: "/manage-events", label: "Manage Events", icon: ClipboardList },
  { href: "/joined-events", label: "Joined Events", icon: Ticket },
];

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Switch between light and dark by toggling the "dark" class on the page
  function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle("dark");

    if (html.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }

  async function handleLogout() {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message || "Could not log out. Please try again.");
      return;
    }
    toast.success("You have been logged out.");
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center" aria-label="Oikyo home">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Oikyo</span>
          </Link>

          {/* Center links */}
          <div className="hidden space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-blue-500"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Theme button: the moon shows in light mode, the sun in dark mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              <Moon className="h-5 w-5 dark:hidden" />
              <Sun className="hidden h-5 w-5 dark:block" />
            </Button>

            {/* While the session loads, show a grey circle so the navbar doesn't jump */}
            {isPending && (
              <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-zinc-800" />
            )}

            {/* Logged out: Login button */}
            {!isPending && !session && (
              <HeroButton
                onPress={() => router.push("/login")}
                className="rounded-full bg-slate-900 px-5 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
              >
                Login
              </HeroButton>
            )}

            {/* Logged in: avatar with dropdown, plus a Logout button in the bar */}
            {!isPending && session && (
              <>
                <DropdownMenu>
                  <div className="group relative">
                    <DropdownMenuTrigger
                      className="flex items-center gap-2 rounded-full outline-none"
                      aria-label="Open account menu"
                    >
                      <Avatar className="h-9 w-9 border border-slate-200 shadow-sm dark:border-zinc-700">
                        <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                        <AvatarFallback className="bg-blue-600 text-sm font-semibold text-white">
                          {session.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
                    </DropdownMenuTrigger>

                    {/* Name shown when hovering over the picture (hidden while the menu is open) */}
                    <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-has-[[aria-expanded=true]]:opacity-0 dark:bg-white dark:text-zinc-900">
                      {session.user.name}
                    </div>
                  </div>

                  <DropdownMenuContent align="end" className="glass-panel w-56 rounded-2xl p-0 shadow-lg">
                    {/* Name and email */}
                    <div className="border-b border-slate-200/50 px-4 py-3 dark:border-zinc-700/50">
                      <p className="truncate text-sm font-medium">{session.user.name}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {session.user.email}
                      </p>
                    </div>

                    {/* Private pages */}
                    {menuLinks.map(({ href, label, icon: Icon }) => (
                      <DropdownMenuItem
                        key={href}
                        onClick={() => router.push(href)}
                        className="cursor-pointer px-4 py-2 text-sm"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {label}
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    {/* Log out inside the menu (this is the one phones use) */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer px-4 py-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Logout button in the bar, outside the dropdown (hidden on small phones) */}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="hidden rounded-full sm:inline-flex"
                >
                  Log out
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="rounded-full md:hidden"
              aria-label="Open menu"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile links */}
      {isMobileOpen && (
        <div className="border-t border-slate-200/50 px-4 py-3 md:hidden dark:border-zinc-700/50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}