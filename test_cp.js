async function testComprasPublicas() {
    try {
        console.log('Fetching https://compraspublicas.sanjuan.gob.ar...');
        const res = await fetch('https://compraspublicas.sanjuan.gob.ar', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Length:', text.length);
        console.log('Snippet:', text.slice(0, 1500));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testComprasPublicas();
