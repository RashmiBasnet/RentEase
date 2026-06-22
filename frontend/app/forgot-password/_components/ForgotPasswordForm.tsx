"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { ArrowLeft, AtSign, MailCheck } from "lucide-react";
import { Button } from "@/app/_components/Button";
import { TextField } from "@/app/_components/TextField";
import { handleForgotPassword } from "@/lib/actions/auth-action";

const schema = z.object({
  email: z.email("Enter a valid email"),
});

type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: Values) => {
    setServerError(null);
    const res = await handleForgotPassword(values.email);
    if (res.success) {
      setSentTo(values.email);
      toast.success("Reset link sent. Check your inbox.");
      return;
    }
    setServerError(res.message);
    toast.error(res.message ?? "Could not send reset link.");
  };

  if (sentTo) {
    return (
      <div className="mt-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-success-soft-bg)] text-[var(--color-success-soft-text)]">
          <MailCheck size={22} />
        </div>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          If an account exists for{" "}
          <span className="font-semibold text-[var(--color-text)]">
            {sentTo}
          </span>
          , we&apos;ve sent a link to reset your password. The link expires in 1
          hour.
        </p>
        <Button href="/sign-in" variant="outline" fullWidth className="mt-6">
          Back to login
        </Button>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="mt-3 text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

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

      <TextField
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        icon={<AtSign size={18} />}
        error={errors.email?.message}
        {...register("email")}
      />

      <Button type="submit" size="lg" fullWidth className="mt-1" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>

      <Link
        href="/sign-in"
        className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text)] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to login
      </Link>
    </form>
  );
}
