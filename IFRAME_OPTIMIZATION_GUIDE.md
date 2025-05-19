# Iframe Optimization Guide

This guide explains how to optimize your Netlify sites to display properly in the project gallery iframes.

## Quick Solution

Add this line to your site's HTML `<head>` section:

```html
<script src="https://scintillating-torrone-19b562.netlify.app/iframe-optimizer.js"></script>
```

## Site-Specific Instructions

### For React/Vite Apps (like stately-kelpie)

1. Add to your `index.html`:
```html
<head>
  <!-- Other meta tags -->
  <script>
    // Iframe detection and optimization
    if (window.self !== window.top) {
      document.documentElement.classList.add('in-iframe');
    }
  </script>
  <style>
    .in-iframe #root {
      transform: scale(0.8);
      transform-origin: 0 0;
      width: 125%;
      height: 125%;
      overflow: hidden;
    }
  </style>
</head>
```

2. Or add to your main CSS file:
```css
/* Iframe-specific styles */
html.in-iframe {
  overflow: hidden;
}

html.in-iframe body {
  transform: scale(0.8);
  transform-origin: 0 0;
  width: 125%;
  height: 125%;
}
```

### For Next.js Apps (like mindblitz)

1. Create `public/iframe-detect.js`:
```javascript
if (window.self !== window.top) {
  document.documentElement.classList.add('in-iframe');
}
```

2. Add to your `_document.tsx` or `_app.tsx`:
```tsx
import Head from 'next/head'

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="/iframe-detect.js" />
        <style>{`
          .in-iframe {
            zoom: 0.8;
            overflow: hidden;
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

### For Static Sites

Just add to your HTML:
```html
<head>
  <script>
    if (window.self !== window.top) {
      document.documentElement.style.zoom = '0.8';
      document.body.style.overflow = 'hidden';
    }
  </script>
</head>
```

## Using Netlify Snippet Injection

You can also add this automatically to all your sites using Netlify's snippet injection:

1. Go to Site Settings > Build & Deploy > Post processing > Snippet injection
2. Add to "Insert before </head>":

```html
<script>
(function() {
  if (window.self !== window.top) {
    document.documentElement.classList.add('in-iframe');
    var style = document.createElement('style');
    style.textContent = `
      .in-iframe { zoom: 0.8; overflow: hidden; }
      .in-iframe * { animation-duration: 0s !important; }
    `;
    document.head.appendChild(style);
  }
})();
</script>
```

## Headers Configuration

Add to your `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    Content-Security-Policy = "frame-ancestors 'self' https://*.netlify.app"
```

## Testing

To test if your site works in iframes:

1. Create a test HTML file:
```html
<!DOCTYPE html>
<html>
<body>
  <iframe src="https://your-site.netlify.app" 
          width="400" height="300" 
          style="border: 1px solid black;">
  </iframe>
</body>
</html>
```

2. Open it locally and check if your site displays properly

## Troubleshooting

### Site not loading in iframe
- Check browser console for CORS or CSP errors
- Make sure X-Frame-Options is not set to DENY
- Verify Content-Security-Policy allows framing

### Layout issues
- Use CSS transform instead of zoom for better browser support
- Hide fixed position elements in iframe mode
- Disable animations for better performance

### Performance issues
- Disable unnecessary animations
- Reduce image sizes
- Use lazy loading for content below the fold