"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Calendar,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/lib/supabase-server";

interface PortfolioDetailProps {
  portfolio: PortfolioItem;
}

export function PortfolioDetail({ portfolio }: PortfolioDetailProps) {
  // Combine cover_image with images array for gallery
  const allImages = [
    ...(portfolio.cover_image ? [portfolio.cover_image] : []),
    ...portfolio.images,
  ].filter(Boolean);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={portfolio.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="relative aspect-video bg-background">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={allImages[currentImageIndex]}
                alt={`${portfolio.title} - Image ${
                  currentImageIndex + 1
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background hover:border-accent/50 transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background hover:border-accent/50 transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        index === currentImageIndex
                          ? "bg-accent w-4"
                          : "bg-foreground/30 hover:bg-foreground/50"
                      )}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-3">
                {portfolio.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                {portfolio.title}
              </h3>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
            {portfolio.client_name && (
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span>{portfolio.client_name}</span>
              </div>
            )}
            {portfolio.completed_at && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{formatDate(portfolio.completed_at)}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-muted leading-relaxed mb-6">
            {portfolio.content || portfolio.description}
          </p>

          {/* Technologies */}
          {portfolio.technologies.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {portfolio.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-background border border-border text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {portfolio.project_url && (
              <a
                href={portfolio.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-sm transition-colors"
              >
                <ExternalLink size={16} />
                View Project
              </a>
            )}
            {portfolio.github_url && (
              <a
                href={portfolio.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card hover:bg-background border border-border text-foreground font-medium text-sm transition-colors"
              >
                <Github size={16} />
                Source Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
