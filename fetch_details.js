const fs = require('fs');

async function fetchDetails() {
    const licitaciones = JSON.parse(fs.readFileSync('all_licitaciones_clean.json', 'utf-8'));
    
    // Select top 15 by budget + all 4 with Adjudicadas + 10 recent
    const targetIds = Array.from(new Set([
        ...licitaciones.filter(x => x.estado === 'Adjudicadas').map(x => x.id),
        ...licitaciones.filter(x => x.adjudicacionEstado).map(x => x.id),
        ...[...licitaciones].sort((a,b) => b.presupuesto - a.presupuesto).slice(0, 15).map(x => x.id),
        ...[...licitaciones].filter(x => x.fechaPublicacion?.startsWith('2026')).slice(0, 10).map(x => x.id)
    ]));

    console.log(`Fetching details for ${targetIds.length} target licitaciones...`);
    const detailsMap = {};

    for (const id of targetIds) {
        try {
            console.log(`Fetching ID ${id}...`);
            const res = await fetch(`https://licitaciones.sanjuan.gob.ar/index.php/detalle?id=${id}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (res.ok) {
                const html = await res.text();
                // extract file links
                const files = [];
                const links = html.match(/<a[^>]*href="[^"]*dl\.php[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || [];
                links.forEach(l => {
                    const hrefM = l.match(/href="([^"]*)"/);
                    if (hrefM) {
                        try {
                            const u = new URL(hrefM[1]);
                            const f = u.searchParams.get('f');
                            const fn = u.searchParams.get('fn');
                            const decodedName = fn ? Buffer.from(fn, 'base64').toString('utf-8') : 'archivo.pdf';
                            files.push({
                                nombre: decodedName,
                                url: hrefM[1],
                                fileId: f ? Buffer.from(f, 'base64').toString('utf-8') : ''
                            });
                        } catch (e) {}
                    }
                });

                // Extract table fields
                const rowObj = {};
                const trs = html.match(/<tr>[\s\S]*?<\/tr>/gi) || [];
                trs.forEach(tr => {
                    const text = tr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                    if (text.includes('Fecha de Adjudicación:')) {
                        const m = text.match(/Fecha de Adjudicación:\s*([0-9/]+)/);
                        if (m) rowObj.fechaAdjudicacion = m[1];
                    }
                    if (text.includes('Adjudicación:')) {
                        const m = text.match(/Adjudicación:\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)/);
                        if (m) rowObj.adjudicacion = m[1];
                    }
                });

                detailsMap[id] = {
                    files,
                    ...rowObj
                };
            }
            // small delay
            await new Promise(r => setTimeout(r, 200));
        } catch (e) {
            console.error(`Failed ID ${id}:`, e.message);
        }
    }

    fs.writeFileSync('details_extracted.json', JSON.stringify(detailsMap, null, 2));
    console.log('Saved details for', Object.keys(detailsMap).length, 'licitaciones.');
}

fetchDetails();
