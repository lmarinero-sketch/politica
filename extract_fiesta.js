const fs = require('fs');

const buf = fs.readFileSync('fiesta_adulto.pdf');
console.log('Extracting JPEG images from fiesta_adulto.pdf...');

let pos = 0;
let imgCount = 0;

while (pos < buf.length) {
    const start = buf.indexOf(Buffer.from([0xFF, 0xD8]), pos);
    if (start === -1) break;
    const end = buf.indexOf(Buffer.from([0xFF, 0xD9]), start + 2);
    if (end === -1) break;

    const imgBuf = buf.subarray(start, end + 2);
    if (imgBuf.length > 30000) {
        imgCount++;
        const filename = `fiesta_page_${imgCount}.jpg`;
        fs.writeFileSync(filename, imgBuf);
        console.log(`Saved ${filename} (${imgBuf.length} bytes)`);
    }
    pos = end + 2;
}
if (imgCount === 0) {
    console.log('No direct JPEG markers, let us check FlateDecode streams or other compression');
}
