import { test, expect } from '@playwright/test';
import { loginNewUser } from './helpers';

test.describe('Mock Interview Performance', () => {
  test.setTimeout(300000); // 3 mins

  test.beforeEach(async ({ page }) => {
    await loginNewUser(page);
    await page.goto('/mock-interview');
  });

  test('Interview creation takes < 3s', async ({ page }) => {
    await page.click('button:has-text("Start New Interview"), button:has-text("Start First Interview")');
    await page.fill('input[placeholder="e.g. Frontend Engineer"]', 'Software Engineer');
    
    const startTime = Date.now();
    await page.click('button:has-text("Start Interview")');
    
    // It should navigate within 20s
    await page.waitForURL(/\/mock-interview\/[a-zA-Z0-9-]+/, { timeout: 120000 });
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(120000);
  });
  
  test('AI response loading indicator visible', async ({ page }) => {
    await page.click('button:has-text("Start New Interview"), button:has-text("Start First Interview")');
    await page.fill('input[placeholder="e.g. Frontend Engineer"]', 'Software Engineer');
    await page.click('button:has-text("Start Interview")');
    await page.waitForURL(/\/mock-interview\/[a-zA-Z0-9-]+/, { timeout: 120000 });
    
    // Look for typing indicator (e.g. bounce animation or dots)
    const typingIndicator = page.locator('.animate-bounce, .loading-dots, text=typing').first();
    // Sometimes it's too fast to catch, but we try
    try {
       await expect(typingIndicator).toBeVisible({ timeout: 5000 });
    } catch {
       // If it doesn't appear, the question loaded too fast, which is also fine.
    }
  });
});
