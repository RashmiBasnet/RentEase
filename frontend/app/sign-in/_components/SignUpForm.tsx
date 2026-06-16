"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AtSign, Phone, User } from "lucide-react";
import { Button } from "@/app/_components/Button";
import { TextField } from "@/app/_components/TextField";
import { PasswordField } from "@/app/_components/PasswordField";
import { handleRegister } from "@/lib/actions/auth-action";

const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

/** `onSuccess` lets the parent switch back to the Login tab after registration. */
export function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    setServerError(null);
    setSuccess(null);
    const res = await handleRegister(values);
    if (res.success) {
      setSuccess("Account created! You can now log in.");
      reset();
      onSuccess?.();
      return;
    }
    setServerError(res.message);
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
      {success && (
        <p className="rounded-lg bg-[var(--color-success-soft-bg)] px-4 py-2.5 text-sm text-[var(--color-success-soft-text)]">
          {success}
        </p>
      )}

      <TextField
        label="Full Name"
        placeholder="Your full name"
        autoComplete="name"
        icon={<User size={18} />}
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <TextField
        label="Phone Number"
        type="tel"
        placeholder="98XXXXXXXX"
        autoComplete="tel"
        icon={<Phone size={18} />}
        error={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />

      <TextField
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        icon={<AtSign size={18} />}
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        label="Password"
        placeholder="Enter your password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        size="lg"
        fullWidth
        className="mt-1"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
