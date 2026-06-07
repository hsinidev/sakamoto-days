# Sakamoto Days Portal: Design & Tech Spec

## Aesthetic: "The Assassin's Confectionery"
*   **Colors**: 
    *   `#ffcc00` (Sakamoto Yellow) - Primary brand.
    *   `#ff3300` (Task Force Red) - Action/High-stakes highlights.
    *   `#050505` (Deep Void) - Background.
    *   `#ffffff` (Clean Paper) - Typography.
*   **Typography**: 
    *   `Bangers`: For impact (Chapter numbers, Big headings).
    *   `Plus Jakarta Sans`: For professional readability (Body, UI).
*   **Motifs**: 
    *   Convenience store receipts (Receipt-style headers).
    *   Neon assassination contracts (Glowing outlines).
    *   Fluid motion (Anime.js stagger animations).

## Technical Standards
*   **Performance**: 100/100 Core Web Vitals.
*   **Media**: Prefer WebP/AVIF. Lazy-load all images except the first two pages.
*   **Interactions**: 
    *   Custom dual-ring cursor (Dot + Outline).
    *   Magnetic buttons.
    *   Scanline overlays for a 'surveillance' feel.
*   **SEO**: Automated JSON-LD Article schema per chapter.

## Build Pipeline
1. `generate_data.js`: Scans `manga/` directory.
2. `generate_seo_articles.js`: Incremental AI content generation.
3. `generate_index.js`: Rebuilds home portal.
4. `generate_chapters.js`: Rebuilds all reader pages.
5. `generate_deployment.js`: Assets (Sitemap, Robots, 404).
