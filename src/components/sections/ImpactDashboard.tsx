"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, Bug, ShieldCheck } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { BentoGrid, BentoCard } from "@/components/ui/BentoGrid";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { impactStats } from "@/lib/constants";

const icons = {
  0: Users,
  1: TrendingUp,
  2: Bug,
  3: ShieldCheck,
};

const iconColors = {
  0: "text-blue-400",
  1: "text-green-400",
  2: "text-orange-400",
  3: "text-purple-400",
};

const bgColors = {
  0: "bg-blue-400/10",
  1: "bg-green-400/10",
  2: "bg-orange-400/10",
  3: "bg-purple-400/10",
};

export function ImpactDashboard() {
  return (
    <SectionWrapper id="impact" className="bg-card/30">
      <SectionHeader
        title="Impact Dashboard"
        subtitle="Measurable results from years of engineering leadership and team optimization"
      />

      <BentoGrid columns={4}>
        {impactStats.map((stat, index) => {
          const Icon = icons[index as keyof typeof icons];
          const iconColor = iconColors[index as keyof typeof iconColors];
          const bgColor = bgColors[index as keyof typeof bgColors];

          return (
            <BentoCard key={stat.label} index={index} className="text-center">
              {/* Icon */}
              <div
                className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${bgColor} flex items-center justify-center`}
              >
                <Icon className={`w-7 h-7 ${iconColor}`} />
              </div>

              {/* Value */}
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                {stat.isText ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {stat.label}
                  </motion.span>
                ) : (
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={2}
                  />
                )}
              </div>

              {/* Label */}
              {!stat.isText && (
                <div className="text-lg font-medium text-foreground mb-1">
                  {stat.label}
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-muted">{stat.description}</p>
            </BentoCard>
          );
        })}
      </BentoGrid>

      {/* Additional context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-muted max-w-2xl mx-auto">
          These metrics represent the cumulative impact across multiple
          organizations, reflecting a consistent track record of driving
          efficiency, quality, and team growth.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
