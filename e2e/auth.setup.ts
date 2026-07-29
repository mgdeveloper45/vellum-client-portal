import { test as setup, expect } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("/sign-in");

  await page.getByLabel("Email").fill("email");

  await page.getByLabel("Password").fill("password");

  await page
    .getByRole("button", {
      name: "Sign In",
    })
    .click();

  await expect(page).toHaveURL(/dashboard/);

  // Later we'll save the authenticated storage state here.
});
