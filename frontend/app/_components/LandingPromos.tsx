import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

export function LandingPromos() {
  return (
    <section className="mx-auto max-w-[var(--container-max)] px-6 pb-24">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl bg-slate-900 p-9">
          <Image
            src="/images/review_ratings_image.png"
            alt="Happy renters sharing their experience"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,42,91,0.78)_0%,rgba(11,42,91,0.35)_55%,rgba(11,42,91,0.20)_100%)]" />
          <div className="relative">
            <h3 className="text-3xl font-extrabold text-white">
              Reviews &amp; Ratings
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
              Read authentic ratings and experiences from previous renters to
              make confident booking decisions.
            </p>
            <Link
              href="/reviews"
              className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--color-primary)] no-underline transition-colors hover:bg-white/90 hover:no-underline"
            >
              View More
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[300px] flex-col justify-center overflow-hidden rounded-2xl bg-slate-900 p-9">
          <Image
            src="/images/fast_easy_booking_image.png"
            alt="Booking a vehicle on the go"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(120,73,12,0.82)_0%,rgba(120,73,12,0.45)_55%,rgba(120,73,12,0.25)_100%)]" />
          <div className="relative">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white"
              aria-hidden
            >
              <Tag size={22} />
            </span>
            <h3 className="mt-5 text-3xl font-extrabold text-white">
              Fast &amp; Easy Booking
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
              Find, compare, and reserve your vehicle in just a few simple steps
              with a streamlined booking process designed to save time.
            </p>
            <Link
              href="/rentals"
              className="mt-6 inline-flex w-fit items-center gap-1 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              Learn more about Booking Process
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
