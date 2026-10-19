require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  console.log('Probando cliente Supabase con anon key (modo frontend)...');
  const supabase = createClient(url, anonKey);

  // 1. Probar lectura de licitaciones
  const { data: licitaciones, error: errLic, count } = await supabase
    .from('gob_licitaciones')
    .select('id, num_pub, expediente, objeto, organismo, presupuesto, tipo', { count: 'exact' })
    .limit(3);

  if (errLic) {
    console.error('Error al leer licitaciones:', errLic);
  } else {
    console.log(`✓ Licitaciones leídas exitosamente. Total en tabla: ${count}`);
    console.log('Muestra de 3 filas:');
    console.table(licitaciones);
  }

  // 2. Probar lectura de empresas
  const { data: empresas, error: errEmp } = await supabase
    .from('gob_empresas')
    .select('id, nombre, cuit, total_adjudicado, licitaciones_ganadas_count')
    .order('total_adjudicado', { ascending: false })
    .limit(3);

  if (errEmp) {
    console.error('Error al leer empresas:', errEmp);
  } else {
    console.log('\n✓ Empresas leídas exitosamente:');
    console.table(empresas);
  }

  // 3. Probar lectura de resumen
  const { data: resumen, error: errRes } = await supabase
    .from('gob_observatorio_resumen')
    .select('id, updated_at')
    .limit(1);

  if (errRes) {
    console.error('Error al leer resumen:', errRes);
  } else {
    console.log('\n✓ Resumen del observatorio verificado:', resumen);
  }
}

testSupabaseClient().catch(console.error);
