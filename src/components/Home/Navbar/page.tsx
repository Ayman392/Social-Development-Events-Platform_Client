"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/themeToggle";
import UserMenu from "@/components/ui/userMenu";

const links = [
  { href: "/events", label: "Upcoming Events" },
  { href: "/#features", label: "How It Works" },
  { href: "/#gallery", label: "Gallery" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Center links (desktop) */}
          <div className="hidden space-x-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-blue-500"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <UserMenu />
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="rounded-full p-2 transition-colors hover:bg-slate-200/50 md:hidden dark:hover:bg-zinc-800/50"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200/50 px-4 py-3 md:hidden dark:border-zinc-700/50">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
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