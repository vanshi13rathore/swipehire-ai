import { test, expect } from '@playwright/test';
import { loginNewUser } from './helpers';

test.describe('Mock Interview Authentication', () => {
  test('Logged-out user is redirected to login', async ({ page }) => {
    await page.goto('/mock-interview');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Logged-in user can access dashboard and open setup modal', async ({ page }) => {
    await loginNewUser(page);
    await page.goto('/mock-interview');
    
    // Verify dashboard renders
    await expect(page.locator('h1', { hasText: 'Mock Interviews' })).toBeVisible();
    
    // Open Setup Modal
    await page.click('button:has-text("Start New Interview"), button:has-text("Start First Interview")');
    await page.fill('input[placeholder="e.g. Frontend Engineer"]', 'Software Engineer');
    await expect(page.locator('h2', { hasText: 'New Mock Interview' })).toBeVisible();
  });
});
