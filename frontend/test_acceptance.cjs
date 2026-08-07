/* eslint-disable */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = process.argv[2] || "http://localhost:3000";

async function runAudit() {
  console.log(`Starting Comprehensive Acceptance Audit on ${TARGET_URL}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const screenshotsDir = path.join(__dirname, 'audit_screenshots');
  if (!fs.existsSync(screenshotsDir)){
    fs.mkdirSync(screenshotsDir);
  }

  let consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  let networkErrors = [];
  page.on('response', response => {
    // ignore 400s if it's just a missing image or something minor, but log them
    if (response.status() >= 400 && response.status() < 600) {
      networkErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  try {
    // 1. Landing Page
    console.log("Testing Landing Page...");
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    await page.screenshot({ path: path.join(screenshotsDir, '01_home.png'), fullPage: true });
    
    // 2. Auth Flow (Sign Up / Login)
    console.log("Testing Signup / Login...");
    // Just capture the login page
    await page.goto(`${TARGET_URL}/login`, { waitUntil: 'load' });
    await page.screenshot({ path: path.join(screenshotsDir, '02_login.png'), fullPage: true });

    // Since we don't have interactive auth tokens working via playwright easily without mocking,
    // we'll visit public or protected routes and capture how they handle auth (e.g. redirect to login).
    console.log("Testing Protected Route Redirect...");
    await page.goto(`${TARGET_URL}/dashboard`, { waitUntil: 'load' });
    await page.waitForTimeout(2000); // Give it time to redirect
    await page.screenshot({ path: path.join(screenshotsDir, '03_dashboard_unauth.png'), fullPage: true });

    // Assuming Jobs might be visible or redirect
    console.log("Testing Jobs Feed...");
    await page.goto(`${TARGET_URL}/jobs`, { waitUntil: 'load' });
    await page.waitForTimeout(2000); // Give it time to load data
    await page.screenshot({ path: path.join(screenshotsDir, '04_jobs.png'), fullPage: true });
    
    console.log("Audit complete (script logic bound).");
  } catch (error) {
    console.error("Audit failed during execution:", error.message);
  } finally {
    console.log("--- Audit Results ---");
    console.log("Console Errors found:", consoleErrors.length);
    consoleErrors.forEach(e => console.log(" -", e));
    console.log("Network Errors found:", networkErrors.length);
    networkErrors.forEach(e => console.log(" -", e));
    await browser.close();
  }
}

runAudit();
