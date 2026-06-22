import type { Metadata } from "next";
import { KeyRound } from "lucide-react";
import { AuthCard } from "@/app/_components/AuthCard";
import { ForgotPasswordForm } from "./_components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password · RentEase",
  description: "Reset your RentEase account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      icon={<KeyRound size={22} />}
      title="Forgot password?"
      subtitle="Enter the email linked to your account and we'll send you a link to reset your password."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
