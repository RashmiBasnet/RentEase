import Image from "next/image";

export function LandingHero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-slate-950">
      <div className="relative aspect-[3/2] max-h-[660px] w-full sm:aspect-[16/9]">
        <Image
          src="/images/landing_pic.png"
          alt="Vehicle on a scenic mountain road"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,33,58,0.40)_0%,rgba(3,36,66,0.18)_45%,rgba(0,24,71,0.72)_100%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl">
            Rent Smart, Travel Easy
          </h1>
          <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-white/90 sm:text-base">
            Find verified vehicles, transparent pricing, and hassle-free
            booking. RentEase helps you travel with confidence wherever the road
            takes you.
          </p>
        </div>
      </div>
    </section>
  );
}
