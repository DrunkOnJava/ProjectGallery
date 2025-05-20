/**
 * Error dashboard module for Project Gallery
 * Contains functions for the error dashboard UI
 */

/**
 * Render error list in the dashboard
 */
function renderErrorList(tabId) {
    if (!window.errorCollection) return;
    
    const errorList = document.getElementById('errorList');
    if (!errorList) return;
    
    // Filter errors based on tab
    let filteredErrors = window.errorCollection.errors;
    
    if (tabId === 'iframe') {
        filteredErrors = filteredErrors.filter(e => 
            e.type === 'iframe-load-error' || e.source.includes('iframe'));
    } else if (tabId === 'network') {
        filteredErrors = filteredErrors.filter(e => 
            e.type === 'network-error' || e.message.includes('network') || 
            e.message.includes('fetch') || e.message.includes('XHR'));
    } else if (tabId === 'js') {
        filteredErrors = filteredErrors.filter(e => 
            e.type === 'js-error' || e.type === 'unhandled-promise' || 
            (e.stack && e.stack.includes('at ')));
    }
    
    // Update tabs
    document.querySelectorAll('.error-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });
    
    // Sort errors by timestamp (newest first)
    filteredErrors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Limit to most recent 50 errors to avoid performance issues
    filteredErrors = filteredErrors.slice(0, 50);
    
    // Generate error list HTML
    errorList.innerHTML = filteredErrors.length === 0 ? 
        '<div class="error-empty">No errors found</div>' : 
        filteredErrors.map((error, index) => {
            // Determine error type class
            let errorClass = '';
            if (error.message.includes('404') || error.message.includes('not found')) {
                errorClass = 'resource-missing';
            } else if (error.message.includes('API') || error.message.includes('fetch failed')) {
                errorClass = 'api-failure';
            } else if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
                errorClass = 'cors-error';
            } else if (error.type === 'warning') {
                errorClass = 'warning';
            }
            
            // Format source
            const source = error.source || 'unknown';
            
            // Create error entry HTML
            const template = document.createElement('div');
            template.className = `error-entry ${errorClass}`;
            template.innerHTML = `
                <div class="error-entry-header">
                    <span class="error-source">${source}</span>
                    <span>${new Date(error.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="error-message">${error.message}</div>
            `;
            
            // Add stack trace if available
            if (error.stack) {
                const stackEl = document.createElement('pre');
                stackEl.className = 'error-stack';
                stackEl.textContent = error.stack;
                template.appendChild(stackEl);
                
                // Add click to toggle stack trace
                template.querySelector('.error-message').style.cursor = 'pointer';
                template.querySelector('.error-message').addEventListener('click', function() {
                    stackEl.classList.toggle('active');
                });
            }
            
            // Set up action buttons
            const actions = document.createElement('div');
            actions.className = 'error-actions';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'error-copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', function() {
                const fullError = `${error.message}\nSource: ${error.source}\nTimestamp: ${error.timestamp}${error.stack ? '\nStack: ' + error.stack : ''}`;
                navigator.clipboard.writeText(fullError);
                showDebugInfo('Error copied to clipboard');
            });
            
            const ignoreBtn = document.createElement('button');
            ignoreBtn.className = 'error-ignore-btn';
            ignoreBtn.textContent = 'Ignore';
            ignoreBtn.addEventListener('click', function() {
                // Add to ignored errors
                if (!window.errorCollection.ignoredErrors) {
                    window.errorCollection.ignoredErrors = [];
                }
                
                window.errorCollection.ignoredErrors.push({
                    source: error.source,
                    message: error.message
                });
                
                // Remove from displayed errors
                window.errorCollection.errors = window.errorCollection.errors.filter(e => 
                    !(e.source === error.source && e.message === error.message)
                );
                
                // Update UI
                renderErrorList(tabId);
                updateErrorStats();
                
                showDebugInfo(`Error from ${error.source} ignored`);
            });
            
            const fixBtn = document.createElement('button');
            fixBtn.className = 'error-fix-btn';
            fixBtn.textContent = 'Fix';
            fixBtn.addEventListener('click', function() {
                // Generate fix instructions
                const errorUrl = error.source;
                const instructions = generateFixInstructions(error);
                
                // Show instructions in debug
                showDebugInfo(instructions);
                
                // Open relevant file if possible
                if (errorUrl && errorUrl.startsWith('file://')) {
                    const filePath = errorUrl.replace('file://', '');
                    // This would be implemented to open the file in an editor
                    console.log('Would open file:', filePath);
                }
            });
            
            actions.appendChild(copyBtn);
            actions.appendChild(ignoreBtn);
            actions.appendChild(fixBtn);
            
            template.appendChild(actions);
            
            return template.outerHTML;
        }).join('');
}

/**
 * Generate fix instructions for an error
 */
function generateFixInstructions(error) {
    // This is a simple placeholder - in a real app, this would be more sophisticated
    let instructions = `Fix suggestions for error: ${error.message}\n`;
    
    if (error.message.includes('404') || error.message.includes('not found')) {
        instructions += '- Check if the resource exists at the specified location\n';
        instructions += '- Verify the URL path is correct\n';
        instructions += '- Check for typos in the resource name\n';
    } else if (error.message.includes('CORS')) {
        instructions += '- Configure CORS headers on the server\n';
        instructions += '- Check if the server allows the origin\n';
        instructions += '- Consider using a proxy server\n';
    } else if (error.message.includes('syntax error')) {
        instructions += '- Check for syntax errors in your JavaScript\n';
        instructions += '- Verify that all brackets and parentheses are balanced\n';
        instructions += '- Look for missing semicolons or commas\n';
    }
    
    return instructions;
}

/**
 * Update error statistics
 */
function updateErrorStats() {
    // Implemented in error-handling.js
}

/**
 * Show debug information
 */
function showDebugInfo(message) {
    // Implemented in error-handling.js
}

// Export functions
export {
    renderErrorList,
    generateFixInstructions
};