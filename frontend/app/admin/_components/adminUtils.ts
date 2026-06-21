export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export function resolveImage(src?: string): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  const cleanSrc = src.replace(/^\/+/, "");
  const path = cleanSrc.startsWith("uploads/") ? cleanSrc : `uploads/${cleanSrc}`;
  return `${API_BASE}/${path}`;
}

export const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

export function formatDate(value?: string | Date): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const formatMoney = (amount?: number) =>
  amount === undefined || amount === null
    ? "—"
    : `Rs. ${Number(amount).toLocaleString("en-US")}`;

/** Maps a status string to Badge-style soft colour classes. */
export function statusTone(
  status?: string
): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "active":
    case "confirmed":
    case "resolved":
    case "completed":
      return "success";
    case "pending":
    case "reviewed":
      return "warning";
    case "cancelled":
    case "dismissed":
      return "danger";
    default:
      return "neutral";
  }
}
