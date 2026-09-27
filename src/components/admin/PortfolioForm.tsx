"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { CoverImageUpload } from "@/components/ui/CoverImageUpload";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";
import {
  portfolioTypeOptions as typeOptions,
  portfolioSkillOptions as skillOptions,
} from "@/lib/constants";

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface PortfolioFormValues {
  title: string;
  slug: string;
  description: string;
  content: string;
  // Case Study Sections
  case_overview: string;
  case_components: string;
  case_team: string;
  case_outcome: string;
  // End Case Study Sections
  cover_image: string;
  cover_image_focal_x: number;
  cover_image_focal_y: number;
  images: string[];
  technologies: string[];
  category: string;
  client_name: string;
  project_url: string;
  github_url: string;
  display_order: number;
  featured: boolean;
  visible: boolean;
  completed_at: string;
}

// Defaults used when creating a new portfolio item.
export const defaultPortfolioFormValues: PortfolioFormValues = {
  title: "",
  slug: "",
  description: "",
  content: "",
  case_overview: "",
  case_components: "",
  case_team: "",
  case_outcome: "",
  cover_image: "",
  cover_image_focal_x: 50,
  cover_image_focal_y: 50,
  images: [],
  technologies: [],
  category: "",
  client_name: "",
  project_url: "",
  github_url: "",
  display_order: 0,
  featured: false,
  visible: true,
  completed_at: "",
};

interface PortfolioFormProps {
  values: PortfolioFormValues;
  onChange: Dispatch<SetStateAction<PortfolioFormValues>>;
  /**
   * Optional override for the title field's onChange handler.
   * The "new" page auto-syncs the slug from the title while the slug
   * hasn't been manually edited; the "edit" page leaves the slug alone.
   */
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PortfolioForm({
  values,
  onChange,
  onTitleChange,
}: PortfolioFormProps) {
  const [techInput, setTechInput] = useState("");

  const handleTitleChange =
    onTitleChange ??
    ((e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      onChange((prev) => ({ ...prev, title }));
    });

  const handleAddTech = () => {
    const tech = techInput.trim();
    if (tech && !values.technologies.includes(tech)) {
      onChange((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tech],
      }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    onChange((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Title *
        </label>
        <input
          type="text"
          value={values.title}
          onChange={handleTitleChange}
          placeholder="e.g., E-commerce Platform"
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors text-lg"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Slug
        </label>
        <input
          type="text"
          value={values.slug}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              slug: e.target.value,
            }))
          }
          placeholder="e-commerce-platform"
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors font-mono text-sm"
        />
        <p className="text-xs text-muted mt-1">
          URL-friendly identifier (auto-generated from title)
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Short Description *
        </label>
        <textarea
          value={values.description}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="A brief description for the card view..."
          rows={3}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      {/* Case Study Sections */}
      <div className="space-y-6 p-4 bg-background border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Case Study / Project Details
        </h3>
        <p className="text-xs text-muted -mt-4">
          Supports Markdown: **bold**, *italic*, # headers, - lists,
          [links](url), `code`
        </p>

        {/* 1. Overview */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            1. Overview
          </label>
          <textarea
            value={values.case_overview}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                case_overview: e.target.value,
              }))
            }
            placeholder="What is this project about? Brief summary of the project scope and objectives..."
            rows={4}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none font-mono text-sm"
          />
        </div>

        {/* 2. Project Component */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            2. Project Component
          </label>
          <textarea
            value={values.case_components}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                case_components: e.target.value,
              }))
            }
            placeholder="What are the main components/features of this project? List the key modules, features, or parts..."
            rows={4}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none font-mono text-sm"
          />
        </div>

        {/* 3. Team Member */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            3. Team Member
          </label>
          <textarea
            value={values.case_team}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                case_team: e.target.value,
              }))
            }
            placeholder="Who was involved? Team size, roles, structure..."
            rows={3}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none font-mono text-sm"
          />
        </div>

        {/* 4. What I Contribute (Outcome) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            4. What I Contribute (Outcome)
          </label>
          <textarea
            value={values.case_outcome}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                case_outcome: e.target.value,
              }))
            }
            placeholder="What was the result? Key achievements, metrics, impact..."
            rows={4}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none font-mono text-sm"
          />
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Cover Image
        </label>
        <CoverImageUpload
          value={values.cover_image}
          onChange={(url) =>
            onChange((prev) => ({
              ...prev,
              cover_image: url,
            }))
          }
          focalPoint={{
            x: values.cover_image_focal_x,
            y: values.cover_image_focal_y,
          }}
          onFocalPointChange={(point) =>
            onChange((prev) => ({
              ...prev,
              cover_image_focal_x: point.x,
              cover_image_focal_y: point.y,
            }))
          }
          bucket="portfolio-images"
        />
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Gallery Images
        </label>
        <MultiImageUpload
          value={values.images}
          onChange={(urls) =>
            onChange((prev) => ({
              ...prev,
              images: urls,
            }))
          }
          bucket="portfolio-images"
        />
      </div>

      {/* Type (Multi-select) */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Type
        </label>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((type) => {
            const selectedTypes = values.category
              ? values.category.split(", ").filter(Boolean)
              : [];
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  const current = values.category
                    ? values.category.split(", ").filter(Boolean)
                    : [];
                  const updated = isSelected
                    ? current.filter((t) => t !== type)
                    : [...current, type];
                  onChange((prev) => ({
                    ...prev,
                    category: updated.join(", "),
                  }));
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  isSelected
                    ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                    : "bg-card border-border text-muted hover:text-foreground hover:border-accent/50"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
        {!values.category && (
          <p className="text-xs text-muted mt-2">
            Select one or more types
          </p>
        )}
      </div>

      {/* Client Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Client Name
        </label>
        <input
          type="text"
          value={values.client_name}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              client_name: e.target.value,
            }))
          }
          placeholder="Company or client name"
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Skills
        </label>
        {/* Quick select skill options */}
        <div className="flex flex-wrap gap-2 mb-3">
          {skillOptions.map((skill) => {
            const isSelected = values.technologies.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    handleRemoveTech(skill);
                  } else {
                    onChange((prev) => ({
                      ...prev,
                      technologies: [...prev.technologies, skill],
                    }));
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  isSelected
                    ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                    : "bg-card border-border text-muted hover:text-foreground hover:border-accent/50"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
        {/* Custom skill input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Add custom skill, e.g., React, Node.js"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTech();
              }
            }}
            className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="button"
            onClick={handleAddTech}
            aria-label="Add skill"
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        {/* Selected skills (custom ones not in quick select) */}
        {values.technologies.filter(
          (t) => !skillOptions.includes(t as (typeof skillOptions)[number])
        ).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {values.technologies
              .filter(
                (t) =>
                  !skillOptions.includes(t as (typeof skillOptions)[number])
              )
              .map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-lg text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    aria-label={`Remove ${tech}`}
                    className="text-muted hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Links Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project URL */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Project URL
          </label>
          <input
            type="url"
            value={values.project_url}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                project_url: e.target.value,
              }))
            }
            placeholder="https://project.com"
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            value={values.github_url}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                github_url: e.target.value,
              }))
            }
            placeholder="https://github.com/user/repo"
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Order & Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Order */}
        <div>
          <label
            htmlFor="display_order"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Display Order
          </label>
          <input
            id="display_order"
            type="number"
            min="0"
            value={values.display_order}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                display_order: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
          />
          <p className="text-xs text-muted mt-1">
            Lower numbers appear first
          </p>
        </div>

        {/* Completed At */}
        <div>
          <label
            htmlFor="completed_at"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Completion Date
          </label>
          <input
            id="completed_at"
            type="date"
            value={values.completed_at}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                completed_at: e.target.value,
              }))
            }
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Featured Checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={values.featured}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              featured: e.target.checked,
            }))
          }
          className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
        />
        <label
          htmlFor="featured"
          className="text-sm font-medium text-foreground"
        >
          Featured project (highlighted in portfolio)
        </label>
      </div>
    </motion.form>
  );
}
