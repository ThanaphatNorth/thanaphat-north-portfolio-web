import { SectionHeader } from "@/components/ui/SectionWrapper";
import { getPortfolios } from "@/lib/supabase-server";
import { PortfolioShowcase } from "./PortfolioShowcase";

export async function Portfolio() {
  const portfolios = await getPortfolios();
  if (portfolios.length === 0) return null;

  return (
    <section id="work" className="relative pt-20 md:pt-28 lg:pt-36 pb-20 scroll-mt-16" data-testid="work">
      <span id="portfolio" className="absolute -top-16" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHeader
          index="02"
          eyebrow="Selected work"
          title={<>Systems I&apos;ve <span className="font-serif-accent text-accent">shipped.</span></>}
          subtitle="Products and platforms built for clients and my own ventures. Open any frame for the case study."
        />
      </div>
      <PortfolioShowcase portfolios={portfolios} />
    </section>
  );
}
