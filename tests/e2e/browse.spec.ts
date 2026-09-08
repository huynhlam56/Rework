import { test, expect } from "@playwright/test";

test.describe("browse listings", () => {
  test("home page shows seeded listings", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Browse listings" })).toBeVisible();
    await expect(page.getByTestId("listing-card").first()).toBeVisible();
  });

  test("clicking a listing navigates to its detail page", async ({ page }) => {
    await page.goto("/");

    const firstCard = page.getByTestId("listing-card").first();
    const title = await firstCard.locator("p").first().innerText();
    await firstCard.click();

    await expect(page).toHaveURL(/\/listings\//);
    await expect(page.getByTestId("listing-title")).toHaveText(title);
  });
});
