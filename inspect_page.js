const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\lucas\\.gemini\\antigravity-ide\\brain\\d259da8e-1791-4361-b806-e0f16d5226aa\\.system_generated\\steps\\11\\content.md', 'utf-8');
console.log('Total content length in chars:', content.length);
console.log('Last 1000 chars:');
console.log(content.slice(-1000));
