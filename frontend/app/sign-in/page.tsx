"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Star, StarHalf } from "lucide-react";
import { LoginForm } from "./_components/LoginForm";
import { SignUpForm } from "./_components/SignUpForm";

const travelers = [
  { name: "A", tone: "from-[#0f766e] to-[#39c6a2]" },
  { name: "V", tone: "from-[#2563eb] to-[#7dd3fc]" },
  { name: "S", tone: "from-[#c2410c] to-[#fbbf24]" },
];

type Tab = "login" | "signup";

export default function SignInPage() {
  const [tab, setTab] = useState<Tab>("login");
  const isLogin = tab === "login";

  return (
    <main className="grid min-h-screen bg-[var(--color-surface-muted)] lg:grid-cols-[55%_45%]">
      {/* Brand / hero panel */}
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

      {/* Form panel */}
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

          {/* Tabs */}
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

          {isLogin ? (
            <LoginForm />
          ) : (
            <SignUpForm onSuccess={() => setTab("login")} />
          )}

          {/* Footer */}
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
