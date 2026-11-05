"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useSession } from "@/lib/auth-client";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Only redirect once we KNOW there is no session.
  // While isPending is true we are still checking, so a reload never bounces a logged-in user.
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please log in to continue.");
      router.replace("/login");
    }
  }, [isPending, session, router]);

  // Still checking: show a spinner
  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // No session: show nothing while the redirect happens
  if (!session) return null;

  return <>{children}</>;
}
