import { test, expect } from "@playwright/test";

test("главная открывается, hero содержит название питомника", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toContainText(/LargeBrush|Cattery/i);
});

test("навигация содержит ключевые разделы", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("banner").getByRole("navigation");
  await expect(nav).toBeVisible();
  for (const label of ["Котята", "Контакты", "О породе"]) {
    await expect(nav.getByRole("link", { name: label })).toBeAttached();
  }
});
