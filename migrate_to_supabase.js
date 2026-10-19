require('dotenv').config();
const fs = require('fs');
const path = require('path');

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.SUPABASE_PROJECT_REF;

async function runSql(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`SQL error (${res.status}): ${txt}`);
  }
  return await res.json();
}

function escapeSqlString(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function escapeSqlJson(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
}

function escapeSqlNumber(val) {
  if (val === null || val === undefined || isNaN(val)) return 'NULL';
  return Number(val);
}

function escapeSqlDate(val) {
  if (!val) return 'NULL';
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return `'${val}'::date`;
  return 'NULL';
}

async function migrate() {
  console.log('--- INICIANDO MIGRACIÓN A SUPABASE POSTGRESQL ---');
  console.log(`Proyecto: ${ref}`);

  // 1. Crear tablas si no existen
  console.log('\n[1/4] Creando tablas e índices...');
  const createTablesSql = `
    -- Tabla de Licitaciones y Contrataciones
    CREATE TABLE IF NOT EXISTS public.gob_licitaciones (
      id BIGINT PRIMARY KEY,
      num_pub TEXT,
      expediente TEXT,
      objeto TEXT,
      organismo TEXT,
      dependencia TEXT,
      tipo TEXT,
      estado TEXT,
      adjudicacion_estado TEXT,
      presupuesto NUMERIC(18, 2),
      costo_pliego NUMERIC(18, 2),
      fecha_publicacion DATE,
      fecha_apertura DATE,
      fecha_adjudicacion DATE,
      hora_apertura TEXT,
      rubro TEXT,
      email TEXT,
      telefono TEXT,
      domicilio TEXT,
      dias_publicacion INT,
      archivos JSONB DEFAULT '[]'::jsonb,
      expediente_movimientos JSONB DEFAULT '[]'::jsonb,
      ganador JSONB,
      alertas JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_gob_licitaciones_expediente ON public.gob_licitaciones(expediente);
    CREATE INDEX IF NOT EXISTS idx_gob_licitaciones_organismo ON public.gob_licitaciones(organismo);
    CREATE INDEX IF NOT EXISTS idx_gob_licitaciones_tipo ON public.gob_licitaciones(tipo);
    CREATE INDEX IF NOT EXISTS idx_gob_licitaciones_fecha_pub ON public.gob_licitaciones(fecha_publicacion);
    CREATE INDEX IF NOT EXISTS idx_gob_licitaciones_presupuesto ON public.gob_licitaciones(presupuesto);

    -- Tabla de Empresas Contratistas
    CREATE TABLE IF NOT EXISTS public.gob_empresas (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      cuit TEXT,
      rubro TEXT,
      domicilio TEXT,
      alerta TEXT,
      moneda TEXT DEFAULT 'ARS',
      total_cotizado NUMERIC(18, 2),
      total_adjudicado NUMERIC(18, 2),
      licitaciones_ganadas_count INT DEFAULT 0,
      publicas_count INT DEFAULT 0,
      directas_count INT DEFAULT 0,
      compulsas_count INT DEFAULT 0,
      organismos JSONB DEFAULT '[]'::jsonb,
      ultimas_licitaciones JSONB DEFAULT '[]'::jsonb,
      evolucion_anual JSONB DEFAULT '[]'::jsonb,
      desglose_modalidad JSONB DEFAULT '[]'::jsonb,
      desglose_organismos JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_gob_empresas_cuit ON public.gob_empresas(cuit);
    CREATE INDEX IF NOT EXISTS idx_gob_empresas_total_adj ON public.gob_empresas(total_adjudicado);

    -- Tabla de Estadísticas Globales del Observatorio
    CREATE TABLE IF NOT EXISTS public.gob_observatorio_resumen (
      id TEXT PRIMARY KEY,
      resumen JSONB,
      top_organismos JSONB,
      por_tipo JSONB,
      por_year JSONB,
      por_rubro JSONB,
      top_empresas_por_monto JSONB,
      top_empresas_por_cantidad JSONB,
      rubros_empresas JSONB,
      adjudicatarios_destacados JSONB,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Permisos RLS y Lectura Pública
    ALTER TABLE public.gob_licitaciones ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.gob_empresas ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.gob_observatorio_resumen ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'gob_licitaciones' AND policyname = 'gob_licitaciones_public_select'
      ) THEN
        CREATE POLICY "gob_licitaciones_public_select" ON public.gob_licitaciones FOR SELECT USING (true);
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'gob_empresas' AND policyname = 'gob_empresas_public_select'
      ) THEN
        CREATE POLICY "gob_empresas_public_select" ON public.gob_empresas FOR SELECT USING (true);
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'gob_observatorio_resumen' AND policyname = 'gob_observatorio_resumen_public_select'
      ) THEN
        CREATE POLICY "gob_observatorio_resumen_public_select" ON public.gob_observatorio_resumen FOR SELECT USING (true);
      END IF;
    END $$;

    GRANT SELECT ON public.gob_licitaciones, public.gob_empresas, public.gob_observatorio_resumen TO anon, authenticated;
    GRANT ALL ON public.gob_licitaciones, public.gob_empresas, public.gob_observatorio_resumen TO service_role, postgres;
  `;

  await runSql(createTablesSql);
  console.log('✓ Tablas, índices y políticas de seguridad configurados con éxito.');

  // Cargar datos
  const dataPath = path.join(__dirname, 'dashboard', 'src', 'data', 'licitacionesData.json');
  console.log('\n[2/4] Leyendo archivo de datos:', dataPath);
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`✓ Licitaciones a migrar: ${data.licitaciones.length}`);
  console.log(`✓ Empresas contratistas a migrar: ${data.empresasContratistas.length}`);

  // Migrar Empresas Contratistas
  console.log('\n[3/4] Insertando Empresas Contratistas...');
  for (const emp of data.empresasContratistas) {
    const empSql = `
      INSERT INTO public.gob_empresas (
        id, nombre, cuit, rubro, domicilio, alerta, moneda,
        total_cotizado, total_adjudicado, licitaciones_ganadas_count,
        publicas_count, directas_count, compulsas_count,
        organismos, ultimas_licitaciones, evolucion_anual,
        desglose_modalidad, desglose_organismos, created_at
      ) VALUES (
        ${escapeSqlString(emp.id)},
        ${escapeSqlString(emp.nombre)},
        ${escapeSqlString(emp.cuit)},
        ${escapeSqlString(emp.rubro)},
        ${escapeSqlString(emp.domicilio)},
        ${escapeSqlString(emp.alerta)},
        ${escapeSqlString(emp.moneda || 'ARS')},
        ${escapeSqlNumber(emp.totalCotizado)},
        ${escapeSqlNumber(emp.totalAdjudicado)},
        ${escapeSqlNumber(emp.licitacionesGanadasCount || 0)},
        ${escapeSqlNumber(emp.publicasCount || 0)},
        ${escapeSqlNumber(emp.directasCount || 0)},
        ${escapeSqlNumber(emp.compulsasCount || 0)},
        ${escapeSqlJson(emp.organismos || [])},
        ${escapeSqlJson(emp.ultimasLicitaciones || [])},
        ${escapeSqlJson(emp.evolucionAnual || [])},
        ${escapeSqlJson(emp.desgloseModalidad || [])},
        ${escapeSqlJson(emp.desgloseOrganismos || [])},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        cuit = EXCLUDED.cuit,
        rubro = EXCLUDED.rubro,
        domicilio = EXCLUDED.domicilio,
        alerta = EXCLUDED.alerta,
        moneda = EXCLUDED.moneda,
        total_cotizado = EXCLUDED.total_cotizado,
        total_adjudicado = EXCLUDED.total_adjudicado,
        licitaciones_ganadas_count = EXCLUDED.licitaciones_ganadas_count,
        publicas_count = EXCLUDED.publicas_count,
        directas_count = EXCLUDED.directas_count,
        compulsas_count = EXCLUDED.compulsas_count,
        organismos = EXCLUDED.organismos,
        ultimas_licitaciones = EXCLUDED.ultimas_licitaciones,
        evolucion_anual = EXCLUDED.evolucion_anual,
        desglose_modalidad = EXCLUDED.desglose_modalidad,
        desglose_organismos = EXCLUDED.desglose_organismos;
    `;
    await runSql(empSql);
  }
  console.log('✓ 12 empresas contratistas insertadas / actualizadas.');

  // Migrar Estadísticas del Observatorio
  console.log('\n[3b/4] Insertando Estadísticas Globales del Observatorio...');
  const obsSql = `
    INSERT INTO public.gob_observatorio_resumen (
      id, resumen, top_organismos, por_tipo, por_year, por_rubro,
      top_empresas_por_monto, top_empresas_por_cantidad, rubros_empresas, adjudicatarios_destacados, updated_at
    ) VALUES (
      'sanjuan_central',
      ${escapeSqlJson(data.resumen)},
      ${escapeSqlJson(data.topOrganismos)},
      ${escapeSqlJson(data.porTipo)},
      ${escapeSqlJson(data.porYear)},
      ${escapeSqlJson(data.porRubro)},
      ${escapeSqlJson(data.topEmpresasPorMonto)},
      ${escapeSqlJson(data.topEmpresasPorCantidad)},
      ${escapeSqlJson(data.rubrosEmpresas)},
      ${escapeSqlJson(data.adjudicatariosDestacados)},
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      resumen = EXCLUDED.resumen,
      top_organismos = EXCLUDED.top_organismos,
      por_tipo = EXCLUDED.por_tipo,
      por_year = EXCLUDED.por_year,
      por_rubro = EXCLUDED.por_rubro,
      top_empresas_por_monto = EXCLUDED.top_empresas_por_monto,
      top_empresas_por_cantidad = EXCLUDED.top_empresas_por_cantidad,
      rubros_empresas = EXCLUDED.rubros_empresas,
      adjudicatarios_destacados = EXCLUDED.adjudicatarios_destacados,
      updated_at = NOW();
  `;
  await runSql(obsSql);
  console.log('✓ Estadísticas globales registradas.');

  // Migrar Licitaciones en lotes de 100
  console.log('\n[4/4] Insertando 1.550 Licitaciones en lotes de 100...');
  const batchSize = 100;
  const total = data.licitaciones.length;

  for (let i = 0; i < total; i += batchSize) {
    const batch = data.licitaciones.slice(i, i + batchSize);
    
    const valueClauses = batch.map(l => `(
      ${escapeSqlNumber(l.id)},
      ${escapeSqlString(l.numPub)},
      ${escapeSqlString(l.expediente)},
      ${escapeSqlString(l.objeto)},
      ${escapeSqlString(l.organismo)},
      ${escapeSqlString(l.dependencia)},
      ${escapeSqlString(l.tipo)},
      ${escapeSqlString(l.estado)},
      ${escapeSqlString(l.adjudicacionEstado)},
      ${escapeSqlNumber(l.presupuesto)},
      ${escapeSqlNumber(l.costoPliego)},
      ${escapeSqlDate(l.fechaPublicacion)},
      ${escapeSqlDate(l.fechaApertura)},
      ${escapeSqlDate(l.fechaAdjudicacion)},
      ${escapeSqlString(l.horaApertura)},
      ${escapeSqlString(l.rubro)},
      ${escapeSqlString(l.email)},
      ${escapeSqlString(l.telefono)},
      ${escapeSqlString(l.domicilio)},
      ${escapeSqlNumber(l.diasPublicacion)},
      ${escapeSqlJson(l.archivos || [])},
      ${escapeSqlJson(l.expedienteMovimientos || [])},
      ${escapeSqlJson(l.ganador || null)},
      ${escapeSqlJson(l.alertas || [])},
      NOW(),
      NOW()
    )`).join(',\n');

    const batchSql = `
      INSERT INTO public.gob_licitaciones (
        id, num_pub, expediente, objeto, organismo, dependencia,
        tipo, estado, adjudicacion_estado, presupuesto, costo_pliego,
        fecha_publicacion, fecha_apertura, fecha_adjudicacion, hora_apertura,
        rubro, email, telefono, domicilio, dias_publicacion,
        archivos, expediente_movimientos, ganador, alertas, created_at, updated_at
      ) VALUES
      ${valueClauses}
      ON CONFLICT (id) DO UPDATE SET
        num_pub = EXCLUDED.num_pub,
        expediente = EXCLUDED.expediente,
        objeto = EXCLUDED.objeto,
        organismo = EXCLUDED.organismo,
        dependencia = EXCLUDED.dependencia,
        tipo = EXCLUDED.tipo,
        estado = EXCLUDED.estado,
        adjudicacion_estado = EXCLUDED.adjudicacion_estado,
        presupuesto = EXCLUDED.presupuesto,
        costo_pliego = EXCLUDED.costo_pliego,
        fecha_publicacion = EXCLUDED.fecha_publicacion,
        fecha_apertura = EXCLUDED.fecha_apertura,
        fecha_adjudicacion = EXCLUDED.fecha_adjudicacion,
        hora_apertura = EXCLUDED.hora_apertura,
        rubro = EXCLUDED.rubro,
        email = EXCLUDED.email,
        telefono = EXCLUDED.telefono,
        domicilio = EXCLUDED.domicilio,
        dias_publicacion = EXCLUDED.dias_publicacion,
        archivos = EXCLUDED.archivos,
        expediente_movimientos = EXCLUDED.expediente_movimientos,
        ganador = EXCLUDED.ganador,
        alertas = EXCLUDED.alertas,
        updated_at = NOW();
    `;

    await runSql(batchSql);
    process.stdout.write(`  -> Licitaciones insertadas: ${Math.min(i + batchSize, total)} / ${total}\r`);
  }

  console.log('\n\n--- MIGRACIÓN COMPLETADA EXITOSAMENTE ---');

  // Verificación
  console.log('\nVerificando conteos en Supabase:');
  const countLicitaciones = await runSql(`SELECT COUNT(*) FROM public.gob_licitaciones;`);
  const countEmpresas = await runSql(`SELECT COUNT(*) FROM public.gob_empresas;`);
  const countResumen = await runSql(`SELECT COUNT(*) FROM public.gob_observatorio_resumen;`);

  console.log(`• gob_licitaciones: ${countLicitaciones[0].count} registros`);
  console.log(`• gob_empresas: ${countEmpresas[0].count} empresas`);
  console.log(`• gob_observatorio_resumen: ${countResumen[0].count} registros`);
}

migrate().catch(err => {
  console.error('\nError en la migración:', err);
  process.exit(1);
});
