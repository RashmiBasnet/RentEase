import { AlertTriangle, History, Search, XCircle } from "lucide-react";
import { Button } from "../../../_components/Button";

type PaymentIssueProps = {
  /** "unpaid" is an expected Khalti outcome; "error" means we couldn't tell. */
  kind: "unpaid" | "error";
  message: string;
};

export function PaymentIssue({ kind, message }: PaymentIssueProps) {
  const isUnpaid = kind === "unpaid";

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <span
        className={
          isUnpaid
            ? "flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-warning)] text-white"
            : "flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-danger)] text-white"
        }
      >
        {isUnpaid ? <AlertTriangle size={34} /> : <XCircle size={34} />}
      </span>
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
        {isUnpaid ? "Payment not completed" : "Something went wrong"}
      </h1>
      <p className="mt-2 max-w-md text-[var(--color-text-secondary)]">
        {message}
      </p>

      <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <Button
          href="/history"
          size="lg"
          fullWidth
          leftIcon={<History size={18} />}
        >
          View My Bookings
        </Button>
        <Button
          href="/rentals"
          variant="outline"
          size="lg"
          fullWidth
          leftIcon={<Search size={18} />}
        >
          Back to Rentals
        </Button>
      </div>
    </div>
  );
}
