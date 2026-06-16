"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Compass, Search } from "lucide-react";
import { Button } from "./Button";

export function RentalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/rentals?search=${encodeURIComponent(trimmed)}` : "/rentals");
  };

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-inset)] p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
        <Compass size={20} className="text-[var(--color-primary)]" />
        Next Adventure
      </h2>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4">
          <Search size={18} className="text-[var(--color-text-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your next rental"
            className="w-full bg-transparent py-3 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </div>
        <Button type="submit" size="lg" rightIcon={<ArrowRight size={18} />}>
          Search Vehicles
        </Button>
      </form>
    </section>
  );
}
