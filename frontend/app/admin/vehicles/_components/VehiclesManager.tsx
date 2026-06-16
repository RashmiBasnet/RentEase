"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CircleCheck,
  CircleSlash,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "../../../_components/Button";
import { cn } from "../../../_components/cn";
import { StatusBadge } from "../../_components/StatusBadge";
import {
  capitalize,
  formatMoney,
  resolveImage,
} from "../../_components/adminUtils";
import {
  handleDeleteVehicle,
  handleToggleVehicleAvailability,
  handleToggleVehicleVerification,
} from "@/lib/actions/vehicle-action";
import { VehicleFormModal } from "./VehicleFormModal";

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50";

export function VehiclesManager({ vehicles }: { vehicles: any[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

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

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (v: any) => {
    setEditing(v);
    setModalOpen(true);
  };

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Vehicles
          </h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            {vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"} in the fleet.
          </p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={openCreate}>
          Add Vehicle
        </Button>
      </header>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[var(--color-surface-inset)] text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Price/Day</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Verified</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {vehicles.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-[var(--color-text-muted)]"
                  >
                    No vehicles yet. Add your first one.
                  </td>
                </tr>
              )}
              {vehicles.map((v) => {
                const id = String(v._id);
                const img = resolveImage(v.images?.[0]);
                const busy = pending && busyId === id;
                return (
                  <tr
                    key={id}
                    className={cn("align-middle", busy && "opacity-60")}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-10 w-14 shrink-0 overflow-hidden rounded-md bg-[var(--color-surface-inset)]">
                          {img && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={img}
                              alt={v.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[var(--color-text)]">
                            {v.title}
                          </p>
                          <p className="truncate text-xs text-[var(--color-text-muted)]">
                            {v.brand} {v.vehicleModel}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {capitalize(v.type)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-text)]">
                      {formatMoney(v.pricePerDay)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={v.isAvailable ? "available" : "booked"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {v.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-success-soft-text)]">
                          <BadgeCheck size={15} /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--color-text-muted)]">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          title={
                            v.isAvailable
                              ? "Mark unavailable"
                              : "Mark available"
                          }
                          disabled={busy}
                          onClick={() =>
                            run(id, () =>
                              handleToggleVehicleAvailability(id)
                            )
                          }
                          className={iconBtn}
                        >
                          {v.isAvailable ? (
                            <CircleSlash size={15} />
                          ) : (
                            <CircleCheck size={15} />
                          )}
                        </button>
                        <button
                          type="button"
                          title={v.isVerified ? "Unverify" : "Verify"}
                          disabled={busy}
                          onClick={() =>
                            run(id, () =>
                              handleToggleVehicleVerification(id)
                            )
                          }
                          className={cn(
                            iconBtn,
                            v.isVerified &&
                              "border-[var(--color-success)] text-[var(--color-success)]"
                          )}
                        >
                          <BadgeCheck size={15} />
                        </button>
                        <button
                          type="button"
                          title="Edit"
                          disabled={busy}
                          onClick={() => openEdit(v)}
                          className={iconBtn}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          disabled={busy}
                          onClick={() => {
                            if (
                              confirm(`Delete "${v.title}"? This cannot be undone.`)
                            ) {
                              run(id, () => handleDeleteVehicle(id));
                            }
                          }}
                          className={cn(
                            iconBtn,
                            "hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"
                          )}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <VehicleFormModal
        open={modalOpen}
        vehicle={editing}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
