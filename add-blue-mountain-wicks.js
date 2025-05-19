#!/usr/bin/env node

/**
 * Add Blue Mountain Wicks to the project gallery
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    sitesDataPath: path.join(__dirname, 'site-data.json'),
    indexPath: path.join(__dirname, 'index.html')
};

// New site to add
const blueMountainWicks = {
    name: "blue-mountain-wicks",
    url: "https://blue-mountain-wicks.netlify.app",
    screenshot: "screenshots/blue-mountain-wicks.png",
    status: "success",
    useLivePreview: true,
    featured: true
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

// Check if site already exists
function siteExists(sites, newSite) {
    return sites.some(site => 
        site.name === newSite.name || 
        site.url === newSite.url
    );
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
function main() {
    console.log('Adding Blue Mountain Wicks to the gallery...');
    
    // Load existing data
    const existingSites = loadExistingData();
    
    // Check if already exists
    if (siteExists(existingSites, blueMountainWicks)) {
        console.log('Blue Mountain Wicks already exists in the gallery');
        return;
    }
    
    // Add to the beginning of the array (so it shows first)
    existingSites.unshift(blueMountainWicks);
    
    // Update files
    updateSiteData(existingSites);
    updateIndexHTML(existingSites);
    
    console.log('Blue Mountain Wicks added successfully!');
    console.log('Note: You may need to capture a screenshot manually or wait for auto-capture');
}

// Run the script
if (require.main === module) {
    main();
}