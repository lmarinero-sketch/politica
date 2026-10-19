const fs = require('fs');

async function test() {
    try {
        console.log('Fetching https://licitaciones.sanjuan.gob.ar...');
        const res = await fetch('https://licitaciones.sanjuan.gob.ar', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        console.log('Status:', res.status, res.statusText);
        const html = await res.text();
        console.log('Fetched HTML length:', html.length);
        fs.writeFileSync('licitaciones_sanjuan.html', html, 'utf-8');

        // Look for scripts and interesting logic
        const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/gi);
        console.log('Inline scripts count:', scriptMatch ? scriptMatch.length : 0);

        if (scriptMatch) {
            scriptMatch.forEach((s, idx) => {
                console.log(`\n=== INLINE SCRIPT ${idx + 1} (length: ${s.length}) ===`);
                if (s.includes('var obj=')) {
                    // Extract script after var obj = ...;
                    const afterObj = s.replace(/var obj\s*=\s*\{[\s\S]*?\};\s*/, '/* VAR OBJ WAS HERE */\n');
                    console.log('Content without obj:', afterObj.slice(0, 3000));
                    if (afterObj.length > 3000) {
                        console.log('... tail:', afterObj.slice(-1000));
                    }
                } else {
                    console.log(s.slice(0, 500));
                }
            });
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

test();
