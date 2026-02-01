"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    console.log(
      "[LOGIN PAGE] ========================================"
    );
    console.log("[LOGIN PAGE] useEffect running - checking auth");

    const checkAuth = async () => {
      try {
        console.log(
          "[LOGIN PAGE] Creating Supabase browser client..."
        );
        const supabase = createSupabaseBrowserClient();
        console.log("[LOGIN PAGE] Calling getUser()...");
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        console.log("[LOGIN PAGE] getUser() result:");
        console.log(
          "[LOGIN PAGE]   - user:",
          user
            ? `Found (id: ${user.id}, email: ${user.email})`
            : "null"
        );
        console.log(
          "[LOGIN PAGE]   - error:",
          error ? error.message : "none"
        );

        if (user) {
          // User is authenticated, redirect to admin dashboard
          console.log(
            "[LOGIN PAGE] User is authenticated - REDIRECTING to /admin"
          );
          router.replace("/admin");
          return;
        }

        console.log(
          "[LOGIN PAGE] No user found - showing login form"
        );
      } catch (error) {
        console.error("[LOGIN PAGE] Error checking auth:", error);
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log(
      "[LOGIN PAGE] ========================================"
    );
    console.log(
      "[LOGIN PAGE] Form submitted - attempting login with email:",
      email
    );

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("[LOGIN PAGE] signInWithPassword result:");
      console.log(
        "[LOGIN PAGE]   - user:",
        data?.user ? `Found (id: ${data.user.id})` : "null"
      );
      console.log(
        "[LOGIN PAGE]   - session:",
        data?.session ? "exists" : "null"
      );
      console.log(
        "[LOGIN PAGE]   - error:",
        error ? error.message : "none"
      );

      if (error) {
        console.log("[LOGIN PAGE] Login failed:", error.message);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      console.log(
        "[LOGIN PAGE] Login successful - navigating to /admin"
      );
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(
        "[LOGIN PAGE] Unexpected error during login:",
        err
      );
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 pl-11 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all";

  // Show loading state while checking auth
  if (isCheckingAuth) {
    console.log(
      "[LOGIN PAGE] Rendering: Loading state (checking auth)"
    );
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  console.log("[LOGIN PAGE] Rendering: Login form");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Admin Login
            </h1>
            <p className="text-muted mt-2">
              Sign in to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className={inputClasses}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className={inputClasses}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted text-sm mt-6">
            Protected admin area
          </p>
        </div>
      </motion.div>
    </div>
  );
}
