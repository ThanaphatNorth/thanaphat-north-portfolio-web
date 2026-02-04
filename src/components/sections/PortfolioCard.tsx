"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/lib/supabase-server";

interface PortfolioCardProps {
  portfolio: PortfolioItem;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function PortfolioCard({
  portfolio,
  isSelected,
  onClick,
  index,
}: PortfolioCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative aspect-[4/3] rounded-xl overflow-hidden text-left transition-all duration-300",
        "border-2",
        isSelected
          ? "border-accent ring-2 ring-accent/20 shadow-lg shadow-accent/10"
          : "border-border hover:border-accent/50"
      )}
    >
      {/* Background Image */}
      {portfolio.cover_image ? (
        <img
          src={portfolio.cover_image}
          alt={portfolio.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
      )}

      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent transition-opacity duration-300",
          isSelected
            ? "opacity-90"
            : "opacity-70 group-hover:opacity-80"
        )}
      />

      {/* Content */}
      <div className="absolute inset-0 p-3 flex flex-col justify-end">
        {/* Category Badge */}
        <span
          className={cn(
            "self-start px-2 py-0.5 rounded-full text-[10px] font-medium mb-1.5 transition-colors",
            isSelected
              ? "bg-accent text-white"
              : "bg-accent/20 text-accent"
          )}
        >
          {portfolio.category}
        </span>

        {/* Title */}
        <h3
          className={cn(
            "text-sm font-semibold line-clamp-2 transition-colors",
            isSelected ? "text-accent" : "text-foreground"
          )}
        >
          {portfolio.title}
        </h3>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          layoutId="selectedIndicator"
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
