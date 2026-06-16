"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Logo } from "./Logo";
import { cn } from "./cn";

type NavLink = { label: string; href: string };

type NavbarProps = {
  links?: NavLink[];

  user?: { name: string; avatarUrl?: string };
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
};

const defaultLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Rentals", href: "/rentals" },
  { label: "Locations", href: "/locations" },
  { label: "History", href: "/history" },
];

type NavItemsProps = {
  links: NavLink[];
  pathname: string;
  onClick?: () => void;
};

function NavItems({ links, pathname, onClick }: NavItemsProps) {
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={cn(
            "text-sm font-medium no-underline transition-colors hover:text-[var(--color-primary)]",
            isActive(link.href)
              ? "text-[var(--color-primary)] underline decoration-2 underline-offset-8"
              : "text-[var(--color-text-secondary)]"
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

export function Navbar({
  links = defaultLinks,
  user,
  searchPlaceholder = "Search vehicles...",
  onSearch,
  className,
}: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur",
        className
      )}
    >
      <div className="mx-auto flex h-[var(--header-height)] max-w-[var(--container-max)] items-center gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          <NavItems links={links} pathname={pathname} />
        </nav>


        <div className="ml-auto hidden max-w-md flex-1 lg:block">
          <div className="flex items-center gap-2 rounded-full bg-[var(--color-surface-inset)] px-4 py-2.5">
            <Search size={18} className="text-[var(--color-text-muted)]" />
            <input
              type="search"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
            />
          </div>
        </div>


        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          {user ? (
            <Link href="/account" className="no-underline">
              <Avatar name={user.name} src={user.avatarUrl} showName />
            </Link>
          ) : (
            <Button href="/sign-in" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          )}


          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="text-[var(--color-text)] md:hidden"
          >
            {open ? <Menu size={22} className="hidden" /> : null}
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>


      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <NavItems
              links={links}
              pathname={pathname}
              onClick={() => setOpen(false)}
            />
          </nav>
          {!user && (
            <Button href="/sign-in" size="sm" fullWidth className="mt-4">
              Sign In
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
