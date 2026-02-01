"use client";

import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
}

export function ImageUpload({ value, onChange, bucket = "blog-images" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bucketMissing, setBucketMissing] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value && !value.includes(bucket) ? "url" : "upload");
  const [urlInput, setUrlInput] = useState(value && !value.includes(bucket) ? value : "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createSupabaseBrowserClient();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        // Provide helpful error message for common issues
        if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("bucket")) {
          setBucketMissing(true);
          setMode("url");
          throw new Error(
            "Storage bucket 'blog-images' not found. Switched to URL mode. Create the bucket in Supabase Dashboard > Storage to enable uploads."
          );
        }
        if (uploadError.message.includes("security policy")) {
          throw new Error(
            "Permission denied. Please add storage policies for the 'blog-images' bucket."
          );
        }
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onChange(urlData.publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
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
          {bucketMissing && <span className="text-xs">(unavailable)</span>}
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
          <p className="text-yellow-400 font-medium mb-1">Storage bucket not configured</p>
          <p className="text-yellow-400/80 text-xs">
            Create a public bucket named &apos;blog-images&apos; in Supabase Dashboard → Storage to enable file uploads.
            For now, use the URL option to add images.
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
            onChange={handleFileSelect}
            className="hidden"
            id="cover-image-upload"
          />
          <label
            htmlFor="cover-image-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
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
                <Upload size={24} className="mb-2" />
                <span className="text-sm">Click to upload or drag and drop</span>
                <span className="text-xs mt-1">PNG, JPG, GIF up to 5MB</span>
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
            className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            Set
          </button>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <p className="text-red-400 text-sm">{uploadError}</p>
      )}

      {/* Preview */}
      {value && (
        <div className="relative">
          <div className="relative bg-card border border-border rounded-lg overflow-hidden p-2">
            <img
              src={value}
              alt="Cover preview"
              className="w-full h-auto max-h-[400px] object-contain mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            title="Remove image"
          >
            <X size={16} />
          </button>
          <p className="text-xs text-muted mt-2 truncate">{value}</p>
        </div>
      )}

      {/* Empty State */}
      {!value && mode === "upload" && !isUploading && (
        <div className="flex items-center gap-2 text-muted text-sm">
          <ImageIcon size={16} />
          No image selected
        </div>
      )}
    </div>
  );
}
