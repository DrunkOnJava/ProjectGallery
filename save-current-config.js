// Script to save current configuration as locked defaults
const fs = require('fs');
const path = require('path');

// This will be populated with the current hidden projects from your browser
const lockedHiddenProjects = [
    // You'll need to run this in the browser console to get the list:
    // copy(JSON.stringify(hiddenProjects))
];

// This will be populated with current project states from your browser
const lockedProjectStates = {
    // You'll need to run this in the browser console to get the states:
    // copy(JSON.stringify(projectStates))
};

// Save locked configuration
const lockedConfig = {
    hiddenProjects: lockedHiddenProjects,
    projectStates: lockedProjectStates,
    lastUpdated: new Date().toISOString()
};

fs.writeFileSync(
    path.join(__dirname, 'locked-config.json'),
    JSON.stringify(lockedConfig, null, 2)
);

console.log('Configuration locked and saved to locked-config.json');