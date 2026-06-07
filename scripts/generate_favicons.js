const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../assets/favicon-source.png');
const outputDir = path.join(__dirname, '../');

async function generateFavicons() {
    try {
        console.log('Generating favicons...');

        // Apple Touch Icon (180x180)
        await sharp(source)
            .resize(180, 180)
            .toFile(path.join(outputDir, 'apple-touch-icon.png'));

        // Favicon 96x96
        await sharp(source)
            .resize(96, 96)
            .toFile(path.join(outputDir, 'favicon-96x96.png'));

        // Favicon 32x32 (approx for .ico fallback)
        await sharp(source)
            .resize(32, 32)
            .toFile(path.join(outputDir, 'favicon.ico'));

        // Manifest Icons
        await sharp(source)
            .resize(192, 192)
            .toFile(path.join(outputDir, 'web-app-manifest-192x192.png'));

        await sharp(source)
            .resize(512, 512)
            .toFile(path.join(outputDir, 'web-app-manifest-512x512.png'));

        // Create Web Manifest
        const manifest = {
            "name": "Sakamoto Days Archive",
            "short_name": "SakamotoArchive",
            "icons": [
                {
                    "src": "/web-app-manifest-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "maskable"
                },
                {
                    "src": "/web-app-manifest-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "maskable"
                }
            ],
            "theme_color": "#ffcc00",
            "background_color": "#050505",
            "display": "standalone"
        };

        fs.writeFileSync(path.join(outputDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));

        console.log('✓ Favicons and manifest generated.');
    } catch (err) {
        console.error('Error generating favicons:', err);
    }
}

generateFavicons();
