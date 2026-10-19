const fs = require('fs');

['detail_7899.html', 'detail_7911.html', 'detail_7917.html'].forEach(filename => {
    if (!fs.existsSync(filename)) return;
    const content = fs.readFileSync(filename, 'utf-8');
    console.log(`\n================= ${filename} =================`);
    
    const rows = content.match(/<tr>[\s\S]*?<\/tr>/gi) || [];
    rows.forEach(r => console.log('Row:', r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));

    const links = content.match(/<a[^>]*href="[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || [];
    links.forEach(l => {
        const hrefMatch = l.match(/href="([^"]*)"/);
        const text = l.replace(/<[^>]+>/g, '').trim();
        if (hrefMatch && hrefMatch[1].includes('dl.php')) {
            const url = new URL(hrefMatch[1]);
            const f = url.searchParams.get('f');
            const fn = url.searchParams.get('fn');
            const decodedF = f ? Buffer.from(f, 'base64').toString('utf-8') : '';
            const decodedFn = fn ? Buffer.from(fn, 'base64').toString('utf-8') : '';
            console.log(`File: ${decodedFn} (ID: ${decodedF}) -> ${hrefMatch[1]}`);
        }
    });
});
