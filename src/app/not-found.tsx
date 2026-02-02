import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <div className="mb-8">
          <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-muted mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
          >
            <Home size={18} />
            Go to Homepage
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted mb-4">You might be looking for:</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/#experience"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              Experience
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/#services"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              Services
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/blog"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
