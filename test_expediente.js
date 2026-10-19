async function testExpediente() {
    // URL: https://sanjuan.gob.ar/ol/?or=2B331CC34D344C31875DED5E05060FAA&Prefijo=600&Numero=3645&Anio=2026&Tipo=EXP&Movimientos=1
    const testCases = [
        { Prefijo: '600', Numero: '3645', Anio: '2026', Tipo: 'EXP', Movimientos: '1' },
        { Prefijo: '600', Numero: '003645', Anio: '2026', Tipo: 'EXP-GC', Movimientos: '1' },
        { Prefijo: '506', Numero: '2019', Anio: '2026', Tipo: 'EXP', Movimientos: '1' }
    ];

    for (const tc of testCases) {
        const url = `https://sanjuan.gob.ar/ol/?or=2B331CC34D344C31875DED5E05060FAA&Prefijo=${tc.Prefijo}&Numero=${tc.Numero}&Anio=${tc.Anio}&Tipo=${tc.Tipo}&Movimientos=${tc.Movimientos}`;
        console.log('Testing url:', url);
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                }
            });
            console.log('Status:', res.status, res.headers.get('content-type'));
            const text = await res.text();
            console.log('Snippet (length ' + text.length + '):', text.slice(0, 500));
        } catch (e) {
            console.error('Error:', e.message);
        }
    }
}

testExpediente();
