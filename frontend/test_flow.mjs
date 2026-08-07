import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = '/Users/vanshikarathore/.gemini/antigravity/brain/05b8f361-926e-41d7-8411-3e2fc28c1dfd';
const landingScreenshot = path.join(ARTIFACTS_DIR, 'landing_screenshot.png');
const dashboardScreenshot = path.join(ARTIFACTS_DIR, 'dashboard_screenshot.png');
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function run() {
  const logMessages = [];
  function log(msg) {
    console.log(msg);
    logMessages.push(msg);
  }

  log(`Starting end-to-end authentication and dashboard verification test against ${BASE_URL}...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => log(`[BROWSER ERROR] ${err.message}`));

  try {
    // Step 1: Landing Page
    log(`1. Navigating to ${BASE_URL} ...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    log(`Initial URL: ${page.url()}`);
    log(`Page Title: ${await page.title()}`);
    await page.screenshot({ path: landingScreenshot, fullPage: true });

    // Step 2: Click Get Started / Sign Up
    log('2. Clicking "Get Started"...');
    const getStartedBtn = page.locator('text=/Get Started/i').first();
    if (await getStartedBtn.isVisible().catch(() => false)) {
      await getStartedBtn.click();
      await page.waitForTimeout(2000);
    } else {
      log('Directly navigating to /signup');
      await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    }
    log(`Current URL after click: ${page.url()}`);

    // Step 3: Sign Up Form
    log('3. Filling Sign Up form...');
    const timestamp = Date.now();
    const testEmail = `testuser_${timestamp}@example.com`;
    const testPassword = `TestPass123!`;
    const testName = `Test User ${timestamp}`;

    const nameInput = page.locator('input[placeholder="John Doe"]').first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill(testName);
    }

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill(testEmail);
    }

    const passwordInput = page.locator('input[type="password"]').first();
    if (await passwordInput.isVisible().catch(() => false)) {
      await passwordInput.fill(testPassword);
    }

    log(`Attempting account creation for email: ${testEmail}`);
    const createAccountBtn = page.locator('button:has-text("Create Account")').first();
    await createAccountBtn.click();
    await page.waitForTimeout(4000);

    log(`URL after signup submit: ${page.url()}`);

    // If redirected to /login
    if (page.url().includes('/login') || (await page.locator('button:has-text("Login")').isVisible().catch(() => false))) {
      log('4. Performing login with created credentials...');
      const loginEmail = page.locator('input[type="email"]').first();
      const loginPassword = page.locator('input[type="password"]').first();
      
      if (await loginEmail.isVisible().catch(() => false)) {
        await loginEmail.fill(testEmail);
      }
      if (await loginPassword.isVisible().catch(() => false)) {
        await loginPassword.fill(testPassword);
      }

      const loginBtn = page.locator('button:has-text("Login")').first();
      await loginBtn.click();
      await page.waitForTimeout(5000);
      log(`URL after login: ${page.url()}`);
    }

    // Step 4: Navigate to /dashboard
    log(`5. Navigating to ${BASE_URL}/dashboard ...`);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(4000);

    const finalUrl = page.url();
    log(`Final URL: ${finalUrl}`);
    log(`Final Page Title: ${await page.title()}`);

    await page.screenshot({ path: dashboardScreenshot, fullPage: true });
    log(`Saved final screenshot to ${dashboardScreenshot}`);

    const isDashboard = finalUrl.includes('/dashboard');
    const isNotRedirectedToLogin = !finalUrl.includes('/login');

    const result = {
      success: isDashboard && isNotRedirectedToLogin,
      testEmail,
      finalUrl,
      landingScreenshot,
      dashboardScreenshot,
      logMessages
    };

    console.log('=== TEST RESULT ===');
    console.log(JSON.stringify(result, null, 2));

  } catch (err) {
    log(`[ERROR] Test failed with exception: ${err.stack || err.message}`);
    await page.screenshot({ path: dashboardScreenshot, fullPage: true }).catch(() => {});
  } finally {
    await browser.close();
  }
}

run();
