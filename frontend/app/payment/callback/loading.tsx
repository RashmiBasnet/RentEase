import { Loader2 } from "lucide-react";

/**
 * Shown while the callback page verifies the payment with Khalti and loads the
 * booking (two server round-trips). Without this, the highest-stakes moment in
 * the app — "did my payment go through?" — would render nothing until it
 * resolved (Doherty Threshold).
 */
export default function PaymentCallbackLoading() {
  return (
    <main className="mx-auto flex w-full max-w-[var(--container-max)] flex-col items-center px-6 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)]">
        <Loader2 size={34} className="animate-spin motion-reduce:animate-none" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[var(--color-text)]">
        Confirming your payment…
      </h1>
      <p className="mt-2 max-w-md text-[var(--color-text-secondary)]">
        Hang tight while we verify your transaction with Khalti. This only takes
        a moment — please don&apos;t close or refresh this page.
      </p>
    </main>
  );
}
