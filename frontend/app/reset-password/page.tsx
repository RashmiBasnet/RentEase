import type { Metadata } from "next";
import { Suspense } from "react";
import { LockKeyhole } from "lucide-react";
import { AuthCard } from "@/app/_components/AuthCard";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password · RentEase",
  description: "Set a new password for your RentEase account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      icon={<LockKeyhole size={22} />}
      title="Set a new password"
      subtitle="Choose a strong password you don't use anywhere else."
    >
      <Suspense
        fallback={
          <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            Loading...
          </p>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
