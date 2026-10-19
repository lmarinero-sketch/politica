const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('sample_res_adj.pdf');

// Find all stream / endstream offsets
let pos = 0;
let streamCount = 0;
while (true) {
    const sIdx = buf.indexOf(Buffer.from('stream'), pos);
    if (sIdx === -1) break;
    // skip \r?\n after stream
    let dataStart = sIdx + 6;
    if (buf[dataStart] === 0x0d && buf[dataStart + 1] === 0x0a) dataStart += 2;
    else if (buf[dataStart] === 0x0a) dataStart += 1;

    const eIdx = buf.indexOf(Buffer.from('endstream'), dataStart);
    if (eIdx === -1) break;

    const chunk = buf.subarray(dataStart, eIdx);
    streamCount++;
    try {
        const inflated = zlib.inflateSync(chunk);
        const text = inflated.toString('utf-8');
        console.log(`Stream ${streamCount} inflated (${chunk.length} -> ${inflated.length}):`);
        // Check for words
        const words = ['ARTICULO', 'ADJUDIC', 'EMPRESA', 'CUIT', 'PESOS', 'RENGLON', '$'];
        words.forEach(w => {
            if (text.toUpperCase().includes(w)) {
                console.log(`  Found keyword: ${w}`);
            }
        });
        console.log('  Preview:', text.replace(/[^a-zA-Z0-9 .,$:\-/]/g, ' ').slice(0, 300));
    } catch (e) {
        // Might be an image or other filter
        console.log(`Stream ${streamCount} could not inflate (likely image / JPEG / CCITT):`, chunk.length, 'bytes');
    }
    pos = eIdx + 9;
}
