/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Navigate to jobs page
  console.log("Navigating to http://localhost:3000/jobs...");
  await page.goto('http://localhost:3000/jobs', { waitUntil: 'networkidle2' });
  
  // Wait for loading to finish. Assuming there's a loading spinner or wait for a job card.
  console.log("Waiting for jobs to load...");
  try {
    // Wait for the first job card to appear. Modify selector if needed.
    await page.waitForSelector('.group.relative.rounded-2xl', { timeout: 10000 });
  } catch (e) {
    console.log("Could not find job card quickly, continuing anyway.");
  }

  // Take initial screenshot
  await page.screenshot({ path: 'screenshot-1-initial.png' });
  console.log("Initial state screenshot taken: screenshot-1-initial.png");

  // Helper to wait and capture
  const interactAndCapture = async (actionDesc, filename) => {
    // wait a moment for UI to settle/update
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: filename });
    console.log(`Action: ${actionDesc} -> Screenshot: ${filename}`);
  };

  // Note: We need to figure out selectors based on the components.
  // Instead of complex selectors, we can just dump the HTML or find placeholder text.
  // Let's use evaluate to find elements by their placeholder or text content.
  
  // 1. Test Search
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="title, keyword, or company"]');
    if (input) {
      input.value = 'Engineer';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await interactAndCapture('Search "Engineer"', 'screenshot-2-search.png');

  // 2. Test Location
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Location"]');
    if (input) {
      input.value = 'Remote';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await interactAndCapture('Location "Remote"', 'screenshot-3-location.png');

  // 3. Test Reset
  // We can look for a "Reset Filters" button or text
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const reset = btns.find(b => b.textContent.includes('Reset'));
    if (reset) reset.click();
  });
  await interactAndCapture('Reset Filters', 'screenshot-4-reset.png');

  // 4. Test Sorting
  // We can look for a select or trigger for sort.
  // Without exact selectors, we will just click the first select-like element
  await page.evaluate(() => {
    const triggers = Array.from(document.querySelectorAll('[role="combobox"]'));
    if (triggers.length > 0) {
      triggers[0].click();
    }
  });
  await interactAndCapture('Open Sort Dropdown', 'screenshot-5-sort-open.png');
  
  // 5. Test Infinite scrolling
  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await interactAndCapture('Scroll to Bottom (Infinite Scroll)', 'screenshot-6-scroll.png');

  await browser.close();
  console.log("Done testing.");
})();
