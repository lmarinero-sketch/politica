const fs = require('fs');

const raw = fs.readFileSync('licitaciones_sanjuan.html', 'utf-8');
const startMatch = raw.match(/var obj\s*=\s*/);
const startIndex = startMatch.index + startMatch[0].length;
const targetPos = startIndex + 1946054;
const data = JSON.parse(raw.slice(startIndex, targetPos));

console.log('Total items in raw dataset:', data.licitaciones.res.length);

// Extract all licitaciones and normalize them
const licitaciones = data.licitaciones.res.map(item => {
    let pubDate = null;
    let aperDate = null;
    let adjDate = null;

    if (item.F_PUBLICACION) {
        const m = item.F_PUBLICACION.match(/\/Date\((\d+)\)\//);
        if (m) pubDate = new Date(parseInt(m[1])).toISOString().split('T')[0];
    }
    if (item.F_APERTURA) {
        const m = item.F_APERTURA.match(/\/Date\((\d+)\)\//);
        if (m) aperDate = new Date(parseInt(m[1])).toISOString().split('T')[0];
    }
    if (item.F_ADJUDICACION) {
        const m = item.F_ADJUDICACION.match(/\/Date\((\d+)\)\//);
        if (m) adjDate = new Date(parseInt(m[1])).toISOString().split('T')[0];
    }

    // Categorize
    let rubro = 'Otros';
    const objLower = (item.OBJETO || '').toLowerCase();
    const instLower = (item.INSTITUCION || '').toLowerCase();

    if (instLower.includes('salud') || instLower.includes('hospital') || objLower.includes('medicament') || objLower.includes('quirurg') || objLower.includes('sanitar') || objLower.includes('farmacia')) {
        rubro = 'Salud y Farmacia';
    } else if (instLower.includes('infraestructura') || instLower.includes('vialidad') || instLower.includes('hidr') || objLower.includes('obra') || objLower.includes('construc') || objLower.includes('mantenimiento') || objLower.includes('reparac')) {
        rubro = 'Obras e Infraestructura';
    } else if (instLower.includes('seguridad') || instLower.includes('polic') || objLower.includes('seguridad') || objLower.includes('vigilancia') || objLower.includes('uniformes') || objLower.includes('arma')) {
        rubro = 'Seguridad y Orden';
    } else if (objLower.includes('servidor') || objLower.includes('software') || objLower.includes('computad') || objLower.includes('digitaliz') || objLower.includes('tecnolog') || objLower.includes('sistema')) {
        rubro = 'Tecnología y Sistemas';
    } else if (objLower.includes('alimento') || objLower.includes('vianda') || objLower.includes('fruta') || objLower.includes('leche') || instLower.includes('familia')) {
        rubro = 'Desarrollo Social y Alimentos';
    } else if (objLower.includes('vehicul') || objLower.includes('camioneta') || objLower.includes('combustible') || objLower.includes('neumatic') || objLower.includes('cubiertas')) {
        rubro = 'Vehículos y Transporte';
    }

    return {
        id: item.ID_PUBLICACION,
        numPub: item.N_PUB || `${item.ID_PUBLICACION}`,
        expediente: item.EXPEDIENTE || 'S/E',
        objeto: item.OBJETO?.replace(/\r\n/g, ' ').replace(/\s+/g, ' ').trim() || 'Sin objeto especificado',
        organismo: item.INSTITUCION || 'Gobierno de San Juan',
        dependencia: item.ORGANICA || '',
        tipo: item.TIPO || 'Licitación',
        estado: item.ESTADOS || 'Proceso de Adjudicación',
        adjudicacionEstado: item.ADJUDICACION || null,
        presupuesto: item.PRESUPUESTO || 0,
        costoPliego: item.COSTOPLIEGO || 0,
        fechaPublicacion: pubDate,
        fechaApertura: aperDate,
        fechaAdjudicacion: adjDate,
        horaApertura: item.H_APERTURA || '',
        rubro: rubro,
        email: item.MAIL || '',
        telefono: item.TELEFONO || '',
        domicilio: item.DOMI_APERTURA || item.INFORMACION || '',
        diasPublicacion: item.DIASPUB || 1
    };
});

console.log('Processed licitaciones count:', licitaciones.length);
console.log('Sample item:', JSON.stringify(licitaciones[0], null, 2));

fs.writeFileSync('all_licitaciones_clean.json', JSON.stringify(licitaciones, null, 2));
console.log('Saved to all_licitaciones_clean.json');
