const fs = require('fs');

['detail_7782.html', 'detail_7814.html'].forEach(filename => {
    if (!fs.existsSync(filename)) return;
    const content = fs.readFileSync(filename, 'utf-8');
    console.log(`\n================= ${filename} =================`);
    
    // Extract table rows or headings
    const h5 = content.match(/<h5>([\s\S]*?)<\/h5>/gi) || [];
    console.log('Headers (h5):', h5.map(h => h.replace(/<[^>]+>/g, '').trim()));

    // Look for keywords like Adjudicaci, Oferente, Proveedor, Items, Renglones, Archivos, Pliego
    const keywords = ['adjudic', 'oferente', 'proveedor', 'empresa', 'monto', 'renglon', 'item', 'archivo', 'descargar', 'ganador'];
    keywords.forEach(kw => {
        const regex = new RegExp(`[^\n<]{0,50}${kw}[^\n<]{0,50}`, 'gi');
        const matches = content.match(regex) || [];
        console.log(`Keyword "${kw}": ${matches.length} occurrences (sample: ${JSON.stringify(matches.slice(0, 3))})`);
    });

    // Check all tables in the detail
    const tables = content.match(/<table[\s\S]*?<\/table>/gi) || [];
    console.log(`Found ${tables.length} tables`);
    tables.forEach((t, i) => {
        console.log(`--- Table ${i + 1} preview ---`);
        // Strip tags and print first 300 chars
        const clean = t.replace(/<tr[^>]*>/gi, '\nTR: ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400);
        console.log(clean);
    });
});
