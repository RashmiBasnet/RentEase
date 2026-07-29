"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

/**
 * Surfaces the `?error=` message the Google OAuth callback redirects back with,
 * then strips it from the URL so it doesn't re-fire on refresh. Rendered inside a
 * Suspense boundary because it reads search params.
 */
export function GoogleAuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shown = useRef(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error && !shown.current) {
      shown.current = true;
      toast.error(error);
      router.replace("/sign-in");
    }
  }, [searchParams, router]);

  return null;
}
