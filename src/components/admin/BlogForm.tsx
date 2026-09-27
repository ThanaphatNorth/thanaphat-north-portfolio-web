"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, Star } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface BlogFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  tags: string;
  read_time: number;
  featured: boolean;
  published: boolean;
}

// Defaults used when creating a new blog post.
export const defaultBlogFormValues: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  tags: "",
  read_time: 5,
  featured: false,
  published: false,
};

interface BlogFormProps {
  values: BlogFormValues;
  onChange: Dispatch<SetStateAction<BlogFormValues>>;
  /**
   * Whether the slug has already been considered "manually edited" when the
   * form mounts. The "new" page starts as false (slug auto-syncs from the
   * title); the "edit" page starts as true (slug is already set, so typing
   * in the title shouldn't silently rewrite it).
   */
  initialSlugManuallyEdited?: boolean;
}

export function BlogForm({
  values,
  onChange,
  initialSlugManuallyEdited = false,
}: BlogFormProps) {
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    initialSlugManuallyEdited
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    onChange((prev) => ({
      ...prev,
      title,
      // Only auto-generate slug if user hasn't manually edited it
      slug: slugManuallyEdited ? prev.slug : generateSlug(title),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    onChange((prev) => ({ ...prev, slug: e.target.value }));
  };

  return (
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
            value={values.title}
            onChange={handleTitleChange}
            placeholder="Enter post title..."
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors text-lg"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Slug{" "}
            {!slugManuallyEdited && (
              <span className="text-muted text-xs">
                (auto-generated from title)
              </span>
            )}
          </label>
          <input
            type="text"
            value={values.slug}
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
            value={values.excerpt}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, excerpt: e.target.value }))
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
            value={values.content}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, content: e.target.value }))
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
            value={values.cover_image}
            onChange={(url) =>
              onChange((prev) => ({ ...prev, cover_image: url }))
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
              value={values.tags}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder="react, nextjs, typescript"
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Read Time */}
          <div>
            <label
              htmlFor="read_time"
              className="block text-sm font-medium text-foreground mb-2"
            >
              <Clock size={16} className="inline mr-2" />
              Read Time (minutes)
            </label>
            <input
              id="read_time"
              type="number"
              min="1"
              max="60"
              value={values.read_time}
              onChange={(e) =>
                onChange((prev) => ({
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
                checked={values.featured}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    featured: e.target.checked,
                  }))
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
  );
}
