"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { CoverImageUpload } from "@/components/ui/CoverImageUpload";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";
import type { Portfolio } from "@/lib/supabase";
import {
  portfolioTypeOptions as typeOptions,
  portfolioSkillOptions as skillOptions,
} from "@/lib/constants";

export default function EditPortfolioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    // Case Study Sections
    case_overview: "",
    case_components: "",
    case_team: "",
    case_outcome: "",
    // End Case Study Sections
    cover_image: "",
    cover_image_focal_x: 50,
    cover_image_focal_y: 50,
    images: [] as string[],
    technologies: [] as string[],
    category: "Web App",
    client_name: "",
    project_url: "",
    github_url: "",
    display_order: 0,
    featured: false,
    visible: true,
    completed_at: "",
  });

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching portfolio:", error);
        router.push("/admin/portfolio");
        return;
      }

      const portfolio = data as Portfolio;
      setFormData({
        title: portfolio.title,
        slug: portfolio.slug,
        description: portfolio.description,
        content: portfolio.content || "",
        // Case Study Sections
        case_overview: portfolio.case_overview || "",
        case_components: portfolio.case_components || "",
        case_team: portfolio.case_team || "",
        case_outcome: portfolio.case_outcome || "",
        // End Case Study Sections
        cover_image: portfolio.cover_image || "",
        cover_image_focal_x: portfolio.cover_image_focal_x ?? 50,
        cover_image_focal_y: portfolio.cover_image_focal_y ?? 50,
        images: portfolio.images || [],
        technologies: portfolio.technologies || [],
        category: portfolio.category,
        client_name: portfolio.client_name || "",
        project_url: portfolio.project_url || "",
        github_url: portfolio.github_url || "",
        display_order: portfolio.display_order,
        featured: portfolio.featured,
        visible: portfolio.visible,
        completed_at: portfolio.completed_at
          ? portfolio.completed_at.split("T")[0]
          : "",
      });
      setIsLoading(false);
    };

    fetchPortfolio();
  }, [id, supabase, router]);

  const handleAddTech = () => {
    const tech = techInput.trim();
    if (tech && !formData.technologies.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tech],
      }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    makeVisible?: boolean
  ) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description are required");
      return;
    }

    setIsSubmitting(true);

    const updateData: Record<string, unknown> = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      content: formData.content.trim() || null,
      // Case Study Sections
      case_overview: formData.case_overview.trim() || null,
      case_components: formData.case_components.trim() || null,
      case_team: formData.case_team.trim() || null,
      case_outcome: formData.case_outcome.trim() || null,
      // End Case Study Sections
      cover_image: formData.cover_image.trim() || null,
      cover_image_focal_x: formData.cover_image_focal_x,
      cover_image_focal_y: formData.cover_image_focal_y,
      images: formData.images,
      technologies: formData.technologies,
      category: formData.category,
      client_name: formData.client_name.trim() || null,
      project_url: formData.project_url.trim() || null,
      github_url: formData.github_url.trim() || null,
      display_order: formData.display_order,
      featured: formData.featured,
      completed_at: formData.completed_at || null,
    };

    if (makeVisible !== undefined) {
      updateData.visible = makeVisible;
      setFormData((prev) => ({ ...prev, visible: makeVisible }));
    }

    const { error } = await supabase
      .from("portfolios")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating portfolio:", error);
      alert("Failed to update portfolio: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/portfolio");
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this portfolio item? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    const { error } = await supabase
      .from("portfolios")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting portfolio:", error);
      alert("Failed to delete portfolio: " + error.message);
      setIsDeleting(false);
      return;
    }

    router.push("/admin/portfolio");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/portfolio"
            className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card border border-border"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Edit Project
            </h1>
            <p className="text-sm text-muted">{formData.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            Delete
          </button>
          {formData.visible ? (
            <button
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground hover:bg-background rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <EyeOff size={18} />
              )}
              Save & Hide
            </button>
          ) : (
            <button
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground hover:bg-background rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Eye size={18} />
              )}
              Save & Show
            </button>
          )}
          <button
            onClick={(e) => handleSubmit(e)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6 flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            formData.visible
              ? "bg-green-500/20 text-green-400"
              : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {formData.visible ? "Visible" : "Hidden"}
        </span>
        {formData.featured && (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
            Featured
          </span>
        )}
      </div>

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
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
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
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                slug: e.target.value,
              }))
            }
            placeholder="e-commerce-platform"
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors font-mono text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Short Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
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
              value={formData.case_overview}
              onChange={(e) =>
                setFormData((prev) => ({
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
              value={formData.case_components}
              onChange={(e) =>
                setFormData((prev) => ({
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
              value={formData.case_team}
              onChange={(e) =>
                setFormData((prev) => ({
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
              value={formData.case_outcome}
              onChange={(e) =>
                setFormData((prev) => ({
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
            value={formData.cover_image}
            onChange={(url) =>
              setFormData((prev) => ({
                ...prev,
                cover_image: url,
              }))
            }
            focalPoint={{
              x: formData.cover_image_focal_x,
              y: formData.cover_image_focal_y,
            }}
            onFocalPointChange={(point) =>
              setFormData((prev) => ({
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
            value={formData.images}
            onChange={(urls) =>
              setFormData((prev) => ({
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
              const selectedTypes = formData.category
                ? formData.category.split(", ").filter(Boolean)
                : [];
              const isSelected = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    const current = formData.category
                      ? formData.category.split(", ").filter(Boolean)
                      : [];
                    const updated = isSelected
                      ? current.filter((t) => t !== type)
                      : [...current, type];
                    setFormData((prev) => ({
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
          {!formData.category && (
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
            value={formData.client_name}
            onChange={(e) =>
              setFormData((prev) => ({
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
              const isSelected =
                formData.technologies.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      handleRemoveTech(skill);
                    } else {
                      setFormData((prev) => ({
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
          {formData.technologies.filter(
            (t) =>
              !skillOptions.includes(
                t as (typeof skillOptions)[number]
              )
          ).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies
                .filter(
                  (t) =>
                    !skillOptions.includes(
                      t as (typeof skillOptions)[number]
                    )
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
              value={formData.project_url}
              onChange={(e) =>
                setFormData((prev) => ({
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
              value={formData.github_url}
              onChange={(e) =>
                setFormData((prev) => ({
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
              value={formData.display_order}
              onChange={(e) =>
                setFormData((prev) => ({
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
              value={formData.completed_at}
              onChange={(e) =>
                setFormData((prev) => ({
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
            checked={formData.featured}
            onChange={(e) =>
              setFormData((prev) => ({
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
    </div>
  );
}
