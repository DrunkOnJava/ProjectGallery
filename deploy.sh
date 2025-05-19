#!/bin/bash

# Deployment script for Project Gallery
# Usage: ./deploy.sh [platform]

PLATFORM=${1:-netlify}

echo "🚀 Deploying Project Gallery to $PLATFORM..."

case $PLATFORM in
  "netlify")
    echo "📦 Deploying to Netlify..."
    if command -v netlify &> /dev/null; then
      netlify deploy --prod
    else
      echo "❌ Netlify CLI not installed. Install with: npm install -g netlify-cli"
      exit 1
    fi
    ;;
    
  "vercel")
    echo "📦 Deploying to Vercel..."
    if command -v vercel &> /dev/null; then
      vercel --prod
    else
      echo "❌ Vercel CLI not installed. Install with: npm install -g vercel"
      exit 1
    fi
    ;;
    
  "surge")
    echo "📦 Deploying to Surge..."
    if command -v surge &> /dev/null; then
      surge . ${2:-project-gallery.surge.sh}
    else
      echo "❌ Surge CLI not installed. Install with: npm install -g surge"
      exit 1
    fi
    ;;
    
  "github")
    echo "📦 Pushing to GitHub..."
    git add .
    git commit -m "Deploy Project Gallery"
    git push origin main
    echo "✅ Pushed to GitHub. GitHub Pages will deploy automatically."
    ;;
    
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: netlify, vercel, surge, github"
    exit 1
    ;;
esac

echo "✅ Deployment complete!"
