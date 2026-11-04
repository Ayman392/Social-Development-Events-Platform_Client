import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { CalendarDays, CalendarPlus, ClipboardList, Image, Mail, MapPin, Ticket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Logo from "@/components/ui/logo";

const exploreLinks = [
  { label: "Upcoming Events", href: "/events", icon: CalendarDays },
  { label: "Create Event", href: "/create-event", icon: CalendarPlus },
  { label: "Manage Events", href: "/manage-events", icon: ClipboardList },
  { label: "Joined Events", href: "/joined-events", icon: Ticket },
  { label: "Gallery", href: "/#gallery", icon: Image },
];

// Same colours as the badges on the event cards
const categories = [
  { label: "Cleanup", color: "bg-emerald-500" },
  { label: "Plantation", color: "bg-green-500" },
  { label: "Donation", color: "bg-orange-500" },
  { label: "Education", color: "bg-blue-500" },
  { label: "Health Camp", color: "bg-rose-500" },
  { label: "Food Distribution", color: "bg-amber-500" },
];

const socials = [
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: FaLinkedinIn },
  { label: "Instagram", href: "https://www.instagram.com", icon: FaInstagram },
];

const headingClass = "mb-5 text-xs font-bold uppercase tracking-widest text-white";
const linkClass = "flex items-center text-sm text-slate-400 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      {/* Colourful strip along the top */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo, description and social icons */}
          <div>
              <Logo/>

            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Connecting passionate volunteers with community service events to drive meaningful
              social development across Bangladesh.
            </p>

            <div className="flex gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-1 hover:bg-white hover:text-slate-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links with icons */}
          <div>
            <h4 className={headingClass}>Explore</h4>
            <ul className="space-y-4">
              {exploreLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>
                    <Icon className="mr-3 h-4 w-4 text-sky-400" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event categories as coloured pills */}
          <div>
            <h4 className={headingClass}>Event Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(({ label, color }) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="gap-2 border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                >
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h4 className={headingClass}>Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin className="mr-3 mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-start">
                <Mail className="mr-3 mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <a href="mailto:hello@hopenetwork.example" className="transition-colors hover:text-white">
                  hello@oikyo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 Oikyo. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made by Ayman
          </p>
        </div>
      </div>
    </footer>
  );
}