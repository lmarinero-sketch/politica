const fs = require('fs');

const buf = fs.readFileSync('sample_res_adj.pdf');
console.log('PDF size:', buf.length);

// Let's search for readable text strings in the PDF
const str = buf.toString('latin1');
// Check if it's text-based or scanned
const textMatches = str.match(/\(([^()]{4,})\)/g) || [];
console.log('Parenthesized strings count:', textMatches.length);

// Also look for FlateDecode streams or uncompressed text
const streamMatches = str.match(/stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g) || [];
console.log('Streams count:', streamMatches.length);

// Let's look for standard patterns: "ARTICULO", "ADJUDICAR", "EMPRESA", "S.A.", "S.R.L.", "CUIT", "$"
const keywords = ['ARTICULO', 'ADJUDICAR', 'EMPRESA', 'CUIT', 'PESOS', 'RENGLON'];
keywords.forEach(kw => {
    const idx = str.indexOf(kw);
    console.log(`Keyword ${kw}:`, idx !== -1 ? `found at ${idx}` : 'not found');
});
