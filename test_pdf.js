const fs = require('fs');

async function testPdfDownload() {
    const url = 'https://licitacionesarchivos.sanjuan.gob.ar/dl.php?f=MzMwNjQ5LnBkZg==&fn=UmVzIGRlIEFkaiBOwrAgMTY4MS1ESC0yMDI2IFNlcnZpY2lvIGludGVncmFsIGRlIERpZ2l0YWxpemFjacOzbiBkZSBQcm9jZXNvcyBHT1AucGRm';
    console.log('Downloading PDF from:', url);
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        console.log('Status:', res.status, res.headers.get('content-type'), res.headers.get('content-length'));
        const buffer = await res.arrayBuffer();
        console.log('Downloaded bytes:', buffer.byteLength);
        fs.writeFileSync('sample_res_adj.pdf', Buffer.from(buffer));
        console.log('Saved to sample_res_adj.pdf');
    } catch (e) {
        console.error('Download error:', e.message);
    }
}

testPdfDownload();
