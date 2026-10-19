const fs = require('fs');

const buf = fs.readFileSync('sample_res_adj.pdf');
console.log('Extracting JPEG images from sample_res_adj.pdf...');

// In JPEG, files start with 0xFFD8FFE0 or 0xFFD8FFE1 or 0xFFD8DB
let pos = 0;
let imgCount = 0;

while (pos < buf.length) {
    const start = buf.indexOf(Buffer.from([0xFF, 0xD8]), pos);
    if (start === -1) break;
    const end = buf.indexOf(Buffer.from([0xFF, 0xD9]), start + 2);
    if (end === -1) break;

    const imgBuf = buf.subarray(start, end + 2);
    if (imgBuf.length > 50000) { // real document page scan
        imgCount++;
        const filename = `scanned_page_${imgCount}.jpg`;
        fs.writeFileSync(filename, imgBuf);
        console.log(`Saved ${filename} (${imgBuf.length} bytes)`);
    }
    pos = end + 2;
}
