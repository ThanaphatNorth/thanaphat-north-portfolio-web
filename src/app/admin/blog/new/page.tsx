"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Tag,
  Clock,
  Star,
} from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { ImageUpload } from "@/components/ui/ImageUpload";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    tags: "",
    read_time: 5,
    featured: false,
    published: false,
  });

  const supabase = createSupabaseBrowserClient();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      // Only auto-generate slug if user hasn't manually edited it
      slug: slugManuallyEdited ? prev.slug : generateSlug(title),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required");
      return;
    }

    setIsSubmitting(true);

    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const { error } = await supabase.from("blog_posts").insert([
      {
        title: formData.title.trim(),
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content.trim(),
        cover_image: formData.cover_image.trim() || null,
        tags,
        read_time: formData.read_time,
        featured: formData.featured,
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
      },
    ]);

    if (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/blog");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card border border-border"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">New Blog Post</h1>
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
            Save Draft
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
            Publish
          </button>
        </div>
      </div>

      <div>
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
              placeholder="Enter post title..."
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors text-lg"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Slug {!slugManuallyEdited && <span className="text-muted text-xs">(auto-generated from title)</span>}
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="post-url-slug"
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors font-mono text-sm"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              placeholder="Brief description of the post..."
              rows={3}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content * (Markdown supported)
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Write your post content here... Markdown is supported."
              rows={20}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-y font-mono text-sm"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Image
            </label>
            <ImageUpload
              value={formData.cover_image}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, cover_image: url }))
              }
            />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Tag size={16} className="inline mr-2" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="react, nextjs, typescript"
                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Read Time */}
            <div>
              <label htmlFor="read_time" className="block text-sm font-medium text-foreground mb-2">
                <Clock size={16} className="inline mr-2" />
                Read Time (minutes)
              </label>
              <input
                id="read_time"
                type="number"
                min="1"
                max="60"
                value={formData.read_time}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    read_time: parseInt(e.target.value) || 5,
                  }))
                }
                aria-label="Read time in minutes"
                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3 pt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  aria-label="Mark as featured post"
                  className="w-5 h-5 rounded border-border bg-card text-accent focus:ring-accent"
                />
                <span className="text-foreground flex items-center gap-2">
                  <Star size={16} />
                  Featured Post
                </span>
              </label>
            </div>
          </div>

        </motion.form>
      </div>
    </div>
  );
}
