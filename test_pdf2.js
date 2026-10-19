const fs = require('fs');

async function testPdf2() {
    const url = 'https://licitacionesarchivos.sanjuan.gob.ar/dl.php?f=MzMxMjQxLnBkZg==&fn=UkVTLjMxMTYtTUZ5REgtMjYgQURKVURJQ0FDSU9OLnBkZg==';
    console.log('Downloading PDF 2 (Resolución de Adjudicación Fiesta del Adulto Mayor)...');
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    console.log('Size:', buf.length);
    const str = buf.toString('latin1');
    const isCamScanner = str.includes('CamScanner');
    const hasFlate = str.includes('FlateDecode');
    console.log('CamScanner?', isCamScanner, 'FlateDecode?', hasFlate);
    
    // Check if we can find text strings
    const plainText = str.match(/[A-ZÁÉÍÓÚÑ]{4,}\s+[A-ZÁÉÍÓÚÑ]{4,}/g);
    console.log('Sample plain text matches:', plainText?.slice(0, 10));
}

testPdf2();
