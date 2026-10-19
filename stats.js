const fs = require('fs');

const raw = fs.readFileSync('licitaciones_sanjuan.html', 'utf-8');
const startMatch = raw.match(/var obj\s*=\s*/);
const startIndex = startMatch.index + startMatch[0].length;
const targetPos = startIndex + 1946054;
const data = JSON.parse(raw.slice(startIndex, targetPos));

console.log('Total licitaciones:', data.licitaciones.res.length);

// Summary by year
const byYear = {};
const byOrganismo = {};
const byTipo = {};
let totalPresupuesto = 0;
let validPresupuestoCount = 0;

data.licitaciones.res.forEach(item => {
    // F_PUBLICACION is in format /Date(timestamp)/
    const match = item.F_PUBLICACION?.match(/\/Date\((\d+)\)\//);
    const date = match ? new Date(parseInt(match[1])) : null;
    const year = date ? date.getFullYear() : 'Desconocido';
    byYear[year] = (byYear[year] || 0) + 1;

    const org = item.INSTITUCION || 'Otro';
    byOrganismo[org] = (byOrganismo[org] || 0) + 1;

    const tipo = item.TIPO || 'Otro';
    byTipo[tipo] = (byTipo[tipo] || 0) + 1;

    if (item.PRESUPUESTO && item.PRESUPUESTO > 0) {
        totalPresupuesto += item.PRESUPUESTO;
        validPresupuestoCount++;
    }
});

console.log('\n--- Licitaciones por Año ---');
console.log(byYear);

console.log('\n--- Top 10 Organismos ---');
console.log(Object.entries(byOrganismo).sort((a,b) => b[1] - a[1]).slice(0, 10));

console.log('\n--- Por Tipo de Contratación ---');
console.log(byTipo);

console.log(`\nPresupuesto Total acumulado: $${totalPresupuesto.toLocaleString('es-AR')} ARS (en ${validPresupuestoCount} licitaciones con presupuesto registrado)`);
