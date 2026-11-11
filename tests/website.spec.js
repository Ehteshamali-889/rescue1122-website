import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("production page loads images and valid section links without runtime errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (
      response.url().startsWith("http://127.0.0.1:4173") &&
      response.status() >= 400
    ) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "HERE FORLIFE.",
  );
  const broken = await page.evaluate(async () => {
    const images = [...document.images];
    await Promise.all(
      images.map(async (image) => {
        image.loading = "eager";
        await image.decode().catch(() => {});
      }),
    );
    return images
      .filter((image) => !image.naturalWidth)
      .map((image) => image.src);
  });
  expect(broken).toEqual([]);
  const missingTargets = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href"))
        .filter(
          (href) => href !== "#" && !document.getElementById(href.slice(1)),
        ),
    );
  expect(missingTargets).toEqual([]);
  expect(errors).toEqual([]);
});

test("service tabs support keyboard selection and modal focus restoration", async ({
  page,
}) => {
  await page.goto("/");
  const tabs = page.getByRole("tablist", { name: "Rescue services" });
  await expect(tabs).toHaveAttribute("aria-orientation", "vertical");
  const first = page.getByRole("tab", { name: /Ambulance service/ });
  await first.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("tab", { name: /Fire & rescue/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Fire & rescue");
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: /Emergency rescue training/ }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  const opener = page.getByRole("button", {
    name: "Service information",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading")).toHaveText("Ambulance service");
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading")).toHaveText("Fire & rescue");
  const nextService = dialog.getByRole("button", {
    name: "Next service",
    exact: true,
  });
  await nextService.click();
  await expect(dialog.getByRole("heading")).toHaveText("Motorbike rescue");
  await expect(nextService).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

test("photo stories navigate, close, and restore the opener", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.locator(".story-panel").first();
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading")).toHaveText(
    "The first link in care.",
  );
  await page
    .getByRole("button", { name: "Next photo story", exact: true })
    .click();
  await expect(dialog.getByRole("heading")).toHaveText(
    "Courage is a team effort.",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("frontline story can hand off to service details without leaving scroll locked", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.getByRole("button", { name: /Open respond photograph/ });
  await opener.click();
  const nextPhoto = page.getByRole("button", {
    name: "Next frontline photograph",
    exact: true,
  });
  await nextPhoto.click();
  await expect(nextPhoto).toBeFocused();
  await page
    .getByRole("button", { name: "Previous frontline photograph", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Explore medical response", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveCount(1);
  await expect(dialog.getByRole("heading")).toHaveText("Ambulance service");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await expect(opener).toBeFocused();
});

test("mobile menu supports Escape and closes after section navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu", exact: true });
  await menu.click();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#services$/);
  await expect(page.getByRole("tablist")).toHaveAttribute(
    "aria-orientation",
    "horizontal",
  );
});

test("reduced motion and the motion switch stop automatic animation and smooth scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("body")).toHaveAttribute("data-motion", "off");
  const activeImage = await page
    .locator(".doc-hero-plate.active img")
    .getAttribute("src");
  await page.waitForTimeout(7200);
  await expect(page.locator(".doc-hero-plate.active img")).toHaveAttribute(
    "src",
    activeImage,
  );
  const enable = page.getByRole("button", { name: "Enable website motion" });
  await enable.click();
  await expect(page.locator("body")).toHaveAttribute("data-motion", "on");
  await page.getByRole("button", { name: "Pause website motion" }).click();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

test("FAQ exposes one answer at a time and supports collapsing it", async ({
  page,
}) => {
  await page.goto("/");
  const questions = page.locator(".faq button");
  await expect(questions.nth(0)).toHaveAttribute("aria-expanded", "true");
  await questions.nth(1).click();
  await expect(questions.nth(0)).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#answer-0")).toBeHidden();
  await expect(page.locator("#answer-1")).toBeVisible();
  await questions.nth(1).click();
  await expect(page.locator("#answer-1")).toBeHidden();
});

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`layout fits a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("link", { name: "Emergency? Call 1122" }),
    ).toBeVisible();
  });
}

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test(`accessibility scan at ${viewport.width}px covers the page and open dialog`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const scan = () =>
      new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
    expect((await scan()).violations).toEqual([]);
    await page.locator(".story-panel").first().click();
    expect((await scan()).violations).toEqual([]);
  });
}
