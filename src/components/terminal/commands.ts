import { experienceGroups, siteConfig, techStack, credentials, impactStats, coordinates, services } from "@/lib/constants";
import type { ExperienceYears } from "@/lib/experience";

export interface TerminalData {
  experience: ExperienceYears;
  projects: { title: string; category: string }[];
  ventures: { name: string; tagline: string; url: string; status: string }[];
}

/** Side effects a command may request; the UI performs them. */
export type TerminalAction =
  | { type: "clear" }
  | { type: "close" }
  | { type: "contact"; service?: string }
  | { type: "scroll"; target: string }
  | { type: "download" }
  | { type: "toggle-motion" };

export interface CommandResult {
  lines: string[];
  action?: TerminalAction;
}

const SECTIONS: Record<string, string> = {
  top: "#top",
  impact: "#impact",
  work: "#work",
  journey: "#journey",
  services: "#services",
  ventures: "#ventures",
  philosophy: "#philosophy",
  blog: "#blog",
  stack: "#stack",
  contact: "#contact",
};

export const COMMANDS = [
  "help", "whoami", "about", "experience", "projects", "stack", "ventures", "impact",
  "hire", "resume", "ls", "cd", "motion", "clear", "exit",
] as const;

const pad = (s: string, n: number) => s + " ".repeat(Math.max(1, n - s.length));

export function runCommand(input: string, data: TerminalData): CommandResult {
  const raw = input.trim();
  if (!raw) return { lines: [] };
  const [cmd, ...args] = raw.split(/\s+/);
  const arg = args.join(" ").toLowerCase();

  switch (cmd.toLowerCase()) {
    case "help":
      return {
        lines: [
          "Available commands:",
          `  ${pad("whoami", 14)}who is North`,
          `  ${pad("about", 14)}the short version`,
          `  ${pad("experience", 14)}career, grouped by company`,
          `  ${pad("projects", 14)}selected work`,
          `  ${pad("stack", 14)}tools I ship with`,
          `  ${pad("ventures", 14)}products I run`,
          `  ${pad("impact", 14)}numbers that matter`,
          `  ${pad("hire [service]", 14)}open the contact form (advisor, agile, development, coaching)`,
          `  ${pad("resume", 14)}download the CV (PDF)`,
          `  ${pad("ls / cd <dir>", 14)}jump to a section`,
          `  ${pad("motion", 14)}pause / play animations`,
          `  ${pad("clear, exit", 14)}tidy up / close`,
          "Tip: ↑/↓ history · Tab completes · Esc closes",
        ],
      };
    case "whoami":
      return {
        lines: [
          `${siteConfig.name} — Thanaphat Chirutpadathorn`,
          siteConfig.role,
          `${data.experience.totalYearsDisplay} years in software · ${data.experience.leadershipYearsDisplay} leading teams`,
          `Bangkok, Thailand · ${coordinates}`,
        ],
      };
    case "about":
      return {
        lines: [
          "I lead a 30+ engineer healthcare-tech organization at Invitrace:",
          "patient-facing apps, employee-health products and hospital systems.",
          "Scaled the org by 50%, drove ISO 27001/9001, and grew an AI-assisted",
          "workflow from one team to a 3× gain in deployment frequency.",
          "Also a technical consultant for teams that need to ship. → try `hire`",
        ],
      };
    case "experience":
    case "journey":
      return {
        lines: experienceGroups.flatMap((g) => [
          `▸ ${g.company}  (${g.period})`,
          ...g.roles.map((r) => `    ${pad(r.period, 22)}${r.title}`),
        ]),
      };
    case "projects":
    case "work":
      return {
        lines: data.projects.length
          ? [
              ...data.projects.map((p, i) => `  ${String(i + 1).padStart(2, "0")}  ${p.title}${p.category ? `  [${p.category}]` : ""}`),
              "→ `cd work` to see them",
            ]
          : ["No projects loaded right now. → `cd work`"],
      };
    case "stack":
      return {
        lines: Object.entries(techStack).map(([k, v]) => `  ${pad(k, 10)}${v.map((t) => t.name).join(" · ")}`),
      };
    case "ventures":
      return {
        lines: data.ventures.map((v) => `  ${pad(v.name, 20)}${v.tagline}  (${v.status}) ${v.url}`),
      };
    case "impact":
      return {
        lines: [
          ...impactStats.map((s) => `  ${pad(`${s.value}${s.suffix}`, 6)}${s.label} — ${s.description}`),
          `  ${credentials.join(" · ")}`,
        ],
      };
    case "hire":
    case "contact":
    {
      // Only pre-select a real service (the form uses a <select>); free text is ignored.
      const service = arg ? services.find((sv) => sv.title.toLowerCase().includes(arg) || sv.id === arg)?.title : undefined;
      return {
        lines: [
          service ? `Opening the contact form for “${service}”…` : "Opening the contact form… the first 30-minute call is free.",
          ...(arg && !service ? [`(no service matches “${arg}” — options: ${services.map((sv) => sv.id).join(", ")})`] : []),
        ],
        action: { type: "contact", service },
      };
    }
    case "sudo":
      if (arg.startsWith("hire")) {
        return { lines: ["[sudo] permission granted. Excellent decision."], action: { type: "contact" } };
      }
      return { lines: [`sudo: ${arg || "command"}: nice try 🙂`] };
    case "resume":
    case "cv":
      return { lines: ["Downloading Thanaphat-Chirutpadathorn-Resume.pdf…"], action: { type: "download" } };
    case "ls":
      return { lines: [Object.keys(SECTIONS).join("  ")] };
    case "cd": {
      const key = arg.replace(/^[#/~.]+/, "") || "top";
      const target = SECTIONS[key];
      return target
        ? { lines: [`→ ${key}`], action: { type: "scroll", target } }
        : { lines: [`cd: no such section: ${arg}. Try \`ls\`.`] };
    }
    case "motion":
      return { lines: ["Toggling motion…"], action: { type: "toggle-motion" } };
    case "clear":
      return { lines: [], action: { type: "clear" } };
    case "exit":
    case "quit":
      return { lines: [], action: { type: "close" } };
    case "rm":
      return { lines: ["rm: this portfolio is in production. Denied. 😅"] };
    default:
      return { lines: [`command not found: ${cmd}. Type \`help\`.`] };
  }
}

export function complete(prefix: string): string | null {
  const p = prefix.trim().toLowerCase();
  if (!p || p.includes(" ")) return null;
  const hits = COMMANDS.filter((c) => c.startsWith(p));
  return hits.length === 1 ? hits[0] : null;
}
