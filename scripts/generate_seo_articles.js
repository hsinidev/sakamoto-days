const fs = require('fs');
const path = require('path');
const https = require('https');

const chaptersData = require('../src/chapters_data.json');
const ollamaApi = require('../ollama_api.json');

const KEYS = ollamaApi.API_KEYS;
let currentKeyIndex = 0;

function getKey() {
  const key = KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % KEYS.length;
  return key;
}

const CACHE_FILE = path.join(__dirname, '../article_cache.json');
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
}

async function generateSeo(chapterId, title) {
  // Try generating with retries
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const prompt = `Write a high-quality, 2-paragraph SEO-optimized article about Sakamoto Days Chapter ${chapterId}. 
Theme: Convenience Store, Action, Retirement, Hard-boiled, Assassin, High-stakes, Fluid-motion.
Format: HTML inside a single <div> element. Use bolding for important terms. Do not use markdown backticks. Include a JSON-LD schema script tag for SEO (schema.org/Article).`;

      const response = await new Promise((resolve, reject) => {
        const payload = JSON.stringify({
          model: ollamaApi.MODEL || "gpt-oss:120b",
          prompt: prompt,
          stream: false
        });

        const url = new URL(ollamaApi.URL);
        const req = https.request({
          hostname: url.hostname,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getKey()}`,
            'Content-Length': Buffer.byteLength(payload)
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
      });

      if (response.statusCode === 200) {
        const json = JSON.parse(response.data);
        let content = json.response || json.text || json.content || "";
        // Cleanup markdown backticks and common AI labels
        content = content.replace(/```html|```/gi, "").trim();
        return content;
      } else {
        console.warn(`[Chapter ${chapterId}] Attempt ${i + 1} API Error: ${response.statusCode} - ${response.data.slice(0,100)}`);
      }
    } catch (e) {
      console.warn(`[Chapter ${chapterId}] Attempt ${i + 1} Fetch Error: ${e.message}`);
    }
    // Wait before retry
    await new Promise(r => setTimeout(r, 1000));
  }
  return null;
}

async function run() {
  console.log(`Starting SEO Article generation for ${chaptersData.length} chapters...`);
  
  // Also do home page
  if (!cache['home']) {
    console.log(`[Home] Generating home page SEO schema and article...`);
    const homeHTML = await generateSeo("All", "Sakamoto Days Manga Portal");
    if (homeHTML) cache['home'] = homeHTML;
  }

  for (const chapter of chaptersData) {
    if (!cache[chapter.id]) {
      console.log(`[Chapter ${chapter.id}] Generating...`);
      const html = await generateSeo(chapter.id, chapter.title);
      if (html) {
        cache[chapter.id] = html;
        // Save incrementally
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      } else {
        console.log(`[Chapter ${chapter.id}] Failed to generate.`);
      }
    } else {
      console.log(`[Chapter ${chapter.id}] Already in cache.`);
    }
  }

  console.log("Finished generating all SEO data.");
}

run();
