"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const fadeTimeoutId = window.setTimeout(() => setVisible(false), 500);
    const removeTimeoutId = window.setTimeout(() => setMounted(false), 650);

    return () => {
      window.clearTimeout(fadeTimeoutId);
      window.clearTimeout(removeTimeoutId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`page-loader ${visible ? "page-loader-visible" : "page-loader-hidden"}`}
      aria-hidden="true"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}
