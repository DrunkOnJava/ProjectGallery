# Adding Icons to the Project Gallery

## Easy Method: Using the add-icon.js Script

1. **Prepare your icon image**
   - Any image format (PNG, JPG, etc.)
   - Will be automatically resized and background removed
   - Best results with square images

2. **Run the add-icon script**
   ```bash
   node add-icon.js <path-to-image> <icon-name> <display-name>
   ```

   Example:
   ```bash
   node add-icon.js ~/Desktop/my-app-icon.png my-app "My Awesome App"
   ```

3. **That's it!**
   - The script will process your image
   - Create transparent background versions
   - Update the icons-config.json
   - The icon will appear in the gallery

## Manual Method

1. **Process your icon**
   - Resize to 512x512px with transparent background
   - Save as PNG in `app-icons/` directory
   - Name it consistently (e.g., `my-icon.png`)

2. **Update icons-config.json**
   ```json
   {
     "icons": [
       // ... existing icons ...
       { "name": "my-icon", "displayName": "My Icon Display Name" }
     ]
   }
   ```

3. **Refresh the gallery**
   - Open index.html in your browser
   - Your new icon will appear at the bottom

## Icon Requirements

- **Format**: PNG with transparent background
- **Size**: Will be displayed in 280x280px square containers
- **Naming**: Use lowercase with hyphens (e.g., `my-cool-app`)

## Troubleshooting

- If icons don't appear, check browser console for errors
- Ensure file paths are correct in icons-config.json
- Make sure image files exist in app-icons/ directory
- Try clearing browser cache if changes don't show