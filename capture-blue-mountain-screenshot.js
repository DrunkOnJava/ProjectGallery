#!/usr/bin/env node

/**
 * Capture screenshot for Blue Mountain Wicks
 */

const playwright = require('playwright');
const path = require('path');

async function captureScreenshot() {
    const site = {
        name: 'blue-mountain-wicks',
        url: 'https://blue-mountain-wicks.netlify.app'
    };
    
    const screenshotPath = path.join(__dirname, 'screenshots', `${site.name}.png`);
    
    console.log(`Capturing screenshot for ${site.name}...`);
    
    try {
        const browser = await playwright.chromium.launch();
        const page = await browser.newPage();
        
        // Set viewport to standard desktop size
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        // Navigate to the site
        await page.goto(site.url, { waitUntil: 'networkidle' });
        
        // Wait a bit for any animations to complete
        await page.waitForTimeout(2000);
        
        // Capture screenshot
        await page.screenshot({ 
            path: screenshotPath, 
            fullPage: false,
            clip: { x: 0, y: 0, width: 1920, height: 1080 }
        });
        
        await browser.close();
        
        console.log(`Screenshot saved: ${screenshotPath}`);
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        console.log('Make sure you have playwright installed: npm install playwright');
    }
}

// Run the script
if (require.main === module) {
    captureScreenshot();
}