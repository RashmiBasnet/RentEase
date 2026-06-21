import { getUserData } from "@/lib/cookie";
import { handleGetProfile } from "@/lib/actions/user-action";
import { Navbar } from "./Navbar";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function resolveImage(src?: string) {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  const cleanSrc = src.replace(/^\/+/, "");
  const path = cleanSrc.startsWith("uploads/") ? cleanSrc : `uploads/${cleanSrc}`;
  return `${API_BASE}/${path}`;
}

const links = [
  { label: "Home", href: "/home" },
  { label: "Rentals", href: "/rentals" },
  { label: "Locations", href: "/locations" },
  { label: "History", href: "/history" },
];

export async function SiteNavbar() {
  let user = await getUserData();

  if (user && !user.fullName) {
    const res = await handleGetProfile();
    if (res.success && res.data) {
      user = { ...user, ...res.data };
    }
  }

  return (
    <Navbar
      user={
        user
          ? {
              name: user.fullName ?? "Account",
              avatarUrl: resolveImage(user.profilePicture),
            }
          : undefined
      }
      links={links}
    />
  );
}
