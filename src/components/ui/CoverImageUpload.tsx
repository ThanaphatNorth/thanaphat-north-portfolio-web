"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Link as LinkIcon,
  X,
  Loader2,
  Image as ImageIcon,
  Move,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface FocalPoint {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

interface CoverImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  focalPoint: FocalPoint;
  onFocalPointChange: (point: FocalPoint) => void;
  bucket?: string;
}

export function CoverImageUpload({
  value,
  onChange,
  focalPoint,
  onFocalPointChange,
  bucket = "portfolio-images",
}: CoverImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bucketMissing, setBucketMissing] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(
    value && !value.includes(bucket) ? "url" : "upload"
  );
  const [urlInput, setUrlInput] = useState(
    value && !value.includes(bucket) ? value : ""
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const supabase = createSupabaseBrowserClient();

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

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
            `Storage bucket '${bucket}' not found. Switched to URL mode.`
          );
        }
        if (uploadError.message.includes("security policy")) {
          throw new Error(
            `Permission denied. Please add storage policies for the '${bucket}' bucket.`
          );
        }
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(urlData.publicUrl);
      // Reset focal point to center when new image is uploaded
      onFocalPointChange({ x: 50, y: 50 });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      // Reset focal point to center when new image is set
      onFocalPointChange({ x: 50, y: 50 });
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    onFocalPointChange({ x: 50, y: 50 });
  };

  const updateFocalPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!imageContainerRef.current) return;

      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100)
      );
      const y = Math.max(
        0,
        Math.min(100, ((clientY - rect.top) / rect.height) * 100)
      );

      onFocalPointChange({ x: Math.round(x), y: Math.round(y) });
    },
    [onFocalPointChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateFocalPoint(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        updateFocalPoint(e.clientX, e.clientY);
      }
    },
    [isDragging, updateFocalPoint]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseUp]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    updateFocalPoint(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      updateFocalPoint(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
            Supabase Dashboard → Storage to enable file uploads.
          </p>
        </div>
      )}

      {/* Upload Mode */}
      {mode === "upload" && !value && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="cover-image-upload-focal"
          />
          <label
            htmlFor="cover-image-upload-focal"
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
                <span className="text-sm">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs mt-1">
                  PNG, JPG, GIF up to 5MB
                </span>
              </div>
            )}
          </label>
        </div>
      )}

      {/* URL Mode */}
      {mode === "url" && !value && (
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

      {/* Preview with Focal Point Selector */}
      {value && (
        <div className="space-y-3">
          <div className="relative">
            <div className="relative bg-card border border-border rounded-lg overflow-hidden">
              {/* Focal Point Selector */}
              <div
                ref={imageContainerRef}
                className="relative cursor-crosshair select-none"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={value}
                  alt="Cover preview"
                  className="w-full h-auto max-h-[400px] object-contain mx-auto pointer-events-none"
                  draggable={false}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display =
                      "none";
                  }}
                />

                {/* Focal Point Indicator */}
                <div
                  className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${focalPoint.x}%`,
                    top: `${focalPoint.y}%`,
                  }}
                >
                  {/* Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-0.5 bg-accent rounded-full" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-0.5 bg-accent rounded-full" />
                  </div>
                  {/* Center dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-accent rounded-full border-2 border-white shadow-lg" />
                  </div>
                </div>

                {/* Overlay hint */}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs text-muted flex items-center gap-1">
                  <Move size={12} />
                  Drag to set focal point
                </div>
              </div>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>

          {/* Focal Point Preview */}
          <div className="p-3 bg-background border border-border rounded-lg">
            <p className="text-xs text-muted mb-2 flex items-center gap-2">
              <span>Preview (how it will appear in cards)</span>
              <span className="text-accent font-mono">
                ({focalPoint.x}%, {focalPoint.y}%)
              </span>
            </p>
            <div className="relative w-full aspect-[4/3] max-w-[300px] rounded-lg overflow-hidden border border-border">
              <img
                src={value}
                alt="Focal point preview"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
                }}
              />
            </div>
          </div>

          {/* URL display */}
          <p className="text-xs text-muted truncate">{value}</p>
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
