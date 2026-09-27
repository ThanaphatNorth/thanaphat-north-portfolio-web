"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  PortfolioForm,
  defaultPortfolioFormValues,
  generateSlug,
} from "@/components/admin/PortfolioForm";

export default function NewPortfolioPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultPortfolioFormValues);

  const supabase = createSupabaseBrowserClient();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      <PortfolioForm
        values={formData}
        onChange={setFormData}
        onTitleChange={handleTitleChange}
      />
    </div>
  );
}
