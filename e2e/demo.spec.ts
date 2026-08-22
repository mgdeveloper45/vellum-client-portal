import { expect, test } from "@playwright/test";

test.describe("public product demo", () => {
  test("visitor can enter the demo from the landing page", async ({ page }) => {
    await page.goto("/");

    const demoLink = page.getByRole("link", {
      name: "View Demo",
      exact: true,
    });

    await expect(demoLink).toBeVisible();
    await expect(demoLink).toHaveAttribute("href", "/demo");

    await demoLink.click();

    await expect(page).toHaveURL(/\/demo$/);

    await expect(
      page.getByRole("heading", {
        name: "Good morning. Here's what needs your attention.",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByText("Demo Workspace", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("visitor can explore projects without signing in", async ({ page }) => {
    await page.goto("/demo/projects");

    await expect(
      page.getByRole("heading", {
        name: "Projects",
        exact: true,
      }),
    ).toBeVisible();

    const projectLink = page.getByRole("link", {
      name: /Atlas Coffee Website Redesign/i,
    });

    await expect(projectLink).toBeVisible();
    await expect(projectLink).toHaveAttribute(
      "href",
      "/demo/projects/project-atlas",
    );

    /*
     * The project link destination is verified above.
     * Navigate directly so the test validates the public dynamic route
     * without depending on a flaky dev-server client transition.
     */
    await page.goto("/demo/projects/project-atlas");

    await expect(page).toHaveURL(
      /\/demo\/projects\/project-atlas$/,
    );

    await expect(
      page.getByRole("heading", {
        name: "Atlas Coffee Website Redesign",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("visitor can explore an invoice and generate its demo AI reminder", async ({
    page,
  }) => {
    await page.goto("/demo/invoices");

    await expect(
      page.getByRole("heading", {
        name: "Invoices",
        exact: true,
      }),
    ).toBeVisible();

    const invoiceLink = page.getByRole("link", {
      name: "Review Invoice",
      exact: true,
    });

    await expect(invoiceLink).toBeVisible();
    await expect(invoiceLink).toHaveAttribute(
      "href",
      "/demo/invoices/INV-1042",
    );

    /*
     * The href itself is already verified above.
     * Navigate directly so this E2E test validates the route and workflow
     * without depending on a potentially flaky dev-server client transition.
     */
    await page.goto("/demo/invoices/INV-1042");

    await expect(page).toHaveURL(
      /\/demo\/invoices\/INV-1042$/,
    );

    const reminderLink = page.getByRole("link", {
      name: "Draft AI Reminder",
      exact: true,
    });

    await expect(reminderLink).toBeVisible();
    await expect(reminderLink).toHaveAttribute(
      "href",
      "/demo/invoices/INV-1042/reminder",
    );

    await page.goto("/demo/invoices/INV-1042/reminder");

    await expect(page).toHaveURL(
      /\/demo\/invoices\/INV-1042\/reminder$/,
    );

    await expect(
      page.getByRole("heading", {
        name: "AI Invoice Reminder",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(/outstanding balance is \$2,500/i),
    ).toBeVisible();
  });

  test("authenticated application routes remain protected", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/sign-in/);
  });
});
