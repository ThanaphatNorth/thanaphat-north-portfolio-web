import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import {
  ExperienceYears,
  calculateExperienceYears,
  getDefaultExperienceYears,
} from "./experience";
import { ventures as defaultVentures } from "./constants";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get experience years from database (server-side)
 * Uses React.cache() for per-request deduplication
 */
export const getExperienceYears = cache(
  async (): Promise<ExperienceYears> => {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["career_start_date", "leadership_start_date"]);

      if (error) {
        console.warn("Error fetching experience settings:", error);
        return getDefaultExperienceYears();
      }

      const settings = data as { key: string; value: string }[];
      const careerSetting = settings.find(
        (s) => s.key === "career_start_date"
      );
      const leadershipSetting = settings.find(
        (s) => s.key === "leadership_start_date"
      );

      if (careerSetting && leadershipSetting) {
        return calculateExperienceYears(
          careerSetting.value,
          leadershipSetting.value
        );
      }

      return getDefaultExperienceYears();
    } catch (err) {
      console.warn("Error fetching experience settings:", err);
      return getDefaultExperienceYears();
    }
  }
);

/**
 * Venture item interface
 */
export interface VentureItem {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  status: string;
  icon?: string;
}

/**
 * Get ventures from database (server-side)
 * Uses React.cache() for per-request deduplication
 */
export const getVentures = cache(async (): Promise<VentureItem[]> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("ventures")
      .select("*")
      .eq("visible", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching ventures:", error);
      return defaultVentures.map((v) => ({ ...v, icon: "Rocket" }));
    }

    if (data && data.length > 0) {
      return data;
    }

    // If no data in database, use default ventures
    return defaultVentures.map((v) => ({ ...v, icon: "Rocket" }));
  } catch (error) {
    console.error("Error fetching ventures:", error);
    return defaultVentures.map((v) => ({ ...v, icon: "Rocket" }));
  }
});

/**
 * Portfolio item interface for server-side
 */
export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  cover_image: string | null;
  images: string[];
  technologies: string[];
  category: string;
  client_name: string | null;
  project_url: string | null;
  github_url: string | null;
  featured: boolean;
  visible: boolean;
  display_order: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get portfolios from database (server-side)
 * Uses React.cache() for per-request deduplication
 */
export const getPortfolios = cache(
  async (): Promise<PortfolioItem[]> => {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("visible", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching portfolios:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      return [];
    }
  }
);
