/**
 * Main JavaScript file for Project Gallery
 * Entry point that imports and initializes all modules
 */

import { initialize } from './config.js';
import { setEmbeddedData } from './data-loader.js';
import { SITE_DATA, APP_ICONS } from './data.js';

// Make sure DOM is fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setEmbeddedData(SITE_DATA, APP_ICONS);
        initialize();
    });
} else {
    setEmbeddedData(SITE_DATA, APP_ICONS);
    initialize();
}

// Expose necessary functions to global scope for HTML event handlers
// We'll need to do this until we update all the event handlers to use JavaScript modules

import { renderGallery, filterProjects } from './gallery.js';
window.renderGallery = renderGallery;
window.filterProjects = filterProjects;

import { 
    openEditPanel, 
    closeEditPanel, 
    renderEditForm, 
    updateItem, 
    refreshIframe 
} from './edit-panel.js';
window.openEditPanel = openEditPanel;
window.closeEditPanel = closeEditPanel;
window.renderEditForm = renderEditForm;
window.updateItem = updateItem;
window.refreshIframe = refreshIframe;

import {
    handleIframeError,
    handleImageError,
    handleIconError,
    showDebugInfo
} from './error-handling.js';
window.handleIframeError = handleIframeError;
window.handleImageError = handleImageError;
window.handleIconError = handleIconError;
window.showDebugInfo = showDebugInfo;

// Import error dashboard functions
import { renderErrorList } from './error-dashboard.js';
window.renderErrorList = renderErrorList;

import {
    toggleSelectMode,
    cancelSelectMode,
    toggleCardSelection,
    hideSelected
} from './selection.js';
window.toggleSelectMode = toggleSelectMode;
window.cancelSelectMode = cancelSelectMode;
window.toggleCardSelection = toggleCardSelection;
window.hideSelected = hideSelected;

// Search input event handler
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            import('./config.js').then(module => {
                module.searchTerm = searchInput.value.toLowerCase();
                renderGallery();
            });
        });
    }
});