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
  Tag,
  Clock,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { BlogPost } from "@/lib/supabase";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // For edit page, slug is already set so we mark it as manually edited by default
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(true);
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

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error || !data) {
        console.error("Error fetching post:", error);
        router.push("/admin/blog");
        return;
      }

      const post = data as BlogPost;
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        cover_image: post.cover_image || "",
        tags: post.tags?.join(", ") || "",
        read_time: post.read_time,
        featured: post.featured,
        published: post.published,
      });
      setIsLoading(false);
    }

    fetchPost();
  }, [postId, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
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

    const { error } = await supabase
      .from("blog_posts")
      .update({
        title: formData.title.trim(),
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content.trim(),
        cover_image: formData.cover_image.trim() || null,
        tags,
        read_time: formData.read_time,
        featured: formData.featured,
        published: formData.published,
      })
      .eq("id", postId);

    if (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post: " + error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/blog");
  };

  const handleTogglePublish = async () => {
    const newStatus = !formData.published;
    setFormData((prev) => ({ ...prev, published: newStatus }));

    const { error } = await supabase
      .from("blog_posts")
      .update({
        published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null,
      })
      .eq("id", postId);

    if (error) {
      console.error("Error toggling publish status:", error);
      setFormData((prev) => ({ ...prev, published: !newStatus }));
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    const { error } = await supabase.from("blog_posts").delete().eq("id", postId);

    if (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post: " + error.message);
      setIsDeleting(false);
      return;
    }

    router.push("/admin/blog");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card border border-border"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit Post</h1>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              formData.published
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {formData.published ? "Published" : "Draft"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            Delete
          </button>
          <button
            onClick={handleTogglePublish}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              formData.published
                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
            }`}
          >
            {formData.published ? <EyeOff size={18} /> : <Eye size={18} />}
            {formData.published ? "Unpublish" : "Publish"}
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
              Slug
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
