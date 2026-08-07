import { test, expect } from '@playwright/test';
import { loginNewUser } from './helpers';

test.describe('Mock Interview Flow', () => {
  test.setTimeout(300000); // 5 mins for full flow

  test('Complete full interview flow', async ({ page }) => {
    await loginNewUser(page);
    await page.goto('/mock-interview');
    
    // 1. Setup
    await page.click('button:has-text("Start New Interview"), button:has-text("Start First Interview")');
    await page.fill('input[placeholder="e.g. Frontend Engineer"]', 'Software Engineer');
    await page.click('button:has-text("Start Interview")');

    // 2. Wait for Session
    await page.waitForURL(/\/mock-interview\/[a-zA-Z0-9-]+/, { timeout: 120000 });
    
    // 3. Wait for AI first question
    const questionDiv = page.locator('.bg-secondary\\/50.rounded-2xl').first();
    await expect(questionDiv).toBeVisible({ timeout: 120000 });

    // 4. Answer question 1 (using text fallback)
    await page.fill('textarea', 'I would use a priority queue and a hash map to keep track of the most frequently accessed items.');
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    
    // 5. Wait for follow-up (Question 2)
    await expect(page.locator('.bg-secondary\\/50.rounded-2xl').nth(1)).toBeVisible({ timeout: 120000 });

    // 6. Answer question 2
    await page.fill('textarea', 'I would handle concurrency using read-write locks or a concurrent map to avoid bottlenecks.');
    await page.getByRole('button', { name: 'Submit Answer' }).click();

    // 7. Finish the interview
    await page.getByRole('button', { name: /Finish Interview/i }).click();

    // 8. Wait for completion and final evaluation
    await expect(page.locator('h1', { hasText: 'FAANG Evaluation Report' })).toBeVisible({ timeout: 120000 });
    await expect(page.locator('text=FAANG Rubric Breakdown')).toBeVisible();
    await expect(page.locator('text=Strong Signals')).toBeVisible();

    // 8. Verify dashboard has the result
    await page.goto('/mock-interview');
    await expect(page.locator('h3', { hasText: 'Software Engineer' })).toBeVisible();
  });
});
