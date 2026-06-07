const fs = require('fs');
const path = require('path');
const chapters = require('../src/chapters_data.json');

const BASE_OUT = process.argv[2] || '.';
const OUTPUT_FILE = path.join(BASE_OUT, 'index.html');
const CACHE_FILE = path.join(__dirname, '../article_cache.json');

let seoHTML = '';
if (fs.existsSync(CACHE_FILE)) {
    try {
        const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        seoHTML = cache['home'] || '';
    } catch (e) {
        console.error('Error loading SEO cache:', e);
    }
}

const heroTitleLetters = 'SAKAMOTO DAYS'.split('').map(char => 
    char === ' ' ? '<br>' : '<span class="letter">' + char + '</span>'
).join('');


const chapterCardsHTML = chapters.map((ch, index) => {
    const isNew = index < 5 ? '<div class="latest-badge">NEW</div>' : '';
    const missionSubtitle = ch.title.replace('Chapter ' + ch.id, '').replace(/-/g, ' ').trim() || 'Classified Action';
    
    return `
    <a href="chapters/${ch.folder}.html" class="chapter-card" data-title="${ch.title.toLowerCase()} mission ${ch.id}">
        ${isNew}
        <img src="${ch.thumbnail}" alt="Sakamoto Days Chapter ${ch.id}" class="card-img" loading="lazy">
        <div class="card-overlay">
            <div class="mission-num">MISSION ${ch.id}</div>
            <div class="card-title">${ch.title}</div>
            <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; margin-top: 0.5rem;">STATUS: RECORDED</div>
        </div>
    </a>`;
}).join('');

let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sakamoto Days Manga Online | The Assassin's Confectionery Archive</title>
    <meta name="description" content="Read Sakamoto Days manga online for free. Follow Taro Sakamoto, the legendary retired hitman, in high quality images and professional interface.">
    <link rel="stylesheet" href="src/styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Sakamoto Days Portal",
      "url": "https://sakamotodays.online",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sakamotodays.online/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
</head>
<body>
    <div class="grain-overlay"></div>
    <div class="scanlines"></div>
    <div id="custom-cursor"></div>
    <div id="custom-cursor-outline"></div>

    <nav class="nav" id="mainNav">
        <div class="container nav-inner">
            <a href="/" class="logo magnetic">SAKAMOTO</a>
            <div class="nav-links">
                <a href="#chapterGrid" class="nav-link">ARCHIVE</a>
                <a href="#chapterGrid" class="nav-link magnetic">MISSIONS</a>
            </div>
        </div>
    </nav>

    <header class="hero">
        <div class="hero-bg" style="background-image: url('assets/hero.png');"></div>
        <div class="hero-overlay"></div>
        <div class="hero-gradient"></div>
        
        <div class="container">
            <div class="hero-content">
                <div class="hero-badge">OPERATIVE STATUS: ACTIVE</div>
                <div class="hero-subtitle">ORDER #402 - LEGENDARY RETIRED HITMAN</div>
                <h1 class="hero-title">${heroTitleLetters}</h1>
                
                <div class="hero-actions">
                    <div class="search-box">
                        <input type="text" id="chapterSearch" class="search-input" placeholder="SEARCH ARCHIVE MISSIONS...">
                        <span class="search-icon">⌕</span>
                    </div>
                </div>

                <div class="receipt">
                    <div style="font-weight: 800; font-size: 1.2rem; margin-bottom: 0.5rem;">SAKAMOTO STORE</div>
                    <div style="font-size: 0.7rem; margin-bottom: 1rem;">ORDER TERMINAL V.2.0.4</div>
                    <div class="receipt-divider"></div>
                    <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
                        <span>TOTAL MISSIONS</span>
                        <span>${chapters.length}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
                        <span>ARCHIVE STATUS</span>
                        <span style="color: #00cc00">VERIFIED</span>
                    </div>
                    <div class="receipt-divider"></div>
                    <div style="text-align: center; font-size: 0.6rem; margin-top: 1rem; opacity: 0.6;">* DON'T MAKE A SCENE IN THE STORE *</div>
                </div>
            </div>
        </div>
    </header>

    <main class="grid-section">
        <div class="container">
            <div class="section-header">
                <div>
                    <div class="mono" style="font-size: 0.7rem; color: var(--primary); letter-spacing: 0.5em; text-transform: uppercase;">Mission Log</div>
                    <h2 class="section-title">The Archive</h2>
                </div>
                <div class="mono" style="font-size: 0.7rem; color: var(--text-dim);">${new Date().toLocaleDateString()}</div>
            </div>

            <div class="chapter-grid" id="chapterGrid">
                ${chapterCardsHTML}
            </div>

            ${seoHTML ? `<section class="seo-section" style="margin-top: 10rem; padding: 4rem; background: var(--surface-1); border-radius: 2rem; border: 1px solid var(--glass-border); line-height: 1.8; color: var(--text-muted);">
                <div class="mono" style="color: var(--primary); font-size: 0.7rem; margin-bottom: 2rem; letter-spacing: 0.3em;">// DATA_SYNOPSIS</div>
                <div class="seo-content">${seoHTML}</div>
            </section>` : ''}
        </div>
    </main>

    <footer style="padding: 6rem 0; border-top: 1px solid var(--glass-border); background: #010101; position: relative; overflow: hidden;">
        <div class="container">
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 3rem; margin-bottom: 5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 3rem;">
                <a href="about.html" style="color: var(--text-muted); text-decoration: none; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;" class="footer-link">ABOUT</a>
                <a href="contact.html" style="color: var(--text-muted); text-decoration: none; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;" class="footer-link">CONTACT</a>
                <a href="privacy-policy.html" style="color: var(--text-muted); text-decoration: none; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;" class="footer-link">PRIVACY</a>
                <a href="dmca.html" style="color: var(--text-muted); text-decoration: none; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;" class="footer-link">DMCA</a>
                <a href="terms.html" style="color: var(--text-muted); text-decoration: none; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;" class="footer-link">TERMS</a>
                <a href="cookies.html" style="color: var(--text-muted); text-decoration: none; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;" class="footer-link">COOKIES</a>
                <a href="disclaimer.html" style="color: var(--text-muted); text-decoration: none; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;" class="footer-link">DISCLAIMER</a>
            </div>
            
            <div style="text-align: center;">
                <div class="bangers" style="font-size: 3rem; color: var(--primary); margin-bottom: 1.5rem; letter-spacing: 0.1em; opacity: 0.8;">SAKAMOTO DAYS</div>
                <div class="mono" style="font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.3em; text-transform: uppercase;">&copy; 2024 THE ASSASSIN'S CONFECTIONERY. ALL RIGHTS RESERVED.</div>
            </div>
        </div>
    </footer>

    <script>
        // Cursor Logic
        const cursor = document.getElementById('custom-cursor');
        const outline = document.getElementById('custom-cursor-outline');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            anime({
                targets: outline,
                left: e.clientX,
                top: e.clientY,
                duration: 400,
                easing: 'easeOutExpo'
            });
        });

        // Hover & Magnetic Effect
        const interactables = document.querySelectorAll('a, button, .search-input, .chapter-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => {
                outline.classList.remove('cursor-hover');
                if (el.classList.contains('magnetic')) {
                    anime({
                        targets: el,
                        translateX: 0,
                        translateY: 0,
                        duration: 800,
                        easing: 'easeOutElastic(1, .6)'
                    });
                }
            });

            if (el.classList.contains('magnetic')) {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    anime({
                        targets: el,
                        translateX: x * 0.3,
                        translateY: y * 0.3,
                        duration: 100,
                        easing: 'easeOutQuad'
                    });
                });
            }
        });

        // Nav Scroll
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('mainNav');
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });

        // Search Filter
        const searchInput = document.getElementById('chapterSearch');
        const cards = document.querySelectorAll('.chapter-card');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            cards.forEach(card => {
                const title = card.getAttribute('data-title');
                if (title.includes(query)) {
                    card.style.display = 'block';
                    anime({ targets: card, opacity: [0, 1], scale: [0.95, 1], duration: 400, easing: 'easeOutExpo' });
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Entrance Animations
        window.addEventListener('load', () => {
            const tl = anime.timeline({
                easing: 'easeOutExpo',
                duration: 1000
            });

            tl.add({
                targets: '.hero-title .letter',
                translateY: [100, 0],
                opacity: [0, 1],
                delay: anime.stagger(40)
            })
            .add({
                targets: '.hero-badge, .hero-subtitle',
                opacity: [0, 1],
                translateX: [-20, 0],
                delay: anime.stagger(100)
            }, '-=800')
            .add({
                targets: '.hero-actions, .receipt',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(100)
            }, '-=600')
            .add({
                targets: '.chapter-card',
                opacity: [0, 1],
                scale: [0.9, 1],
                rotateZ: [-2, 0],
                delay: anime.stagger(50)
            }, '-=600');
        });
    </script>
</body>
</html>`;

fs.writeFileSync(OUTPUT_FILE, html);
console.log('✓ Home page regenerated with Pro aesthetic.');
