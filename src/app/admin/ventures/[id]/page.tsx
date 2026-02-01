"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Rocket,
  Sparkles,
  BookOpen,
  Zap,
  Globe,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Venture } from "@/lib/supabase";

const iconOptions = [
  { value: "Rocket", label: "Rocket", icon: Rocket },
  { value: "Sparkles", label: "Sparkles", icon: Sparkles },
  { value: "BookOpen", label: "Book", icon: BookOpen },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Star", label: "Star", icon: Star },
];

const statusOptions = ["Live", "Beta", "Coming Soon"];

export default function EditVenturePage() {
  const router = useRouter();
  const params = useParams();
  const ventureId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    url: "",
    status: "Coming Soon",
    icon: "Rocket",
    display_order: 0,
    visible: true,
  });

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
    fetchVenture();
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

  const SelectedIcon = iconOptions.find((i) => i.value === formData.icon)?.icon || Rocket;

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

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., JongQue.com"
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors text-lg"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tagline *
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
            placeholder="e.g., SaaS for Resource & Queue Management"
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="A comprehensive description of your venture..."
            rows={4}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            URL *
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors font-mono text-sm"
          />
        </div>

        {/* Status & Icon Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Icon */}
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-foreground mb-2">
              Icon
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <SelectedIcon className="w-6 h-6 text-accent" />
              </div>
              <select
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
              >
                {iconOptions.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Display Order */}
        <div>
          <label htmlFor="display_order" className="block text-sm font-medium text-foreground mb-2">
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
          <p className="text-xs text-muted mt-1">Lower numbers appear first</p>
        </div>

        {/* Preview Card */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Preview
          </label>
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <SelectedIcon className="w-6 h-6 text-accent" />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  formData.status === "Live"
                    ? "bg-green-500/10 text-green-400 border-green-500/30"
                    : formData.status === "Beta"
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                }`}
              >
                {formData.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {formData.name || "Venture Name"}
            </h3>
            <p className="text-accent text-sm font-medium mb-3">
              {formData.tagline || "Your tagline here"}
            </p>
            <p className="text-muted text-sm leading-relaxed">
              {formData.description || "Your description here..."}
            </p>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
