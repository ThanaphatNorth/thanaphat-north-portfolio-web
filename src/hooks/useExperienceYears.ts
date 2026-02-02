"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  ExperienceYears,
  calculateExperienceYears,
  getDefaultExperienceYears,
} from "@/lib/experience";

interface SiteSetting {
  key: string;
  value: string;
}

/**
 * Hook to fetch and calculate experience years from the database
 * Falls back to default calculated values if fetch fails
 */
export function useExperienceYears(): ExperienceYears {
  const [experience, setExperience] = useState<ExperienceYears>(
    getDefaultExperienceYears()
  );

  useEffect(() => {
    async function fetchSettings() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["career_start_date", "leadership_start_date"]);

        if (error) {
          console.warn("Error fetching experience settings:", error);
          return;
        }

        const settings = data as SiteSetting[];
        const careerSetting = settings.find((s) => s.key === "career_start_date");
        const leadershipSetting = settings.find(
          (s) => s.key === "leadership_start_date"
        );

        if (careerSetting && leadershipSetting) {
          const calculated = calculateExperienceYears(
            careerSetting.value,
            leadershipSetting.value
          );
          setExperience(calculated);
        }
      } catch (err) {
        console.warn("Error fetching experience settings:", err);
        // Keep using default values
      }
    }

    fetchSettings();
  }, []);

  return experience;
}
