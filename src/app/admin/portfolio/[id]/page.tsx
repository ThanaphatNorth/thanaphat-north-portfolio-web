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
import type { Portfolio } from "@/lib/supabase";

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

export default function EditPortfolioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    cover_image: "",
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
        cover_image: portfolio.cover_image || "",
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

  const handleAddImage = () => {
    const url = imageUrlInput.trim();
    if (url && !formData.images.includes(url)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
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
      cover_image: formData.cover_image.trim() || null,
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

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Description / Case Study
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                content: e.target.value,
              }))
            }
            placeholder="Detailed description, challenges, solutions..."
            rows={6}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            value={formData.cover_image}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                cover_image: e.target.value,
              }))
            }
            placeholder="https://example.com/cover.jpg"
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
          {formData.cover_image && (
            <div className="mt-3 relative inline-block">
              <img
                src={formData.cover_image}
                alt="Cover preview"
                className="h-32 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display =
                    "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Gallery Images */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Gallery Images
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
              className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={handleAddImage}
              aria-label="Add image"
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full aspect-video object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
