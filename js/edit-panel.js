/**
 * Edit panel module for Project Gallery
 * Contains functions to manage the edit panel and project editing
 */

import { 
    projects, 
    appIcons, 
    currentEditingId, 
    currentEditingType,
    saveProjectState
} from './config.js';

import { renderGallery } from './gallery.js';

/**
 * Open edit panel for a specific item
 */
function openEditPanel(itemName, type = 'project') {
    currentEditingId = itemName;
    currentEditingType = type;
    document.getElementById('editPanel').classList.add('active');
    renderGallery();
    renderEditForm();
}

/**
 * Close edit panel
 */
function closeEditPanel() {
    document.getElementById('editPanel').classList.remove('active');
    currentEditingId = null;
    renderGallery();
}

/**
 * Render the edit form based on current editing item
 */
function renderEditForm() {
    const editForm = document.getElementById('editForm');
    
    let item;
    let sizeOptions;
    
    if (currentEditingType === 'icon') {
        item = appIcons.find(i => i.name === currentEditingId);
        sizeOptions = ['icon-tiny', 'icon-small', 'icon-medium', 'icon-large', 'icon-wide', 'icon-square'];
    } else {
        item = projects.find(p => p.name === currentEditingId);
        sizeOptions = ['tiny', 'small', 'medium', 'tall', 'wide', 'large', 'xlarge'];
    }
    
    if (!item) return;
    
    editForm.innerHTML = `
        <h3>Edit ${currentEditingType === 'icon' ? 'Icon' : 'Project'}</h3>
        <div class="edit-group">
            <label>${currentEditingType === 'icon' ? 'Icon' : 'Project'} Name</label>
            <div class="edit-input">${item.name}</div>
        </div>
        
        <div class="edit-group">
            <label>Size</label>
            <div class="size-selector">
                ${sizeOptions.map(size => 
                    `<button class="size-button ${item.size === size ? 'active' : ''}" 
                             onclick="updateItem('size', '${size}')">${size}</button>`
                ).join('')}
            </div>
        </div>
        
        ${currentEditingType !== 'icon' ? `
        <div class="edit-group">
            <div class="checkbox-group">
                <input type="checkbox" 
                       id="livePreview"
                       ${item.useLivePreview ? 'checked' : ''}
                       onchange="updateItem('useLivePreview', this.checked)">
                <label for="livePreview">Use Live Preview</label>
            </div>
        </div>` : ''}
        
        <div class="edit-group">
            <div class="checkbox-group">
                <input type="checkbox" 
                       id="roundedCorners"
                       ${item.roundedCorners ? 'checked' : ''}
                       onchange="updateItem('roundedCorners', this.checked)">
                <label for="roundedCorners">Rounded Corners</label>
            </div>
        </div>
        
        ${item.useLivePreview && currentEditingType !== 'icon' ? `
            <button class="refresh-button" onclick="refreshIframe('${item.name}')">
                Refresh Preview
            </button>
        ` : ''}
    `;
}

/**
 * Update an item property
 */
function updateItem(field, value) {
    let item;
    
    if (currentEditingType === 'icon') {
        item = appIcons.find(i => i.name === currentEditingId);
    } else {
        item = projects.find(p => p.name === currentEditingId);
    }
    
    if (!item) return;
    
    item[field] = value;
    
    saveProjectState(item.name, {
        size: item.size,
        roundedCorners: item.roundedCorners,
        useLivePreview: item.useLivePreview
    });
    
    renderGallery();
    renderEditForm();
}

/**
 * Refresh iframe for a specific project
 */
function refreshIframe(projectName) {
    const project = projects.find(p => p.name === projectName);
    if (project) {
        const projectIndex = projects.indexOf(project);
        const iframe = document.getElementById(`iframe-${projectIndex}`);
        if (iframe) {
            iframe.src = iframe.src;
        }
    }
}

// Export functions
export {
    openEditPanel,
    closeEditPanel,
    renderEditForm,
    updateItem,
    refreshIframe
};