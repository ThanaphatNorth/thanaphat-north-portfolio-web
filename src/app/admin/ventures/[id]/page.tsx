"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  VentureForm,
  defaultVentureFormValues,
} from "@/components/admin/VentureForm";

export default function EditVenturePage() {
  const router = useRouter();
  const params = useParams();
  const ventureId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState(defaultVentureFormValues);

  const supabase = createSupabaseBrowserClient();

  const fetchVenture = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("ventures")
      .select("*")
      .eq("id", ventureId)
      .single();

    if (error) {
      console.error("Error fetching venture:", error);
      router.push("/admin/ventures");
      return;
    }

    if (data) {
      setFormData({
        name: data.name,
        tagline: data.tagline,
        description: data.description || "",
        url: data.url,
        status: data.status,
        icon: data.icon || "Rocket",
        display_order: data.display_order || 0,
        visible: data.visible,
      });
    }
    setIsLoading(false);
  }, [supabase, ventureId, router]);

  useEffect(() => {
    (async () => {
      await fetchVenture();
    })();
  }, [fetchVenture]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.tagline.trim() || !formData.url.trim()) {
      alert("Name, tagline, and URL are required");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("ventures")
      .update({
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        status: formData.status,
        icon: formData.icon,
        display_order: formData.display_order,
        visible: formData.visible,
      })
      .eq("id", ventureId);

    if (error) {
      console.error("Error updating venture:", error);
      alert("Failed to update venture: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/ventures");
  };

  const handleToggleVisible = async () => {
    const newVisible = !formData.visible;
    setFormData((prev) => ({ ...prev, visible: newVisible }));

    await supabase
      .from("ventures")
      .update({ visible: newVisible })
      .eq("id", ventureId);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this venture? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    const { error } = await supabase.from("ventures").delete().eq("id", ventureId);

    if (error) {
      console.error("Error deleting venture:", error);
      alert("Failed to delete venture: " + error.message);
      setIsDeleting(false);
      return;
    }

    router.push("/admin/ventures");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/ventures"
            className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card border border-border"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit Venture</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleVisible}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${
              formData.visible
                ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
                : "bg-card text-muted border-border hover:text-foreground"
            }`}
          >
            {formData.visible ? <Eye size={18} /> : <EyeOff size={18} />}
            {formData.visible ? "Visible" : "Hidden"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            Delete
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <VentureForm values={formData} onChange={setFormData} />
    </div>
  );
}
