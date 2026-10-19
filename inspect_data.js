const fs = require('fs');

const html = fs.readFileSync('licitaciones_sanjuan.html', 'utf-8');
const startMatch = html.match(/var obj\s*=\s*/);
const startIndex = startMatch.index + startMatch[0].length;

const targetPos = startIndex + 1946054;
console.log('Context around targetPos:');
console.log(html.slice(targetPos - 50, targetPos + 50));

// Find exact end by slicing to targetPos
const jsonStr = html.slice(startIndex, targetPos);
try {
    const data = JSON.parse(jsonStr);
    console.log('\nSUCCESSFULLY PARSED DATA!');
    console.log('Keys:', Object.keys(data));
    console.log('Licitaciones count:', data.licitaciones?.res?.length);
    
    const byEstado = {};
    let nonNullAdjudicacion = 0;
    let adjudicadaCount = 0;
    
    data.licitaciones.res.forEach(item => {
        const est = item.ESTADOS;
        byEstado[est] = (byEstado[est] || 0) + 1;
        if (item.ADJUDICACION !== null && item.ADJUDICACION !== undefined && item.ADJUDICACION !== "") {
            nonNullAdjudicacion++;
        }
        if (est && est.toLowerCase().includes('adjudic')) {
            adjudicadaCount++;
        }
    });
    console.log('Estados breakdown:', byEstado);
    console.log('nonNullAdjudicacion:', nonNullAdjudicacion);
    console.log('adjudicadaCount:', adjudicadaCount);

    // Save parsed data to a clean json file for analysis
    fs.writeFileSync('sample_licitaciones.json', JSON.stringify(data.licitaciones.res.slice(0, 50), null, 2));
    console.log('Wrote 50 sample licitaciones to sample_licitaciones.json');
} catch (e) {
    console.error('Parse error:', e.message);
}
