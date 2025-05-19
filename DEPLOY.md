# Deployment Guide for Project Gallery

This guide provides step-by-step instructions for deploying the Project Gallery to various hosting platforms.

## Prerequisites

- A GitHub account (for automated deployments)
- Git installed locally
- The project files ready in a git repository

## Quick Deploy Options

### 1. Netlify (Recommended)

The easiest way to deploy is using Netlify's drag-and-drop feature or git integration.

#### Option A: Drag & Drop Deploy
1. Visit [Netlify Drop](https://app.netlify.com/drop)
2. Drag your project folder into the browser
3. Your site will be live immediately at a random URL
4. Click "Claim your site" to customize the URL

#### Option B: Git Deploy
1. Push your code to GitHub
2. Visit [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub account and select your repository
5. Deploy settings are already configured in `netlify.toml`
6. Click "Deploy site"

#### Option C: CLI Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy

# Deploy to production
netlify deploy --prod
```

### 2. Vercel

Deploy using Vercel's git integration or CLI.

#### Option A: Git Deploy
1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Deploy settings are already configured in `vercel.json`
6. Click "Deploy"

#### Option B: CLI Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Follow the prompts
```

### 3. GitHub Pages

Deploy directly from your GitHub repository.

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select "Deploy from a branch"
4. Choose your branch (usually `main` or `master`)
5. Select the root folder
6. Click "Save"
7. Your site will be available at `https://[username].github.io/[repository-name]`

### 4. Surge.sh

Quick deployment for static sites.

```bash
# Install Surge
npm install -g surge

# Deploy
surge

# Follow the prompts to choose a domain
```

### 5. Firebase Hosting

For Google Cloud deployment.

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase in your project
firebase init hosting

# Deploy
firebase deploy
```

## Environment Variables

If you need to add any API keys or configuration:

1. **Netlify**: Settings → Build & deploy → Environment variables
2. **Vercel**: Settings → Environment Variables
3. **GitHub Pages**: Use GitHub Secrets for Actions

## Custom Domain Setup

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Update your DNS records as instructed

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Post-Deployment Checklist

- [ ] Test all links and functionality
- [ ] Verify icons are loading correctly
- [ ] Check responsive design on mobile
- [ ] Test project card interactions
- [ ] Verify hidden projects persist across sessions
- [ ] Test multi-select functionality
- [ ] Ensure debugging tools work

## Continuous Deployment

Once connected to git, all platforms above will automatically deploy when you push to your repository.

## Performance Optimization

The deployment configurations include:
- Security headers
- Caching for static assets
- Compression (handled by hosting platform)
- Clean URLs

## Troubleshooting

### Icons not loading
- Check that the `/icons` directory is included in deployment
- Verify icon paths in `icons-config.json`

### Site not updating
- Clear browser cache
- Check deployment logs on your hosting platform
- Verify git push was successful

### CORS issues
- The embedded SITE_DATA should prevent CORS issues
- If using external data, configure CORS headers

## Support

For platform-specific help:
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Pages Docs](https://docs.github.com/pages)