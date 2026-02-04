import {
  SectionWrapper,
  SectionHeader,
} from "@/components/ui/SectionWrapper";
import { getPortfolios } from "@/lib/supabase-server";
import { PortfolioShowcase } from "./PortfolioShowcase";

export async function Portfolio() {
  const portfolios = await getPortfolios();

  if (portfolios.length === 0) {
    return null;
  }

  return (
    <SectionWrapper id="portfolio">
      <SectionHeader
        title="My Portfolio"
        subtitle="A showcase of projects I've built for clients and personal ventures"
      />

      <PortfolioShowcase portfolios={portfolios} />
    </SectionWrapper>
  );
}
