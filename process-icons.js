const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// List of icon files to process
const iconFiles = [
    '/Users/griffin/Pictures/4bd57825ab8eef83164318ddd3d7e4987f4e6c84a0ab8468bb485adba60dd07d.jpeg',
    '/Users/griffin/Pictures/5b7a227e-61c2-44c6-9360-d253d3376c14_8754722.png',
    '/Users/griffin/Pictures/7a93289fab4973f805134555316a371329e5f69ed38a509f454e7d1ba66a30c9.jpeg',
    '/Users/griffin/Pictures/create_a_file_flat_image9.png',
    '/Users/griffin/Pictures/DrunkOnJavaLogo4.png',
    '/Users/griffin/Pictures/fbfbef143eac445b6c8ad64a9d47c61b31fedd7abbd12a54e9f51205a141d7aa.jpeg',
    '/Users/griffin/Pictures/FileFuse.png',
    '/Users/griffin/Pictures/gpt4oAppIcon.png',
    '/Users/griffin/Pictures/hammer4.png',
    '/Users/griffin/Pictures/I_need_an_logo_for_my_app_calle_MindBlitz_It_s_a_chatgptlike_AI_chat_client_with_addtional_AI_features_builtin.png',
    '/Users/griffin/Pictures/modern_minimalist_image.jpeg',
    '/Users/griffin/Pictures/templateAppIcon.png',
    '/Users/griffin/Pictures/xcodeVSCodeIcon.png',
    '/Users/griffin/Pictures/xcodeVSCodeICON2.png',
    '/Users/griffin/Pictures/xcodevscodeicon4.png'
];

const outputDir = path.join(__dirname, 'app-icons');

// Simple name mapping for cleaner filenames
const nameMap = {
    '4bd57825ab8eef83164318ddd3d7e4987f4e6c84a0ab8468bb485adba60dd07d': 'app-icon-1',
    '5b7a227e-61c2-44c6-9360-d253d3376c14_8754722': 'app-icon-2',
    '7a93289fab4973f805134555316a371329e5f69ed38a509f454e7d1ba66a30c9': 'app-icon-3',
    'create_a_file_flat_image9': 'file-creator',
    'DrunkOnJavaLogo4': 'drunk-on-java',
    'fbfbef143eac445b6c8ad64a9d47c61b31fedd7abbd12a54e9f51205a141d7aa': 'app-icon-4',
    'FileFuse': 'file-fuse',
    'gpt4oAppIcon': 'gpt4o',
    'hammer4': 'hammer',
    'I_need_an_logo_for_my_app_calle_MindBlitz_It_s_a_chatgptlike_AI_chat_client_with_addtional_AI_features_builtin': 'mindblitz',
    'modern_minimalist_image': 'minimalist',
    'templateAppIcon': 'template',
    'xcodeVSCodeIcon': 'xcode-vscode-1',
    'xcodeVSCodeICON2': 'xcode-vscode-2',
    'xcodevscodeicon4': 'xcode-vscode-3'
};

async function processIcon(inputPath) {
    try {
        const basename = path.basename(inputPath, path.extname(inputPath));
        const cleanName = nameMap[basename] || basename;
        const outputPath = path.join(outputDir, `${cleanName}.png`);
        
        console.log(`Processing ${basename} -> ${cleanName}`);
        
        // Read the image and process it
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
            
        console.log(`✓ Saved ${cleanName}.png`);
        
        // Create a smaller version for thumbnail
        await sharp(inputPath)
            .resize(256, 256, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .removeAlpha()
            .ensureAlpha()
            .png()
            .toFile(path.join(outputDir, `${cleanName}-thumb.png`));
            
        console.log(`✓ Saved ${cleanName}-thumb.png`);
        
    } catch (error) {
        console.error(`Error processing ${inputPath}:`, error);
    }
}

async function main() {
    console.log('Starting icon processing...');
    
    // Process all icons
    for (const iconFile of iconFiles) {
        if (fs.existsSync(iconFile)) {
            await processIcon(iconFile);
        } else {
            console.log(`File not found: ${iconFile}`);
        }
    }
    
    console.log('Icon processing complete!');
}

main();