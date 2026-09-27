import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/** Portfolio `category` is stored as "Web App, SaaS" — one parser for every consumer. */
export function parseCategories(category: string | null | undefined): string[] {
  return (category ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Plain-text preview of a markdown snippet (cards show descriptions without formatting). */
export function stripMarkdown(md: string | null | undefined): string {
  return (md ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_|`|~~)(.*?)\1/g, "$2")
    .replace(/^#+\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
