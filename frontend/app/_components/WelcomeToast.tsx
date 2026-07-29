"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

/**
 * Shows a welcome toast after a redirect that carries a `?welcome=<firstName>`
 * param — used by the Google sign-in callback, which finishes server-side and so
 * can't toast on its own. Strips the param afterwards so it fires only once.
 */
function WelcomeToastInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shown = useRef(false);

  useEffect(() => {
    const name = searchParams.get("welcome");
    if (!name || shown.current) return;

    shown.current = true;
    toast.success(`Welcome, ${name}! You're signed in with Google.`);

    const params = new URLSearchParams(searchParams);
    params.delete("welcome");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [searchParams, pathname, router]);

  return null;
}

export function WelcomeToast() {
  return (
    <Suspense fallback={null}>
      <WelcomeToastInner />
    </Suspense>
  );
}
