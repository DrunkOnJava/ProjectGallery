// Hosted iframe optimizer - add this to your sites
// Iframe Optimization Script
// Add this to your sites to make them display better in iframes

(function() {
    // Detect if loaded in iframe
    function isInIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    if (isInIframe()) {
        // Add iframe-specific class
        document.documentElement.classList.add('in-iframe');
        
        // Add iframe-specific styles
        const style = document.createElement('style');
        style.textContent = `
            /* Iframe-specific optimizations */
            .in-iframe {
                zoom: 0.8;
                overflow: hidden;
            }
            
            /* Disable animations for better performance */
            .in-iframe * {
                animation-duration: 0s !important;
                transition-duration: 0s !important;
            }
            
            /* Hide fixed elements that might break layout */
            .in-iframe .fixed,
            .in-iframe [data-fixed],
            .in-iframe header.fixed,
            .in-iframe nav.fixed {
                position: absolute !important;
            }
            
            /* Optimize for small viewport */
            .in-iframe body {
                overflow: hidden;
                width: 100vw;
                height: 100vh;
            }
            
            /* Hide cookie banners and popups */
            .in-iframe .cookie-banner,
            .in-iframe .popup,
            .in-iframe .modal,
            .in-iframe [role="dialog"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Send message to parent window that iframe is ready
        if (window.parent) {
            window.parent.postMessage({ type: 'iframe-ready', url: window.location.href }, '*');
        }
        
        // Prevent scrolling
        document.addEventListener('wheel', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        // Adjust viewport meta tag for better mobile display
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
        }
    }
})();