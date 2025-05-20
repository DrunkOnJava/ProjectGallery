/**
 * Polyfills for older browsers
 * Required to support ES6 modules in older browsers
 */

// Check if the browser supports ES6 modules
if (!('noModule' in HTMLScriptElement.prototype)) {
    // Create a script element to load the SystemJS module loader
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/systemjs@6.8.3/dist/system.min.js';
    script.onload = function() {
        // Configure SystemJS to load from the /js directory
        System.config({
            baseURL: '/js',
            defaultExtension: 'js'
        });
        
        // Import the main module
        System.import('main.js').catch(function(err) {
            console.error('Failed to load the application:', err);
            document.getElementById('gallery').innerHTML = 
                '<div class="loading error">Failed to load the application. Please use a modern browser.</div>';
        });
    };
    document.head.appendChild(script);
    
    // Add a message for older browsers
    const message = document.createElement('div');
    message.className = 'browser-warning';
    message.innerHTML = 'You are using an older browser. For the best experience, please update to a modern browser.';
    document.body.insertBefore(message, document.body.firstChild);
}