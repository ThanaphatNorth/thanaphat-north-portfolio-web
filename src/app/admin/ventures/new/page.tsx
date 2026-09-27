"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  VentureForm,
  defaultVentureFormValues,
} from "@/components/admin/VentureForm";

export default function NewVenturePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultVentureFormValues);

  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent, makeVisible: boolean = true) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.tagline.trim() || !formData.url.trim()) {
      alert("Name, tagline, and URL are required");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("ventures").insert([
      {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        status: formData.status,
        icon: formData.icon,
        display_order: formData.display_order,
        visible: makeVisible,
      },
    ]);

    if (error) {
      console.error("Error creating venture:", error);
      alert("Failed to create venture: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/ventures");
  };

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
          <h1 className="text-2xl font-bold text-foreground">New Venture</h1>
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

      <VentureForm values={formData} onChange={setFormData} />
    </div>
  );
}
