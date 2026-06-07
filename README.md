# Sakamoto Grocery Store Portal

> **Vibe Focus:** Convenience Store Chic / Action Comedy style  
> **Tech Stack:** Node.js Custom Static Generator + sharp + fs-extra

Welcome to the **Sakamoto Grocery Store Portal** web portal. This is a high-performance, immersive manga reader site designed specifically for fans of the series. The project leverages modern web optimization techniques to deliver a fast, localized, and beautiful experience.

---

## 🌟 Key Features

- Convenience store receipt style chapter index layouts.
- High performance image optimization converting pages to WebP using sharp.
- Automated static page compilation with pre-baked SEO tags.
- Compliance legal layouts matching the store policy theme.

---

## 🛠️ Getting Started

### 📋 Prerequisites
- **For Web Server:** Python 3.10+ (to serve static files or run generators) or Node.js 18+ (if package dependencies are needed).
- **GitHub CLI (`gh`)**: Recommended for pushing updates.

### 🔑 API Key Configuration
This project includes automated content generation and SEO optimization scripts that use the **Zhipu AI / BigModel API**. 

To utilize these scripts:
1. Copy the `.env.example` file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your API key:
   ```env
   BIGMODEL_API_KEY=your_actual_api_key_here
   ```
   *Note: If you have multiple keys, you can specify them as a comma-separated list.*

---

## 🚀 Local Development

Install builder dependencies and compile the static site:
```bash
npm install
npm run build
```

Then open your browser and navigate to the local server URL (usually `http://localhost:8000` or `http://localhost:5173`).

---

## 🤖 Content Generation & Automation
The project is equipped with local AI-powered generation scripts to build and update the site content dynamically.

You can run these scripts to regenerate and optimize the portal content:

- **`npm run build`**: Orchestrates build:data, build:seo, build:index, and build:chapters to output the static site to the out/ directory.


---

## 📦 Production Deployment

Serve the compiled static output located in the `out/` folder using a server:
```bash
cd out && python -m http.server 8000
```

- **Ignored Assets:** Large `manga/` chapter image directories and local archives are excluded from this repository (configured in `.gitignore`) for performance and size constraints. Ensure image files are uploaded directly to your hosting server's path structure.
- **SEO Ready:** Sitemap (`sitemap.xml`) and `.htaccess` file rules are fully configured to rewrite paths and provide Google-friendly crawler access.
