const { chromium } = require('playwright');

async function takeScreenshot(url, outputPath) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2 // High DPI for better quality
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate with longer timeout
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait a bit more for any animations
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: outputPath,
      fullPage: false, // Just viewport for consistency
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
}

// Get command line arguments
const url = process.argv[2];
const outputPath = process.argv[3];

if (!url || !outputPath) {
  console.error('Usage: node playwright-screenshot.js <url> <output-path>');
  process.exit(1);
}

takeScreenshot(url, outputPath)
  .then(() => {
    console.log(`Screenshot saved: ${outputPath}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });