"use client";

import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();

  // The key changes with every page, so the spinner starts again each time
  return (
    <div key={pathname} className="page-loader" aria-hidden="true">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}