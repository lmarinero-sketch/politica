async function testExpedienteAll() {
    for (const mov of ['0', '1', '2', 'todos']) {
        const url = `https://sanjuan.gob.ar/ol/?or=2B331CC34D344C31875DED5E05060FAA&Prefijo=600&Numero=3645&Anio=2026&Tipo=EXP&Movimientos=${mov}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(`Movimientos=${mov} count:`, data.res?.length, JSON.stringify(data.res));
    }
}
testExpedienteAll();
