import { redirect } from "next/navigation";
import { getUserData } from "@/lib/cookie";
import { AdminShell } from "./_components/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserData();

  // Server-side guard in addition to the proxy redirect.
  if (!user) redirect("/sign-in?redirect=/admin");
  if (user.role !== "admin") redirect("/home");

  return (
    <AdminShell adminName={user.fullName ?? "Admin"}>{children}</AdminShell>
  );
}
