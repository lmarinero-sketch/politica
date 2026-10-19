const fs = require('fs');

const licitaciones = JSON.parse(fs.readFileSync('all_licitaciones_clean.json', 'utf-8'));

// Sort by presupuesto descending
const topByBudget = [...licitaciones].sort((a,b) => b.presupuesto - a.presupuesto).slice(0, 30);
console.log('Top 10 by budget:');
topByBudget.slice(0, 10).forEach(x => {
    console.log(`ID ${x.id}: $${x.presupuesto.toLocaleString('es-AR')} | ${x.tipo} | ${x.organismo} | ${x.objeto.slice(0, 70)}...`);
});

// Also check the most recent licitaciones
const recent = [...licitaciones].filter(x => x.fechaPublicacion && x.fechaPublicacion.startsWith('2026')).slice(0, 20);
console.log('\nRecent in 2026 count:', recent.length);
