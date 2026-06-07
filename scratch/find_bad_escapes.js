const fs = require('fs');
const content = fs.readFileSync('article_cache.json', 'utf8');
const regex = /\\(.)/g;
let match;
while ((match = regex.exec(content)) !== null) {
    const char = match[1];
    if (!['"', '\\', '/', 'b', 'f', 'n', 'r', 't', 'u'].includes(char)) {
        console.log(`Potential bad escape at position ${match.index}: \\${char}`);
        console.log('Context:', content.substring(match.index - 20, match.index + 20));
    }
}
