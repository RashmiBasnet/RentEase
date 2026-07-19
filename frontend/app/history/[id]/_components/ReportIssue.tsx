"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CheckCircle2, Flag } from "lucide-react";
import { Button } from "../../../_components/Button";
import { Modal } from "../../../_components/Modal";
import { Select } from "../../../_components/Select";
import { handleCreateReport } from "@/lib/actions/report-action";
import type { ReportReason } from "@/lib/api/report/report";

type ReportIssueProps = {
  vehicleId: string;
  vehicleTitle: string;
  /** Whether the user has already filed a report for this vehicle. */
  alreadyReported?: boolean;
};

const reasons: { value: ReportReason; label: string }[] = [
  { value: "poor_condition", label: "Poor vehicle condition" },
  { value: "misleading_info", label: "Misleading information" },
  { value: "fake_listing", label: "Fake listing" },
  { value: "scam", label: "Scam or fraud" },
  { value: "other", label: "Something else" },
];

/** The API rejects anything shorter. */
const MIN_DESCRIPTION = 10;

export function ReportIssue({
  vehicleId,
  vehicleTitle,
  alreadyReported,
}: ReportIssueProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>(reasons[0].value);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justReported, setJustReported] = useState(false);

  // One report per vehicle is enforced server-side, so an existing report
  // means this booking can't be reported again.
  const reported = justReported || Boolean(alreadyReported);

  const remaining = MIN_DESCRIPTION - description.trim().length;

  const close = () => {
    if (submitting) return;
    setOpen(false);
  };

  const submit = async () => {
    if (description.trim().length < MIN_DESCRIPTION) {
      toast.error(`Please describe the issue in at least ${MIN_DESCRIPTION} characters`);
      return;
    }

    setSubmitting(true);
    const res = await handleCreateReport({
      vehicleId,
      reason,
      description: description.trim(),
    });
    setSubmitting(false);

    if (res.success) {
      toast.success("Report submitted — our team will look into it.");
      setJustReported(true);
      setOpen(false);
      setDescription("");
      router.refresh();
    } else {
      toast.error(res.message ?? "Could not submit the report");
    }
  };

  if (reported) {
    return (
      <Button
        href="/account"
        variant="outline"
        leftIcon={<CheckCircle2 size={16} />}
      >
        Reported
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        leftIcon={<Flag size={16} />}
        onClick={() => setOpen(true)}
      >
        Report Issue
      </Button>

      <Modal
        open={open}
        onClose={close}
        title="Report an issue"
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Report"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          Tell us what went wrong with{" "}
          <span className="font-semibold text-[var(--color-text)]">
            {vehicleTitle}
          </span>
          . Our team reviews every report.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <Select
            name="reason"
            label="What's the problem?"
            value={reason}
            onChange={(e) => setReason(e.target.value as ReportReason)}
          >
            {reasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              Describe the issue
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Share what happened, including dates or details that would help us investigate."
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-inset)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-shadow focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-focus)]"
            />
            <span className="text-xs text-[var(--color-text-muted)]">
              {remaining > 0
                ? `${remaining} more character${remaining === 1 ? "" : "s"} needed`
                : "Thanks — that's enough detail to get started."}
            </span>
          </label>
        </div>
      </Modal>
    </>
  );
}
