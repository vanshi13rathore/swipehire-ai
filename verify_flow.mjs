import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = '/Users/vanshikarathore/.gemini/antigravity/brain/cb552248-b789-4440-a61d-5637c78c0efa';
const BASE_URL = 'https://swipehire-nu.vercel.app';

async function run() {
  const logs = [];
  const networkEvents = [];
  
  function log(msg) {
    console.log(msg);
    logs.push(msg);
  }

  log(`--- Starting E2E Profile flow test on ${BASE_URL} ---`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to console logs
  page.on('console', msg => {
    log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });

  // Listen to uncaught page errors
  page.on('pageerror', err => {
    log(`[BROWSER UNCAUGHT ERROR] ${err.message}\nStack: ${err.stack}`);
  });

  // Listen to network failures and responses
  page.on('response', async resp => {
    const url = resp.url();
    const status = resp.status();
    if (status >= 400) {
      let body = '';
      try { body = await resp.text(); } catch(e) {}
      log(`[NETWORK ERROR] ${status} ${resp.statusText()} for ${url} - Body: ${body.substring(0, 300)}`);
    } else {
      networkEvents.push(`${status} ${url}`);
    }
  });

  page.on('requestfailed', req => {
    log(`[NETWORK FAILED] ${req.url()} - ${req.failure()?.errorText}`);
  });

  try {
    // Step 1: Navigate to landing page
    log('Step 1: Navigating to landing page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '01_landing.png'), fullPage: true });
    log(`Initial URL: ${page.url()}`);

    // Step 2: Go to Signup / Auth
    log('Step 2: Navigating to /signup ...');
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '02_signup.png'), fullPage: true });
    log(`Signup page URL: ${page.url()}`);

    const timestamp = Date.now();
    const testEmail = `test_qa_${timestamp}@example.com`;
    const testPassword = `TestPass123!`;
    const testName = `QA Test User ${timestamp}`;

    log(`Attempting signup with Email: ${testEmail}`);

    // Look for inputs
    const nameInput = page.locator('input[placeholder*="Doe"], input[placeholder*="Name"], input[name="name"], input[name="full_name"]').first();
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

    // Click Sign Up / Create Account
    const submitBtn = page.locator('button[type="submit"], button:has-text("Create Account"), button:has-text("Sign Up")').first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      log('Clicked Create Account / Sign Up button.');
    } else {
      log('Could not find explicit submit button, pressing Enter on password field...');
      await passwordInput.press('Enter');
    }

    await page.waitForTimeout(4000);
    log(`URL after signup submit: ${page.url()}`);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '03_after_signup.png'), fullPage: true });

    // Check if we need to login or if we are redirected to /login
    if (page.url().includes('/login') || await page.locator('button:has-text("Login"), button:has-text("Sign In")').first().isVisible().catch(() => false)) {
      log('Page is on /login or login form. Submitting login credentials...');
      const loginEmail = page.locator('input[type="email"]').first();
      const loginPassword = page.locator('input[type="password"]').first();
      if (await loginEmail.isVisible().catch(() => false)) await loginEmail.fill(testEmail);
      if (await loginPassword.isVisible().catch(() => false)) await loginPassword.fill(testPassword);

      const loginBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
      if (await loginBtn.isVisible().catch(() => false)) await loginBtn.click();
      await page.waitForTimeout(4000);
      log(`URL after login submit: ${page.url()}`);
    }

    // Step 3: Navigate to Profile page
    log('Step 3: Navigating to /profile page...');
    await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    log(`Profile Page URL: ${page.url()}`);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '04_profile_page.png'), fullPage: true });

    // Step 4: Fill out required profile fields
    log('Step 4: Filling out profile fields...');
    
    // 1. Full Name
    const profName = page.locator('input[placeholder="John Doe"]').first();
    if (await profName.isVisible().catch(() => false)) {
      await profName.fill(testName);
    }

    // 2. Email
    const profEmail = page.locator('input[placeholder="john@example.com"]').first();
    if (await profEmail.isVisible().catch(() => false)) {
      await profEmail.fill(testEmail);
    }

    // 3. Location
    const profLocation = page.locator('input[placeholder="San Francisco, CA"]').first();
    if (await profLocation.isVisible().catch(() => false)) {
      await profLocation.fill("San Francisco, CA");
    }

    // 4. Current Role
    const profRole = page.locator('input[placeholder="Frontend Engineer"]').first();
    if (await profRole.isVisible().catch(() => false)) {
      await profRole.fill("Senior Software Engineer");
    }

    // 5. Years of Experience
    const profYoe = page.locator('input[placeholder="5"]').first();
    if (await profYoe.isVisible().catch(() => false)) {
      await profYoe.fill("6");
    }

    // 6. Preferred Job Title
    const profTitle = page.locator('input[placeholder="Senior Frontend Engineer"]').first();
    if (await profTitle.isVisible().catch(() => false)) {
      await profTitle.fill("Full Stack Engineer");
    }

    // 7. Skills
    const profSkills = page.locator('input[placeholder*="React"]').first();
    if (await profSkills.isVisible().catch(() => false)) {
      await profSkills.fill("React, TypeScript, Next.js, Node.js");
    }

    // 8. Preferred Salary
    const profSalary = page.locator('input[placeholder="$120,000"]').first();
    if (await profSalary.isVisible().catch(() => false)) {
      await profSalary.fill("$150,000");
    }

    // 9. Preferred Location
    const profPrefLocation = page.locator('input[placeholder="New York, NY"]').first();
    if (await profPrefLocation.isVisible().catch(() => false)) {
      await profPrefLocation.fill("Remote");
    }

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '05_profile_filled.png'), fullPage: true });

    // Step 5: Click "Continue" or "Save Profile"
    log('Step 5: Clicking "Continue"...');
    const continueBtn = page.locator('button:has-text("Continue")').first();
    
    if (await continueBtn.isVisible().catch(() => false)) {
      await continueBtn.click();
      log('Clicked "Continue" button.');
    } else {
      const saveBtn = page.locator('button:has-text("Save Profile")').first();
      await saveBtn.click();
      log('Clicked "Save Profile" button.');
    }

    // Wait for navigation / response
    log('Waiting up to 10 seconds for redirection or response...');
    await page.waitForTimeout(10000);

    const postSubmitUrl = page.url();
    log(`URL after clicking Continue/Save Profile: ${postSubmitUrl}`);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '06_after_profile_submit.png'), fullPage: true });

    // Check if page redirected to /resume
    const redirectedToResume = postSubmitUrl.includes('/resume');
    
    // Check if error box appeared on page
    const errorBoxText = await page.locator('.bg-destructive\\/10, [class*="destructive"]').textContent().catch(() => null);

    const summary = {
      testEmail,
      initialUrl: `${BASE_URL}`,
      postSubmitUrl,
      redirectedToResume,
      hasErrorBox: !!errorBoxText,
      errorBoxText: errorBoxText?.trim() || null,
      passed: redirectedToResume && !errorBoxText
    };

    log('=== SUMMARY RESULT ===');
    log(JSON.stringify(summary, null, 2));

    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'test_output.json'), JSON.stringify({ summary, logs }, null, 2));

  } catch (err) {
    log(`[TEST ERROR] ${err.stack || err.message}`);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '07_error_state.png'), fullPage: true }).catch(() => {});
  } finally {
    await browser.close();
  }
}

run();
