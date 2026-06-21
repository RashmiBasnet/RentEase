import { FeatureCard } from "./FeatureCard";
import { landingFeatures } from "./landingData";

export function LandingFeatures() {
  return (
    <section className="mx-auto max-w-[var(--container-max)] px-6 py-20">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
          Why Book with RentEase?
        </h2>
        <span className="mt-3 h-1 w-16 rounded-full bg-[var(--color-primary)]" />
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {landingFeatures.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
