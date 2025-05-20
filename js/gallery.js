/**
 * Gallery rendering module for Project Gallery
 * Contains functions to render and manage the gallery display
 */

import { 
    featuredProjects, 
    tinyProjects,
    projects, 
    appIcons, 
    hiddenProjects,
    currentFilter, 
    searchTerm,
    currentEditingId,
    selectMode,
    selectedCards,
    projectStates,
    hashString
} from './config.js';

/**
 * Determine optimal size for a project
 * Uses a deterministic approach based on project name for consistency
 */
function determineOptimalSize(project) {
    // MOST IMPORTANT: Always respect manually saved sizes first
    const savedState = projectStates[project.name];
    if (savedState && savedState.size) {
        return savedState.size; // Use saved size preference
    }

    // Check if it's featured
    if (featuredProjects.includes(project.name)) {
        return 'large';
    }

    // Check if it's explicitly listed for tiny size
    if (tinyProjects.includes(project.name)) {
        return 'tiny';
    }

    // For remaining projects, use a consistent size based on name hash
    // Distribute across size categories based on modulo
    const sizes = ['small', 'medium', 'tall', 'wide', 'large', 'small', 'medium'];
    const nameHash = hashString(project.name);
    const sizeMod = nameHash % sizes.length;
    return sizes[sizeMod];
}

/**
 * Render the gallery based on current filters and search term
 */
function renderGallery() {
    const gallery = document.getElementById('gallery');
    
    // Filter projects based on criteria
    let filteredProjects = projects;
    let filteredIcons = appIcons;
    
    // Apply status filter (only for projects, not icons)
    if (currentFilter === 'success') {
        filteredProjects = filteredProjects.filter(p => p.status === 'success');
    } else if (currentFilter === 'failed') {
        filteredProjects = filteredProjects.filter(p => p.status === 'failed');
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredProjects = filteredProjects.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.url.toLowerCase().includes(searchTerm)
        );
        filteredIcons = filteredIcons.filter(i => 
            i.name.toLowerCase().includes(searchTerm) ||
            i.displayName.toLowerCase().includes(searchTerm)
        );
    }
    
    // Deterministic card layout algorithm - ensures consistent grid each page load
    // Use a stable sorting algorithm based on name rather than random distribution
    
    // First, separate featured projects - these always come first
    let featuredProjectList = filteredProjects.filter(p => p.featured);
    let regularProjects = filteredProjects.filter(p => !p.featured);
    
    // Sort by name to ensure stable ordering on every page load
    featuredProjectList.sort((a, b) => a.name.localeCompare(b.name));
    regularProjects.sort((a, b) => a.name.localeCompare(b.name));
    filteredIcons.sort((a, b) => a.name.localeCompare(b.name));
    
    // Initialize the final array with featured projects
    let allItems = [...featuredProjectList];
    
    // Helper function to determine optimal item placement for grid flow
    const itemsPerRow = Math.floor(window.innerWidth / 300); // Approximate calculation
    
    // Instead of random distribution, we'll use a fixed pattern 
    // that intelligently places icons to minimize empty spaces
    
    // First, inject first icon after 2 featured projects (if they exist)
    // This ensures icons are visible near the top
    if (filteredIcons.length > 0 && allItems.length >= 2) {
        allItems.splice(2, 0, filteredIcons[0]);
        filteredIcons = filteredIcons.slice(1);
    }
    
    // Then follow a deterministic pattern for the rest:
    // - Regular projects in groups of 3
    // - Place icons strategically after each group
    let regularIndex = 0;
    let iconIndex = 0;
    
    while (regularIndex < regularProjects.length || iconIndex < filteredIcons.length) {
        // Add a block of 3 regular projects (or as many as available)
        for (let i = 0; i < 3 && regularIndex < regularProjects.length; i++) {
            allItems.push(regularProjects[regularIndex++]);
        }
        
        // Add an icon if available
        if (iconIndex < filteredIcons.length) {
            allItems.push(filteredIcons[iconIndex++]);
        }
    }
    
    // Mark items with their type for CSS
    allItems.forEach(item => {
        if (item.type === 'icon') {
            item.itemType = 'icon-card';
        } else {
            item.itemType = 'project-card';
        }
    });
    
    // Handle empty gallery
    if (allItems.length === 0) {
        gallery.innerHTML = '<div class="loading">No items found</div>';
        return;
    }

    // Render all items
    gallery.innerHTML = allItems.map((item, index) => {
        if (item.type === 'icon') {
            return renderIconCard(item, index);
        } else {
            return renderProjectCard(item, index);
        }
    }).join('');
}

/**
 * Render a project card
 */
function renderProjectCard(item, index) {
    return `
        <div class="project-card ${item.size} ${item.featured ? 'featured' : ''} ${item.roundedCorners ? 'rounded-corners' : ''} ${currentEditingId === item.name ? 'editing' : ''} ${selectMode ? 'selecting' : ''} ${selectedCards.has(item.name) ? 'selected' : ''}" 
             id="card-${index}"
             onclick="${selectMode ? `toggleCardSelection('${item.name}')` : ''}">
            <button class="remove-button" onclick="event.stopPropagation(); removeProject('${item.name}')" title="Remove from gallery">×</button>
            <div class="image-container">
                ${item.useLivePreview && item.status === 'success' && !window.disableLivePreviews ? 
                    `<div class="iframe-loading">⟳</div>
                     <iframe 
                        src="${item.url}" 
                        class="project-iframe"
                        id="iframe-${index}"
                        onload="this.previousElementSibling.style.display='none'; this.style.opacity=1;"
                        onerror="handleIframeError(this, '${item.name}')"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                        loading="lazy"
                        style="opacity: 0; transition: opacity 0.3s ease;"
                    ></iframe>` :
                    item.screenshot && item.status === 'success' ? 
                        `<img 
                            src="${item.screenshot}" 
                            alt="${item.name}" 
                            class="project-screenshot ${item.fitMode || 'fit-cover'}" 
                            draggable="false" 
                            loading="lazy"
                            onerror="handleImageError(this, '${item.name}', '${item.url}')"
                        />` : 
                        `<div class="project-placeholder">${item.status === 'failed' ? '❌' : '🔄'}</div>`
                }
            </div>
            <div class="project-overlay">
                <div class="project-name">${item.name}</div>
                <div class="project-url">${item.url}</div>
                <div class="project-actions">
                    <a href="${item.url}" target="_blank" class="action-button primary">Visit Site</a>
                    <button class="action-button" onclick="event.stopPropagation(); openEditPanel('${item.name}')">Edit</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render an icon card
 */
function renderIconCard(item, index) {
    return `
        <div class="project-card ${item.size} ${item.roundedCorners ? 'rounded-corners' : ''} ${currentEditingId === item.name ? 'editing' : ''} ${selectMode ? 'selecting' : ''} ${selectedCards.has(item.name) ? 'selected' : ''}" 
             id="card-${index}"
             onclick="${selectMode ? `toggleCardSelection('${item.name}')` : ''}">
            <button class="remove-button" onclick="event.stopPropagation(); removeItem('${item.name}', 'icon')" title="Remove from gallery">×</button>
            <div class="image-container">
                <img 
                    src="${item.screenshot}" 
                    alt="${item.displayName}" 
                    class="project-screenshot" 
                    draggable="false" 
                    loading="lazy"
                    onerror="handleIconError(this, '${item.name}')"
                />
            </div>
            <div class="project-overlay">
                <div class="project-name">${item.displayName || item.name}</div>
                <div class="project-actions">
                    <button class="action-button" onclick="event.stopPropagation(); openEditPanel('${item.name}', 'icon')">Edit</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Filter projects by status
 */
function filterProjects(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.add('active');
    renderGallery();
}

// Export functions
export {
    determineOptimalSize,
    renderGallery,
    filterProjects
};