import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  featured: boolean;
  tags: string[];
  read_time: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  published?: boolean;
  featured?: boolean;
  tags?: string[];
  read_time?: number;
}

export interface Venture {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  status: "Live" | "Beta" | "Coming Soon";
  icon: string;
  display_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface VentureFormData {
  name: string;
  tagline: string;
  description: string;
  url: string;
  status?: string;
  icon?: string;
  display_order?: number;
  visible?: boolean;
}

export interface Portfolio {
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

export interface PortfolioFormData {
  title: string;
  slug: string;
  description: string;
  content?: string;
  cover_image?: string;
  images?: string[];
  technologies?: string[];
  category?: string;
  client_name?: string;
  project_url?: string;
  github_url?: string;
  featured?: boolean;
  visible?: boolean;
  display_order?: number;
  completed_at?: string;
}

export async function submitContactForm(data: ContactFormData) {
  const { error } = await supabase.from("contacts").insert([
    {
      name: data.name,
      email: data.email,
      company: data.company || null,
      service: data.service || null,
      message: data.message,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
