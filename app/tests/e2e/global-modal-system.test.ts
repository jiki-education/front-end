/* eslint-disable @typescript-eslint/no-unnecessary-condition */
describe("Global Modal System E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3070/dev/test-global-modals");
    await page.waitForSelector("h1");

    // Wait a bit for page to fully stabilize
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  it("should open and close example modal", async () => {
    // Modal should not be visible initially
    const modalBefore = await page.$('[role="dialog"]');
    expect(modalBefore).toBeNull();

    // Wait for button to be present and clickable
    await page.waitForFunction(
      () => {
        const button = Array.from(document.querySelectorAll("button")).find((el) =>
          el.textContent?.includes("Show Example Modal")
        );
        return button !== undefined;
      },
      { timeout: 5000 }
    );

    // Click button to open modal - evaluate in page context and verify click happened
    const clickResult = await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find((el) =>
        el.textContent?.includes("Show Example Modal")
      );
      if (!button) {
        throw new Error("Button 'Show Example Modal' not found");
      }
      button.click();
      return true;
    });

    expect(clickResult).toBe(true);

    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Verify modal content - get all h2 elements and find the one in the modal
    const titleText = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const h2 = modal?.querySelector("h2");
      return h2?.textContent;
    });
    expect(titleText).toBe("Global Example");

    const messageText = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const p = modal?.querySelector("p");
      return p?.textContent;
    });
    expect(messageText).toBe("This modal is called globally without any orchestrator!");

    // Close modal via Cancel button
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find((el) => el.textContent?.includes("Cancel"));
      button?.click();
    });

    // Wait for modal to disappear
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));

    // Verify modal is closed
    const modalAfter = await page.$('[role="dialog"]');
    expect(modalAfter).toBeNull();
  }, 40000);

  it("should handle confirmation modal with callbacks", async () => {
    // Open confirmation modal
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find((el) =>
        el.textContent?.includes("Show Confirmation Modal")
      );
      button?.click();
    });

    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"]');

    // Verify modal content
    const titleText = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const h2 = modal?.querySelector("h2");
      return h2?.textContent;
    });
    expect(titleText).toBe("Delete Item");

    // Click Delete button and check alert
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe("Item deleted!");
      await dialog.accept();
    });

    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find((el) => el.textContent?.includes("Delete"));
      button?.click();
    });

    // Wait for modal to close
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
  }, 40000);

  it("should display info modal with custom content", async () => {
    // Open info modal
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find((el) =>
        el.textContent?.includes("Show Info Modal")
      );
      button?.click();
    });

    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"]');

    // Verify modal content
    const titleText = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const h2 = modal?.querySelector("h2");
      return h2?.textContent;
    });
    expect(titleText).toBe("System Information");

    const contentExists = await page.evaluate(() => {
      return !!Array.from(document.querySelectorAll("*")).find((el) =>
        el.textContent?.includes("The global modal system provides:")
      );
    });
    expect(contentExists).toBe(true);

    // Close modal
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find((el) => el.textContent?.includes("Awesome!"));
      button?.click();
    });

    // Wait for modal to disappear
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
  });

  it("should close modal with X button", async () => {
    // Open a modal
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find((el) =>
        el.textContent?.includes("Show Example Modal")
      );
      button?.click();
    });
    await page.waitForSelector('[role="dialog"]');

    // Close using X button (aria-label)
    await page.click('[aria-label="Close modal"]');

    // Wait for modal to disappear
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));

    // Verify modal is closed
    const modal = await page.$('[role="dialog"]');
    expect(modal).toBeNull();
  });

  it("should handle custom props in modals", async () => {
    // Open modal with custom props - check if button exists first
    const buttonExists = await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find((el) =>
        el.textContent?.includes("Show Modal with Custom Props")
      );
      return !!button;
    });

    if (!buttonExists) {
      throw new Error("Button 'Show Modal with Custom Props' not found on page");
    }

    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find((el) =>
        el.textContent?.includes("Show Modal with Custom Props")
      );
      button?.click();
    });

    // Wait for modal to appear with timeout
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Verify custom props are applied
    const titleText = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const h2 = modal?.querySelector("h2");
      return h2?.textContent;
    });
    expect(titleText).toBe("Custom Title");

    const messageText = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const p = modal?.querySelector("p");
      return p?.textContent;
    });
    expect(messageText).toBe("You can pass any props to your modals!");

    // Close modal - find button within the modal specifically
    await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const button = modal
        ? Array.from(modal.querySelectorAll("button")).find((el) => el.textContent?.includes("Confirm"))
        : null;
      button?.click();
    });

    // Wait for modal to disappear with timeout
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout: 5000 });
  }, 35000); // Increase test timeout
});
