const fs = require('fs');
const buf = fs.readFileSync('article_cache.json');
const pos = 67694;
console.log('Context:', buf.slice(Math.max(0, pos - 50), Math.min(buf.length, pos + 50)).toString('utf8'));
for (let i = -5; i <= 5; i++) {
    console.log(`Byte at ${pos + i}:`, buf[pos + i], String.fromCharCode(buf[pos + i]));
}
