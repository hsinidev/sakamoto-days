const fs = require('fs');
const content = fs.readFileSync('article_cache.json', 'utf8');

// Fix common culprits
const fixed = content
    .replace(/\\v/g, 'v') // Fix \v to v
    .replace(/\\ /g, ' ') // Fix \  to  
    .replace(/\\'/g, "'"); // Fix \' to ' (not valid in JSON but often found)

fs.writeFileSync('article_cache.json', fixed);
console.log('Cleaned article_cache.json');
