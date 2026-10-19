const fs = require('fs');

const details = JSON.parse(fs.readFileSync('details_extracted.json', 'utf-8'));
console.log('Total extracted details:', Object.keys(details).length);

Object.entries(details).forEach(([id, d]) => {
    console.log(`\n--- ID: ${id} | FechaAdj: ${d.fechaAdjudicacion || 'N/A'} | Adj: ${d.adjudicacion || 'N/A'} ---`);
    console.log(`Files count: ${d.files.length}`);
    d.files.forEach(f => {
        console.log(`  - [${f.fileId}] ${f.nombre}`);
    });
});
