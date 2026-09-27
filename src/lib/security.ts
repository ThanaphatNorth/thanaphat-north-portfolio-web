/** Escape a string for safe interpolation into HTML (text or attribute context). */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Serialize JSON for an inline <script type="application/ld+json"> without allowing `</script>` breakout. */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

/**
 * Fixed-window rate limiter kept in module memory. Best-effort only: each
 * serverless instance has its own window, so it slows abuse rather than
 * guaranteeing a global limit.
 */
export function createRateLimiter(limit: number, windowMs: number, maxKeys = 5000) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return function check(key: string, now = Date.now()): boolean {
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.delete(key);
      hits.set(key, { count: 1, resetAt: now + windowMs });
      if (hits.size > maxKeys) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
        // Hard cap: evict oldest windows (Map keeps insertion order).
        for (const k of hits.keys()) {
          if (hits.size <= maxKeys) break;
          hits.delete(k);
        }
      }
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}
