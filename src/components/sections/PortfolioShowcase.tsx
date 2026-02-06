"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioDetail } from "./PortfolioDetail";
import type { PortfolioItem } from "@/lib/supabase-server";

interface PortfolioShowcaseProps {
  portfolios: PortfolioItem[];
}

export function PortfolioShowcase({
  portfolios,
}: PortfolioShowcaseProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Extract unique categories (types) from portfolios, handling comma-separated values
  const types = useMemo(() => {
    const allTypes = portfolios.flatMap((p) =>
      p.category
        ? p.category
            .split(", ")
            .map((t) => t.trim())
            .filter(Boolean)
        : []
    );
    return [...new Set(allTypes)].sort();
  }, [portfolios]);

  // Filter portfolios based on selected types (supports comma-separated categories)
  const filteredPortfolios = useMemo(() => {
    if (selectedTypes.length === 0) return portfolios;
    return portfolios.filter((p) => {
      const portfolioTypes = p.category
        ? p.category
            .split(", ")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      return portfolioTypes.some((t) => selectedTypes.includes(t));
    });
  }, [portfolios, selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const selectedPortfolio = selectedId
    ? portfolios.find((p) => p.id === selectedId)
    : null;

  const handleCardClick = (id: string) => {
    setSelectedId(id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    // Delay clearing the selected ID to allow exit animation
    setTimeout(() => setSelectedId(null), 300);
  }, []);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        handleCloseDrawer();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () =>
      document.removeEventListener("keydown", handleEscape);
  }, [isDrawerOpen, handleCloseDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (portfolios.length === 0) {
    return null;
  }

  return (
    <>
      {/* Type Filter - Multi Select */}
      {types.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center gap-2 mb-6"
        >
          <button
            onClick={() => setSelectedTypes([])}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
              selectedTypes.length === 0
                ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                : "bg-card border-border text-muted hover:text-foreground hover:border-accent/50"
            )}
          >
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                selectedTypes.includes(type)
                  ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                  : "bg-card border-border text-muted hover:text-foreground hover:border-accent/50"
              )}
            >
              {type}
            </button>
          ))}
        </motion.div>
      )}

      {/* Portfolio Cards Grid - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredPortfolios.map((portfolio, index) => (
              <motion.div
                key={portfolio.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <PortfolioCard
                  portfolio={portfolio}
                  isSelected={portfolio.id === selectedId}
                  onClick={() => handleCardClick(portfolio.id)}
                  index={index}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state when no portfolios match filter */}
        {filteredPortfolios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted text-sm">
              No projects found for the selected types.
            </p>
          </div>
        )}
      </motion.div>

      {/* Slide-in Drawer from Right */}
      <AnimatePresence>
        {isDrawerOpen && selectedPortfolio && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              className="fixed top-0 right-0 h-full w-full sm:w-[90%] md:w-[70%] lg:w-[55%] xl:w-[45%] bg-card border-l border-border z-50 overflow-hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-foreground truncate pr-4">
                  {selectedPortfolio.title}
                </h2>
                <button
                  onClick={handleCloseDrawer}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border text-foreground hover:bg-accent/10 hover:border-accent/50 transition-[background-color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  aria-label="Close drawer"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Drawer Content - Scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <PortfolioDetail portfolio={selectedPortfolio} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
