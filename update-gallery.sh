#!/bin/bash

# Update Gallery Script
# This script adds Blue Mountain Wicks to the gallery and commits changes

echo "Updating Project Gallery with Blue Mountain Wicks..."

# Add Blue Mountain Wicks
node add-blue-mountain-wicks.js

# Try to capture screenshot (may fail without proper setup)
node capture-bm-screenshot.js || echo "Screenshot capture failed - you may need to add manually"

# Check if there are changes
if git diff --quiet; then
    echo "No changes detected"
    exit 0
fi

# Commit changes
git add -A
git commit -m "Add Blue Mountain Wicks to project gallery"

echo "Changes committed. Run 'git push' to update the remote repository"