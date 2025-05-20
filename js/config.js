/**
 * Configuration module for Project Gallery
 * Contains configuration constants, settings, and initialization functions
 */

// Feature flagged projects
const featuredProjects = ['evidence-based-performance', 'chatgpt-interface', 'blue-mountain-property', 'filepond-demo'];

// Projects that work well with tiny size
const tinyProjects = ['file-fuse', 'timewell', 'tango-mango', 'steroidbase'];

// Global state variables
let projects = [];
let appIcons = [];
let hiddenProjects = [];
let currentFilter = 'all';
let searchTerm = '';
let currentEditingId = null;
let currentEditingType = 'project';
let selectMode = false;
const selectedCards = new Set();
let projectStates = {};

/**
 * Initialize the application
 */
async function initialize() {
    try {
        loadStoredData();
        await fetchConfig();
        applyTheme();
        initializeErrorCollection();
        
        // After initial page load, disable live previews to improve performance
        setTimeout(() => {
            window.disableLivePreviews = true;
            console.log('Live previews disabled after initial load for better performance');
            renderGallery(); // Re-render to apply the change
        }, 5000); // 5 second delay to allow initial iframes to load
    } catch (error) {
        console.error('Initialization error:', error);
        document.getElementById('gallery').innerHTML = '<div class="loading">Error initializing: ' + error.message + '</div>';
    }
}

/**
 * Load stored data from localStorage
 */
function loadStoredData() {
    // Load project states from localStorage
    try {
        const savedStates = localStorage.getItem('projectStates');
        if (savedStates) {
            projectStates = JSON.parse(savedStates);
        }
    } catch (e) {
        console.error('Error loading project states:', e);
        projectStates = {};
    }
    
    // Load hidden projects from localStorage
    try {
        const savedHidden = localStorage.getItem('hiddenProjects');
        if (savedHidden) {
            hiddenProjects = JSON.parse(savedHidden);
        }
    } catch (e) {
        console.error('Error loading hidden projects:', e);
        hiddenProjects = [];
    }
}

/**
 * Save project state to localStorage
 */
function saveProjectState(projectName, state) {
    projectStates[projectName] = state;
    localStorage.setItem('projectStates', JSON.stringify(projectStates));
}

/**
 * Save hidden projects to localStorage
 */
function saveHiddenProjects() {
    localStorage.setItem('hiddenProjects', JSON.stringify(hiddenProjects));
}

/**
 * Apply theme based on user preferences
 */
function applyTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark-theme', prefersDark);
}

/**
 * Hash string for deterministic sizing
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Export all functions and variables
export {
    featuredProjects,
    tinyProjects,
    projects,
    appIcons,
    hiddenProjects,
    currentFilter,
    searchTerm,
    currentEditingId,
    currentEditingType,
    selectMode,
    selectedCards,
    projectStates,
    initialize,
    loadStoredData,
    saveProjectState,
    saveHiddenProjects,
    applyTheme,
    hashString
};