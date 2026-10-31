"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarPlus, ChevronDown, ClipboardList, LogOut, Ticket } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

const menuLinks = [
  { href: "/create-event", label: "Create Event", icon: CalendarPlus },
  { href: "/manage-events", label: "Manage Events", icon: ClipboardList },
  { href: "/joined-events", label: "Joined Events", icon: Ticket },
];

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message || "Could not log out. Please try again.");
      return;
    }
    setIsOpen(false);
    toast.success("You have been logged out.");
    router.push("/");
    router.refresh();
  }

  // While the session loads, show a placeholder so the navbar doesn't jump
  if (isPending) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-zinc-800" />;
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-slate-900"
      >
        Login
      </Link>
    );
  }

  const { user } = session;

  return (
    <div className="relative" ref={menuRef}>
      <div className="group relative">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex items-center space-x-2 focus:outline-none"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label="Open account menu"
        >
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="h-9 w-9 rounded-full border border-slate-200 object-cover shadow-sm dark:border-zinc-700"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
          <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
        </button>

        {/* Display name on hover */}
        <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-zinc-900">
          {user.name}
        </div>
      </div>

      {isOpen && (
        <div
          role="menu"
          className="glass-panel absolute right-0 mt-3 w-56 origin-top-right overflow-hidden rounded-2xl py-1 shadow-lg"
        >
          <div className="border-b border-slate-200/50 px-4 py-3 dark:border-zinc-700/50">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>

          {menuLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Link>
          ))}

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center border-t border-slate-200/50 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-zinc-700/50 dark:hover:bg-red-950/30"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}