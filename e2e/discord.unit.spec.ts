import { test, expect } from "@playwright/test";
import { buildDiscordPayload, getDiscordWebhookUrl } from "../src/lib/notify/discord";

test.describe("discord notifier (unit)", () => {
  test("accepts only real Discord webhook URLs", () => {
    const ok = "https://discord.com/api/webhooks/123/abc_DEF-ghi";
    expect(getDiscordWebhookUrl({ DISCORD_CONTACT_WEBHOOK_URL: ok })).toBe(ok);
    expect(getDiscordWebhookUrl({ DISCORD_CONTACT_WEBHOOK_URL: "https://discordapp.com/api/webhooks/1/x" })).not.toBeNull();
    expect(getDiscordWebhookUrl({})).toBeNull();
    expect(getDiscordWebhookUrl({ DISCORD_CONTACT_WEBHOOK_URL: "https://evil.example/api/webhooks/1/x" })).toBeNull();
    expect(getDiscordWebhookUrl({ DISCORD_CONTACT_WEBHOOK_URL: "http://discord.com/api/webhooks/1/x" })).toBeNull();
    // local mock only when explicitly allowed
    const local = "http://127.0.0.1:54329/api/webhooks/1/t";
    expect(getDiscordWebhookUrl({ DISCORD_CONTACT_WEBHOOK_URL: local })).toBeNull();
    expect(getDiscordWebhookUrl({ DISCORD_CONTACT_WEBHOOK_URL: local, DISCORD_WEBHOOK_ALLOW_LOCAL: "1" })).toBe(local);
  });

  test("payload never pings and respects Discord limits", () => {
    const p = buildDiscordPayload(
      { name: "A", email: "a@b.co", message: "@here hello ```x```" + "y".repeat(5000), company: "", service: "" },
      new Date("2026-09-28T00:00:00Z")
    );
    expect(p.allowed_mentions).toEqual({ parse: [] });
    expect(p.embeds[0].description.length).toBeLessThanOrEqual(4000);
    expect(p.embeds[0].description).not.toMatch(/@here/);
    expect(p.embeds[0].description).not.toContain("```");
    expect(p.embeds[0].fields.map((f) => f.name)).toEqual(["Name", "Email"]);
    expect(p.embeds[0].timestamp).toBe("2026-09-28T00:00:00.000Z");
  });
});

test("whole embed stays under Discord's 6000-char budget even with maxed fields", () => {
  const long = "x".repeat(2000);
  const p = buildDiscordPayload({ name: long, email: long, company: long, service: long, message: "🙂".repeat(6000) });
  const e = p.embeds[0];
  const total = e.title.length + e.description.length + e.footer.text.length + e.fields.reduce((n, f) => n + f.name.length + f.value.length, 0);
  expect(total).toBeLessThanOrEqual(6000);
  expect(e.description.endsWith("…")).toBe(true);
  expect(e.description).not.toMatch(/\uD83D(?!\uDE42)/); // no half emoji
});
