import { ExternalLink, Rocket, Sparkles, BookOpen, Zap, Globe, Star, LucideIcon } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { getVentures, VentureItem } from "@/lib/supabase-server";
import { VenturesGrid } from "./VenturesGrid";

const iconMap: Record<string, LucideIcon> = {
  Rocket: Rocket,
  Sparkles: Sparkles,
  BookOpen: BookOpen,
  Zap: Zap,
  Globe: Globe,
  Star: Star,
};

const statusColors: Record<string, string> = {
  Live: "bg-green-500/10 text-green-400 border-green-500/30",
  Beta: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "Coming Soon": "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

export async function Ventures() {
  const ventures = await getVentures();

  if (ventures.length === 0) {
    return null;
  }

  // Prepare ventures with resolved icon components and status colors
  const venturesWithMeta = ventures.map((venture) => ({
    ...venture,
    iconName: venture.icon || "Rocket",
    statusColor: statusColors[venture.status] || statusColors["Coming Soon"],
  }));

  return (
    <SectionWrapper id="ventures">
      <SectionHeader
        title="My Ventures"
        subtitle="Building the ecosystem of tools and platforms for modern businesses and entrepreneurs"
      />

      <VenturesGrid ventures={venturesWithMeta} />

      {/* Ecosystem Note */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-foreground">
            More ventures coming soon
          </span>
        </div>
      </div>
    </SectionWrapper>
  );
}
