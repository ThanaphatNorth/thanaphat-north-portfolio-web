import type { Page } from "@playwright/test";

/** Collect uncaught errors and console errors (ignoring known-benign noise). */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    // Media aborted by navigation/pausing is not an app error.
    if (/net::ERR_ABORTED|The play\(\) request was interrupted/.test(t)) return;
    errors.push(`console: ${t}`);
  });
  return errors;
}

/** Smooth, human-like wheel scroll (Lenis smooths it further in the "full" tier). */
export async function wheelScroll(page: Page, distance: number, step = 90, pauseMs = 40) {
  const n = Math.ceil(Math.abs(distance) / step);
  for (let i = 0; i < n; i++) {
    await page.mouse.wheel(0, Math.sign(distance) * step);
    await page.waitForTimeout(pauseMs);
  }
}

/** Move the mouse along a straight path in small steps (visible in recordings). */
export async function glide(page: Page, x: number, y: number, steps = 30) {
  await page.mouse.move(x, y, { steps });
}
