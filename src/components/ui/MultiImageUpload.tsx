"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Link as LinkIcon,
  X,
  Loader2,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
}

export function MultiImageUpload({
  value,
  onChange,
  bucket = "portfolio-images",
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bucketMissing, setBucketMissing] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createSupabaseBrowserClient();

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          if (
            uploadError.message.includes("Bucket not found") ||
            uploadError.message.includes("bucket")
          ) {
            setBucketMissing(true);
            setMode("url");
            throw new Error(
              `Storage bucket '${bucket}' not found. Switched to URL mode. Create the bucket in Supabase Dashboard > Storage to enable uploads.`
            );
          }
          if (uploadError.message.includes("security policy")) {
            throw new Error(
              `Permission denied. Please add storage policies for the '${bucket}' bucket.`
            );
          }
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        newUrls.push(urlData.publicUrl);
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to upload images"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlSubmit = () => {
    const url = urlInput.trim();
    if (url && !value.includes(url)) {
      onChange([...value, url]);
      setUrlInput("");
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => !bucketMissing && setMode("upload")}
          disabled={bucketMissing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "upload"
              ? "bg-accent text-white"
              : bucketMissing
              ? "bg-card text-muted/50 border border-border cursor-not-allowed"
              : "bg-card text-muted hover:text-foreground border border-border"
          }`}
        >
          <Upload size={14} />
          Upload
          {bucketMissing && (
            <span className="text-xs">(unavailable)</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "url"
              ? "bg-accent text-white"
              : "bg-card text-muted hover:text-foreground border border-border"
          }`}
        >
          <LinkIcon size={14} />
          URL
        </button>
      </div>

      {/* Bucket Missing Warning */}
      {bucketMissing && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm">
          <p className="text-yellow-400 font-medium mb-1">
            Storage bucket not configured
          </p>
          <p className="text-yellow-400/80 text-xs">
            Create a public bucket named &apos;{bucket}&apos; in
            Supabase Dashboard → Storage to enable file uploads. For
            now, use the URL option to add images.
          </p>
        </div>
      )}

      {/* Upload Mode */}
      {mode === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="gallery-image-upload"
          />
          <label
            htmlFor="gallery-image-upload"
            className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isUploading
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50 hover:bg-card"
            }`}
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-accent">
                <Loader2 size={20} className="animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-muted">
                <Upload size={20} className="mb-1" />
                <span className="text-sm">
                  Click to upload multiple images
                </span>
                <span className="text-xs mt-0.5">
                  PNG, JPG, GIF up to 5MB each
                </span>
              </div>
            )}
          </label>
        </div>
      )}

      {/* URL Mode */}
      {mode === "url" && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUrlSubmit();
              }
            }}
            className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            aria-label="Add image URL"
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <p className="text-red-400 text-sm">{uploadError}</p>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full aspect-video object-cover rounded-lg border border-border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EError%3C/text%3E%3C/svg%3E";
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {value.length === 0 && !isUploading && (
        <div className="flex items-center gap-2 text-muted text-sm">
          <ImageIcon size={16} />
          No images added
        </div>
      )}
    </div>
  );
}
