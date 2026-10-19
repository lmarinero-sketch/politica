async function testProveedorPortal() {
    try {
        console.log('Testing serviciosweb.sanjuan.gob.ar/certificado_proveedor.php...');
        const res = await fetch('https://serviciosweb.sanjuan.gob.ar/certificado_proveedor.php');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Length:', text.length);
        console.log('Snippet:', text.slice(0, 1000));
    } catch (e) {
        console.error('Error:', e.message);
    }
}
testProveedorPortal();
