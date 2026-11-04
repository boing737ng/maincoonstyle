import { test, expect } from "@playwright/test";

test("главная открывается, hero содержит название питомника", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toContainText(/Large\s*Brush|Cattery/i);
});

test("навигация содержит ключевые разделы", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("banner").getByRole("navigation");
  await expect(nav).toBeVisible();
  for (const label of ["Котята", "Контакты", "О породе"]) {
    await expect(nav.getByRole("link", { name: label })).toBeAttached();
  }
});

test("на узком экране нет горизонтального переполнения", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");

  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBe(320);
});

test("корзина открывается без переполнения страницы", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: /Корзина/ }).click();
  await expect(page.getByRole("dialog", { name: "Корзина" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBe(390);
});

test("hero и шапка не ломаются на промежуточной ширине", async ({ page }) => {
  await page.setViewportSize({ width: 676, height: 1235 });
  await page.goto("/");

  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBe(676);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: /Корзина/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Открыть меню/ })).toBeVisible();
});
