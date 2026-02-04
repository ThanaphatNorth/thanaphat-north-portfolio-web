import { Suspense } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ImpactDashboard } from "@/components/sections/ImpactDashboard";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { Portfolio } from "@/components/sections/Portfolio";
import { FreelanceServices } from "@/components/sections/FreelanceServices";
import { Ventures } from "@/components/sections/Ventures";
import { Philosophy } from "@/components/sections/Philosophy";
import { TechStack } from "@/components/sections/TechStack";
import { LatestBlog } from "@/components/sections/LatestBlog";
import { getExperienceYears } from "@/lib/supabase-server";

// Loading skeleton for portfolio section
function PortfolioSkeleton() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="h-8 w-48 bg-card rounded animate-pulse mx-auto mb-4" />
          <div className="h-4 w-96 max-w-full bg-card rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: Cards Grid Skeleton */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 lg:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-card border border-border rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
          {/* Right: Detail Panel Skeleton */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="aspect-video bg-background animate-pulse" />
              <div className="p-6 md:p-8">
                <div className="h-6 w-24 bg-accent/10 rounded-full animate-pulse mb-4" />
                <div className="h-8 w-3/4 bg-card rounded animate-pulse mb-4" />
                <div className="h-20 w-full bg-card rounded animate-pulse mb-6" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-16 bg-background rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Loading skeleton for ventures section
function VenturesSkeleton() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="h-8 w-48 bg-card rounded animate-pulse mx-auto mb-4" />
          <div className="h-4 w-96 max-w-full bg-card rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl animate-pulse mb-4" />
              <div className="h-6 w-32 bg-card rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-card rounded animate-pulse mb-3" />
              <div className="h-16 w-full bg-card rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Loading skeleton for blog section
function BlogSkeleton() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="h-8 w-64 bg-card rounded animate-pulse mx-auto mb-4" />
          <div className="h-4 w-80 max-w-full bg-card rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <div className="aspect-video bg-card animate-pulse" />
              <div className="p-6">
                <div className="h-4 w-24 bg-card rounded animate-pulse mb-3" />
                <div className="h-6 w-full bg-card rounded animate-pulse mb-2" />
                <div className="h-12 w-full bg-card rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  // Fetch experience years server-side - no client-side waterfall
  const experience = await getExperienceYears();

  return (
    <>
      <CustomCursor />
      <Navigation />
      <main>
        <Hero experience={experience} />
        <ImpactDashboard />
        <ExperienceTimeline />
        {/* Portfolio section with split layout */}
        <Suspense fallback={<PortfolioSkeleton />}>
          <Portfolio />
        </Suspense>
        <FreelanceServices />
        {/* Suspense enables streaming - shell renders immediately, data streams in */}
        <Suspense fallback={<VenturesSkeleton />}>
          <Ventures />
        </Suspense>
        <Suspense fallback={<BlogSkeleton />}>
          <LatestBlog />
        </Suspense>
        <Philosophy />
        <TechStack />
      </main>
      <Footer />
    </>
  );
}
