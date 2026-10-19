const fs = require('fs');

async function testDetalle() {
    const raw = fs.readFileSync('licitaciones_sanjuan.html', 'utf-8');
    const startMatch = raw.match(/var obj\s*=\s*/);
    const startIndex = startMatch.index + startMatch[0].length;
    const targetPos = startIndex + 1946054;
    const data = JSON.parse(raw.slice(startIndex, targetPos));
    
    // Find some IDs: one with ADJUDICACION, one standard, one recent, etc.
    const withAdj = data.licitaciones.res.filter(x => x.ADJUDICACION);
    console.log('Items with ADJUDICACION:', withAdj.length);
    withAdj.forEach(x => console.log('ID:', x.ID_PUBLICACION, 'Adjudicacion:', x.ADJUDICACION, 'Estado:', x.ESTADOS));

    const testIds = [
        ...withAdj.map(x => x.ID_PUBLICACION),
        data.licitaciones.res[0].ID_PUBLICACION,
        data.licitaciones.res[1].ID_PUBLICACION,
        data.licitaciones.res[2].ID_PUBLICACION
    ].slice(0, 5);

    console.log('\nTesting /index.php/detalle for IDs:', testIds);

    for (const id of testIds) {
        console.log(`\nFetching detail for ID ${id}...`);
        try {
            const res = await fetch(`https://licitaciones.sanjuan.gob.ar/index.php/detalle?id=${id}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            console.log('Status:', res.status, res.headers.get('content-type'));
            const text = await res.text();
            console.log('Detail response preview (length: ' + text.length + '):');
            console.log(text.slice(0, 1500));
            fs.writeFileSync(`detail_${id}.html`, text, 'utf-8');
        } catch (e) {
            console.error('Failed for id', id, e.message);
        }
    }
}

testDetalle();
