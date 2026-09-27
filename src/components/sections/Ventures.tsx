import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { getVentures } from "@/lib/supabase-server";
import { VenturesGrid } from "./VenturesGrid";

export async function Ventures() {
  const ventures = await getVentures();
  if (ventures.length === 0) return null;

  return (
    <SectionWrapper id="ventures">
      <SectionHeader
        index="05"
        eyebrow="Ventures"
        title={<>Things I build <span className="font-serif-accent text-accent">after hours.</span></>}
        subtitle="Products I founded and run — where I test ideas on my own dime before recommending them to clients."
      />
      <VenturesGrid ventures={ventures.map((v) => ({ ...v, iconName: v.icon || "Rocket" }))} />
    </SectionWrapper>
  );
}
