const fs = require('fs');

const html = fs.readFileSync('licitaciones_sanjuan.html', 'utf-8');

// Find all occurrences of modal, ajax, detail, urllic, etc.
const scriptStart = html.indexOf('<script>');
const script = html.slice(scriptStart);

// Let's search for tbListado click handlers or modal events
const dtMatches = script.match(/tbListado[\s\S]*?\}\);/g) || [];
console.log('tbListado code snippets:');
dtMatches.forEach(m => console.log(m.slice(0, 1000), '\n---'));

// Also search for any url or ajax call
const ajaxMatches = script.match(/\$\.ajax\(\{[\s\S]*?\}\);/g) || [];
console.log('Ajax calls found:', ajaxMatches.length);
ajaxMatches.forEach((a, i) => console.log(`Ajax ${i}:`, a.slice(0, 500), '\n---'));
