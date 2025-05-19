const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Blue Mountain Wicks site
const site = { 
    name: 'blue-mountain-wicks', 
    url: 'https://blue-mountain-wicks.netlify.app' 
};

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}

// Function to capture screenshot using Playwright
async function captureScreenshotWithPlaywright(site) {
    try {
        const playwright = require('playwright');
        const browser = await playwright.chromium.launch();
        const page = await browser.newPage();
        
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto(site.url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000); // Wait for page to fully load
        
        const screenshotPath = path.join(screenshotsDir, `${site.name}.png`);
        await page.screenshot({ path: screenshotPath });
        
        await browser.close();
        console.log(`✓ ${site.name}: Screenshot captured successfully`);
        return true;
    } catch (error) {
        console.error(`✗ ${site.name}: Playwright error - ${error.message}`);
        return false;
    }
}

// Fallback: capture screenshot using Chrome in headless mode
function captureScreenshotWithChrome(site) {
    return new Promise((resolve) => {
        const screenshotPath = path.join(screenshotsDir, `${site.name}.png`);
        
        // Try different Chrome executables
        const chromeExecutables = [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            'google-chrome',
            'chromium'
        ];
        
        let chromeCommand = null;
        for (const exe of chromeExecutables) {
            try {
                require('child_process').execSync(`which ${exe} 2>/dev/null`);
                chromeCommand = exe;
                break;
            } catch (e) {
                // Continue to next
            }
        }
        
        if (!chromeCommand) {
            console.error(`✗ ${site.name}: No Chrome installation found`);
            resolve(false);
            return;
        }
        
        const args = [
            '--headless',
            '--screenshot=' + screenshotPath,
            '--window-size=1920,1080',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            site.url
        ];
        
        console.log(`Capturing screenshot for ${site.name}...`);
        const chrome = spawn(chromeCommand, args);
        
        chrome.on('close', (code) => {
            if (code === 0 && fs.existsSync(screenshotPath)) {
                console.log(`✓ ${site.name}: Screenshot captured successfully`);
                resolve(true);
            } else {
                console.error(`✗ ${site.name}: Failed to capture screenshot (code: ${code})`);
                resolve(false);
            }
        });
        
        chrome.on('error', (err) => {
            console.error(`✗ ${site.name}: Chrome error - ${err.message}`);
            resolve(false);
        });
    });
}

// Main function
async function main() {
    console.log('Capturing screenshot for Blue Mountain Wicks...');
    
    // Try Playwright first
    let success = false;
    try {
        require('playwright');
        success = await captureScreenshotWithPlaywright(site);
    } catch (error) {
        console.log('Playwright not available, trying Chrome directly...');
    }
    
    // If Playwright fails, try Chrome directly
    if (!success) {
        success = await captureScreenshotWithChrome(site);
    }
    
    if (success) {
        console.log('\nScreenshot captured successfully!');
        console.log('You can now see Blue Mountain Wicks in your project gallery');
    } else {
        console.log('\nFailed to capture screenshot');
        console.log('You may need to install Playwright or capture manually');
    }
}

// Run the script
main().catch(console.error);