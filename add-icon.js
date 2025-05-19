#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// Usage: node add-icon.js <input-image-path> <icon-name> <display-name>

async function addIcon(inputPath, iconName, displayName) {
    try {
        // Validate inputs
        if (!inputPath || !iconName || !displayName) {
            console.error('Usage: node add-icon.js <input-image-path> <icon-name> <display-name>');
            console.error('Example: node add-icon.js ~/Desktop/my-icon.png my-icon "My Cool Icon"');
            process.exit(1);
        }

        // Check if input file exists
        try {
            await fs.access(inputPath);
        } catch {
            console.error(`Error: Input file not found: ${inputPath}`);
            process.exit(1);
        }

        const outputDir = 'app-icons';
        const outputPath = path.join(outputDir, `${iconName}.png`);
        const thumbPath = path.join(outputDir, `${iconName}-thumb.png`);

        // Process the icon
        console.log(`Processing ${iconName}...`);
        
        // Create full size icon with transparent background
        await sharp(inputPath)
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .removeAlpha()
            .ensureAlpha()
            .png()
            .toFile(outputPath);

        // Create thumbnail
        await sharp(inputPath)
            .resize(64, 64, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .removeAlpha()
            .ensureAlpha()
            .png()
            .toFile(thumbPath);

        console.log(`✓ Saved ${iconName}.png`);
        console.log(`✓ Saved ${iconName}-thumb.png`);

        // Update icons config
        const configPath = 'icons-config.json';
        const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
        
        // Check if icon already exists
        const existingIndex = config.icons.findIndex(icon => icon.name === iconName);
        if (existingIndex >= 0) {
            console.log(`Updating existing icon: ${iconName}`);
            config.icons[existingIndex] = { name: iconName, displayName: displayName };
        } else {
            console.log(`Adding new icon: ${iconName}`);
            config.icons.push({ name: iconName, displayName: displayName });
        }

        // Save updated config
        await fs.writeFile(configPath, JSON.stringify(config, null, 2));
        console.log('✓ Updated icons-config.json');

        console.log('\nSuccess! To see your new icon in the gallery:');
        console.log('1. Open index.html in your browser');
        console.log('2. The icon will appear at the bottom of the gallery');
        
    } catch (error) {
        console.error('Error processing icon:', error);
        process.exit(1);
    }
}

// Get command line arguments
const args = process.argv.slice(2);
addIcon(args[0], args[1], args[2]);