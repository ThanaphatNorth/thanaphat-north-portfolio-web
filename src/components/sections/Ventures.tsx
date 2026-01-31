"use client";

import { motion, Variants } from "framer-motion";
import { ExternalLink, Rocket, Sparkles, BookOpen } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { ventures } from "@/lib/constants";

const iconMap = {
  "JongQue.com": Rocket,
  "BuildYourThinks.com": Sparkles,
  "Visibr.com": BookOpen,
};

const statusColors = {
  Live: "bg-green-500/10 text-green-400 border-green-500/30",
  Beta: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "Coming Soon": "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export function Ventures() {
  return (
    <SectionWrapper id="ventures">
      <SectionHeader
        title="My Ventures"
        subtitle="Building the ecosystem of tools and platforms for modern businesses and entrepreneurs"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {ventures.map((venture, index) => {
          const Icon = iconMap[venture.name as keyof typeof iconMap];
          const statusColor =
            statusColors[venture.status as keyof typeof statusColors];

          return (
            <motion.a
              key={venture.name}
              href={venture.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 overflow-hidden cursor-pointer"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}
                  >
                    {venture.status}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300 flex items-center gap-2">
                  {venture.name}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>

                {/* Tagline */}
                <p className="text-accent text-sm font-medium mb-3">
                  {venture.tagline}
                </p>

                {/* Description */}
                <p className="text-muted text-sm leading-relaxed">
                  {venture.description}
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <ExternalLink className="w-5 h-5 text-accent" />
              </div>
            </motion.a>
          );
        })}
      </motion.div>

      {/* Ecosystem Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-foreground">
            More ventures coming soon
          </span>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
