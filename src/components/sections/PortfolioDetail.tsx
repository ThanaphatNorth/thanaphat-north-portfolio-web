"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Calendar,
  User,
  FileText,
  Layers,
  Users,
  Trophy,
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

  // Format date using Intl.DateTimeFormat for proper i18n
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-card">
      {/* Image Gallery */}
      {allImages.length > 0 && (
        <div className="relative h-[250px] sm:h-[300px] md:h-[350px] bg-background flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={allImages[currentImageIndex]}
              alt={`${portfolio.title} - Image ${
                currentImageIndex + 1
              }`}
              width={800}
              height={600}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background hover:border-accent/50 transition-[background-color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background hover:border-accent/50 transition-[background-color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Next image"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-[width,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background",
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
            <h3 className="text-2xl md:text-3xl font-bold text-foreground text-pretty">
              {portfolio.title}
            </h3>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
          {portfolio.client_name && (
            <div className="flex items-center gap-1.5">
              <User
                size={14}
                className="text-foreground"
                aria-hidden="true"
              />
              <span>{portfolio.client_name}</span>
            </div>
          )}
          {portfolio.completed_at && (
            <div className="flex items-center gap-1.5">
              <Calendar
                size={14}
                className="text-foreground"
                aria-hidden="true"
              />
              <span>{formatDate(portfolio.completed_at)}</span>
            </div>
          )}
        </div>

        {/* Case Study Sections */}
        {portfolio.case_overview ||
        portfolio.case_components ||
        portfolio.case_team ||
        portfolio.case_outcome ? (
          <div className="space-y-4 mb-8">
            {/* Case Study Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <FileText
                size={18}
                className="text-accent"
                aria-hidden="true"
              />
              <h4 className="text-base font-semibold text-foreground">
                Case Study
              </h4>
            </div>

            {/* 1. Overview */}
            {portfolio.case_overview && (
              <div className="p-4 bg-background rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">
                    1
                  </span>
                  <h5 className="text-sm font-semibold text-foreground">
                    Overview
                  </h5>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-muted [&>p]:leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-2 [&>code]:bg-card [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>a]:text-accent [&>a]:underline [&>a]:underline-offset-2">
                  <ReactMarkdown>
                    {portfolio.case_overview}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* 2. Project Component */}
            {portfolio.case_components && (
              <div className="p-4 bg-background rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">
                    2
                  </span>
                  <Layers
                    size={14}
                    className="text-muted"
                    aria-hidden="true"
                  />
                  <h5 className="text-sm font-semibold text-foreground">
                    Project Component
                  </h5>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-muted [&>p]:leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-2 [&>code]:bg-card [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>a]:text-accent [&>a]:underline [&>a]:underline-offset-2">
                  <ReactMarkdown>
                    {portfolio.case_components}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* 3. Team Member */}
            {portfolio.case_team && (
              <div className="p-4 bg-background rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">
                    3
                  </span>
                  <Users
                    size={14}
                    className="text-muted"
                    aria-hidden="true"
                  />
                  <h5 className="text-sm font-semibold text-foreground">
                    Team Member
                  </h5>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-muted [&>p]:leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-2 [&>code]:bg-card [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>a]:text-accent [&>a]:underline [&>a]:underline-offset-2">
                  <ReactMarkdown>{portfolio.case_team}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* 4. What I Contribute (Outcome) */}
            {portfolio.case_outcome && (
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold">
                    4
                  </span>
                  <Trophy
                    size={14}
                    className="text-accent"
                    aria-hidden="true"
                  />
                  <h5 className="text-sm font-semibold text-foreground">
                    What I Contribute (Outcome)
                  </h5>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-muted [&>p]:leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-2 [&>code]:bg-card [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>a]:text-accent [&>a]:underline [&>a]:underline-offset-2">
                  <ReactMarkdown>
                    {portfolio.case_outcome}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : /* Fallback to old content/description if no case study sections */
        portfolio.content || portfolio.description ? (
          <div className="mb-6">
            <div className="prose prose-invert prose-sm max-w-none text-muted [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:text-foreground [&>h1]:mb-3 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:text-foreground [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-medium [&>h3]:text-foreground [&>h3]:mb-2 [&>code]:bg-background [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>pre]:bg-background [&>pre]:p-4 [&>pre]:rounded-lg [&>blockquote]:border-l-2 [&>blockquote]:border-accent [&>blockquote]:pl-4 [&>blockquote]:italic [&>a]:text-accent [&>a]:underline">
              <ReactMarkdown>
                {portfolio.content || portfolio.description}
              </ReactMarkdown>
            </div>
          </div>
        ) : null}

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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              <ExternalLink size={16} aria-hidden="true" />
              View Project
            </a>
          )}
          {portfolio.github_url && (
            <a
              href={portfolio.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card hover:bg-background border border-border text-foreground font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              <Github size={16} aria-hidden="true" />
              Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
