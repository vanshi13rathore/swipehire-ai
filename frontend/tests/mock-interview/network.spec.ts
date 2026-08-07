import { test, expect } from '@playwright/test';
import { loginNewUser, simulateServerError } from './helpers';

test.describe('Mock Interview Network Handling', () => {
  test.setTimeout(300000); // 3 mins

  test.beforeEach(async ({ page }) => {
    await loginNewUser(page);
    await page.goto('/mock-interview');
  });

  test('Gracefully handles Gemini timeout or API error', async ({ page }) => {
    // We mock the API to return a 500 error when simulating a Gemini failure
    await simulateServerError(page, 'AI Quota Exceeded: Please try again in a minute.');
    
    // Attempt to start interview
    await page.click('button:has-text("Start New Interview"), button:has-text("Start First Interview")');
    await page.fill('input[placeholder="e.g. Frontend Engineer"]', 'Software Engineer');
    // Set a header to trigger the mock
    await page.setExtraHTTPHeaders({ 'x-test-simulate-error': 'true' });
    await page.click('button:has-text("Start Interview")');
    
    // UI should display error rather than crashing
    await expect(page.locator('text=AI Quota Exceeded').or(page.locator('.text-destructive'))).toBeVisible({ timeout: 15000 });
  });

  test('Supabase insert failure handling', async ({ page }) => {
    await simulateServerError(page, 'Failed to create session in Supabase');
    await page.click('button:has-text("Start New Interview"), button:has-text("Start First Interview")');
    await page.fill('input[placeholder="e.g. Frontend Engineer"]', 'Software Engineer');
    
    await page.setExtraHTTPHeaders({ 'x-test-simulate-error': 'true' });
    await page.click('button:has-text("Start Interview")');
    
    await expect(page.locator('text=Failed to create session').or(page.locator('.text-destructive'))).toBeVisible({ timeout: 15000 });
  });
});
