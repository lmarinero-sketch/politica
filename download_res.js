const fs = require('fs');

async function downloadResolutions() {
    const urls = [
        { id: 7899, name: 'monda_jachal.pdf', url: 'https://licitacionesarchivos.sanjuan.gob.ar/dl.php?f=MzMwMDIzLnBkZg==&fn=UmVzIEFkaiBOwrAgMTY1OS1ESC0yMDI2ICBNb25kYSBKw6FjaGFsICgzIMOtdGVtcykucGRm' },
        { id: 7911, name: 'encuesta_opinion.pdf', url: 'https://licitacionesarchivos.sanjuan.gob.ar/dl.php?f=MzMwNDE5LnBkZg==&fn=UkVTT0xVQ0lPTiBOwrAxNjM1MDAwMS5wZGY=' },
        { id: 7814, name: 'fiesta_adulto.pdf', url: 'https://licitacionesarchivos.sanjuan.gob.ar/dl.php?f=MzMxMjQxLnBkZg==&fn=UkVTLjMxMTYtTUZ5REgtMjYgQURKVURJQ0FDSU9OLnBkZg==' }
    ];

    for (const item of urls) {
        console.log(`Downloading ${item.name}...`);
        try {
            const res = await fetch(item.url);
            const buf = Buffer.from(await res.arrayBuffer());
            fs.writeFileSync(item.name, buf);
            console.log(`Saved ${item.name} (${buf.length} bytes)`);

            // Check if there are plain ASCII / UTF-8 strings
            const str = buf.toString('latin1');
            const words = str.match(/[A-ZÁÉÍÓÚÑ]{3,}\s+[A-ZÁÉÍÓÚÑ]{3,}/g) || [];
            console.log(`  Sample words:`, words.slice(0, 5));
        } catch (e) {
            console.error(`Error ${item.name}:`, e.message);
        }
    }
}

downloadResolutions();
