import Link from "next/link";

type LogoProps = {
  size?: number;
};

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="Oikyo home">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="mr-3 shrink-0"
      >
        {/* Dark rounded square with a faint edge, so it also shows up on dark pages */}
        <rect
          x="1"
          y="1"
          width="118"
          height="118"
          rx="28"
          fill="#0F172A"
          stroke="#ffffff"
          strokeOpacity="0.15"
          strokeWidth="2"
        />

        {/* Three circles that overlap in the middle */}
        <circle cx="48" cy="48" r="26" fill="#3B82F6" fillOpacity="0.8" />
        <circle cx="72" cy="48" r="26" fill="#10B981" fillOpacity="0.8" />
        <circle cx="60" cy="70" r="26" fill="#F59E0B" fillOpacity="0.8" />
      </svg>

      <span className="text-xl font-semibold tracking-tight">Oikyo</span>
    </Link>
  );
}