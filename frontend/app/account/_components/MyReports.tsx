import Link from "next/link";
import { Flag } from "lucide-react";
import { cn } from "../../_components/cn";

type Report = {
  _id: string;
  reason: string;
  description: string;
  status: string;
  createdAt?: string;
  vehicleId?: {
    _id?: string;
    title?: string;
    brand?: string;
    vehicleModel?: string;
  } | null;
};

const reasonLabel: Record<string, string> = {
  fake_listing: "Fake listing",
  poor_condition: "Poor vehicle condition",
  scam: "Scam or fraud",
  misleading_info: "Misleading information",
  other: "Something else",
};

const statusPill: Record<string, string> = {
  pending: "bg-[var(--color-warning-soft-bg)] text-[var(--color-warning-soft-text)]",
  reviewed: "bg-[var(--color-primary-50)] text-[var(--color-primary)]",
  resolved: "bg-[var(--color-success-soft-bg)] text-[var(--color-success-soft-text)]",
  dismissed: "bg-[var(--color-surface-inset)] text-[var(--color-text-muted)]",
};

const statusNote: Record<string, string> = {
  pending: "Waiting for our team to review.",
  reviewed: "Our team has looked at this and is following up.",
  resolved: "This has been resolved.",
  dismissed: "We reviewed this and took no further action.",
};

const fmtDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

export function MyReports({ reports }: { reports: Report[] }) {
  return (
    <section className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
            <Flag size={18} className="text-[var(--color-primary)]" />
            My Reports
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Issues you&rsquo;ve raised about vehicles you rented.
          </p>
        </div>
        {reports.length > 0 && (
          <span className="shrink-0 rounded-full bg-[var(--color-surface-inset)] px-3 py-1 text-sm font-semibold text-[var(--color-text-secondary)]">
            {reports.length}
          </span>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-inset)] p-8 text-center">
          <p className="font-semibold text-[var(--color-text)]">
            No reports yet
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            If something goes wrong with a rental, you can report it from your{" "}
            <Link
              href="/history"
              className="font-semibold text-[var(--color-primary)] no-underline hover:underline"
            >
              booking history
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {reports.map((r) => {
            const v = r.vehicleId;
            const title = v?.title ?? "Vehicle no longer listed";
            const status = r.status ?? "pending";

            return (
              <li
                key={r._id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-inset)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    {v?._id ? (
                      <Link
                        href={`/rentals/${v._id}`}
                        className="font-bold text-[var(--color-text)] no-underline hover:text-[var(--color-primary)]"
                      >
                        {title}
                      </Link>
                    ) : (
                      <span className="font-bold text-[var(--color-text)]">
                        {title}
                      </span>
                    )}
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                      {reasonLabel[r.reason] ?? r.reason} ·{" "}
                      {fmtDate(r.createdAt)}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                      statusPill[status] ?? statusPill.dismissed
                    )}
                  >
                    {status}
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {r.description}
                </p>

                <p className="mt-3 border-t border-[var(--color-border)] pt-2 text-xs text-[var(--color-text-muted)]">
                  {statusNote[status] ?? ""}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
