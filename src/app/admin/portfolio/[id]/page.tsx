"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Portfolio } from "@/lib/supabase";
import {
  PortfolioForm,
  defaultPortfolioFormValues,
} from "@/components/admin/PortfolioForm";

export default function EditPortfolioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    ...defaultPortfolioFormValues,
    category: "Web App",
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

      <PortfolioForm values={formData} onChange={setFormData} />
    </div>
  );
}
