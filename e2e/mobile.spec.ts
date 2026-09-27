import { test, expect } from "@playwright/test";
import { trackErrors } from "./helpers";

test("mobile: lite tier, menu dialog, no horizontal overflow", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "lite");
  await expect(page.getByTestId("custom-cursor")).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByText("Journey", { exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  // Portfolio falls back to a grid (no pinned horizontal gallery) on touch.
  await expect(page.getByTestId("portfolio-gallery")).toHaveCount(0);
  expect(errors, errors.join("\n")).toEqual([]);
});
