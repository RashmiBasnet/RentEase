import { Footer } from "./_components/Footer";
import { LandingFeatures } from "./_components/LandingFeatures";
import { LandingFleet } from "./_components/LandingFleet";
import { LandingHero } from "./_components/LandingHero";
import { LandingPromos } from "./_components/LandingPromos";
import { Navbar } from "./_components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingHero />

      <main>
        <LandingFeatures />
        <LandingFleet />
        <LandingPromos />
      </main>

      <Footer />
    </>
  );
}
