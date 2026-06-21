"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  CalendarCheck,
  Car,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  Star,
  X,
} from "lucide-react";
import { Logo } from "../../_components/Logo";
import { cn } from "../../_components/cn";
import { handleLogout } from "@/lib/actions/auth-action";

type AdminShellProps = {
  adminName: string;
  children: ReactNode;
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Vehicles", href: "/admin/vehicles", icon: Car },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Reports", href: "/admin/reports", icon: Flag },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

export function AdminShell({ adminName, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const onLogout = async () => {
    await handleLogout();
    router.push("/sign-in");
    router.refresh();
  };

  const SidebarContent = (
    <>
      <div className="px-5 py-5">
        <Logo />
        <p className="mt-1 pl-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Admin Console
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-colors",
              isActive(href)
                ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-inset)] hover:text-[var(--color-primary)]"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-danger-soft-text)] transition-colors hover:bg-[var(--color-danger-soft-bg)]"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface-inset)]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[var(--color-surface)]">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="text-[var(--color-text)] lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                {adminName}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Administrator
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-[var(--color-on-primary)]">
              {adminName.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
