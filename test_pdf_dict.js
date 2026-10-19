const fs = require('fs');

const buf = fs.readFileSync('sample_res_adj.pdf');
const str = buf.toString('latin1');
const matches = str.match(/<<[\s\S]*?>>\s*stream/g) || [];
console.log('Stream dicts:');
matches.forEach((m, i) => console.log(`Dict ${i + 1}:`, m.replace(/\s+/g, ' ').slice(0, 150)));
