const fs = require('fs');

const content = fs.readFileSync('detail_7814.html', 'utf-8');
console.log('=== All Table Rows in detail_7814.html ===');
const trs = content.match(/<tr[\s\S]*?<\/tr>/gi) || [];
trs.forEach((tr, i) => {
    console.log(`Row ${i + 1}:`, tr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
});

console.log('\n=== Archivos in detail_7814.html ===');
const links = content.match(/<a[^>]*href="[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || [];
links.forEach(l => {
    console.log(l.replace(/\s+/g, ' ').trim());
});
