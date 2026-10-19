async function inspectVueApp() {
    console.log('Fetching app.6216640d.js...');
    try {
        const res = await fetch('https://compraspublicas.sanjuan.gob.ar/js/app.6216640d.js');
        const js = await res.text();
        console.log('JS length:', js.length);

        // Find API endpoints, URLs, axios calls
        const urls = js.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s"']*)?/g) || [];
        console.log('Absolute URLs in bundle:', Array.from(new Set(urls)));

        const apiPaths = js.match(/["'](\/(?:api|v[0-9]|licitaciones|proveedores)[^"']*)["']/g) || [];
        console.log('Relative API paths in bundle:', Array.from(new Set(apiPaths)).slice(0, 20));

        // Look for keywords
        const keywords = ['baseURL', 'axios.create', 'process.env'];
        keywords.forEach(kw => {
            const idx = js.indexOf(kw);
            if (idx !== -1) {
                console.log(`Found ${kw}:`, js.slice(Math.max(0, idx - 50), Math.min(js.length, idx + 100)));
            }
        });
    } catch (e) {
        console.error('Error:', e.message);
    }
}

inspectVueApp();
