import { test, expect, type Page, type Locator } from "@playwright/test";
import { glide, trackErrors, wheelScroll } from "./helpers";

/**
 * Headless recordings have no OS cursor. This overlay draws one that behaves
 * like the real browser would: the native arrow/I-beam where the page shows a
 * native cursor, nothing where the site's own custom cursor takes over, and a
 * ripple on every click.
 */
const CURSOR_OVERLAY = `
(() => {
  const install = () => {
    if (document.getElementById("__rec_cursor")) return;
    const c = document.createElement("div");
    c.id = "__rec_cursor";
    c.style.cssText = "position:fixed;left:0;top:0;width:22px;height:22px;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px);";
    const arrow = '<svg width="22" height="22" viewBox="0 0 22 22"><path d="M2 1 L2 17 L6.5 13 L9.5 20 L12.5 18.7 L9.6 12 L15.5 12 Z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>';
    const beam = '<svg width="22" height="22" viewBox="0 0 22 22"><path d="M8 2 h6 M11 2 v18 M8 20 h6" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M8 2 h6 M11 2 v18 M8 20 h6" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>';
    const hand = '<svg width="22" height="22" viewBox="0 0 22 22"><path d="M8 20 L5 13 C4.4 11.6 6 10.8 6.8 12 L8 13.6 L8 3.5 C8 2.2 10 2.2 10 3.5 L10 10 L10.2 8.4 C10.4 7.2 12.2 7.3 12.2 8.6 L12.2 10.3 C12.4 9.2 14.2 9.3 14.2 10.6 L14.2 11.6 C14.5 10.6 16.2 10.8 16.2 12 L16.2 15.5 C16.2 18 14.6 20 12.5 20 Z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>';
    c.innerHTML = arrow;
    document.documentElement.appendChild(c);
    let current = "arrow";
    document.addEventListener("mousemove", (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const cur = el ? getComputedStyle(el).cursor : "auto";
      let kind = "arrow";
      if (cur === "none") kind = "none";
      else if (cur === "text" || (el && el.matches("input:not([type=checkbox]),textarea"))) kind = "beam";
      else if (cur === "pointer") kind = "hand";
      if (kind !== current) {
        current = kind;
        c.innerHTML = kind === "beam" ? beam : kind === "hand" ? hand : kind === "arrow" ? arrow : "";
      }
      const dx = kind === "beam" ? 11 : kind === "hand" ? 7 : 2;
      const dy = kind === "beam" ? 11 : kind === "hand" ? 2 : 1;
      c.style.transform = "translate(" + (e.clientX - dx) + "px," + (e.clientY - dy) + "px)";
    }, { capture: true, passive: true });
    document.addEventListener("mousedown", (e) => {
      const r = document.createElement("div");
      r.style.cssText = "position:fixed;z-index:2147483646;pointer-events:none;left:" + (e.clientX - 18) + "px;top:" + (e.clientY - 18) + "px;width:36px;height:36px;border-radius:50%;border:2px solid #ff5a1f;opacity:.9;transition:transform .45s ease-out,opacity .45s ease-out;";
      document.documentElement.appendChild(r);
      requestAnimationFrame(() => { r.style.transform = "scale(2.2)"; r.style.opacity = "0"; });
      setTimeout(() => r.remove(), 500);
    }, { capture: true, passive: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();
`;

async function centerOf(l: Locator) {
  const b = await l.boundingBox();
  if (!b) throw new Error("element not visible");
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}

async function hoverGlide(page: Page, l: Locator, steps = 35) {
  const p = await centerOf(l);
  await glide(page, p.x, p.y, steps);
  return p;
}

async function slowType(page: Page, selector: string, text: string) {
  await page.locator(selector).click();
  await page.keyboard.type(text, { delay: 45 });
}

async function scrollUntil(page: Page, selector: string, topPx = 120, step = 90) {
  for (let i = 0; i < 400; i++) {
    const top = await page.locator(selector).first().evaluate((el) => el.getBoundingClientRect().top);
    if (top <= topPx) return;
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(45);
  }
}

test("TRUE NORTH — full walkthrough (recorded)", async ({ page }) => {
  const errors = trackErrors(page);
  await page.addInitScript(CURSOR_OVERLAY);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await page.mouse.move(720, 450);
  await page.waitForTimeout(1200);

  // 1 — Hero: mouse parallax over the blueprint, hover the primary CTA
  await glide(page, 1100, 260, 40);
  await glide(page, 300, 380, 50);
  await glide(page, 980, 520, 45);
  await hoverGlide(page, page.getByTestId("hero-cta"));
  await page.waitForTimeout(900);
  await glide(page, 1000, 600, 30);

  // 2 — Scroll to build: blueprint → skyline → the city rewritten as code
  await wheelScroll(page, 1050, 60, 70);
  await page.waitForTimeout(1500);
  await wheelScroll(page, 500, 50, 70);
  await expect(page.getByTestId("hero-terminal")).toContainText("ai-agent");
  await wheelScroll(page, 650, 45, 75);
  await page.waitForTimeout(1800);
  await wheelScroll(page, 500, 70, 55);

  // 3 — Impact gauges
  await scrollUntil(page, "#impact", 60);
  await page.waitForTimeout(1600);

  // 4 — Work: pinned horizontal gallery, open a case study
  await scrollUntil(page, "#work", 40);
  await page.waitForTimeout(700);
  await wheelScroll(page, 1400, 80, 55);
  const card = page.getByTestId("portfolio-card").nth(2);
  await hoverGlide(page, card);
  await page.waitForTimeout(900);
  await card.click();
  const drawer = page.getByTestId("portfolio-drawer").getByRole("dialog");
  await expect(drawer).toBeVisible();
  await page.waitForTimeout(1200);
  await glide(page, 1100, 600, 25);
  await wheelScroll(page, 900, 90, 70);
  await page.waitForTimeout(800);
  await hoverGlide(page, page.getByRole("button", { name: "Close dialog" }), 25);
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(drawer).toBeHidden();
  await wheelScroll(page, 2600, 110, 45);

  // 5 — Journey: route draws, sticky year updates
  await scrollUntil(page, "#journey", 40);
  await page.waitForTimeout(600);
  await wheelScroll(page, 2400, 80, 60);

  // 6 — Services: tilt + spotlight, CTA pre-selects the service
  await scrollUntil(page, "[data-testid=services-grid]", 150);
  await page.waitForTimeout(900);
  const svc = page.getByTestId("service-cta-agile");
  const grid = await page.getByTestId("services-grid").boundingBox();
  if (grid) {
    await glide(page, grid.x + 60, grid.y + 60, 20);
    await glide(page, grid.x + grid.width - 80, grid.y + 140, 60);
    await glide(page, grid.x + grid.width * 0.3, grid.y + grid.height * 0.35, 50);
  }
  await hoverGlide(page, svc);
  await svc.click();
  await expect(page.locator("#contact-service")).toHaveValue("Agile & Team Performance Consultant");
  await page.waitForTimeout(1000);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // 7 — Ventures, Philosophy word reveal, Blog marquee
  await wheelScroll(page, 1600, 80, 55);
  await scrollUntil(page, "#philosophy", 0, 70);
  await wheelScroll(page, 1300, 50, 70);
  await page.waitForTimeout(600);
  await scrollUntil(page, "#blog", 80);
  await page.waitForTimeout(1600);

  // 8 — Stack constellation: trace two constellations
  await scrollUntil(page, "#stack", 60);
  await page.waitForTimeout(1800);
  const svg = await page.getByTestId("constellation").boundingBox();
  if (svg) {
    await glide(page, svg.x + svg.width * 0.22, svg.y + svg.height * 0.2, 40);
    await page.waitForTimeout(900);
    await glide(page, svg.x + svg.width * 0.78, svg.y + svg.height * 0.72, 50);
    await page.waitForTimeout(900);
  }

  // 9 — Summit: book the call
  await scrollUntil(page, "#contact", 0);
  await page.waitForTimeout(2000);
  const cta = page.getByTestId("summit-cta");
  await hoverGlide(page, cta, 40);
  await page.waitForTimeout(600);
  await cta.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.waitForTimeout(500);
  await slowType(page, "#contact-name", "Somchai Jaidee");
  await slowType(page, "#contact-email", "somchai@example.com");
  await slowType(page, "#contact-message", "We need to scale our delivery team from 8 to 20 engineers.");
  const send = page.getByRole("button", { name: "Send message" });
  await hoverGlide(page, send, 25);
  await send.click();
  await expect(page.getByRole("status")).toContainText("got it");
  await page.waitForTimeout(2200);

  expect(errors, errors.join("\n")).toEqual([]);
});
