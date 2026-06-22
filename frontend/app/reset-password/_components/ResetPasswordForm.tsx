"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/app/_components/Button";
import { PasswordField } from "@/app/_components/PasswordField";
import { handleResetPassword } from "@/lib/actions/auth-action";

const schema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";

  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <div className="mt-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger-soft-bg)] text-[var(--color-danger-soft-text)]">
          <TriangleAlert size={22} />
        </div>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          This reset link is invalid or incomplete. Please request a new one.
        </p>
        <Button href="/forgot-password" fullWidth className="mt-6">
          Request a new link
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mt-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-success-soft-bg)] text-[var(--color-success-soft-text)]">
          <CircleCheck size={22} />
        </div>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          Your password has been reset. You can now log in with your new
          password.
        </p>
        <Button href="/sign-in" fullWidth className="mt-6">
          Go to login
        </Button>
      </div>
    );
  }

  const onSubmit = async (values: Values) => {
    setServerError(null);
    const res = await handleResetPassword(token, values.newPassword);
    if (res.success) {
      setDone(true);
      toast.success("Password reset successful.");
      router.refresh();
      return;
    }
    setServerError(res.message);
    toast.error(res.message ?? "Could not reset password.");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-4"
      noValidate
    >
      {serverError && (
        <p className="rounded-lg bg-[var(--color-danger-soft-bg)] px-4 py-2.5 text-sm text-[var(--color-danger-soft-text)]">
          {serverError}
        </p>
      )}

      <PasswordField
        label="New password"
        placeholder="Enter a new password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <PasswordField
        label="Confirm password"
        placeholder="Re-enter your new password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" size="lg" fullWidth className="mt-1" disabled={isSubmitting}>
        {isSubmitting ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}
