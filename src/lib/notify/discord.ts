/**
 * Contact-form notification to a Discord channel via an incoming webhook.
 * The webhook URL is a secret: it comes only from DISCORD_CONTACT_WEBHOOK_URL
 * (never hard-code or commit it).
 */

export interface ContactNotification {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}

// Only real Discord webhook endpoints — a misconfigured env must not turn this into an open relay.
const WEBHOOK_RE = /^https:\/\/(?:canary\.|ptb\.)?(?:discord|discordapp)\.com\/api\/webhooks\/\d+\/[\w-]+$/;

export function getDiscordWebhookUrl(env: Record<string, string | undefined> = process.env): string | null {
  const url = env.DISCORD_CONTACT_WEBHOOK_URL?.trim();
  if (!url) return null;
  // Tests may point at a local mock explicitly.
  if (env.DISCORD_WEBHOOK_ALLOW_LOCAL === "1" && /^http:\/\/127\.0\.0\.1:\d+\//.test(url)) return url;
  return WEBHOOK_RE.test(url) ? url : null;
}

/** Discord limits: embed field value ≤ 1024, description ≤ 4096, title ≤ 256. */
function clip(value: string, max: number): string {
  // Budget in UTF-16 units (the stricter count) but cut on code points,
  // so emoji / surrogate pairs are never split.
  if (value.length <= max) return value;
  let out = "";
  for (const ch of value) {
    if (out.length + ch.length > max - 1) break;
    out += ch;
  }
  return `${out}…`;
}

/** Discord rejects an embed whose title+description+fields+footer exceed 6000 chars. */
const EMBED_BUDGET = 5900;

/**
 * Neutralise Discord markup that could ping people or break formatting.
 * allowed_mentions below is the real guard; this keeps the text readable.
 */
function plain(value: string): string {
  return value.replace(/@(everyone|here)/gi, "@​$1").replace(/```/g, "ˋˋˋ");
}

export function buildDiscordPayload(c: ContactNotification, now = new Date()) {
  const fields = [
    { name: "Name", value: clip(plain(c.name), 1024), inline: true },
    { name: "Email", value: clip(plain(c.email), 1024), inline: true },
    ...(c.company ? [{ name: "Company", value: clip(plain(c.company), 1024), inline: true }] : []),
    ...(c.service ? [{ name: "Interested in", value: clip(plain(c.service), 1024), inline: false }] : []),
  ];
  const title = clip(`📬 New contact${c.service ? ` — ${plain(c.service)}` : ""}`, 256);
  const footer = "Portfolio contact form";
  const used = title.length + footer.length + fields.reduce((n, f) => n + f.name.length + f.value.length, 0);
  const description = clip(plain(c.message), Math.max(200, Math.min(4000, EMBED_BUDGET - used)));

  return {
    username: "thanaphat-north.com",
    // Never ping @everyone/@here/roles/users from user-supplied text.
    allowed_mentions: { parse: [] as string[] },
    embeds: [
      {
        title,
        description,
        color: 0xff5a1f,
        fields,
        timestamp: now.toISOString(),
        footer: { text: footer },
      },
    ],
  };
}

/** Returns true when Discord accepted the message. Never throws. */
export async function sendDiscordContactNotification(c: ContactNotification): Promise<boolean> {
  const url = getDiscordWebhookUrl();
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildDiscordPayload(c)),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("Discord webhook failed:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (error) {
    console.error("Discord webhook error:", error);
    return false;
  }
}
