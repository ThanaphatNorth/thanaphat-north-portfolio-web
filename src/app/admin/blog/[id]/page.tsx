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
import type { BlogPost } from "@/lib/supabase";
import {
  BlogForm,
  defaultBlogFormValues,
  generateSlug,
} from "@/components/admin/BlogForm";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState(defaultBlogFormValues);

  const supabase = createSupabaseBrowserClient();

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

      <BlogForm
        values={formData}
        onChange={setFormData}
        initialSlugManuallyEdited={true}
      />
    </div>
  );
}
