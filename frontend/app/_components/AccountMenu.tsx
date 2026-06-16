"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Clock, LogOut, User } from "lucide-react";
import { Avatar } from "./Avatar";
import { cn } from "./cn";
import { handleLogout } from "@/lib/actions/auth-action";

type AccountMenuProps = {
  name: string;
  avatarUrl?: string;
  className?: string;
};

const menuLinks = [
  { label: "Profile", href: "/account", icon: User },
  { label: "My Trips", href: "/history", icon: Clock },
];

export function AccountMenu({ name, avatarUrl, className }: AccountMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  // Small delay so a brief mouse slip doesn't snap the menu shut.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      cancelClose();
    };
  }, []);

  const onLogout = async () => {
    setLoggingOut(true);
    await handleLogout();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", className)}
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-full outline-none focus-visible:shadow-[var(--shadow-focus)]"
      >
        <Avatar name={name} src={avatarUrl} showName />
      </button>

      {open && (
        // pt-2 keeps an invisible bridge between trigger and panel so hover holds.
        <div className="absolute right-0 top-full z-50 pt-2">
          <div
            role="menu"
            className="w-60 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]"
          >
            <div className="px-4 pb-3 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Account
              </p>
              <p className="mt-1 truncate text-base font-bold text-[var(--color-text)]">
                {name}
              </p>
            </div>

            <div className="border-t border-[var(--color-border)] py-1.5">
              {menuLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] no-underline transition-colors hover:bg-[var(--color-surface-inset)] hover:text-[var(--color-primary)]"
                >
                  <Icon size={17} />
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t border-[var(--color-border)] py-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={onLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[var(--color-danger-soft-text)] transition-colors hover:bg-[var(--color-danger-soft-bg)] disabled:opacity-60"
              >
                <LogOut size={17} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
