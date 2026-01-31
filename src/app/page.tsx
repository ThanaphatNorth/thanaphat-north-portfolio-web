import { Navigation } from "@/components/layout/Navigation";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ImpactDashboard } from "@/components/sections/ImpactDashboard";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { FreelanceServices } from "@/components/sections/FreelanceServices";
import { Ventures } from "@/components/sections/Ventures";
import { Philosophy } from "@/components/sections/Philosophy";
import { TechStack } from "@/components/sections/TechStack";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        <ImpactDashboard />
        <ExperienceTimeline />
        <FreelanceServices />
        <Ventures />
        <Philosophy />
        <TechStack />
      </main>
      <Footer />
    </>
  );
}
