#!/usr/bin/env node

/**
 * Auto-detect new Netlify deployments and add them to the project gallery
 * This script can be run manually or via a GitHub Action/cron job
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Configuration
const CONFIG = {
    sitesDataPath: path.join(__dirname, 'site-data.json'),
    lockedConfigPath: path.join(__dirname, 'locked-config.json'),
    screenshotsDir: path.join(__dirname, 'screenshots'),
    indexPath: path.join(__dirname, 'index.html')
};

// Load existing data
function loadExistingData() {
    try {
        const siteData = JSON.parse(fs.readFileSync(CONFIG.sitesDataPath, 'utf8'));
        return siteData;
    } catch (error) {
        console.error('Error loading site data:', error);
        return [];
    }
}

// Load locked config (hidden projects)
function loadLockedConfig() {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG.lockedConfigPath, 'utf8'));
        return config;
    } catch (error) {
        return { hiddenProjects: [] };
    }
}

// Get all Netlify sites for the user
async function getNetlifySites() {
    try {
        // This requires netlify CLI to be installed and authenticated
        const output = execSync('netlify sites:list --json', { encoding: 'utf8' });
        const sites = JSON.parse(output);
        
        return sites.map(site => ({
            name: site.name,
            url: site.ssl_url || site.url,
            id: site.id,
            updated_at: site.updated_at
        }));
    } catch (error) {
        console.error('Error fetching Netlify sites:', error);
        console.log('Make sure you have Netlify CLI installed and are logged in');
        return [];
    }
}

// Check if a site already exists in the gallery
function siteExists(sites, newSite) {
    return sites.some(site => 
        site.name === newSite.name || 
        site.url === newSite.url
    );
}

// Capture screenshot of a site
async function captureScreenshot(site) {
    const screenshotPath = path.join(CONFIG.screenshotsDir, `${site.name}.png`);
    
    // Check if screenshot already exists
    if (fs.existsSync(screenshotPath)) {
        console.log(`Screenshot already exists for ${site.name}`);
        return screenshotPath;
    }
    
    console.log(`Capturing screenshot for ${site.name}...`);
    
    try {
        // Using Playwright to capture screenshot
        const playwright = require('playwright');
        const browser = await playwright.chromium.launch();
        const page = await browser.newPage();
        
        await page.goto(site.url, { waitUntil: 'networkidle' });
        await page.screenshot({ path: screenshotPath, fullPage: false });
        
        await browser.close();
        
        console.log(`Screenshot saved: ${screenshotPath}`);
        return screenshotPath;
    } catch (error) {
        console.error(`Error capturing screenshot for ${site.name}:`, error);
        return null;
    }
}

// Add new site to the data
function addNewSite(sites, newSite, screenshotPath) {
    const siteData = {
        name: newSite.name,
        url: newSite.url,
        screenshot: screenshotPath ? `screenshots/${newSite.name}.png` : null,
        status: "success",
        added: new Date().toISOString()
    };
    
    sites.push(siteData);
    return sites;
}

// Update the site-data.json file
function updateSiteData(sites) {
    fs.writeFileSync(CONFIG.sitesDataPath, JSON.stringify(sites, null, 2));
    console.log('Updated site-data.json');
}

// Update the index.html file with new data
function updateIndexHTML(sites) {
    try {
        let htmlContent = fs.readFileSync(CONFIG.indexPath, 'utf8');
        
        // Find the SITE_DATA constant
        const siteDataRegex = /const SITE_DATA = \[[\s\S]*?\];/;
        const newSiteData = `const SITE_DATA = ${JSON.stringify(sites, null, 2)};`;
        
        htmlContent = htmlContent.replace(siteDataRegex, newSiteData);
        
        fs.writeFileSync(CONFIG.indexPath, htmlContent);
        console.log('Updated index.html');
    } catch (error) {
        console.error('Error updating index.html:', error);
    }
}

// Main function
async function main() {
    console.log('Auto-detecting new Netlify deployments...');
    
    // Load existing data
    const existingSites = loadExistingData();
    const lockedConfig = loadLockedConfig();
    
    // Get all Netlify sites
    const netlifySites = await getNetlifySites();
    
    if (netlifySites.length === 0) {
        console.log('No Netlify sites found or error fetching sites');
        return;
    }
    
    console.log(`Found ${netlifySites.length} Netlify sites`);
    
    // Check for new sites
    let newSitesAdded = 0;
    
    for (const netlifySite of netlifySites) {
        // Skip hidden projects
        if (lockedConfig.hiddenProjects.includes(netlifySite.name)) {
            continue;
        }
        
        // Check if site already exists
        if (!siteExists(existingSites, netlifySite)) {
            console.log(`New site detected: ${netlifySite.name}`);
            
            // Capture screenshot
            const screenshotPath = await captureScreenshot(netlifySite);
            
            // Add to existing sites
            addNewSite(existingSites, netlifySite, screenshotPath);
            newSitesAdded++;
        }
    }
    
    if (newSitesAdded > 0) {
        console.log(`Added ${newSitesAdded} new sites`);
        
        // Update files
        updateSiteData(existingSites);
        updateIndexHTML(existingSites);
        
        console.log('Gallery updated successfully!');
    } else {
        console.log('No new sites to add');
    }
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main, getNetlifySites };