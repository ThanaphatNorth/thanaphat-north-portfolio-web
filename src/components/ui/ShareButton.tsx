"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";

interface ShareButtonProps {
  title: string;
  description?: string;
}

export function ShareButton({ title, description }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return encodeURIComponent(window.location.href);
    }
    return "";
  };

  const getShareTitle = () => encodeURIComponent(title);

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${getShareUrl()}&quote=${getShareTitle()}`;
    window.open(url, "_blank", "width=600,height=400");
    setIsOpen(false);
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?url=${getShareUrl()}&text=${getShareTitle()}`;
    window.open(url, "_blank", "width=600,height=400");
    setIsOpen(false);
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${getShareUrl()}`;
    window.open(url, "_blank", "width=600,height=400");
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
      setIsOpen(false);
    }
  };

  // Check if native share is available
  const hasNativeShare = typeof navigator !== "undefined" && navigator.share;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card"
        aria-label="Share this post"
      >
        <Share2 size={18} />
      </button>

      {/* Share Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <p className="px-3 py-2 text-xs text-muted font-medium uppercase tracking-wide">
              Share to
            </p>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-foreground hover:bg-background rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center">
                <Facebook size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium">Facebook</span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={handleTwitterShare}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-foreground hover:bg-background rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Twitter size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium">X (Twitter)</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={handleLinkedInShare}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-foreground hover:bg-background rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[#0A66C2] rounded-full flex items-center justify-center">
                <Linkedin size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium">LinkedIn</span>
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-border" />

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-foreground hover:bg-background rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                {copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Link2 size={16} className="text-accent" />
                )}
              </div>
              <span className="text-sm font-medium">
                {copied ? "Copied!" : "Copy link"}
              </span>
            </button>

            {/* Native Share (Mobile) */}
            {hasNativeShare && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-foreground hover:bg-background rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                  <Share2 size={16} className="text-accent" />
                </div>
                <span className="text-sm font-medium">More options...</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
