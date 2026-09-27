import { test, expect } from "@playwright/test";
import { complete, runCommand, type TerminalData } from "../src/components/terminal/commands";

const data: TerminalData = {
  experience: { totalYears: 9, leadershipYears: 6, totalYearsDisplay: "9+", leadershipYearsDisplay: "6+" },
  projects: [{ title: "Booking Caddy (Golf)", category: "Mobile" }],
  ventures: [{ name: "JongQue.com", tagline: "Queues", url: "https://jongque.com", status: "Live" }],
};

test("help / whoami / experience", () => {
  expect(runCommand("help", data).lines.join("\n")).toContain("hire");
  const who = runCommand("whoami", data).lines.join("\n");
  expect(who).toContain("Senior Engineering Manager");
  expect(who).toContain("9+ years");
  const exp = runCommand("experience", data).lines.join("\n");
  for (const c of ["Invitrace", "iPassion", "Codediva"]) expect(exp).toContain(c);
});

test("actions: hire, cd, clear, exit, unknown", () => {
  expect(runCommand("hire", data).action).toEqual({ type: "contact", service: undefined });
  expect(runCommand("hire coaching", data).action).toEqual({ type: "contact", service: "Tech Leadership Coaching" });
  expect(runCommand("hire banana", data).action).toEqual({ type: "contact", service: undefined });
  expect(runCommand("cd work", data).action).toEqual({ type: "scroll", target: "#work" });
  expect(runCommand("cd nowhere", data).action).toBeUndefined();
  expect(runCommand("clear", data).action).toEqual({ type: "clear" });
  expect(runCommand("exit", data).action).toEqual({ type: "close" });
  expect(runCommand("sudo hire north", data).action).toEqual({ type: "contact" });
  expect(runCommand("foo", data).lines[0]).toContain("command not found");
  expect(runCommand("   ", data).lines).toEqual([]);
});

test("tab completion", () => {
  expect(complete("who")).toBe("whoami");
  expect(complete("e")).toBe(null); // experience + exit → ambiguous
  expect(complete("exp")).toBe("experience");
});
