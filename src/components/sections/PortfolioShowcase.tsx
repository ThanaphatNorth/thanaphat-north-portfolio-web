"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioDetail } from "./PortfolioDetail";
import type { PortfolioItem } from "@/lib/supabase-server";

interface PortfolioShowcaseProps {
  portfolios: PortfolioItem[];
}

export function PortfolioShowcase({
  portfolios,
}: PortfolioShowcaseProps) {
  const [selectedId, setSelectedId] = useState<string>(
    portfolios[0]?.id || ""
  );

  const selectedPortfolio =
    portfolios.find((p) => p.id === selectedId) || portfolios[0];

  if (!selectedPortfolio) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Left: Cards Grid */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-5 xl:col-span-4"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 lg:gap-4 lg:max-h-[600px] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {portfolios.map((portfolio, index) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              isSelected={portfolio.id === selectedId}
              onClick={() => setSelectedId(portfolio.id)}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* Right: Detail Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-7 xl:col-span-8"
      >
        <div className="lg:sticky lg:top-24">
          <PortfolioDetail portfolio={selectedPortfolio} />
        </div>
      </motion.div>
    </div>
  );
}
