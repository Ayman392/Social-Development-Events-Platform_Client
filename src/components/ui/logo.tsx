import Link from "next/link";
import { Heart } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="HopeNetwork home">
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
        <Heart className="h-5 w-5 text-white" fill="currentColor" />
      </div>
      <span className="text-xl font-semibold tracking-tight">HopeNetwork</span>
    </Link>
  );
}