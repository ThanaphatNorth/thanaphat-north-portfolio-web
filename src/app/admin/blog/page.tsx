"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  RefreshCw,
  Loader2,
  FileText,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { BlogPost } from "@/lib/supabase";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const supabase = createSupabaseBrowserClient();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "published") {
      query = query.eq("published", true);
    } else if (filter === "draft") {
      query = query.eq("published", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
    setIsLoading(false);
  }, [supabase, filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleTogglePublished = async (post: BlogPost) => {
    const newStatus = !post.published;
    const { error } = await supabase
      .from("blog_posts")
      .update({
        published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null,
      })
      .eq("id", post.id);

    if (!error) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, published: newStatus, published_at: newStatus ? new Date().toISOString() : null }
            : p
        )
      );
    }
  };

  const handleToggleFeatured = async (post: BlogPost) => {
    const newStatus = !post.featured;
    const { error } = await supabase
      .from("blog_posts")
      .update({ featured: newStatus })
      .eq("id", post.id);

    if (!error) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, featured: newStatus } : p
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(id);
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
    setIsDeleting(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
              {publishedCount} published
            </span>
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
              {draftCount} drafts
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card border border-border"
            title="Refresh"
          >
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            New Post
          </Link>
        </div>
      </div>
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-accent text-white"
                  : "bg-card text-muted hover:text-foreground border border-border"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted bg-card border border-border rounded-2xl">
            <FileText size={48} className="mb-4" />
            <p className="mb-4">No blog posts found</p>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
            >
              <Plus size={18} />
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {post.featured && (
                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        )}
                        <h2 className="text-lg font-semibold text-foreground truncate">
                          {post.title}
                        </h2>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            post.published
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      {post.excerpt && (
                        <p className="text-muted text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(post.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {post.read_time} min read
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Tag size={14} />
                            {post.tags.slice(0, 3).join(", ")}
                            {post.tags.length > 3 && ` +${post.tags.length - 3}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleFeatured(post)}
                        className={`p-2 rounded-lg transition-colors ${
                          post.featured
                            ? "text-yellow-400 hover:bg-yellow-500/10"
                            : "text-muted hover:text-foreground hover:bg-background"
                        }`}
                        title={post.featured ? "Remove from featured" : "Mark as featured"}
                      >
                        {post.featured ? <Star size={18} className="fill-current" /> : <StarOff size={18} />}
                      </button>
                      <button
                        onClick={() => handleTogglePublished(post)}
                        className={`p-2 rounded-lg transition-colors ${
                          post.published
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-muted hover:text-foreground hover:bg-background"
                        }`}
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {post.published ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting === post.id}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                        title="Delete"
                      >
                        {isDeleting === post.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
  );
}
