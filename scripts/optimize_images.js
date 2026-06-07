const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../manga/Sakamoto Days');
const DEST_DIR = path.join(__dirname, '../public/assets/chapters');

async function optimizeImages() {
  await fs.ensureDir(DEST_DIR);

  const chapters = await fs.readdir(SOURCE_DIR);
  
  for (const chapter of chapters) {
    const chapterSrc = path.join(SOURCE_DIR, chapter);
    const chapterDest = path.join(DEST_DIR, chapter);
    
    const stats = await fs.lstat(chapterSrc);
    if (stats.isDirectory()) {
      await fs.ensureDir(chapterDest);
      
      const images = (await fs.readdir(chapterSrc))
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
        
      console.log(`Optimizing ${chapter} (${images.length} images)...`);
      
      for (const img of images) {
        const ext = path.extname(img).toLowerCase();
        const imgName = path.basename(img, ext);
        const destPath = path.join(chapterDest, `${imgName}.avif`);
        
        if (!await fs.pathExists(destPath)) {
          try {
            await sharp(path.join(chapterSrc, img))
              .avif({ quality: 60, speed: 8 })
              .toFile(destPath);
          } catch (err) {
            console.error(`Error processing ${img}:`, err);
          }
        }
      }
    }
  }
}

optimizeImages()
  .then(() => console.log('✓ Optimization complete!'))
  .catch(err => console.error('FAILED to optimize images:', err));
