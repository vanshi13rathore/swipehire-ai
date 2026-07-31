/* eslint-disable */
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);
const outDir = '/Users/vanshikarathore/.gemini/antigravity/brain/d1f6a131-aeb0-4c58-a8aa-b77a4cbbdd38/';

async function testLandingPage() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    console.log("Navigating to http://localhost:3000...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Verify Hero Section
    console.log("Verifying Hero Section...");
    const heroContent = await page.evaluate(() => {
        const h1 = document.querySelector('h1')?.innerText;
        const watchDemoBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.includes('Watch Demo'));
        const mockDashboard = document.querySelector('.mock-dashboard, [data-testid="mock-dashboard"], canvas, svg, [class*="dashboard"]');
        const stats = document.querySelector('.stats, [class*="stats"], [class*="metric"]');
        const gradient = document.querySelector('[class*="gradient"]');
        return {
            h1,
            hasWatchDemoBtn: !!watchDemoBtn,
            hasMockDashboard: !!mockDashboard,
            hasStats: !!stats,
            hasGradient: !!gradient
        };
    });
    console.log("Hero Analysis:", heroContent);

    // Verify Social Proof logos
    console.log("Verifying Social Proof logos...");
    const socialProof = await page.evaluate(() => {
        const logos = document.querySelectorAll('img[alt*="logo"], svg[class*="logo"]');
        return logos.length;
    });
    console.log(`Found ${socialProof} potential social proof logos.`);

    // Verify Navbar
    console.log("Verifying Navbar...");
    const navbarContent = await page.evaluate(() => {
        const nav = document.querySelector('nav');
        if (!nav) return { hasNav: false };
        const links = Array.from(nav.querySelectorAll('a')).map(a => a.innerText).filter(t => t);
        const hasBlur = window.getComputedStyle(nav).backdropFilter.includes('blur');
        return {
            hasNav: true,
            links,
            hasBlur
        };
    });
    console.log("Navbar Analysis:", navbarContent);

    // Test Watch Demo Button
    console.log("Testing Watch Demo Button...");
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.includes('Watch Demo'));
        if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    const demoModal = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"], .modal, [class*="modal"], [class*="overlay"]');
        return modal ? modal.innerHTML.substring(0, 100) : null;
    });
    console.log("Demo Modal opened:", !!demoModal);
    if (!demoModal) {
        console.log("Current URL after clicking Watch Demo:", page.url());
    }

    // Take Screenshots
    const viewports = [
        { name: 'desktop', width: 1920, height: 1080 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'mobile', width: 375, height: 667 }
    ];

    for (const vp of viewports) {
        await page.setViewport({ width: vp.width, height: vp.height });
        await new Promise(r => setTimeout(r, 1000)); // wait for resize and layout changes
        const fp = path.join(outDir, `screenshot-${vp.name}.png`);
        await page.screenshot({ path: fp, fullPage: true });
        console.log(`Saved screenshot to ${fp}`);
    }

    await browser.close();
}

testLandingPage().catch(console.error);
