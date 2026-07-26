import { handleGetProfile } from "@/lib/actions/user-action";
import { handleGetMyReports } from "@/lib/actions/report-action";
import { getUserData } from "@/lib/cookie";
import { Footer } from "../_components/Footer";
import { SiteNavbar } from "../_components/SiteNavbar";
import { MyReports } from "./_components/MyReports";
import { ProfileView } from "./_components/ProfileView";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function resolveImage(src?: string) {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  const cleanSrc = src.replace(/^\/+/, "");
  const path = cleanSrc.startsWith("uploads/") ? cleanSrc : `uploads/${cleanSrc}`;
  return `${API_BASE}/${path}`;
}

export default async function AccountPage() {
  const [cached, res, reportsRes] = await Promise.all([
    getUserData(),
    handleGetProfile(),
    handleGetMyReports(),
  ]);

  const profile = res.success && res.data ? res.data : cached ?? {};
  const avatarUrl = resolveImage(profile.profilePicture);
  // The API wraps the list: { reports, total }.
  const reports = reportsRes.success ? reportsRes.data?.reports ?? [] : [];

  return (
    <>
      <SiteNavbar />

      <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
        <ProfileView profile={{ ...profile, avatarUrl }} />
        <MyReports reports={reports} />
      </main>

      <Footer />
    </>
  );
}
