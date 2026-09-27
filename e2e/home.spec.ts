import { test, expect } from "@playwright/test";
import { trackErrors } from "./helpers";

test.describe("home — desktop", () => {
  test("renders without runtime errors and with the hero message visible at first paint", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("software blueprints");
    await expect(h1).toBeVisible();
    // Experience years come from the DB and must not double the "+" (was "8++").
    await expect(page.getByTestId("hero")).not.toContainText("++");
    await page.waitForLoadState("networkidle");
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("server HTML already contains the hero copy (SEO/LCP, no opacity:0 on h1)", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain("I turn software blueprints into systems that");
    expect(html).not.toMatch(/<h1[^>]*style="[^"]*opacity:\s*0/);
  });

  test("desktop gets the full motion tier (Lenis + custom cursor)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
    await expect(page.locator("html")).toHaveClass(/lenis/);
    await expect(page.getByTestId("custom-cursor")).toBeAttached();
  });

  test("nav links land on their sections; legacy anchors still exist", async ({ page }) => {
    await page.goto("/");
    for (const [label, id] of [["Work", "work"], ["Journey", "journey"], ["Services", "services"]] as const) {
      await page.getByTestId(`nav-${label.toLowerCase()}`).click();
      await expect
        .poll(async () => page.locator(`#${id}`).evaluate((el) => Math.abs(el.getBoundingClientRect().top)), { timeout: 8000 })
        .toBeLessThan(120);
    }
    for (const legacy of ["portfolio", "experience", "tech-stack"]) {
      await expect(page.locator(`#${legacy}`)).toHaveCount(1);
    }
  });

  test("contact dialog: accessible, focus-trapped, Esc closes and returns focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByTestId("nav-cta");
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(page.locator("#contact-name")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("service CTA pre-selects that service every time (was stale after first open)", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("service-cta-advisor").scrollIntoViewIfNeeded();
    await page.getByTestId("service-cta-advisor").click();
    await expect(page.locator("#contact-service")).toHaveValue("Startup & Product Technical Advisor");
    await page.keyboard.press("Escape");
    await page.getByTestId("service-cta-coaching").click();
    await expect(page.locator("#contact-service")).toHaveValue("Tech Leadership Coaching");
  });

  test("contact form submits and shows success", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("hero-cta").click();
    await page.locator("#contact-name").fill("E2E Tester");
    await page.locator("#contact-email").fill("e2e@example.com");
    await page.locator("#contact-message").fill("Hello from the e2e suite.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("got it");
  });

  test("contact API rejects bad input and escapes nothing into responses", async ({ request }) => {
    const bad = await request.post("/api/contact", { data: { name: "x", email: "not-an-email", message: "hi" } });
    expect(bad.status()).toBe(400);
    const honeypot = await request.post("/api/contact", {
      data: { name: "bot", email: "b@b.co", message: "spam", website: "http://spam" },
    });
    expect(honeypot.status()).toBe(200);
  });

  test("portfolio: horizontal gallery and case-study drawer", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("portfolio-gallery")).toBeAttached();
    const cards = page.getByTestId("portfolio-card");
    expect(await cards.count()).toBeGreaterThan(3);
    await page.locator("#work").scrollIntoViewIfNeeded();
    await cards.first().click();
    const drawer = page.getByTestId("portfolio-drawer").getByRole("dialog");
    await expect(drawer).toBeVisible();
    await page.getByRole("button", { name: "Close dialog" }).click();
    await expect(drawer).toBeHidden();
  });

  test("pause-motion toggle switches to the static tier and persists", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("motion-toggle").first().click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "static");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "static");
    await page.getByTestId("motion-toggle").first().click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  });

  test("admin routes are gated", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test("pause-motion (manual, no OS setting) also stops CSS transitions and Lenis", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.getByTestId("motion-toggle").first().click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "static");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  const dur = await page.getByTestId("nav-cta").evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(dur.split(",").every((d) => parseFloat(d) < 0.01)).toBe(true);
  // restore for the next tests
  await page.getByTestId("motion-toggle").first().click();
});

test("contact submission is forwarded to the Discord webhook without pinging anyone", async ({ page, request }) => {
  const before = (await (await request.get("http://127.0.0.1:54329/__discord")).json()).length;
  await page.goto("/");
  await page.getByTestId("hero-cta").click();
  await page.locator("#contact-name").fill("Discord Tester");
  await page.locator("#contact-email").fill("discord@example.com");
  await page.locator("#contact-service").selectOption("Tech Leadership Coaching");
  await page.locator("#contact-message").fill("Hi @everyone — please call me back.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("got it");

  const inbox = await (await request.get("http://127.0.0.1:54329/__discord")).json();
  expect(inbox.length).toBe(before + 1);
  const payload = inbox[inbox.length - 1];
  expect(payload.allowed_mentions).toEqual({ parse: [] });
  const embed = payload.embeds[0];
  expect(embed.title).toContain("Tech Leadership Coaching");
  expect(embed.description).not.toContain("@everyone");
  expect(embed.fields).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "Name", value: "Discord Tester" }),
      expect.objectContaining({ name: "Email", value: "discord@example.com" }),
    ])
  );
});
