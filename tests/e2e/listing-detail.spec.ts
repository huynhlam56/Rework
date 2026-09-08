import { test, expect } from "@playwright/test";

test.describe("listing detail", () => {
  test("shows price, condition, and seller", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("listing-card").first().click();

    await expect(page.getByTestId("listing-detail")).toBeVisible();
    await expect(page.getByTestId("listing-price")).toHaveText(/^\$\d+\.\d{2}$/);
    await expect(page.getByText("Sold by")).toBeVisible();
  });

  test("unknown listing id shows the 404 page", async ({ page }) => {
    await page.goto("/listings/does-not-exist");

    await expect(page.getByTestId("not-found")).toBeVisible();
  });
});
