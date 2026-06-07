const fs = require('fs');
let content = fs.readFileSync('article_cache.json', 'utf8');

// Find the first occurrence of "}\n" or just the first closing brace that makes sense.
// Since it's a JSON object, it should end with }.
// But some values might end with }.
// The root object ends with }.
// Looking at line 205, it says " Unexpected non-whitespace character after JSON at position 562968 (line 205 column 2)"
// So at line 205, col 2, there is something. Line 205, col 1 is '}'.

const validJson = content.substring(0, 562967); // Truncate at position 562967 (before the '.')
fs.writeFileSync('article_cache.json', validJson);
console.log('Truncated article_cache.json at position 562967');
