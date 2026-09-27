import { test, expect } from "@playwright/test";

test("prefers-reduced-motion → static tier: no smooth scroll, no autoplay video, content visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "static");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  expect(await page.locator("video").count()).toBe(0);
  // Hero is a single screen (no pinned scrub) in static mode.
  const heroH = await page.getByTestId("hero").evaluate((el) => el.getBoundingClientRect().height);
  expect(heroH).toBeLessThan(1000);
});

test("reduced motion: no intro overlay", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("intro")).toBeHidden();
});
