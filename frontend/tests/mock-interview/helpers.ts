import { Page, expect } from '@playwright/test';

export async function loginNewUser(page: Page) {
  const randomStr = Math.random().toString(36).substring(7);
  const testEmail = `tester_${randomStr}@example.com`;
  const testPassword = 'Password123!';
  
  await page.goto('/signup');
  await page.fill('input[type="text"]', "Test User");
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button:has-text("Create Account")');
  
  await page.waitForURL('**/login', { timeout: 15000 });
  
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button:has-text("Login")');
  
  await page.waitForURL('**/profile', { timeout: 15000 });
}

export async function simulateServerError(page: Page, errorMessage: string = 'Simulated Server Error') {
  await page.route('**/*', async (route) => {
    const request = route.request();
    if (request.method() === 'POST' && (await request.headerValue('next-action'))) {
      // For network errors we can abort or fulfill with 500
      if (request.headers()['x-test-simulate-error']) {
         await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: errorMessage }) });
         return;
      }
    }
    await route.continue();
  });
}
