const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));
  page.on('response', async res => {
    if (res.url().includes('/mock-interview')) {
      console.log('RESPONSE:', res.status(), res.url());
      if (res.url() === 'http://localhost:3001/mock-interview' && res.request().method() === 'POST') {
        try {
          const body = await res.text();
          console.log('POST RESPONSE BODY:', body.substring(0, 500));
        } catch (e) {}
      }
    }
  });

  console.log('Navigating to /signup...');
  await page.goto('http://localhost:3001/signup');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("Sign Up"), button:has-text("Create Account")');
  
  await page.waitForTimeout(2000); // wait for redirect
  
  console.log('Navigating to /mock-interview...');
  await page.goto('http://localhost:3001/mock-interview');
  
  console.log('Clicking Start New Interview...');
  await page.click('button:has-text("Start New Interview"), button:has-text("Start First Interview")');
  
  console.log('Filling role...');
  await page.fill('input[placeholder="e.g. Frontend Engineer"]', 'Software Engineer');
  
  console.log('Clicking Start Interview...');
  await page.click('button:has-text("Start Interview")');
  
  console.log('Waiting 10 seconds...');
  await page.waitForTimeout(10000);
  
  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);
  
  await browser.close();
})();
