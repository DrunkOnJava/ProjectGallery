/**
 * Data loader module for Project Gallery
 * Contains functions to load and process project data
 */

import { 
    featuredProjects,
    projects, 
    appIcons, 
    hiddenProjects, 
    projectStates
} from './config.js';

import {
    determineOptimalSize,
    renderGallery
} from './gallery.js';

// Global data for SITE_DATA and APP_ICONS
let SITE_DATA = [];
let APP_ICONS = [];

/**
 * Fetch configuration data
 */
async function fetchConfig() {
    try {
        // In a real app, this would fetch from an API endpoint
        // Here we're loading embedded data from the SITE_DATA variable
        
        // Process projects, filtering out hidden projects
        projects = SITE_DATA
            .filter(project => !hiddenProjects.includes(project.name))
            .map(project => {
                const savedState = projectStates[project.name] || {};
                const optimalSize = determineOptimalSize(project);
                
                return {
                    ...project,
                    // Importantly, we respect saved size configurations to ensure manual edits persist
                    size: savedState.size || optimalSize,
                    roundedCorners: savedState.roundedCorners || false,
                    featured: featuredProjects.includes(project.name),
                    useLivePreview: savedState.useLivePreview !== false // Default to true
                };
            });
        
        updateStats();
        renderGallery();
        // Load icons after projects
        loadAppIcons();
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('gallery').innerHTML = '<div class="loading">Error loading projects: ' + error.message + '</div>';
        document.getElementById('debugInfo').textContent = `Error loading projects: ${error.message}`;
        document.getElementById('debugInfo').classList.add('active');
    }
}

/**
 * Load app icons from config
 */
function loadAppIcons() {
    try {
        // Process icons
        appIcons = APP_ICONS.map(icon => {
            const savedState = projectStates[icon.name] || {};
            return {
                ...icon,
                type: 'icon',
                size: savedState.size || 'icon-square',
                roundedCorners: savedState.roundedCorners !== false, // Default to true for icons
                screenshot: `app-icons/${icon.name}.png`,
            };
        });
        updateStats();
        renderGallery();
    } catch (error) {
        console.error('Error loading app icons:', error);
        document.getElementById('debugInfo').textContent = `Error loading app icons: ${error.message}`;
        document.getElementById('debugInfo').classList.add('active');
        
        // Hide debug info after 5 seconds
        setTimeout(() => {
            document.getElementById('debugInfo').classList.remove('active');
        }, 5000);
    }
}

/**
 * Update statistics display
 */
function updateStats() {
    const totalProjects = projects.length;
    const totalIcons = appIcons.length;
    const successProjects = projects.filter(p => p.status === 'success').length;
    const failedProjects = projects.filter(p => p.status === 'failed').length;
    
    document.getElementById('totalCount').textContent = totalProjects + totalIcons;
    document.getElementById('projectCount').textContent = totalProjects;
    document.getElementById('iconCount').textContent = totalIcons;
    document.getElementById('successCount').textContent = successProjects;
    document.getElementById('failedCount').textContent = failedProjects;
}

// Set global variables for data
export function setEmbeddedData(siteData, appIconsData) {
    SITE_DATA = siteData;
    APP_ICONS = appIconsData;
}

// Export functions
export {
    fetchConfig,
    loadAppIcons,
    updateStats
};