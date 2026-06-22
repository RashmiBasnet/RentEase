"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Ban,
  Loader2,
  LocateFixed,
  MapPin,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { Button } from "../../_components/Button";
import { handleGetVehiclesNear } from "@/lib/actions/vehicle-action";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
const RADIUS_KM = 8;

function resolveImage(src?: string) {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  const cleanSrc = src.replace(/^\/+/, "");
  const path = cleanSrc.startsWith("uploads/") ? cleanSrc : `uploads/${cleanSrc}`;
  return `${API_BASE}/${path}`;
}

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

type Permission = "unsupported" | "prompt" | "granted" | "denied";

export function NearbyVehicles() {
  const [permission, setPermission] = useState<Permission>("prompt");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setPermission("unsupported");
      return;
    }
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setSecure(false);
    }
    if (!navigator.permissions?.query) return;
    let status: PermissionStatus | null = null;
    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((res) => {
        status = res;
        setPermission(res.state as Permission);
        res.onchange = () => setPermission(res.state as Permission);
      })
      .catch(() => {});
    return () => {
      if (status) status.onchange = null;
    };
  }, []);

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setPermission("unsupported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setPermission("granted");
        const res = await handleGetVehiclesNear({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          maxDistanceKm: RADIUS_KM,
        });
        setLoading(false);
        setSearched(true);
        if (res.success) {
          setResults(Array.isArray(res.data) ? res.data : []);
        } else {
          toast.error(res.message ?? "Could not find nearby vehicles");
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermission("denied");
          toast.error("Location permission denied");
        } else {
          toast.error("Could not get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const showResults = permission === "granted" && searched;

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
            <LocateFixed size={22} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">
              Vehicles near you
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Find available rentals within {RADIUS_KM} km of your location.
            </p>
          </div>
        </div>

        {showResults && (
          <Button
            variant="outline"
            onClick={requestLocation}
            disabled={loading}
            leftIcon={
              loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LocateFixed size={18} />
              )
            }
          >
            {loading ? "Locating..." : "Refresh"}
          </Button>
        )}
      </div>
      
      {!showResults && (
        <div className="border-t border-[var(--color-border)] px-6 py-8 text-center">
          {permission === "unsupported" ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Your browser doesn&apos;t support location services. Try browsing
              all locations below instead.
            </p>
          ) : permission === "denied" ? (
            <div className="mx-auto max-w-sm">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger-soft-bg)] text-[var(--color-danger-soft-text)]">
                <Ban size={24} />
              </span>
              <h3 className="mt-3 font-bold text-[var(--color-text)]">
                Location access is blocked
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Click the location icon in your browser&apos;s address bar, allow
                access for this site, then try again.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={requestLocation}
                disabled={loading}
                leftIcon={<LocateFixed size={16} />}
              >
                Try again
              </Button>
            </div>
          ) : (
            <div className="mx-auto max-w-md">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                <MapPin size={24} />
              </span>
              <h3 className="mt-3 font-bold text-[var(--color-text)]">
                Allow location access
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                RentEase uses your location only to show vehicles within{" "}
                {RADIUS_KM} km. We never store or share it.
              </p>

              {!secure && (
                <p className="mx-auto mt-3 inline-flex max-w-sm items-center gap-1.5 rounded-lg bg-[var(--color-warning-soft-bg)] px-3 py-2 text-xs text-[var(--color-warning-soft-text)]">
                  <TriangleAlert size={14} />
                  Location needs a secure connection. Open the site via
                  localhost or HTTPS.
                </p>
              )}

              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                <ShieldCheck size={14} className="text-[var(--color-primary)]" />
                Your privacy is protected
              </p>

              <div className="mt-4">
                <Button
                  size="lg"
                  onClick={requestLocation}
                  disabled={loading}
                  leftIcon={
                    loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <LocateFixed size={18} />
                    )
                  }
                >
                  {loading ? "Locating..." : "Allow location access"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="border-t border-[var(--color-border)] p-6">
          {results.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-inset)] p-6 text-center text-sm text-[var(--color-text-muted)]">
              No available vehicles found within {RADIUS_KM} km. Try browsing
              all locations below.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {results.slice(0, 6).map((v) => {
                const img = resolveImage(v.images?.[0]);
                return (
                  <li key={String(v._id)}>
                    <Link
                      href={`/rentals/${String(v._id)}`}
                      className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-3 no-underline transition-colors hover:border-[var(--color-primary)]"
                    >
                      <span className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-inset)]">
                        {img && (
                          <img
                            src={img}
                            alt={v.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-[var(--color-text)]">
                          {v.title}
                        </span>
                        <span className="block truncate text-xs text-[var(--color-text-muted)]">
                          {capitalize(v.type)} · Rs.{" "}
                          {Number(v.pricePerDay ?? 0).toLocaleString("en-US")}/day
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        className="shrink-0 text-[var(--color-text-muted)]"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
