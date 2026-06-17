"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { AtSign } from "lucide-react";
import { Button } from "@/app/_components/Button";
import { TextField } from "@/app/_components/TextField";
import { PasswordField } from "@/app/_components/PasswordField";
import { handleLogin } from "@/lib/actions/auth-action";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    const res = await handleLogin(values);
    if (res.success) {
      toast.success(`Welcome back, ${res.data?.user?.fullName?.split(" ")[0] ?? "there"}!`);
      router.push(res.data?.user?.role === "admin" ? "/admin" : "/home");
      router.refresh();
      return;
    }
    setServerError(res.message);
    toast.error(res.message ?? "Login failed. Check your credentials.");
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
        autoComplete="current-password"
        error={errors.password?.message}
        action={
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-[var(--color-primary)] no-underline hover:underline"
          >
            Forgot Password?
          </Link>
        }
        {...register("password")}
      />

      <Button
        type="submit"
        size="lg"
        fullWidth
        className="mt-1"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
