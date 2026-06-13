import Link from "next/link";
import { AtSign, Globe, Send } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "./cn";

type FooterColumn = { title: string; links: { label: string; href: string }[] };

type FooterProps = {
  columns?: FooterColumn[];
  tagline?: string;
  className?: string;
};

const defaultColumns: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Partner with Us", href: "/partner" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Safety Guidelines", href: "/safety" },
      { label: "Rental Terms", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const socials = [
  { label: "Twitter", href: "https://twitter.com", Icon: Send },
  { label: "Instagram", href: "https://instagram.com", Icon: AtSign },
  { label: "Website", href: "/", Icon: Globe },
];


export function Footer({
  columns = defaultColumns,
  tagline = "Reliable transport across Nepal.",
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]",
        className
      )}
    >
      <div className="mx-auto grid max-w-[var(--container-max)] gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">

        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} RentEase Vehicle Rentals. {tagline}
          </p>
          <div className="mt-4 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-secondary)] no-underline transition-colors hover:text-[var(--color-primary)]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>


        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text)]">
              {col.title}
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
