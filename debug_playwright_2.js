const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));
  page.on('response', async res => {
    if (res.url().includes('mock-interview')) {
      console.log('RESPONSE:', res.status(), res.url());
      if (res.request().method() === 'POST' && res.status() === 500) {
        try {
          const body = await res.text();
          console.log('POST 500 BODY:', body);
        } catch(e) {}
      }
    }
  });

  const randomStr = Math.random().toString(36).substring(7);
  const testEmail = `tester_${randomStr}@example.com`;
  const testPassword = 'Password123!';

  console.log('Navigating to /signup...');
  await page.goto('http://localhost:3001/signup');
  await page.fill('input[type="text"]', 'Test User');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button:has-text("Create Account")');
  
  await page.waitForURL('**/login', { timeout: 15000 });
  console.log('Navigated to /login');
  
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button:has-text("Login")');
  
  await page.waitForURL('**/profile', { timeout: 15000 });
  console.log('Navigated to /profile');
  
  console.log('Navigating to /mock-interview...');
  await page.goto('http://localhost:3001/mock-interview');
  
  console.log('Clicking Start New Interview...');
  await page.click('button:has-text("Start New Interview"), button:has-text("Start First Interview")');
  
  console.log('Filling role...');
  await page.fill('input[placeholder="e.g. Frontend Engineer"]', 'Software Engineer');
  
  console.log('Clicking Start Interview...');
  await page.click('button:has-text("Start Interview")');
  
  console.log('Waiting 30 seconds for navigation...');
  try {
    await page.waitForURL(/\/mock-interview\/[a-zA-Z0-9-]+/, { timeout: 30000 });
    console.log('SUCCESS! Navigated to:', page.url());
  } catch (e) {
    console.log('FAILED TO NAVIGATE:', e);
    // get text content of the modal to see if there's an error message
    const text = await page.locator('.bg-card').textContent();
    console.log('MODAL TEXT:', text);
  }
  
  await browser.close();
})();
