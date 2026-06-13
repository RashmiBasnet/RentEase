"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  AtSign,
  Eye,
  EyeOff,
  LockKeyhole,
  Phone,
  ShieldCheck,
  Star,
  StarHalf,
  User,
} from "lucide-react";
import { Button } from "../_components/Button";

const travelers = [
  { name: "A", tone: "from-[#0f766e] to-[#39c6a2]" },
  { name: "V", tone: "from-[#2563eb] to-[#7dd3fc]" },
  { name: "S", tone: "from-[#c2410c] to-[#fbbf24]" },
];

const fieldBox =
  "flex items-stretch overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow duration-200 focus-within:border-[var(--color-primary)] focus-within:shadow-[var(--shadow-focus)]";
const fieldInput =
  "w-full bg-transparent py-3 pl-2 pr-4 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]";
const fieldLabel = "text-sm font-medium text-[var(--color-text-secondary)]";

type FieldProps = {
  id: string;
  label: string;
  icon: ReactNode;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
};

function Field({
  id,
  label,
  icon,
  type = "text",
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <div className={fieldBox}>
        <span className="flex items-center pl-3 text-[var(--color-text-muted)]">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={fieldInput}
        />
      </div>
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;

  action?: ReactNode;
};

function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  action,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className={fieldLabel}>
          {label}
        </label>
        {action}
      </div>
      <div className={fieldBox}>
        <span className="flex items-center pl-3 text-[var(--color-text-muted)]">
          <LockKeyhole size={18} />
        </span>
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent py-3 pl-2 pr-2 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="flex items-center px-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    </div>
  );
}

type Tab = "login" | "signup";

export default function SignInPage() {
  const [tab, setTab] = useState<Tab>("login");
  const isLogin = tab === "login";

  return (
    <main className="grid min-h-screen bg-[var(--color-surface-muted)] lg:grid-cols-[55%_45%]">

      <section className="relative isolate min-h-[420px] overflow-hidden bg-slate-950 text-white lg:min-h-screen">
        <Image
          src="/images/login_signup_image.png"
          alt="Snow-capped Himalayan peaks"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,38,71,0.30)_0%,rgba(6,28,58,0.35)_45%,rgba(3,15,48,0.92)_100%)]" />

        <div className="relative flex h-full min-h-[420px] flex-col p-8 sm:p-12 lg:min-h-screen lg:p-16">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            RentEase
          </span>

          <div className="mt-auto max-w-md">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Rent Smart, Travel Easy
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">
              Transparent pricing, verified vehicles, and hassle-free booking.
              RentEase is your trusted partner for convenient vehicle rentals.
            </p>

            <div className="mt-7 flex items-center gap-4">
              <div className="flex -space-x-3">
                {travelers.map((t) => (
                  <span
                    key={t.name}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${t.tone} text-sm font-bold text-white`}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-[#39c6a2]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                  ))}
                  <StarHalf size={18} fill="currentColor" strokeWidth={0} />
                </div>
                <p className="mt-1 text-xs font-medium text-white/85">
                  Joined by 10,000+ verified travelers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-[360px]">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)]">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {isLogin
                ? "Access your rentals and plan your next trip."
                : "Sign up to start booking verified vehicles."}
            </p>
          </div>


          <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-[var(--color-surface-inset)] p-1">
            {(["login", "signup"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`rounded-md py-2.5 text-sm font-semibold transition-colors ${
                  tab === value
                    ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                {value === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            {!isLogin && (
              <>
                <Field
                  id="fullName"
                  label="Full Name"
                  icon={<User size={18} />}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                <Field
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  icon={<Phone size={18} />}
                  placeholder="98XXXXXXXX"
                  autoComplete="tel"
                />
              </>
            )}

            <Field
              id="email"
              label="Email"
              type="email"
              icon={<AtSign size={18} />}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <PasswordField
              id="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              action={
                isLogin ? (
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-[var(--color-primary)] no-underline hover:underline"
                  >
                    Forgot Password?
                  </Link>
                ) : undefined
              }
            />

            {!isLogin && (
              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
            )}

            <Button type="submit" size="lg" fullWidth className="mt-1">
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </form>


          <div className="mt-8">
            <hr className="border-[var(--color-border)]" />
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium text-[var(--color-text-secondary)]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[var(--color-success)]" />
                Verified Providers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[var(--color-success)]" />
                Secure Payment
              </span>
            </div>
            <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
              By continuing, you agree to RentEase&apos;s{" "}
              <Link href="/terms" className="text-[var(--color-primary)]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[var(--color-primary)]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
