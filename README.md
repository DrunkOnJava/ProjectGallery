# Project Gallery

A stunning, interactive gallery showcasing live Netlify projects and custom app icons with a professional animated header.

![Project Gallery Screenshot](screenshot.png)

## 🌐 Live Demo

Visit the gallery at: [https://scintillating-torrone-19b562.netlify.app](https://scintillating-torrone-19b562.netlify.app)

## ✨ Features

### Visual Design
- 🎨 **Professional Animated Header**: Subtle gradient backgrounds with floating particles
- 📊 **Real-time Statistics**: Live count of total projects, active sites, hidden items, and app icons
- 🌈 **Modern UI**: Glass morphism effects, smooth animations, and professional color scheme

### Functionality
- 🔍 **Advanced Search**: Find projects by name or URL instantly
- 🏷️ **Smart Filtering**: View all, successful, or failed projects
- 👁️ **Hide/Show Projects**: Manually hide projects with persistent storage
- 🎯 **Multi-Select Mode**: Select multiple cards to hide in batch
- 📱 **Fully Responsive**: Optimized for all devices and screen sizes
- 🚀 **Fast Loading**: Embedded data prevents CORS issues
- 🛠️ **Debugging Tools**: Built-in tools to manage hidden projects

### App Icons
- 🖼️ **Custom Icon Gallery**: Showcase your custom app icons
- 📐 **Perfect Display**: Square containers with proper aspect ratios
- 🔄 **Easy Management**: Simple process to add new icons

## 📸 Screenshots

High-quality screenshots of all Netlify sites captured at 1920x1080 resolution with 2x device pixel ratio for retina displays.

## 🚀 Quick Deployment

### Deploy with Netlify (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/project-gallery)

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/project-gallery)

## 🛠️ Setup & Configuration

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-gallery.git
   cd project-gallery
   ```

2. Open locally:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Or simply open index.html in your browser
   ```

### Adding Projects

Edit the `SITE_DATA` constant in `index.html`:

```javascript
{
  name: "Your Project Name",
  customUrl: "your-project.netlify.app",
  isPasswordProtected: false,
  lastPublished: "2024-01-20T10:30:00.000Z",
  status: "success",
  actualPath: "https://your-project.netlify.app"
}
```

### Adding App Icons

1. Place your icon in the `/icons` directory
2. Update `icons-config.json`:
   ```json
   {
     "name": "YourApp",
     "displayName": "Your App Name"
   }
   ```

Or use the automated script:
```bash
node add-icon.js YourApp "Your App Name" /path/to/icon.png
```

## 📊 Statistics

- Total Projects: 55+ Netlify sites
- Custom App Icons: 15+ applications
- Screenshot Quality: 1920x1080 @ 2x DPI
- Performance: Instant load with embedded data

## 🎨 Customization

### Color Scheme
- Primary: `#3b82f6` (blue)
- Success: `#10b981` (green)
- Warning: `#f59e0b` (amber)
- Error: `#ef4444` (red)
- Background: `#0a0f1b` to `#050a15` gradient

### Key Style Sections
- Header animation: Lines 22-226
- Control buttons: Lines 238-297
- Project cards: Lines 353-430
- Icon styling: Lines 432-450

## 📱 Multi-Select Mode

1. Click "Select Multiple" button
2. Click cards to select (red outline appears)
3. Choose "Hide Selected" or "Cancel"
4. Use "Show Hidden" to restore

## 🛠️ Debugging Tools

Access debugging tools at the bottom of the page:
- Clear all hidden projects
- Reset all settings
- Export current configuration
- View debug information

## 📄 Files Structure

```
ProjectGallery/
├── index.html              # Main gallery page
├── site-data.json         # Site metadata
├── icons-config.json      # Icon configuration
├── add-icon.js           # Icon addition helper
├── screenshots/          # Screenshot directory
├── icons/               # App icons directory
├── netlify.toml         # Netlify configuration
├── vercel.json         # Vercel configuration
├── DEPLOY.md           # Deployment guide
└── README.md          # This file
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🚀 Deployment

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

Quick options:
- Netlify (drag & drop or git)
- Vercel (git integration)
- GitHub Pages
- Surge.sh
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for your own gallery!

## 🙏 Acknowledgments

- Icons from [Heroicons](https://heroicons.com)
- Gradient inspiration from modern UI design trends
- Built with vanilla JavaScript and CSS for maximum performance