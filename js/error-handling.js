/**
 * Error handling module for Project Gallery
 * Contains functions to handle various error scenarios
 */

import { 
    projects, 
    saveProjectState 
} from './config.js';

import { renderGallery } from './gallery.js';

/**
 * Initialize error collection system
 */
function initializeErrorCollection() {
    // Create error collection object if it doesn't exist
    if (!window.errorCollection) {
        window.errorCollection = {
            errors: [],
            sources: {},
            errorTypes: {},
            ignoredErrors: []
        };
        
        window.loadedIframeSources = {};
        
        // Handle errors from iframes
        window.addEventListener('error', function(e) {
            // Collect the error
            if (e.target && (e.target.tagName === 'IFRAME' || e.target.nodeName === 'IFRAME')) {
                const source = e.target.src || 'unknown-iframe';
                const error = {
                    message: 'Error loading iframe content',
                    source: source,
                    timestamp: new Date().toISOString(),
                    type: 'iframe-load-error'
                };
                
                addErrorToCollection(error);
            }
        }, true); // Capture phase
        
        // Track iframe loads for better source attribution
        document.addEventListener('DOMContentLoaded', function() {
            setInterval(() => {
                const iframes = document.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    if (iframe.src && !window.loadedIframeSources[iframe.src]) {
                        window.loadedIframeSources[iframe.src] = true;
                    }
                });
            }, 2000);
        });
        
        // Suppress unhandled promise rejections from iframes
        window.addEventListener('unhandledrejection', function(e) {
            // Check if the rejection is from an iframe resource
            if (e.reason) {
                let source = 'unhandled-promise';
                let isFromIframe = false;
                
                // Try to determine if from iframe
                for (const iframeSrc in window.loadedIframeSources) {
                    if (e.reason.toString().includes(iframeSrc)) {
                        source = iframeSrc;
                        isFromIframe = true;
                        break;
                    }
                }
                
                // Only prevent default for iframe errors to avoid suppressing important errors
                if (isFromIframe) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Add to error collection
                    const error = {
                        message: e.reason.toString(),
                        source: source,
                        timestamp: new Date().toISOString(),
                        type: 'unhandled-promise',
                        stack: e.reason.stack
                    };
                    
                    addErrorToCollection(error);
                }
            }
        });
    }
}

/**
 * Add error to collection
 */
function addErrorToCollection(error) {
    if (!window.errorCollection) return;
    
    // Check if this is an ignored error
    if (window.errorCollection.ignoredErrors && 
        window.errorCollection.ignoredErrors.some(e => 
            e.source === error.source && e.message === error.message)) {
        return;
    }
    
    window.errorCollection.errors.push(error);
    
    // Update source and type stats
    window.errorCollection.sources[error.source] = 
        (window.errorCollection.sources[error.source] || 0) + 1;
    
    window.errorCollection.errorTypes[error.type || 'general'] = 
        (window.errorCollection.errorTypes[error.type || 'general'] || 0) + 1;
    
    // Update UI if dashboard is open
    updateErrorDashboard();
}

/**
 * Update error dashboard display
 */
function updateErrorDashboard() {
    const dashboard = document.getElementById('errorDashboard');
    if (!dashboard || !dashboard.classList.contains('active')) return;
    
    const currentTab = document.querySelector('.error-tab.active');
    const tabId = currentTab ? currentTab.getAttribute('data-tab') : 'all';
    renderErrorList(tabId);
    
    // Update stats
    updateErrorStats();
}

/**
 * Update error statistics
 */
function updateErrorStats() {
    const totalErrors = window.errorCollection.errors.length;
    const totalSources = Object.keys(window.errorCollection.sources).length;
    const errorTypes = Object.keys(window.errorCollection.errorTypes).length;
    
    const statsContainer = document.getElementById('errorStats');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = `
        <div class="error-stat">Total Errors: ${totalErrors}</div>
        <div class="error-stat">Error Sources: ${totalSources}</div>
        <div class="error-stat">Error Types: ${errorTypes}</div>
    `;
}

/**
 * Handle iframe loading error
 */
function handleIframeError(iframe, projectName) {
    const container = iframe.parentElement;
    
    // Create fallback content
    const fallback = document.createElement('div');
    fallback.className = 'project-placeholder';
    fallback.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📱</div>
            <div style="font-size: 0.8rem; color: #888;">Preview unavailable</div>
            <div style="font-size: 0.75rem; margin-top: 0.5rem;">
                <a href="${iframe.src}" target="_blank" style="color: #06b6d4; text-decoration: underline;">Visit site</a>
            </div>
        </div>
    `;
    
    // Replace iframe with fallback
    iframe.style.display = 'none';
    container.appendChild(fallback);
    
    // Update project state to not use live preview in the future
    const project = projects.find(p => p.name === projectName);
    if (project) {
        project.useLivePreview = false;
        saveProjectState(projectName, {
            size: project.size,
            roundedCorners: project.roundedCorners,
            useLivePreview: false
        });
    }
    
    // Log the error in debug
    showDebugInfo(`Disabled live preview for ${projectName} due to loading errors.`);
}

/**
 * Handle image loading error
 */
function handleImageError(img, projectName, projectUrl) {
    const container = img.parentElement;
    
    // Create fallback content
    const fallback = document.createElement('div');
    fallback.className = 'project-placeholder';
    fallback.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🖼️</div>
            <div style="font-size: 0.8rem; color: #888;">Image unavailable</div>
            <div style="font-size: 0.75rem; margin-top: 0.5rem;">
                <a href="${projectUrl}" target="_blank" style="color: #06b6d4; text-decoration: underline;">Visit site</a>
            </div>
        </div>
    `;
    
    // Replace image with fallback
    img.style.display = 'none';
    container.appendChild(fallback);
    
    // Log the error
    showDebugInfo(`Could not load screenshot for ${projectName}.`);
    
    // Try enabling live preview for next time if not already enabled
    const project = projects.find(p => p.name === projectName);
    if (project && !project.useLivePreview) {
        project.useLivePreview = true;
        saveProjectState(projectName, {
            size: project.size,
            roundedCorners: project.roundedCorners,
            useLivePreview: true
        });
        showDebugInfo(`Enabling live preview for ${projectName} for next visit.`);
    }
}

/**
 * Handle icon loading error
 */
function handleIconError(img, iconName) {
    const container = img.parentElement;
    
    // Create fallback content
    const fallback = document.createElement('div');
    fallback.className = 'project-placeholder';
    fallback.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎨</div>
            <div style="font-size: 0.8rem; color: #888;">${iconName}</div>
        </div>
    `;
    
    // Replace image with fallback
    img.style.display = 'none';
    container.appendChild(fallback);
}

/**
 * Show debug information
 */
function showDebugInfo(message) {
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
        debugInfo.textContent = `${new Date().toLocaleTimeString()}: ${message}\n` + debugInfo.textContent;
        debugInfo.classList.add('active');
        
        // Hide after 5 seconds
        setTimeout(() => {
            debugInfo.classList.remove('active');
        }, 5000);
    }
}

// Export functions
export {
    initializeErrorCollection,
    handleIframeError,
    handleImageError,
    handleIconError,
    showDebugInfo
};