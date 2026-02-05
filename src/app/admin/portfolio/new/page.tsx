"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { CoverImageUpload } from "@/components/ui/CoverImageUpload";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";

const categoryOptions = [
  "Web App",
  "Mobile",
  "Design",
  "E-commerce",
  "SaaS",
  "API",
  "Dashboard",
  "Other",
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewPortfolioPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug:
        prev.slug === generateSlug(prev.title)
          ? generateSlug(title)
          : prev.slug,
    }));
  };

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
    makeVisible: boolean = true
  ) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description are required");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("portfolios").insert([
      {
        title: formData.title.trim(),
        slug: formData.slug.trim() || generateSlug(formData.title),
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
        visible: makeVisible,
        completed_at: formData.completed_at || null,
      },
    ]);

    if (error) {
      console.error("Error creating portfolio:", error);
      alert("Failed to create portfolio: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/portfolio");
  };

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
          <h1 className="text-2xl font-bold text-foreground">
            New Project
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground hover:bg-background rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Hidden
          </button>
          <button
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Eye size={18} />
            )}
            Save & Show
          </button>
        </div>
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

        {/* Category & Client Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Technologies
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="e.g., React, Node.js, PostgreSQL"
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
              aria-label="Add technology"
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          {formData.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
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
