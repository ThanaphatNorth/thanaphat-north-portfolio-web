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
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative text-left"
    >
      {/* Image Container */}
      <div
        className={cn(
          "relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300",
          "border-2 min-h-[180px] sm:min-h-[200px]",
          isSelected
            ? "border-accent ring-2 ring-accent/20 shadow-lg shadow-accent/10"
            : "border-border group-hover:border-accent/50"
        )}
      >
        {/* Background Image */}
        <img
          src={
            portfolio.cover_image ||
            "/images/portfolio-placeholder.svg"
          }
          alt={portfolio.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{
            objectPosition: `${
              portfolio.cover_image_focal_x ?? 50
            }% ${portfolio.cover_image_focal_y ?? 50}%`,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/portfolio-placeholder.svg";
          }}
        />

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-background/40 transition-opacity duration-300",
            isSelected
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          )}
        />

        {/* Content Inside Card - Shows on hover */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-3 translate-y-full transition-transform duration-300 ease-out",
            isSelected ? "translate-y-0" : "group-hover:translate-y-0"
          )}
        >
          <div className="bg-background/70 backdrop-blur-md rounded-xl p-3 border border-border/40">
            {/* Category Badge */}
            <span
              className={cn(
                "inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-2 transition-colors",
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
                "text-base font-semibold line-clamp-2 transition-colors",
                isSelected ? "text-accent" : "text-foreground"
              )}
            >
              {portfolio.title}
            </h3>

            {/* Description Preview */}
            <p className="text-xs text-muted line-clamp-2 mt-1">
              {portfolio.description}
            </p>
          </div>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <motion.div
            layoutId="selectedIndicator"
            className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        )}
      </div>

      {/* Content Below Card - Always visible, hides on hover */}
      <div
        className={cn(
          "mt-3 transition-opacity duration-300",
          isSelected ? "opacity-0" : "group-hover:opacity-0"
        )}
      >
        {/* Category Badge */}
        <span
          className={cn(
            "inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-2",
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
            "text-base font-semibold line-clamp-2",
            isSelected ? "text-accent" : "text-foreground"
          )}
        >
          {portfolio.title}
        </h3>

        {/* Description Preview */}
        <p className="text-xs text-muted line-clamp-2 mt-1">
          {portfolio.description}
        </p>
      </div>
    </motion.button>
  );
}
