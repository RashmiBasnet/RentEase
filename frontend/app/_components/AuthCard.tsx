import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({
  icon,
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-surface-muted)] px-6 py-12">
      <div className="w-full max-w-[420px]">
        <Link
          href="/"
          className="mb-8 block text-center text-2xl font-extrabold tracking-tight text-[var(--color-text)] no-underline hover:no-underline"
        >
          RentEase
        </Link>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)]">
            {icon}
          </div>
          <h1 className="mt-5 text-center text-2xl font-extrabold tracking-tight text-[var(--color-text)]">
            {title}
          </h1>
          <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
            {subtitle}
          </p>

          {children}
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
            {footer}
          </p>
        )}
      </div>
    </main>
  );
}
