"use client";

import Image from "next/image";
import { Car } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../_components/cn";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const main = images[active];

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-inset)]">
        {main ? (
          <Image src={main} alt={alt} fill className="object-cover" priority />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-primary)]/30">
            <Car size={72} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                i === active
                  ? "border-[var(--color-primary)]"
                  : "border-transparent hover:border-[var(--color-border-strong)]"
              )}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
