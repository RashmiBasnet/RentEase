"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { cn } from "../../../_components/cn";
import { StatusBadge } from "../../_components/StatusBadge";
import { capitalize, formatDate } from "../../_components/adminUtils";
import {
  handleDeleteReport,
  handleUpdateReportStatus,
} from "@/lib/actions/report-action";
import type { ReportStatus } from "@/lib/api/report/report";

const STATUS_OPTIONS: ReportStatus[] = [
  "pending",
  "reviewed",
  "resolved",
  "dismissed",
];
const FILTERS: (ReportStatus | "all")[] = ["all", ...STATUS_OPTIONS];

const reasonLabel = (reason?: string) =>
  capitalize(String(reason ?? "").replace(/_/g, " ")) || "—";

export function ReportsManager({ reports }: { reports: any[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReportStatus | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? reports : reports.filter((r) => r.status === filter)),
    [reports, filter]
  );

  const run = (id: string, fn: () => Promise<{ success: boolean; message?: string }>) => {
    setBusyId(id);
    startTransition(async () => {
      const res = await fn();
      setBusyId(null);
      if (!res.success) {
        alert(res.message ?? "Action failed");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div>
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Reports
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Review reports submitted against listings.
        </p>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === s
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                : "border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center text-[var(--color-text-muted)]">
            No reports to show.
          </div>
        )}

        {filtered.map((r) => {
          const id = String(r._id);
          const busy = pending && busyId === id;
          return (
            <div
              key={id}
              className={cn(
                "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
                busy && "opacity-60"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-[var(--color-text)]">
                      {r.vehicleId?.title ?? "Vehicle"}
                    </h3>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text-secondary)]">
                    {reasonLabel(r.reason)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    {r.description}
                  </p>
                  <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                    Reported by {r.reportedBy?.fullName ?? "Unknown"} ·{" "}
                    {formatDate(r.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={r.status}
                    disabled={busy}
                    onChange={(e) =>
                      run(id, () =>
                        handleUpdateReportStatus(
                          id,
                          e.target.value as ReportStatus
                        )
                      )
                    }
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm capitalize text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    title="Delete report"
                    disabled={busy}
                    onClick={() => {
                      if (confirm("Delete this report?")) {
                        run(id, () => handleDeleteReport(id));
                      }
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
