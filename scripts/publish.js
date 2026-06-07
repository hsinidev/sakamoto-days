const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUT_DIR = path.join(__dirname, '../out');

// 1. Clean/Create out directory
console.log('🚀 Starting production build for Sakamoto Days...');
if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

// 2. Run generation scripts
console.log('📦 Generating static pages...');
execSync(`node scripts/generate_index.js out`, { stdio: 'inherit' });
execSync(`node scripts/generate_chapters.js out`, { stdio: 'inherit' });
execSync(`node scripts/generate_legal.js out`, { stdio: 'inherit' });

// 3. Copy assets and static folders
console.log('🖼️ Copying assets and media...');
const foldersToCopy = ['src', 'manga', 'assets'];
foldersToCopy.forEach(folder => {
    const srcPath = path.join(__dirname, '..', folder);
    const destPath = path.join(OUT_DIR, folder);
    if (fs.existsSync(srcPath)) {
        fs.cpSync(srcPath, destPath, { recursive: true });
    }
});

// 4. Copy root static files (favicon, sitemaps, etc)
console.log('📄 Copying SEO and root assets...');
const rootFiles = [
    '.htaccess', 'robots.txt', 'sitemap.xml', 'sitemap-pages.xml', 'sitemap-chapters.xml',
    '404.html', 'favicon.ico', 'favicon-96x96.png', 'apple-touch-icon.png',
    'site.webmanifest', 'web-app-manifest-192x192.png', 'web-app-manifest-512x512.png'
];

rootFiles.forEach(file => {
    const srcPath = path.join(__dirname, '..', file);
    const destPath = path.join(OUT_DIR, file);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
    }
});

// 5. Final check on privacy naming (ensure privacy.html exists)
const privPathP = path.join(OUT_DIR, 'privacy-policy.html');
const privPath = path.join(OUT_DIR, 'privacy.html');
if (fs.existsSync(privPathP) && !fs.existsSync(privPath)) {
    fs.copyFileSync(privPathP, privPath);
}

console.log('✨ Build complete! The "out" folder is ready for vps deployment.');
console.log('🌐 Target Domain: https://sakamotodays.online');
