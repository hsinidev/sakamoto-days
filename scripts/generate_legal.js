const fs = require('fs');
const path = require('path');

const BASE_OUT = process.argv[2] || '.';

const styles = `
    <link rel="stylesheet" href="src/styles.css">
    <style>
        .legal-page { padding: 12rem 2rem 10rem; min-height: 100vh; position: relative; }
        .legal-content { max-width: 800px; margin: 0 auto; line-height: 2; position: relative; z-index: 10; }
        .legal-content h1 { color: var(--primary); font-family: var(--font-heading); font-size: clamp(3rem, 8vw, 6rem); margin-bottom: 3rem; text-transform: uppercase; line-height: 1; }
        .legal-content h2 { color: #fff; margin-top: 4rem; margin-bottom: 1.5rem; font-family: var(--font-heading); font-size: 2rem; text-transform: uppercase; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem; }
        .legal-content p { margin-bottom: 2rem; color: var(--text-muted); font-size: 1.1rem; }
        .legal-content ul { margin-bottom: 3rem; padding-left: 1.5rem; color: var(--text-muted); }
        .legal-content li { margin-bottom: 1rem; }
        .receipt-footer { background: #fff; color: #000; padding: 2rem; font-family: var(--font-mono); margin-top: 5rem; transform: rotate(-1deg); border-radius: 4px; box-shadow: 10px 10px 30px rgba(0,0,0,0.5); }
        
        .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; margin-top: 3rem; }
        .footer-link { color: var(--text-dim); text-decoration: none; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; transition: color 0.3s ease; }
        .footer-link:hover { color: var(--primary); }
    </style>
`;

const nav = `
    <nav class="nav scrolled">
        <div class="container nav-inner">
            <a href="/" class="logo magnetic">SAKAMOTO</a>
            <div class="nav-links">
                <a href="/#chapterGrid" class="nav-link">ARCHIVE</a>
                <a href="/#chapterGrid" class="nav-link magnetic">MISSIONS</a>
            </div>
        </div>
    </nav>
`;

const footer = `
    <footer class="footer">
        <div class="container">
            <div class="footer-top">
                <a href="about.html" class="footer-link magnetic">ABOUT</a>
                <a href="contact.html" class="footer-link magnetic">CONTACT</a>
                <a href="privacy.html" class="footer-link magnetic">PRIVACY</a>
                <a href="dmca.html" class="footer-link magnetic">DMCA</a>
                <a href="terms.html" class="footer-link magnetic">TERMS</a>
                <a href="cookies.html" class="footer-link magnetic">COOKIES</a>
                <a href="disclaimer.html" class="footer-link magnetic">DISCLAIMER</a>
            </div>
            <div class="footer-bottom">
                <div class="footer-brand bangers">SAKAMOTO DAYS</div>
                <p class="footer-copy mono">&copy; 2024 SAKAMOTO DAYS PORTAL. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
    </footer>
`;

const cursor = `
    <div id="custom-cursor"></div>
    <div id="custom-cursor-outline"></div>
    <script>
        const cursor = document.getElementById('custom-cursor');
        const outline = document.getElementById('custom-cursor-outline');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            outline.style.left = e.clientX + 'px';
            outline.style.top = e.clientY + 'px';
        });
    </script>
`;

const createPage = (title, badge, headline, content, receipt) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Sakamoto Days Archive</title>
    ${styles}
</head>
<body>
    <div class="grain-overlay"></div>
    <div class="scanlines"></div>
    ${cursor}
    ${nav}
    <div class="legal-page">
        <div class="legal-content">
            <div class="mono" style="color: var(--primary); font-size: 0.7rem; margin-bottom: 1rem; letter-spacing: 0.5em;">ORDER #${badge}</div>
            <h1>${headline}</h1>
            ${content}
            ${receipt ? `
            <div class="receipt-footer">
                <div style="font-weight: 800;">${receipt.status}</div>
                <div style="font-size: 0.7rem;">DEPT: ${receipt.dept}</div>
                <div style="border-top: 1px dashed #000; margin: 1rem 0;"></div>
                <div style="text-align: center; font-size: 0.8rem;">${receipt.msg}</div>
            </div>` : ''}
        </div>
    </div>
    ${footer}
</body>
</html>`;

const dmca = createPage('DMCA Policy', 'DMCA-NOTICE', 'LEGAL NOTICE', `
    <p>This website is a non-commercial fan-operated archive dedicated to <strong>Sakamoto Days</strong>. All intellectual property, including character designs, artwork, and story elements, belongs to <strong>Yuto Suzuki</strong> and <strong>Shueisha</strong>.</p>
    <h2>CRITICAL COMPLIANCE</h2>
    <p>We do not claim ownership of the manga chapters indexed here. We function as a portal to publically available content for cultural preservation and enjoyment.</p>
    <h2>TAKEDOWN REQUESTS</h2>
    <p>If you are the copyright holder and wish to have content removed, please submit a formal request containing:</p>
    <ul>
        <li>Authorized representative signature.</li>
        <li>Clear identification of the copyrighted work.</li>
        <li>Direct links to the infringing mission files.</li>
        <li>Sufficient contact coordinates.</li>
    </ul>
    <p>Contact the shop manager: <strong style="color: var(--primary)">admin@sakamotodays.online</strong></p>
`, { status: 'ORDER TERMINATED', dept: 'INTELLECTUAL PROPERTY', msg: 'THANK YOU FOR THE REPORT' });

const privacy = createPage('Privacy Policy', 'PRIVACY-CLEARANCE', 'PRIVACY PROTOCOL', `
    <p>Your anonymity is a priority at the Sakamoto Store. We do not track personal identifies or store sensitive data about our mission readers.</p>
    <h2>DATA COLLECTION</h2>
    <p>Server logs may record basic metadata (Browser type, Timestamp, IP) for security auditing. This information is never shared or sold.</p>
    <h2>TRACKING TECHNOLOGIES</h2>
    <p>We utilize browser <strong>Local Storage</strong> solely to track your progress through the mission archives (saving read status). No commercial tracking pixels are active.</p>
`, { status: 'SESSION SECURED', dept: 'COUNTER-INTELLIGENCE', msg: 'YOUR DATA IS ENCRYPTED' });

const about = createPage('About Us', 'ARCHIVE-LOGS', 'THE SAKAMOTO STORE', `
    <p>Sakamoto Store Archive is the premier digital repository for the legend of Taro Sakamoto. We dedicated ourselves to preserving every "mission" with the highest fidelity possible.</p>
    <h2>OUR MISSION</h2>
    <p>To provide a seamless, high-performance reading experience for the global community. Our interface is designed with a "Hitman Modernist" aesthetic, reflecting the double life of our protagonist.</p>
    <h2>TECHNICAL SPEC</h2>
    <p>Developed with optimized static architecture for maximum load speed. No bloat, no clutter—just pure action.</p>
`, { status: 'FILE OPEN', dept: 'ARCHIVAL RECORDS', msg: 'ESTABLISHED 2024' });

const contact = createPage('Contact', 'SIGNAL-REQUEST', 'MISSION CONTROL', `
    <p>Need to report a broken mission link or provide feedback on the store layout? Reach out to Mission Control.</p>
    <h2>COORDINATES</h2>
    <p>Primary Channel: <strong style="color: var(--primary)">contact@sakamotodays.online</strong></p>
    <p>Response Time: Within 24-48 mission hours.</p>
`, { status: 'WAITING FOR SIGNAL', dept: 'COMMUNICATIONS', msg: 'SECURE LINE ACTIVE' });

const terms = createPage('Terms of Service', 'STORE-RULES', 'CODE OF CONDUCT', `
    <p>By entering the Sakamoto Store, you agree to follow the rules of the house. No scenes, no unnecessary trouble.</p>
    <h2>USAGE LICENSING</h2>
    <p>Content provided here is for personal enjoyment only. Commercial redistribution is strictly forbidden by Order 402.</p>
    <h2>SYSTEM INTEGRITY</h2>
    <p>Attempts to disrupt the archive operations or scrape sensitive terminal data will result in immediate blocklisting.</p>
`, { status: 'CONTRACT SIGNED', dept: 'OPERATIONS', msg: 'ENJOY THE STAY' });

const cookies = createPage('Cookies Policy', 'DATA-TRACKS', 'BREADCRUMBS', `
    <p>We use minimal "breadcrumbs" to ensure you don't lose your way in the shop aisles.</p>
    <h2>ESSENTIAL COOKIES</h2>
    <p>These are necessary for the basic functioning of the site, such as maintaining your session integrity.</p>
    <h2>ANALYTICS</h2>
    <p>We use anonymized telemetry to see which missions are being read the most, helping us prioritize archive maintenance.</p>
`, { status: 'CACHE CLEAN', dept: 'LOGISTICS', msg: 'NO PERSONAL TRACES LEFT' });

const disclaimer = createPage('Disclaimer', 'LIABILITY-WAIVER', 'MISSION RISK', `
    <p>Participation in the Sakamoto Days Archive carries the risk of extreme entertainment. We are not responsible for lost time due to binge-reading.</p>
    <h2>CONTENT ACCURACY</h2>
    <p>While we strive for perfection, mission logs may vary. We are an unofficial source and do not represent the official publishers.</p>
    <h2>EXTERNAL LINKS</h2>
    <p>Mission files may contain links to external sectors. We do not control these zones and enter at your own risk.</p>
`, { status: 'WAIVER FILED', dept: 'LEGAL DEFENSE', msg: 'PROCEED WITH CAUTION' });

const pages = {
    'dmca.html': dmca,
    'privacy.html': privacy,
    'about.html': about,
    'contact.html': contact,
    'terms.html': terms,
    'cookies.html': cookies,
    'disclaimer.html': disclaimer
};

for (const [filename, content] of Object.entries(pages)) {
    fs.writeFileSync(path.join(BASE_OUT, filename), content);
}

console.log('✓ All premium mission-themed pages generated successfully.');
