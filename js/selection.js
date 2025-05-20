/**
 * Selection module for Project Gallery
 * Contains functions to manage multi-select mode
 */

import {
    selectMode,
    selectedCards,
    hiddenProjects,
    saveHiddenProjects
} from './config.js';

import {
    renderGallery
} from './gallery.js';

import {
    updateStats
} from './data-loader.js';

/**
 * Toggle select mode
 */
function toggleSelectMode() {
    selectMode = !selectMode;
    
    if (selectMode) {
        document.getElementById('multiSelectControls').classList.add('active');
        document.querySelector('.select-mode-button').textContent = 'Cancel Selection';
    } else {
        selectedCards.clear();
        document.getElementById('multiSelectControls').classList.remove('active');
        document.querySelector('.select-mode-button').textContent = 'Select Multiple';
    }
    
    updateSelectedCount();
    renderGallery();
}

/**
 * Cancel select mode
 */
function cancelSelectMode() {
    selectMode = false;
    selectedCards.clear();
    document.getElementById('multiSelectControls').classList.remove('active');
    document.querySelector('.select-mode-button').textContent = 'Select Multiple';
    updateSelectedCount();
    renderGallery();
}

/**
 * Toggle card selection
 */
function toggleCardSelection(name) {
    if (selectedCards.has(name)) {
        selectedCards.delete(name);
    } else {
        selectedCards.add(name);
    }
    updateSelectedCount();
    renderGallery();
}

/**
 * Update selected count display
 */
function updateSelectedCount() {
    document.getElementById('selectedCount').textContent = selectedCards.size;
}

/**
 * Hide selected projects
 */
function hideSelected() {
    if (selectedCards.size === 0) {
        alert('No projects selected');
        return;
    }
    
    if (confirm(`Hide ${selectedCards.size} selected projects?`)) {
        selectedCards.forEach(name => {
            hiddenProjects.push(name);
        });
        
        saveHiddenProjects();
        selectedCards.clear();
        cancelSelectMode();
        
        // Update UI
        updateStats();
        renderGallery();
    }
}

// Export functions
export {
    toggleSelectMode,
    cancelSelectMode,
    toggleCardSelection,
    updateSelectedCount,
    hideSelected
};