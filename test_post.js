async function testPost() {
    console.log('Testing POST /index.php with estado=3 (Adjudicadas)...');
    try {
        const formData = new URLSearchParams();
        formData.append('estado', '3'); // ID 3 is ADJUDICADAS in obj.estados
        formData.append('tipo', '');
        formData.append('ministerio', '');
        formData.append('xfechacompra', '');

        const res = await fetch('https://licitaciones.sanjuan.gob.ar/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            body: formData.toString()
        });

        console.log('Status:', res.status);
        const html = await res.text();
        console.log('Response length:', html.length);
        
        // Find var obj in returned HTML
        const startMatch = html.match(/var obj\s*=\s*/);
        if (startMatch) {
            const startIndex = startMatch.index + startMatch[0].length;
            const endMatch = html.slice(startIndex).match(/;\s*(?:Parsley|\$\(|window|var)/);
            if (endMatch) {
                const jsonStr = html.slice(startIndex, startIndex + endMatch.index).trim();
                const data = JSON.parse(jsonStr);
                console.log('Resulting licitaciones count:', data.licitaciones?.res?.length);
                if (data.licitaciones?.res?.length > 0) {
                    console.log('First 3 items:');
                    console.log(JSON.stringify(data.licitaciones.res.slice(0, 3), null, 2));
                    
                    const withAdjudicacionField = data.licitaciones.res.filter(x => x.ADJUDICACION || x.F_ADJUDICACION);
                    console.log('Items with ADJUDICACION or F_ADJUDICACION:', withAdjudicacionField.length);
                }
            } else {
                console.log('Could not find end of obj');
            }
        } else {
            console.log('var obj not found in POST response');
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

testPost();
