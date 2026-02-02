"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { calculateExperienceYears, ExperienceYears } from "@/lib/experience";

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

export default function AdminSettingsPage() {
  const [careerStartDate, setCareerStartDate] = useState("");
  const [leadershipStartDate, setLeadershipStartDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [experiencePreview, setExperiencePreview] = useState<ExperienceYears | null>(null);

  const supabase = createSupabaseBrowserClient();

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .in("key", ["career_start_date", "leadership_start_date"]);

      if (error) {
        console.error("Error fetching settings:", error);
        return;
      }

      const settings = data as SiteSetting[];
      
      const careerSetting = settings.find((s) => s.key === "career_start_date");
      const leadershipSetting = settings.find((s) => s.key === "leadership_start_date");

      if (careerSetting) {
        setCareerStartDate(careerSetting.value);
      }
      if (leadershipSetting) {
        setLeadershipStartDate(leadershipSetting.value);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update preview when dates change
  useEffect(() => {
    if (careerStartDate && leadershipStartDate) {
      const preview = calculateExperienceYears(careerStartDate, leadershipStartDate);
      setExperiencePreview(preview);
    }
  }, [careerStartDate, leadershipStartDate]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      // Upsert career start date
      const { error: careerError } = await supabase
        .from("site_settings")
        .upsert(
          {
            key: "career_start_date",
            value: careerStartDate,
            description: "Start date for calculating total years in software development",
          },
          { onConflict: "key" }
        );

      if (careerError) throw careerError;

      // Upsert leadership start date
      const { error: leadershipError } = await supabase
        .from("site_settings")
        .upsert(
          {
            key: "leadership_start_date",
            value: leadershipStartDate,
            description: "Start date for calculating years in leadership roles",
          },
          { onConflict: "key" }
        );

      if (leadershipError) throw leadershipError;

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
          <p className="text-muted mt-1">
            Configure experience dates and other site settings
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card border border-border"
          title="Refresh"
        >
          <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Experience Dates Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">
                    Experience Start Dates
                  </h2>
                  <p className="text-sm text-muted">
                    These dates are used to calculate &quot;X+ years&quot; displayed on the
                    site
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Career Start Date */}
              <div className="space-y-2">
                <label
                  htmlFor="careerStartDate"
                  className="block text-sm font-medium text-foreground"
                >
                  Career Start Date
                </label>
                <p className="text-xs text-muted">
                  When you started your software development career
                </p>
                <input
                  type="date"
                  id="careerStartDate"
                  value={careerStartDate}
                  onChange={(e) => setCareerStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                {careerStartDate && (
                  <p className="text-sm text-muted">
                    {formatDate(careerStartDate)}
                  </p>
                )}
              </div>

              {/* Leadership Start Date */}
              <div className="space-y-2">
                <label
                  htmlFor="leadershipStartDate"
                  className="block text-sm font-medium text-foreground"
                >
                  Leadership Start Date
                </label>
                <p className="text-xs text-muted">
                  When you started taking leadership roles
                </p>
                <input
                  type="date"
                  id="leadershipStartDate"
                  value={leadershipStartDate}
                  onChange={(e) => setLeadershipStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                {leadershipStartDate && (
                  <p className="text-sm text-muted">
                    {formatDate(leadershipStartDate)}
                  </p>
                )}
              </div>

              {/* Preview */}
              {experiencePreview && (
                <div className="p-4 bg-background rounded-lg border border-border">
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    Preview (calculated automatically)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-card rounded-lg">
                      <div className="text-3xl font-bold text-accent mb-1">
                        {experiencePreview.totalYearsDisplay}
                      </div>
                      <div className="text-sm text-muted">Years in Tech</div>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg">
                      <div className="text-3xl font-bold text-accent mb-1">
                        {experiencePreview.leadershipYearsDisplay}
                      </div>
                      <div className="text-sm text-muted">Years Leadership</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <div>
              {saveStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-green-500"
                >
                  <CheckCircle2 size={18} />
                  <span className="text-sm">Settings saved successfully!</span>
                </motion.div>
              )}
              {saveStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-red-500"
                >
                  <AlertCircle size={18} />
                  <span className="text-sm">Error saving settings</span>
                </motion.div>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving || !careerStartDate || !leadershipStartDate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
