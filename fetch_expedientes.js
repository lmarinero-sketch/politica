const fs = require('fs');

const licitaciones = JSON.parse(fs.readFileSync('all_licitaciones_clean.json', 'utf-8'));
const topIds = [7814, 7917, 7899, 7911, 7782, 7898, 6855, 6470, 7817, 7671, 7366, 7650, 7857];

async function fetchExpedientes() {
    const expedienteMap = {};
    for (const id of topIds) {
        const item = licitaciones.find(x => x.id === id);
        if (!item || !item.expediente || item.expediente === 'S/E') continue;

        // format is like 600-003645-2026-EXP-GC or 506-002019-2026-EXP-GC
        const parts = item.expediente.split('-');
        if (parts.length >= 3) {
            const prefijo = parts[0].trim();
            const numero = parts[1].replace(/^0+/, '').trim(); // strip leading zeros or keep
            const anio = parts[2].trim();
            const tipo = 'EXP';

            const url = `https://sanjuan.gob.ar/ol/?or=2B331CC34D344C31875DED5E05060FAA&Prefijo=${prefijo}&Numero=${numero}&Anio=${anio}&Tipo=${tipo}&Movimientos=20`;
            console.log(`Fetching expediente for ID ${id} (${item.expediente})...`);
            try {
                const res = await fetch(url);
                const json = await res.json();
                if (json.res && json.res.length > 0) {
                    expedienteMap[id] = json.res;
                    console.log(`  -> Got ${json.res.length} movements`);
                }
            } catch (e) {
                console.log(`  -> Error:`, e.message);
            }
            await new Promise(r => setTimeout(r, 200));
        }
    }

    fs.writeFileSync('expedientes_extracted.json', JSON.stringify(expedienteMap, null, 2));
    console.log('Saved expedientes map with', Object.keys(expedienteMap).length, 'entries.');
}

fetchExpedientes();
