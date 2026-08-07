import { test, expect } from '@playwright/test';
import { loginNewUser } from './helpers';

test.describe('Final Runtime Verification', () => {
  let consoleLogs: string[] = [];
  let networkErrors: string[] = [];

  test.beforeEach(({ page }) => {
    // Reset arrays
    consoleLogs = [];
    networkErrors = [];

    // Intercept console errors and warnings
    page.on('console', msg => {
      const type = msg.type();
      if (type === 'error' || type === 'warning') {
        const text = msg.text();
        // Ignore expected warnings (like Next.js HMR or 429 quota fallback if we want, but let's log everything)
        consoleLogs.push(`[${type}] ${text}`);
      }
    });

    // Intercept failed API requests (500, hydration, etc.)
    page.on('response', response => {
      if (response.status() >= 500) {
        networkErrors.push(`[${response.status()}] ${response.url()}`);
      }
    });
  });

  test('Full interview flow without errors', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes timeout for full flow

    console.log("Signing up/Logging in...");
    await loginNewUser(page);
    console.log("✓ Signup/Login complete");

    // 2. Create Interview
    console.log("Creating interview...");
    await page.goto('http://localhost:3001/mock-interview');
    await page.click('button:has-text("Start New Interview"), button:has-text("Start First Interview")');
    await page.fill('input[placeholder="e.g. Frontend Engineer"]', 'Software Engineer');
    await page.click('button:has-text("Start Interview")');
    await page.waitForURL('**/mock-interview/*', { timeout: 60000 });
    console.log("✓ Create Interview complete");

    // Wait for the UI to settle
    await page.waitForTimeout(2000);

    // 3. Toggles
    console.log("Toggling hardware...");
    // The camera toggle is the first button inside the absolute div
    await page.waitForSelector('.absolute.top-3.left-3 button');
    const toggles = await page.locator('.absolute.top-3.left-3 button').all();
    if (toggles.length >= 2) {
      await toggles[0].click(); // Camera
      await page.waitForTimeout(500);
      await toggles[1].click(); // Mic
      await page.waitForTimeout(500);
      console.log("✓ Camera and Microphone toggled");
    } else {
      throw new Error("Could not find hardware toggles");
    }

    // 4. First question
    console.log("Answering first question...");
    await page.fill('textarea', 'This is my answer to the first question.');
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    
    // Wait for AI response (the textarea will be disabled, then re-enabled)
    console.log("Waiting for AI to respond...");
    await page.waitForFunction(() => {
      const ta = document.querySelector('textarea');
      return ta && !ta.disabled && ta.value === '';
    }, { timeout: 30000 });
    console.log("✓ First question complete");

    // 5. Follow-up
    console.log("Answering follow-up...");
    await page.fill('textarea', 'This is my follow-up answer.');
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    
    console.log("Waiting for AI to respond again...");
    await page.waitForFunction(() => {
      const ta = document.querySelector('textarea');
      return ta && !ta.disabled && ta.value === '';
    }, { timeout: 30000 });
    console.log("✓ Follow-up question complete");

    // 6. Finish Interview
    console.log("Finishing interview...");
    // ensure finish button is enabled
    const finishBtn = page.locator('button:has-text("Finish Interview")');
    await expect(finishBtn).toBeEnabled();
    await finishBtn.click();

    // 7. FAANG Evaluation Report
    console.log("Waiting for Evaluation Report...");
    const reportHeader = page.locator('h1:has-text("FAANG Evaluation Report")');
    await expect(reportHeader).toBeVisible({ timeout: 15000 });
    console.log("✓ FAANG Evaluation Report visible!");

    // Final checks
    console.log("\n--- Verification Results ---");
    console.log("Console Errors/Warnings:", consoleLogs.length);
    if (consoleLogs.length > 0) {
      consoleLogs.forEach(l => console.log(l));
    }
    console.log("Network 500+ Errors:", networkErrors.length);
    if (networkErrors.length > 0) {
      networkErrors.forEach(l => console.log(l));
    }

    // Since we fallback to mock data on 429, we expect NO unhandled 500 errors!
    // And NO React hook errors (which show up as 'error' in consoleLogs)
    const reactHookErrors = consoleLogs.filter(msg => msg.includes('Rendered fewer hooks') || msg.includes('Minified React error'));
    expect(reactHookErrors.length).toBe(0);
    expect(networkErrors.length).toBe(0);
  });
});
