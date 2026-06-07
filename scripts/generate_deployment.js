const fs = require('fs-extra');
const path = require('path');
const chaptersData = require('../src/chapters_data.json');

const DOMAIN = 'https://sakamotodays.online';
const ROOT = path.join(__dirname, '..');
const TODAY = new Date().toISOString().split('T')[0];

async function generateSitemaps() {
    const pages = [
        { loc: '', priority: '1.0', changefreq: 'daily' },
        { loc: 'dmca.html', priority: '0.3', changefreq: 'yearly' },
        { loc: 'privacy-policy.html', priority: '0.3', changefreq: 'yearly' },
    ];

    let pageUrls = pages.map(p => {
        return '  <url>\n' +
               '    <loc>' + DOMAIN + '/' + p.loc + '</loc>\n' +
               '    <lastmod>' + TODAY + '</lastmod>\n' +
               '    <changefreq>' + p.changefreq + '</changefreq>\n' +
               '    <priority>' + p.priority + '</priority>\n' +
               '  </url>';
    }).join('\n');

    const sitemapPages = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                       pageUrls + '\n' +
                       '</urlset>';
    await fs.writeFile(path.join(ROOT, 'sitemap-pages.xml'), sitemapPages);

    let chapterUrls = chaptersData.map(ch => {
        const priority = ch.id >= 200 ? '0.9' : ch.id >= 100 ? '0.8' : '0.7';
        return '  <url>\n' +
               '    <loc>' + DOMAIN + '/chapters/' + ch.folder + '.html</loc>\n' +
               '    <lastmod>' + TODAY + '</lastmod>\n' +
               '    <changefreq>monthly</changefreq>\n' +
               '    <priority>' + priority + '</priority>\n' +
               '  </url>';
    }).join('\n');

    const sitemapChapters = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                          chapterUrls + '\n' +
                          '</urlset>';
    await fs.writeFile(path.join(ROOT, 'sitemap-chapters.xml'), sitemapChapters);

    const sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                       '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                       '  <sitemap>\n' +
                       '    <loc>' + DOMAIN + '/sitemap-pages.xml</loc>\n' +
                       '    <lastmod>' + TODAY + '</lastmod>\n' +
                       '  </sitemap>\n' +
                       '  <sitemap>\n' +
                       '    <loc>' + DOMAIN + '/sitemap-chapters.xml</loc>\n' +
                       '    <lastmod>' + TODAY + '</lastmod>\n' +
                       '  </sitemap>\n' +
                       '</sitemapindex>';
    await fs.writeFile(path.join(ROOT, 'sitemap.xml'), sitemapIndex);
}

async function generateRobots() {
    const robots = 'User-agent: *\nAllow: /\nSitemap: ' + DOMAIN + '/sitemap.xml';
    await fs.writeFile(path.join(ROOT, 'robots.txt'), robots);
}

async function generate404() {
    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '    <meta charset="UTF-8">\n';
    html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '    <title>404 - Mission File Not Found | Sakamoto Days</title>\n';
    html += '    <link rel="stylesheet" href="src/styles.css">\n';
    html += '    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>\n';
    html += '    <style>\n';
    html += '        body { height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; background: #020202; overflow: hidden; }\n';
    html += '        .error-code { font-family: "Bangers", cursive; font-size: clamp(10rem, 30vw, 25rem); color: var(--primary); line-height: 1; opacity: 0.05; position: absolute; z-index: 0; user-select: none; }\n';
    html += '        .error-content { position: relative; z-index: 10; }\n';
    html += '        .error-title { font-family: "Bangers", cursive; font-size: clamp(3rem, 8vw, 6rem); color: #fff; margin-bottom: 1rem; text-transform: uppercase; }\n';
    html += '    </style>\n';
    html += '</head>\n<body class="scanline">\n';
    html += '    <div id="custom-cursor"></div>\n';
    html += '    <div id="custom-cursor-outline"></div>\n';
    html += '    <div class="error-code">404</div>\n';
    html += '    <div class="error-content">\n';
    html += '        <div style="font-size: 0.8rem; letter-spacing: 0.5em; color: var(--primary); margin-bottom: 1rem; font-weight: 800;">MISSION ABORTED</div>\n';
    html += '        <h1 class="error-title">TARGET LOST</h1>\n';
    html += '        <p style="color: var(--text-muted); margin-bottom: 3rem; max-width: 400px; margin-inline: auto;">The mission coordinate has been retired.</p>\n';
    html += '        <a href="/" class="nav-btn">Return to Archive</a>\n';
    html += '    </div>\n';
    html += '    <script>\n';
    html += '        const cursor = document.getElementById("custom-cursor");\n';
    html += '        const outline = document.getElementById("custom-cursor-outline");\n';
    html += '        document.addEventListener("mousemove", (e) => {\n';
    html += '            cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px";\n';
    html += '            setTimeout(() => { outline.style.left = (e.clientX - 10) + "px"; outline.style.top = (e.clientY - 10) + "px"; }, 50);\n';
    html += '        });\n';
    html += '        window.addEventListener("load", () => {\n';
    html += '            anime({ targets: ".error-content", opacity: [0, 1], translateY: [30, 0], duration: 1500 });\n';
    html += '            anime({ targets: ".error-code", scale: [0.8, 1.2], opacity: [0, 0.05], duration: 5000, loop: true, direction: "alternate" });\n';
    html += '        });\n';
    html += '    </script>\n';
    html += '</body>\n</html>';
    await fs.writeFile(path.join(ROOT, '404.html'), html);
}

async function run() {
    process.stdout.write('Generating deployment files...\n');
    await generateSitemaps();
    await generateRobots();
    await generate404();
    process.stdout.write('✓ Deployment files generated.\n');
}

run().catch(console.error);
