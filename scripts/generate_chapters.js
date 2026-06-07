const fs = require('fs');
const path = require('path');
const chapters = require('../src/chapters_data.json');

const BASE_OUT = process.argv[2] || '.';
const CHAPTERS_DIR = path.join(BASE_OUT, 'chapters');
if (!fs.existsSync(CHAPTERS_DIR)) {
    fs.mkdirSync(CHAPTERS_DIR, { recursive: true });
}

chapters.forEach((ch, index) => {
    const prevCh = index > 0 ? chapters[index - 1] : null;
    const nextCh = index < chapters.length - 1 ? chapters[index + 1] : null;

    const titleLetters = ch.title.toUpperCase().split('').map(char => 
        char === ' ' ? '<br>' : `<span class="letter">${char}</span>`
    ).join('');

    const dropdownOptionsHTML = chapters.map(chap => {
        const isActive = chap.id === ch.id ? 'active' : '';
        return `
            <a href="${chap.folder}.html" class="dropdown-option ${isActive}">
                <div class="opt-id">MISSION ${chap.id}</div>
                <div class="opt-title">${chap.title}</div>
            </a>`;
    }).join('');

    const readerImagesHTML = ch.images.map((img, i) => {
        const loadingAttr = i < 3 ? 'eager' : 'lazy';
        return `<img src="../${img}" class="reader-image" alt="${ch.title} - Page ${i + 1}" loading="${loadingAttr}">`;
    }).join('');

    let h = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Read Sakamoto Days Mission ${ch.id} Online | ${ch.title}</title>
    <meta name="description" content="Read Sakamoto Days Chapter ${ch.id}: ${ch.title} in high quality. The legendary hitman Taro Sakamoto returns.">
    <link rel="stylesheet" href="../src/styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
    
    <style>
        .reader-nav-compact {
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 1rem;
            background: rgba(10, 10, 10, 0.85);
            backdrop-filter: blur(20px);
            padding: 0.75rem 1.5rem;
            border-radius: 4rem;
            border: 1px solid var(--glass-border);
            z-index: 1000;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        
        .chapter-dropdown {
            position: relative;
            cursor: pointer;
        }
        
        .dropdown-trigger {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            background: rgba(255, 255, 255, 0.05);
        }
        
        .dropdown-content {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-1rem);
            width: 280px;
            max-height: 400px;
            overflow-y: auto;
            background: var(--surface-2);
            border: 1px solid var(--glass-border);
            border-radius: 1.5rem;
            display: none;
            padding: 1rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.8);
        }
        
        .dropdown-content.active { display: block; }
        
        .dropdown-option {
            display: block;
            padding: 1rem;
            text-decoration: none;
            color: #fff;
            border-radius: 1rem;
            transition: 0.2s;
            margin-bottom: 0.5rem;
        }
        
        .dropdown-option:hover { background: rgba(255, 204, 0, 0.1); }
        .dropdown-option.active { border: 1px solid var(--primary); background: rgba(255, 204, 0, 0.05); }
        
        .opt-id { font-family: var(--font-mono); font-size: 0.6rem; color: var(--primary); margin-bottom: 0.2rem; }
        .opt-title { font-weight: 700; font-size: 0.9rem; }
        
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--primary);
            z-index: 2000;
            width: 0%;
            transition: width 0.1s;
        }
        
        .reader-chapter-end {
            padding: 10rem 0;
            text-align: center;
            background: linear-gradient(to bottom, transparent, var(--surface-1));
        }

        .status-badge {
            background: var(--primary);
            color: #000;
            padding: 0.5rem 1.5rem;
            font-family: var(--font-mono);
            font-size: 0.7rem;
            font-weight: 800;
            border-radius: 2rem;
            display: inline-block;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    <div class="grain-overlay"></div>
    <div id="custom-cursor"></div>
    <div id="custom-cursor-outline"></div>

    <nav class="nav" id="mainNav">
        <div class="container nav-inner">
            <a href="../index.html" class="logo magnetic">SAKAMOTO</a>
            <div class="nav-links">
                <a href="../index.html" class="nav-link">ARCHIVE</a>
                <a href="../index.html#chapterGrid" class="nav-link magnetic">MISSIONS</a>
            </div>
        </div>
    </nav>

    <header style="padding: 10rem 0 5rem; text-align: center;">
        <div class="container">
            <div class="mono" style="font-size: 0.7rem; color: var(--primary); letter-spacing: 0.5em; margin-bottom: 1rem;">MISSION DATA INGESTED</div>
            <h1 class="hero-title" style="font-size: clamp(3rem, 10vw, 6rem);">${titleLetters}</h1>
            <div class="mono" style="font-size: 0.6rem; color: var(--text-dim); margin-top: 2rem;">STATUS: EXECUTION IN PROGRESS</div>
        </div>
    </header>

    <main class="reader-container">
        ${readerImagesHTML}
    </main>

    <section class="reader-chapter-end">
        <div class="container">
            <div class="status-badge">MISSION COMPLETED</div>
            <h2 class="section-title" style="margin-bottom: 3rem;">Ready for Next?</h2>
            
            <div style="display: flex; justify-content: center; gap: 2rem; align-items: center;">
                ${prevCh ? `<a href="${prevCh.folder}.html" class="nav-link">Previous</a>` : ''}
                <a href="../index.html" class="nav-btn" style="padding: 1rem 3rem;">Return Home</a>
                ${nextCh ? `<a href="${nextCh.folder}.html" class="nav-btn" style="background: var(--primary); color: #000; padding: 1rem 3rem;">Next Mission</a>` : ''}
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-top">
                <a href="../about.html" class="footer-link magnetic">ABOUT</a>
                <a href="../contact.html" class="footer-link magnetic">CONTACT</a>
                <a href="../privacy.html" class="footer-link magnetic">PRIVACY</a>
                <a href="../dmca.html" class="footer-link magnetic">DMCA</a>
                <a href="../terms.html" class="footer-link magnetic">TERMS</a>
                <a href="../cookies.html" class="footer-link magnetic">COOKIES</a>
                <a href="../disclaimer.html" class="footer-link magnetic">DISCLAIMER</a>
            </div>
            <div class="footer-bottom">
                <div class="footer-brand bangers">SAKAMOTO DAYS</div>
                <p class="footer-copy mono">&copy; 2024 SAKAMOTO DAYS PORTAL. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
    </footer>

    <!-- Floating Nav -->
    <div class="reader-nav-compact">
        ${prevCh ? `<a href="${prevCh.folder}.html" class="nav-btn" style="padding: 0.5rem 1rem;">←</a>` : ''}
        
        <div class="chapter-dropdown" id="chDropdown">
            <div class="dropdown-trigger">
                <span>MISSION ${ch.id}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"></path></svg>
            </div>
            <div class="dropdown-content" id="chDropdownContent">
                ${dropdownOptionsHTML}
            </div>
        </div>
        
        ${nextCh ? `<a href="${nextCh.folder}.html" class="nav-btn" style="background: var(--primary); color: #000; padding: 0.5rem 1rem;">→</a>` : ''}
    </div>

    <script>
        const cursor = document.getElementById('custom-cursor');
        const outline = document.getElementById('custom-cursor-outline');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            anime({ targets: outline, left: e.clientX, top: e.clientY, duration: 400, easing: 'easeOutExpo' });
        });

        const interactables = document.querySelectorAll('a, button, .dropdown-trigger, .cta-nav');
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

        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            document.getElementById('progressBar').style.width = scrolled + '%';
            
            const nav = document.getElementById('mainNav');
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });

        // Dropdown Logic
        const trigger = document.getElementById('chDropdown');
        const content = document.getElementById('chDropdownContent');
        
        trigger.onclick = (e) => {
            e.stopPropagation();
            content.classList.toggle('active');
        };
        
        document.onclick = () => content.classList.remove('active');

        // Entrance
        window.addEventListener('load', () => {
            anime.timeline({ easing: 'easeOutExpo' })
                .add({
                    targets: '.hero-title .letter',
                    translateY: [40, 0],
                    opacity: [0, 1],
                    delay: anime.stagger(30)
                })
                .add({
                    targets: '.reader-nav-compact',
                    translateY: [40, 0],
                    opacity: [0, 1]
                }, '-=800');
        });
    </script>
</body>
</html>`;

    fs.writeFileSync(path.join(CHAPTERS_DIR, ch.folder + '.html'), h);
});

console.log('✓ All reader pages regenerated with immersive professional UI.');
