const fs = require('fs');
const path = require('path');

const MANGA_DIR = path.join(__dirname, '../manga/Sakamoto Days');
const OUTPUT_FILE = path.join(__dirname, '../src/chapters_data.json');

// Ensure src directory exists
const srcDir = path.join(__dirname, '../src');
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

function getChapters() {
  const folders = fs.readdirSync(MANGA_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const chapters = folders.map(folder => {
    // Extract number from Chapter-XXX or Chapter-XXX-Title
    const match = folder.match(/Chapter-(\d+)/i);
    const id = match ? parseInt(match[1]) : 0;
    
    // Check for optimized images first
    const optPath = path.join(__dirname, '../public/assets/chapters', folder);
    const chapterPath = path.join(MANGA_DIR, folder);
    
    let images = [];
    if (fs.existsSync(optPath)) {
      images = fs.readdirSync(optPath)
        .filter(file => /\.avif$/i.test(file))
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+/) || 0);
          const numB = parseInt(b.match(/\d+/) || 0);
          return numA - numB;
        })
        .map(img => `public/assets/chapters/${folder}/${img}`);
    } 
    
    // If no optimized images, use original
    if (images.length === 0) {
      images = fs.readdirSync(chapterPath)
        .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+/) || 0);
          const numB = parseInt(b.match(/\d+/) || 0);
          return numA - numB;
        })
        .map(img => `manga/Sakamoto Days/${folder}/${img}`);
    }

    return {
      id,
      title: folder.replace(/-/g, ' '),
      folder,
      images,
      thumbnail: images[0] || ''
    };
  });

  // Sort by ID descending
  return chapters.sort((a, b) => b.id - a.id);
}

const data = getChapters();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
console.log(`✓ Generated data for ${data.length} chapters.`);
