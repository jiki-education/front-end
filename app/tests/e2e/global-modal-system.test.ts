 
import { test, expect } from "@playwright/test";

test.describe("Global Modal System E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dev/test-global-modals");
    await page.locator("h1").waitFor();
  });

  test("should open and close example modal", async ({ page }) => {
    // Modal should not be visible initially
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // Wait for button and click it
    const button = page.getByRole("button", { name: "Show Example Modal" });
    await button.waitFor();
    await button.click();

    // Wait for modal to appear
    const modal = page.locator('[role="dialog"]');
    await modal.waitFor();

    // Verify modal content
    await expect(modal.locator("h2")).toHaveText("Global Example");
    await expect(modal.locator("p")).toHaveText("This modal is called globally without any orchestrator!");

    // Close modal via Cancel button
    await page.getByRole("button", { name: "Cancel" }).click();

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test("should handle confirmation modal with callbacks", async ({ page }) => {
    // Open confirmation modal
    await page.getByRole("button", { name: "Show Confirmation Modal" }).click();

    // Wait for modal to appear
    const modal = page.locator('[role="dialog"]');
    await modal.waitFor();

    // Verify modal content
    await expect(modal.locator("h2")).toHaveText("Delete Item");

    // Click Delete button and check alert
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe("Item deleted!");
      await dialog.accept();
    });

    await page.getByRole("button", { name: "Delete" }).click();

    // Wait for modal to close
    await expect(modal).not.toBeVisible();
  });

  test("should display info modal with custom content", async ({ page }) => {
    // Open info modal
    await page.getByRole("button", { name: "Show Info Modal" }).click();

    // Wait for modal to appear
    const modal = page.locator('[role="dialog"]');
    await modal.waitFor();

    // Verify modal content
    await expect(modal.locator("h2")).toHaveText("System Information");
    await expect(page.getByText("The global modal system provides:")).toBeVisible();

    // Close modal
    await page.getByRole("button", { name: "Awesome!" }).click();

    // Wait for modal to disappear
    await expect(modal).not.toBeVisible();
  });

  test("should close modal with X button", async ({ page }) => {
    // Open a modal
    await page.getByRole("button", { name: "Show Example Modal" }).click();
    const modal = page.locator('[role="dialog"]');
    await modal.waitFor();

    // Close using X button (aria-label)
    await page.locator('[aria-label="Close modal"]').click();

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test("should handle custom props in modals", async ({ page }) => {
    // Open modal with custom props
    const button = page.getByRole("button", { name: "Show Modal with Custom Props" });
    await button.waitFor();
    await button.click();

    // Wait for modal to appear
    const modal = page.locator('[role="dialog"]');
    await modal.waitFor();

    // Verify custom props are applied
    await expect(modal.locator("h2")).toHaveText("Custom Title");
    await expect(modal.locator("p")).toHaveText("You can pass any props to your modals!");

    // Close modal
    await modal.getByRole("button", { name: "Confirm" }).click();

    // Wait for modal to disappear
    await expect(modal).not.toBeVisible();
  });
});
