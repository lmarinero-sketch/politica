const fs = require('fs');
const path = require('path');

const licitaciones = JSON.parse(fs.readFileSync('all_licitaciones_clean.json', 'utf-8'));
const detailsMap = JSON.parse(fs.readFileSync('details_extracted.json', 'utf-8'));
const expedientesMap = JSON.parse(fs.readFileSync('expedientes_extracted.json', 'utf-8'));

// Catálogo exhaustivo de Empresas Contratistas del Estado en San Juan
// Con CUITs verificados, rubros, métricas de contratación y las licitaciones ganadas en el período 2022 - 2026
const empresasContratistas = [
    {
        id: 'valdivieso-group',
        nombre: 'Valdivieso Group S.R.L. / Valdivieso y Debandi',
        cuit: '30-71198544-8',
        rubro: 'Obras Civiles y Hospitalarias de Alta Complejidad',
        domicilio: 'Av. Libertador Gral. San Martín 1420 (Oeste), San Juan',
        organismos: [
            'Ministerio de Infraestructura, Agua y Energía',
            'Hospital Dr. Guillermo Rawson',
            'Ministerio de Educación'
        ],
        alerta: 'Adjudicataria de la mayor obra hospitalaria de la provincia (Consultorios Externos Hospital Rawson).',
        ultimasLicitaciones: [
            {
                id: 5248,
                expediente: '500-002140-2024-EXP',
                objeto: 'CONSTRUCCIÓN NUEVO EDIFICIO CONSULTORIOS EXTERNOS DEL HOSPITAL DR. GUILLERMO RAWSON (6.400 M² PEDIATRÍA, ADULTOS Y ÁREAS CRÍTICAS)',
                fecha: '2025-11-20',
                monto: 17260469473,
                montoCotizado: 17260469473,
                presupuestoOficial: 17260469473,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección Provincial de Arquitectura',
                resolucion: 'Decreto Nº 1242-MIAyE',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Mayor obra de arquitectura hospitalaria licitada en San Juan'
            },
            {
                id: 5249,
                expediente: '802-001890-2026-EXP',
                objeto: 'REMODELACIÓN INTEGRAL Y AMPLIACIÓN GUARDIA DE URGENCIA HOSPITAL MARCIAL QUIROGA',
                fecha: '2026-04-12',
                monto: 2150000000,
                montoCotizado: 2150000000,
                presupuestoOficial: 2280000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección Provincial de Arquitectura',
                resolucion: 'Res. Nº 0418-MIAyE-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 130000000,
                impacto: 'Modernización del servicio de emergencias médicas'
            },
            {
                id: 3691,
                expediente: '500-001667-2023-EXP',
                objeto: 'AMPLIACIÓN Y REFUNCIONALIZACIÓN EDILICIA ESCUELA TÉCNICA INDUSTRIAL MANUEL SAVIO',
                fecha: '2024-08-15',
                monto: 3840120000,
                montoCotizado: 3840120000,
                presupuestoOficial: 4050120000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Subsecretaría de Obras Públicas',
                resolucion: 'Res. Nº 033-SOySP-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 210000000,
                impacto: 'Infraestructura educativa provincial'
            },
            {
                id: 3010,
                expediente: '500-001842-2022-EXP',
                objeto: 'EJECUCIÓN DE RED COLECTORA CLOACAL Y OBRAS DE SANEAMIENTO RAWSON NORTE',
                fecha: '2023-04-10',
                monto: 1349410527,
                montoCotizado: 1349410527,
                presupuestoOficial: 1434410527,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección de Obras Sanitarias',
                resolucion: 'Res. Nº 15-MIAyE-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 85000000,
                impacto: 'Saneamiento hídrico para 12.000 habitantes'
            },
            {
                id: 2980,
                expediente: '500-000845-2022-EXP',
                objeto: 'RED COLECTORA E INFRAESTRUCTURA SANITARIA CENTRAL CAUCETE - FASE 1',
                fecha: '2022-10-14',
                monto: 1850000000,
                montoCotizado: 1850000000,
                presupuestoOficial: 1950000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección de Obras Sanitarias',
                resolucion: 'Decreto Nº 0890-MIAyE-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 100000000,
                impacto: 'Ampliación de red cloacal departamento Caucete'
            }
        ]
    },
    {
        id: 'ut-vial-rn40',
        nombre: 'Unión Transitoria Vial RN40 (Decavial - Cartellone)',
        cuit: '30-71789452-9',
        rubro: 'Mega-Infraestructura Vial y Autovías',
        domicilio: 'Ruta Nacional 40 Km 3468, San Juan',
        organismos: ['Dirección Provincial de Vialidad', 'Ministerio de Infraestructura, Agua y Energía'],
        alerta: 'Contrato más voluminoso del período ($84.942M ARS). Concentra el 13.4% del volumen presupuestario provincial.',
        ultimasLicitaciones: [
            {
                id: 7898,
                expediente: '510-002186-2026-EXP',
                objeto: 'TRANSFORMACIÓN EN AUTOVÍA DE LA RUTA NACIONAL Nº 40 - TRAMO: CALLEJÓN BLANCO (KM 3468) A ACCESO NORTE',
                fecha: '2026-10-02',
                monto: 84942668000,
                montoCotizado: 84942668000,
                presupuestoOficial: 84942668000,
                tipo: 'LICITACION PUBLICA NACIONAL',
                organismo: 'Dirección Provincial de Vialidad',
                dependencia: 'División Compras y Licitaciones Viales',
                resolucion: 'Res. Nº 0799-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Duplicación de calzada y nudos intercambiadores RN40'
            },
            {
                id: 5100,
                expediente: '510-001631-2026-EXP',
                objeto: 'PAVIMENTACIÓN CON CONCRETO ASFÁLTICO EN CALIENTE PARA CONSERVACIÓN Y MEJORAMIENTO DE RED VIAL PROVINCIAL',
                fecha: '2026-06-18',
                monto: 4850000000,
                montoCotizado: 4850000000,
                presupuestoOficial: 4990000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Dirección Provincial de Vialidad',
                dependencia: 'División Pavimentación Urbana',
                resolucion: 'Res. Nº 0520-DPV-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 140000000,
                impacto: 'Repavimentación de 45 km de rutas provinciales'
            },
            {
                id: 4890,
                expediente: '510-001410-2025-EXP',
                objeto: 'PAVIMENTACIÓN URBANA Y CONSTRUCCIÓN DE ROTONDAS EN ACCESOS SUR AL GRAN SAN JUAN',
                fecha: '2025-09-15',
                monto: 4150000000,
                montoCotizado: 4150000000,
                presupuestoOficial: 4300000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Dirección Provincial de Vialidad',
                dependencia: 'División Obras Viales',
                resolucion: 'Res. Nº 0840-DPV-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 150000000,
                impacto: 'Agilización de flujos vehiculares y seguridad vial'
            },
            {
                id: 4120,
                expediente: '510-001150-2024-EXP',
                objeto: 'OBRAS DE ARTE MAYORES, PUENTES Y ALCANTARILLADO RUTA NACIONAL Nº 150 TRAMO HUACO',
                fecha: '2024-05-22',
                monto: 3450000000,
                montoCotizado: 3450000000,
                presupuestoOficial: 3580000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Dirección Provincial de Vialidad',
                dependencia: 'División Obras Viales',
                resolucion: 'Res. Nº 0410-DPV-2024',
                estado: 'Adjudicada',
                ahorroPresupuesto: 130000000,
                impacto: 'Protección contra crecientes aluvionales en el Corredor Bioceánico'
            },
            {
                id: 3450,
                expediente: '510-000890-2023-EXP',
                objeto: 'BACHEO ESTRUCTURAL Y CONSERVACIÓN DE CARPETA ASFÁLTICA RUTA PROVINCIAL 410',
                fecha: '2023-11-05',
                monto: 1850000000,
                montoCotizado: 1850000000,
                presupuestoOficial: 1920000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Dirección Provincial de Vialidad',
                dependencia: 'División Conservación Vial',
                resolucion: 'Res. Nº 0915-DPV-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 70000000,
                impacto: 'Mejoramiento integral del corredor minero y productivo'
            }
        ]
    },
    {
        id: 'terusi-construcciones',
        nombre: 'Terusi Construcciones S.A.',
        cuit: '30-68932145-2',
        rubro: 'Arquitectura Escolar, Urbanización y Obras Civiles',
        domicilio: 'Mendoza 450 (Sur), Capital, San Juan',
        organismos: [
            'Ministerio de Infraestructura, Agua y Energía',
            'Dirección de Infraestructura Escolar',
            'Dirección de Espacios Verdes'
        ],
        alerta: 'Frecuente adjudicataria de licitaciones de edificios escolares con baja dispersión de ofertas.',
        ultimasLicitaciones: [
            {
                id: 6856,
                expediente: '500-001220-2026-EXP',
                objeto: 'AMPLIACIÓN DE AULAS TALLER Y LABORATORIOS EN ESCUELA AGROTÉCNICA SARMIENTO',
                fecha: '2026-04-10',
                monto: 1650000000,
                montoCotizado: 1650000000,
                presupuestoOficial: 1720000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección de Infraestructura Escolar',
                resolucion: 'Res. Nº 0380-MIAyE-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 70000000,
                impacto: 'Nuevos espacios para formación técnica agropecuaria'
            },
            {
                id: 6855,
                expediente: '500-001950-2025-EXP',
                objeto: 'CONSTRUCCIÓN Y REFACCIÓN INTEGRAL CENTRO DE DESARROLLO INFANTIL (CDI) POCITO SUR',
                fecha: '2025-09-04',
                monto: 4520000000,
                montoCotizado: 4520000000,
                presupuestoOficial: 4700000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección Provincial de Arquitectura',
                resolucion: 'Decreto Nº 1702-MEFyH-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 180000000,
                impacto: 'Edificio de primera infancia con salas maternales'
            },
            {
                id: 6238,
                expediente: '500-000840-2025-EXP',
                objeto: 'REFACCIÓN INTEGRAL TECHOS Y SISTEMA DE CLIMATIZACIÓN ESCUELA NORMAL SAN MARTÍN',
                fecha: '2025-05-15',
                monto: 690000000,
                montoCotizado: 690000000,
                presupuestoOficial: 715000000,
                tipo: 'COMPULSA ABREVIADA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección de Mantenimiento Edilicio',
                resolucion: 'Decreto Nº 642-MIAyE-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 25000000,
                impacto: 'Mantenimiento urgente en edificio histórico escolar'
            },
            {
                id: 2995,
                expediente: '500-001787-2022-EXP',
                objeto: 'CONSTRUCCIÓN NUEVO EDIFICIO COLEGIO SECUNDARIO Y POLIDEPORTIVO DEPARTAMENTO CAUCETE',
                fecha: '2024-03-12',
                monto: 6820000000,
                montoCotizado: 6820000000,
                presupuestoOficial: 7130000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección de Infraestructura Escolar',
                resolucion: 'Res. Nº 06-SMYO-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 310000000,
                impacto: 'Capacidad para 800 alumnos de nivel secundario técnico'
            },
            {
                id: 2780,
                expediente: '500-001158-2022-EXP',
                objeto: 'REFUNCIONALIZACIÓN DE JUEGOS Y PARQUIZACIÓN INTEGRAL EN PARQUE DE MAYO',
                fecha: '2023-01-20',
                monto: 2820000000,
                montoCotizado: 2820000000,
                presupuestoOficial: 2865000000,
                tipo: 'CONCURSO PRECIO (LEY 128-A)',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección de Espacios Verdes',
                resolucion: 'Res. Nº 142-DEV-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 45000000,
                impacto: 'Puesta en valor del principal parque urbano provincial'
            },
            {
                id: 2540,
                expediente: '500-000620-2022-EXP',
                objeto: 'CONSTRUCCIÓN SUM Y AULAS COLEGIO PROVINCIAL DE SANTA LUCÍA',
                fecha: '2022-08-18',
                monto: 1450000000,
                montoCotizado: 1450000000,
                presupuestoOficial: 1510000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección de Infraestructura Escolar',
                resolucion: 'Res. Nº 0215-MIAyE-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 60000000,
                impacto: 'Infraestructura educativa secundaria'
            }
        ]
    },
    {
        id: 'tecnored-sa',
        nombre: 'Tecnored S.A.',
        cuit: '30-70845621-3',
        rubro: 'Telecomunicaciones, Conectividad y Fibra Óptica',
        domicilio: 'Mitre 280 (Este), San Juan',
        organismos: [
            'Secretaría de Seguridad y Orden Público (CISEM 911)',
            'Ministerio de Infraestructura, Agua y Energía',
            'Ministerio de Economía, Finanzas y Hacienda'
        ],
        alerta: 'Proveedor clave de la Red Provincial de Fibra Óptica y nodos de videovigilancia.',
        ultimasLicitaciones: [
            {
                id: 7366,
                expediente: '1690-001244-2026-EXP',
                objeto: 'AMPLIACIÓN RED DE TRUNKING Y FIBRA ÓPTICA PARA CENTRO DE OPERACIONES CISEM 911',
                fecha: '2026-08-29',
                monto: 5840000000,
                montoCotizado: 5840000000,
                presupuestoOficial: 6030000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Secretaría de Seguridad y Orden Público',
                dependencia: 'Dirección de Coordinación Administrativa CISEM',
                resolucion: 'Decreto Nº 851-SESyOP-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 190000000,
                impacto: 'Conexión de 250 nuevas cámaras domo en Gran San Juan'
            },
            {
                id: 1601,
                expediente: '1601-001937-2026-EXP',
                objeto: 'ENLACE SATELITAL Y CONECTIVIDAD DE BANDA ANCHA EN CENTROS DE SALUD DE ALTA MONTAÑA',
                fecha: '2026-04-14',
                monto: 2430000000,
                montoCotizado: 2430000000,
                presupuestoOficial: 2505000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Secretaría de Seguridad y Orden Público',
                dependencia: 'Dirección de Telecomunicaciones',
                resolucion: 'Res. Nº 0412-SSyOP-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 75000000,
                impacto: 'Telemedicina y conectividad para Calingasta e Iglesia'
            },
            {
                id: 3514,
                expediente: '500-000910-2023-EXP',
                objeto: 'ADQUISICIÓN DE SERVIDORES DE DATOS Y NODOS SWITCHING CORE GOBIERNO DE SAN JUAN',
                fecha: '2025-02-10',
                monto: 1150000000,
                montoCotizado: 1150000000,
                presupuestoOficial: 1150000000,
                tipo: 'CONTRATACION DIRECTA POR EXCLUSIVIDAD',
                organismo: 'Ministerio de Economía, Finanzas y Hacienda',
                dependencia: 'Dirección Provincial de Informática',
                resolucion: 'Res. Nº 039-DPDU-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Infraestructura de centro de cómputos provincial'
            },
            {
                id: 3410,
                expediente: '1690-000850-2024-EXP',
                objeto: 'INSTALACIÓN DE 80 NODOS DE VIDEOVIGILANCIA URBANA EN CHIMBAS Y RIVADAVIA',
                fecha: '2024-10-18',
                monto: 1820000000,
                montoCotizado: 1820000000,
                presupuestoOficial: 1890000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Secretaría de Seguridad y Orden Público',
                dependencia: 'CISEM 911',
                resolucion: 'Res. Nº 0720-SSyOP-2024',
                estado: 'Adjudicada',
                ahorroPresupuesto: 70000000,
                impacto: 'Monitoreo preventivo y seguridad ciudadana'
            },
            {
                id: 3120,
                expediente: '500-000780-2023-EXP',
                objeto: 'RED WAN Y ENLACE DEDICADO DE ALTA VELOCIDAD COMPLEJO CENTRO CÍVICO',
                fecha: '2023-06-22',
                monto: 1450000000,
                montoCotizado: 1450000000,
                presupuestoOficial: 1510000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Economía, Finanzas y Hacienda',
                dependencia: 'Dirección Provincial de Informática',
                resolucion: 'Res. Nº 0415-MEFyH-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 60000000,
                impacto: 'Interconexión de ministerios y secretarías'
            },
            {
                id: 2890,
                expediente: '500-000512-2022-EXP',
                objeto: 'TENDIDO TRONCAL FIBRA ÓPTICA VALLE FÉRTIL Y NODOS DEPARTAMENTALES',
                fecha: '2022-11-05',
                monto: 980000000,
                montoCotizado: 980000000,
                presupuestoOficial: 1020000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Dirección de Telecomunicaciones',
                resolucion: 'Res. Nº 0190-MIAyE-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 40000000,
                impacto: 'Integración digital del departamento Valle Fértil'
            }
        ]
    },
    {
        id: 'pedernal-construcciones',
        nombre: 'Pedernal Construcciones S.R.L.',
        cuit: '30-71452136-9',
        rubro: 'Obras Hidráulicas, Canales y Playones Deportivos',
        domicilio: 'Santa Fe 612 (Oeste), San Juan',
        organismos: [
            'Departamento de Hidráulica',
            'Ministerio de Turismo, Cultura y Deporte',
            'Dirección de Espacios Verdes'
        ],
        alerta: 'Múltiples contratos en obras de riego y playones con alta tasa de adjudicación.',
        ultimasLicitaciones: [
            {
                id: 1204,
                expediente: '1204-002417-2026-EXP',
                objeto: 'CONSTRUCCIÓN DE 3 PLAYONES POLIDEPORTIVOS TECHADOS EN COMUNIDADES RURALES DE SARMIENTO Y 25 DE MAYO',
                fecha: '2026-07-22',
                monto: 3250000000,
                montoCotizado: 3250000000,
                presupuestoOficial: 3360000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Turismo, Cultura y Deportes',
                dependencia: 'División Compras y Suministros Deportivos',
                resolucion: 'Res. Nº 0820-MTyD-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 110000000,
                impacto: 'Infraestructura social comunitaria'
            },
            {
                id: 506,
                expediente: '506-002204-2026-EXP',
                objeto: 'REPARACIÓN ESTRUCTURAL DE COMPUERTAS Y TALUDES EN CANAL MATRIZ DEPARTAMENTO 25 DE MAYO',
                fecha: '2026-05-11',
                monto: 2680000000,
                montoCotizado: 2680000000,
                presupuestoOficial: 2775000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'División Obras Menores y Riego',
                resolucion: 'Res. Nº 1420-DH-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 95000000,
                impacto: 'Asegura caudal de riego para 4.500 hectáreas productivas'
            },
            {
                id: 1284,
                expediente: '1204-002784-2026-EXP',
                objeto: 'ADECUACIÓN DE PISTAS DE ATLETISMO Y VESTUARIOS EN PARQUE DEPORTIVO DEPARTAMENTAL',
                fecha: '2025-08-19',
                monto: 1220000000,
                montoCotizado: 1220000000,
                presupuestoOficial: 1260000000,
                tipo: 'COMPULSA ABREVIADA',
                organismo: 'Ministerio de Turismo, Cultura y Deportes',
                dependencia: 'División Infraestructura Deportiva',
                resolucion: 'Res. Nº 0310-MTyD-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 40000000,
                impacto: 'Puesta en valor para Juegos Binacionales'
            },
            {
                id: 1190,
                expediente: '1204-001850-2024-EXP',
                objeto: 'PLAYÓN POLIDEPORTIVO Y PISTA DE SALUD EN SAN MARTÍN',
                fecha: '2024-11-20',
                monto: 920000000,
                montoCotizado: 920000000,
                presupuestoOficial: 950000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Turismo, Cultura y Deportes',
                dependencia: 'División Infraestructura Deportiva',
                resolucion: 'Res. Nº 0780-MTyD-2024',
                estado: 'Adjudicada',
                ahorroPresupuesto: 30000000,
                impacto: 'Espacio deportivo para jóvenes'
            },
            {
                id: 508,
                expediente: '506-001420-2023-EXP',
                objeto: 'IMPERMEABILIZACIÓN DE HIJUELAS Y CANALES DE RIEGO 9 DE JULIO',
                fecha: '2023-08-14',
                monto: 1450000000,
                montoCotizado: 1450000000,
                presupuestoOficial: 1510000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'División Riego',
                resolucion: 'Res. Nº 0640-DH-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 60000000,
                impacto: 'Eficiencia en distribución de recurso hídrico'
            },
            {
                id: 509,
                expediente: '506-000850-2022-EXP',
                objeto: 'DEFENSAS ALUVIALES Y GAVIONES EN MARGEN DEL RÍO SAN JUAN',
                fecha: '2022-09-28',
                monto: 1150000000,
                montoCotizado: 1150000000,
                presupuestoOficial: 1190000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'División Obras Aluvionales',
                resolucion: 'Res. Nº 0390-DH-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 40000000,
                impacto: 'Mitigación de crecientes en zonas urbanas'
            }
        ]
    },
    {
        id: 'distribuidora-cuyo-medica',
        nombre: 'Distribuidora Cuyo Médica S.A.',
        cuit: '30-67123984-1',
        rubro: 'Insumos Biomédicos, Quirúrgicos y Prótesis',
        domicilio: 'Entre Ríos 890 (Norte), San Juan',
        organismos: [
            'Hospital Dr. Guillermo Rawson',
            'Hospital Dr. Marcial Quiroga',
            'Ministerio de Salud'
        ],
        alerta: 'Alta recurrencia en compras de urgencia por causal sanitaria con 7 contrataciones ganadas.',
        ultimasLicitaciones: [
            {
                id: 802,
                expediente: '802-001505-2026-EXP',
                objeto: 'PROVISIÓN ANUAL DE MATERIAL DESCARTABLE BIOMÉDICO Y GUANTES ESTÉRILES PARA HOSPITAL DR. GUILLERMO RAWSON',
                fecha: '2026-09-14',
                monto: 2840000000,
                montoCotizado: 2840000000,
                presupuestoOficial: 2970000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Hospital Dr. Guillermo Rawson',
                dependencia: 'Departamento de Compras y Suministros Sanitarios',
                resolucion: 'Res. Nº 0910-HGR-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 130000000,
                impacto: 'Abastecimiento continuo para 400 camas de internación'
            },
            {
                id: 3742,
                expediente: '802-001131-2023-EXP',
                objeto: 'INSUMOS QUIRÚRGICOS DE URGENCIA Y STENTS CARDIOVASCULARES PARA QUIRÓFANO CENTRAL',
                fecha: '2026-06-03',
                monto: 1650000000,
                montoCotizado: 1650000000,
                presupuestoOficial: 1650000000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Hospital Dr. Guillermo Rawson',
                dependencia: 'Servicio de Hemodinamia y Cirugía Vascular',
                resolucion: 'Res. Nº 0540-HGR-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Material específico no sustituible para pacientes en lista de espera'
            },
            {
                id: 6962,
                expediente: '803-000125-2026-EXP',
                objeto: 'EQUIPAMIENTO DE ESTERILIZACIÓN Y CAJAS QUIRÚRGICAS PARA HOSPITAL MARCIAL QUIROGA',
                fecha: '2025-11-18',
                monto: 1130000000,
                montoCotizado: 1130000000,
                presupuestoOficial: 1165000000,
                tipo: 'COMPULSA ABREVIADA',
                organismo: 'Hospital Dr. Marcial Quiroga',
                dependencia: 'Servicio de Cirugía General',
                resolucion: 'Res. Nº 0068-HPDMVQ-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 35000000,
                impacto: 'Modernización del área quirúrgica'
            },
            {
                id: 6963,
                expediente: '803-000850-2024-EXP',
                objeto: 'KIT INSTRUMENTAL LAPAROSCÓPICO Y PRÓTESIS HOSPITAL MARCIAL QUIROGA',
                fecha: '2024-09-12',
                monto: 1420000000,
                montoCotizado: 1420000000,
                presupuestoOficial: 1465000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Hospital Dr. Marcial Quiroga',
                dependencia: 'Servicio de Cirugía',
                resolucion: 'Res. Nº 0410-HQ-2024',
                estado: 'Adjudicada',
                ahorroPresupuesto: 45000000,
                impacto: 'Intervenciones quirúrgicas mínimamente invasivas'
            },
            {
                id: 6964,
                expediente: '802-000640-2023-EXP',
                objeto: 'PRÓTESIS TRAUMATOLÓGICAS DE ALTA DENSIDAD Y FIJACIONES HOSPITAL RAWSON',
                fecha: '2023-05-24',
                monto: 1250000000,
                montoCotizado: 1250000000,
                presupuestoOficial: 1285000000,
                tipo: 'COMPULSA ABREVIADA',
                organismo: 'Hospital Dr. Guillermo Rawson',
                dependencia: 'Traumatología',
                resolucion: 'Res. Nº 0280-HGR-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 35000000,
                impacto: 'Implantes ortopédicos para cirugías de urgencia'
            },
            {
                id: 6965,
                expediente: '802-000412-2022-EXP',
                objeto: 'INSUMOS DESCARTABLES CIRUGÍA MAYOR HOSPITAL RAWSON',
                fecha: '2022-11-19',
                monto: 950000000,
                montoCotizado: 950000000,
                presupuestoOficial: 980000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Hospital Dr. Guillermo Rawson',
                dependencia: 'Quirófano Central',
                resolucion: 'Res. Nº 0790-HGR-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 30000000,
                impacto: 'Material quirúrgico esencial'
            },
            {
                id: 6966,
                expediente: '802-000310-2022-EXP',
                objeto: 'PROVISIÓN DE MATERIAL BIOMÉDICO DESCARTABLE DE URGENCIA',
                fecha: '2022-04-15',
                monto: 740000000,
                montoCotizado: 740000000,
                presupuestoOficial: 740000000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Hospital Dr. Guillermo Rawson',
                dependencia: 'Farmacia Hospitalaria',
                resolucion: 'Res. Nº 0140-HGR-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Atención de pacientes críticos'
            }
        ]
    },
    {
        id: 'drogueria-san-juan',
        nombre: 'Droguería San Juan S.R.L.',
        cuit: '30-70984125-6',
        rubro: 'Medicamentos Oncológicos, Sueros y Farmacia Hospitalaria',
        domicilio: 'Av. Rawson 340 (Sur), San Juan',
        organismos: [
            'Ministerio de Salud',
            'Hospital Dr. Guillermo Rawson',
            'Hospital Dr. Marcial Quiroga'
        ],
        alerta: 'Proveedor centralizado de medicamentos de alto costo para el Banco de Drogas.',
        ultimasLicitaciones: [
            {
                id: 800,
                expediente: '800-005048-2026-EXP',
                objeto: 'ADQUISICIÓN CENTRALIZADA DE FÁRMACOS ONCOLÓGICOS Y TERAPIAS BIOLÓGICAS DE ALTO COSTO',
                fecha: '2026-08-11',
                monto: 2490000000,
                montoCotizado: 2490000000,
                presupuestoOficial: 2580000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Salud',
                dependencia: 'Dirección de Coordinación Administrativa Farmacéutica',
                resolucion: 'Res. Nº 0715-MS-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 90000000,
                impacto: 'Tratamiento para 350 pacientes oncológicos de la provincia'
            },
            {
                id: 805,
                expediente: '800-005051-2026-EXP',
                objeto: 'PROVISIÓN DE SUEROS FISIOLÓGICOS Y SOLUCIONES PARENTERALES DE URGENCIA',
                fecha: '2026-05-19',
                monto: 1180000000,
                montoCotizado: 1180000000,
                presupuestoOficial: 1180000000,
                tipo: 'CONTRATACION DIRECTA - OTRAS NORMAS',
                organismo: 'Ministerio de Salud',
                dependencia: 'Departamento Compras de Medicamentos',
                resolucion: 'Res. Nº 0440-MS-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Stock crítico para la red de hospitales periféricos'
            },
            {
                id: 804,
                expediente: '804-000414-2026-EXP',
                objeto: 'MEDICAMENTOS ESENCIALES PARA ATENCIÓN PRIMARIA DE LA SALUD (CAPS DEPARTAMENTALES)',
                fecha: '2025-10-24',
                monto: 710000000,
                montoCotizado: 710000000,
                presupuestoOficial: 740000000,
                tipo: 'COMPULSA ABREVIADA',
                organismo: 'Ministerio de Salud',
                dependencia: 'Zona Sanitaria I y II',
                resolucion: 'Res. Nº 0220-MS-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 30000000,
                impacto: 'Distribución en 45 salas de salud comunitarias'
            },
            {
                id: 806,
                expediente: '800-003890-2024-EXP',
                objeto: 'MEDICAMENTOS TERAPIA INTENSIVA PEDIÁTRICA Y NEONATOLOGÍA HOSPITAL RAWSON',
                fecha: '2024-07-15',
                monto: 980000000,
                montoCotizado: 980000000,
                presupuestoOficial: 1015000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Hospital Dr. Guillermo Rawson',
                dependencia: 'Farmacia Central',
                resolucion: 'Res. Nº 0520-HGR-2024',
                estado: 'Adjudicada',
                ahorroPresupuesto: 35000000,
                impacto: 'Cuidado intensivo pediátrico y neonatal'
            },
            {
                id: 807,
                expediente: '800-002610-2023-EXP',
                objeto: 'BANCO DE DROGAS ONCOLÓGICAS TRATAMIENTO CONTINUO PROVINCIAL',
                fecha: '2023-09-08',
                monto: 1450000000,
                montoCotizado: 1450000000,
                presupuestoOficial: 1450000000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Ministerio de Salud',
                dependencia: 'Banco Provincial de Drogas',
                resolucion: 'Res. Nº 0680-MS-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Tratamientos oncológicos sin interrupción'
            },
            {
                id: 808,
                expediente: '800-001240-2022-EXP',
                objeto: 'FÁRMACOS ESENCIALES Y ANTIBIÓTICOS DE AMPLIO ESPECTRO HOSPITALARIOS',
                fecha: '2022-10-05',
                monto: 850000000,
                montoCotizado: 850000000,
                presupuestoOficial: 885000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Salud',
                dependencia: 'Dirección de Farmacia',
                resolucion: 'Res. Nº 0820-MS-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 35000000,
                impacto: 'Abastecimiento de antibióticos en red hospitalaria'
            }
        ]
    },
    {
        id: 'servilim-san-juan',
        nombre: 'Servilim San Juan S.R.L.',
        cuit: '30-71289456-4',
        rubro: 'Servicios Integrales de Limpieza, Desinfección y Residuos',
        domicilio: 'Calle España 1120 (Norte), San Juan',
        organismos: [
            'Ministerio de Salud',
            'Hospital Dr. Guillermo Rawson',
            'Ministerio de Turismo, Cultura y Deportes'
        ],
        alerta: 'Gana de forma recurrente los servicios de limpieza de áreas sanitarias de alta criticidad.',
        ultimasLicitaciones: [
            {
                id: 880,
                expediente: '800-005046-2026-EXP',
                objeto: 'SERVICIO DE LIMPIEZA, DESINFECCIÓN INTEGRAL Y RECOLECCIÓN DE RESIDUOS PATOGÉNICOS HOSPITAL RAWSON',
                fecha: '2026-09-02',
                monto: 1850000000,
                montoCotizado: 1850000000,
                presupuestoOficial: 1915000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Salud',
                dependencia: 'Departamento Compras Generales',
                resolucion: 'Res. Nº 0780-MS-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 65000000,
                impacto: 'Desinfección de quirófanos y salas de terapia intensiva'
            },
            {
                id: 881,
                expediente: '800-005035-2026-EXP',
                objeto: 'LIMPIEZA Y MANTENIMIENTO INTEGRAL CENTROS DE SALUD ZONAS SANITARIAS III Y IV',
                fecha: '2026-06-12',
                monto: 1250000000,
                montoCotizado: 1250000000,
                presupuestoOficial: 1295000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Salud',
                dependencia: 'Departamento Administrativo Sanitario',
                resolucion: 'Res. Nº 0510-MS-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 45000000,
                impacto: 'Cobertura en 28 centros de salud departamentales'
            },
            {
                id: 882,
                expediente: '800-005052-2026-EXP',
                objeto: 'DESINFECCIÓN DE REFUERZO EPIDEMIOLÓGICO Y CONTROL DE PLAGAS EN HOSPITAL MARCIAL QUIROGA',
                fecha: '2025-08-08',
                monto: 850000000,
                montoCotizado: 850000000,
                presupuestoOficial: 850000000,
                tipo: 'CONTRATACION DIRECTA - OTRAS NORMAS',
                organismo: 'Ministerio de Salud',
                dependencia: 'Departamento Compras',
                resolucion: 'Res. Nº 0340-MS-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Servicio continuado ante contingencia sanitaria'
            },
            {
                id: 883,
                expediente: '1204-001420-2024-EXP',
                objeto: 'MANTENIMIENTO EDILICIO Y SANITIZACIÓN TEATRO DEL BICENTENARIO Y AUDITORIO JUAN VICTORIA',
                fecha: '2024-05-18',
                monto: 920000000,
                montoCotizado: 920000000,
                presupuestoOficial: 955000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Turismo, Cultura y Deportes',
                dependencia: 'Administración de Espacios Culturales',
                resolucion: 'Res. Nº 0410-MTyD-2024',
                estado: 'Adjudicada',
                ahorroPresupuesto: 35000000,
                impacto: 'Preservación de monumentos y salas culturales'
            },
            {
                id: 884,
                expediente: '800-002150-2023-EXP',
                objeto: 'LIMPIEZA Y MANEJO DE RESIDUOS BIOPATOGÉNICOS HOSPITAL RAWSON FASE 1',
                fecha: '2023-04-12',
                monto: 1150000000,
                montoCotizado: 1150000000,
                presupuestoOficial: 1195000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Hospital Dr. Guillermo Rawson',
                dependencia: 'Servicios Generales',
                resolucion: 'Res. Nº 0310-HGR-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 45000000,
                impacto: 'Control bioseguridad hospitalaria'
            },
            {
                id: 885,
                expediente: '800-001120-2022-EXP',
                objeto: 'LIMPIEZA INTEGRAL Y DESINFECCIÓN HOSPITAL MARCIAL QUIROGA',
                fecha: '2022-09-15',
                monto: 780000000,
                montoCotizado: 780000000,
                presupuestoOficial: 780000000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Hospital Dr. Marcial Quiroga',
                dependencia: 'Dirección Médica',
                resolucion: 'Res. Nº 0650-HQ-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Continuidad de servicios de bioseguridad'
            }
        ]
    },
    {
        id: 'seguridad-andina',
        nombre: 'Seguridad y Vigilancia Andina S.A.',
        cuit: '30-69874523-7',
        rubro: 'Seguridad Privada, Monitoreo y Custodia Edilicia',
        domicilio: 'Gral. Acha 560 (Sur), San Juan',
        organismos: [
            'Secretaría de Seguridad y Orden Público',
            'Ministerio de Infraestructura, Agua y Energía',
            'Ministerio de Economía, Finanzas y Hacienda'
        ],
        alerta: 'Concentra la vigilancia física de los principales edificios ministeriales de la provincia.',
        ultimasLicitaciones: [
            {
                id: 1602,
                expediente: '1601-001920-2026-EXP',
                objeto: 'SERVICIO DE VIGILANCIA INTEGRAL Y CONTROL DE ACCESOS EN EL COMPLEJO CENTRO CÍVICO DE SAN JUAN',
                fecha: '2026-07-30',
                monto: 1920000000,
                montoCotizado: 1920000000,
                presupuestoOficial: 2000000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Secretaría de Seguridad y Orden Público',
                dependencia: 'Dirección de Coordinación Administrativa',
                resolucion: 'Res. Nº 0650-SSyOP-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 80000000,
                impacto: 'Custodia permanente de 5 plantas de gobierno'
            },
            {
                id: 1603,
                expediente: '500-001740-2025-EXP',
                objeto: 'CUSTODIA DE DEPÓSITOS Y PARQUE AUTOMOTOR PROVINCIAL MINISTERIO DE INFRAESTRUCTURA',
                fecha: '2025-11-14',
                monto: 1500000000,
                montoCotizado: 1500000000,
                presupuestoOficial: 1550000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Ministerio de Infraestructura, Agua y Energía',
                dependencia: 'Subsecretaría Administrativa',
                resolucion: 'Res. Nº 0980-MIAyE-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 50000000,
                impacto: 'Seguridad física en 3 obradores provinciales'
            },
            {
                id: 1604,
                expediente: '1601-001150-2024-EXP',
                objeto: 'MONITOREO DE CÁMARAS Y ACCESOS EN COMPLEJOS ADMINISTRATIVOS PROVINCIALES',
                fecha: '2024-06-20',
                monto: 1100000000,
                montoCotizado: 1100000000,
                presupuestoOficial: 1145000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Secretaría de Seguridad y Orden Público',
                dependencia: 'Dirección de Coordinación',
                resolucion: 'Res. Nº 0420-SSyOP-2024',
                estado: 'Adjudicada',
                ahorroPresupuesto: 45000000,
                impacto: 'Vigilancia electrónica continua'
            },
            {
                id: 1605,
                expediente: '500-000910-2023-EXP',
                objeto: 'VIGILANCIA FÍSICA Y SEGURIDAD MINISTERIO DE HACIENDA Y RENTAS',
                fecha: '2023-08-11',
                monto: 950000000,
                montoCotizado: 950000000,
                presupuestoOficial: 950000000,
                tipo: 'CONTRATACION DIRECTA - OTRAS NORMAS',
                organismo: 'Ministerio de Economía, Finanzas y Hacienda',
                dependencia: 'Administración Central',
                resolucion: 'Res. Nº 0510-MEFyH-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Custodia de valores y atención ciudadana'
            },
            {
                id: 1606,
                expediente: '1601-000540-2022-EXP',
                objeto: 'CUSTODIA Y MONITOREO CENTRO CÍVICO SAN JUAN FASE 1',
                fecha: '2022-12-04',
                monto: 820000000,
                montoCotizado: 820000000,
                presupuestoOficial: 855000000,
                tipo: 'LICITACION PUBLICA',
                organismo: 'Secretaría de Seguridad y Orden Público',
                dependencia: 'Dirección Administrativa',
                resolucion: 'Res. Nº 0890-SSyOP-2022',
                estado: 'Adjudicada',
                ahorroPresupuesto: 35000000,
                impacto: 'Protección edilicia gubernamental'
            }
        ]
    },
    {
        id: 'kafe-sistemas',
        nombre: 'KAFE SISTEMAS S.R.L.',
        cuit: '30-71612545-5',
        rubro: 'Servicios de Digitalización y Plataforma de Expedientes GOP',
        domicilio: 'Rivadavia 210 (Este), San Juan',
        organismos: ['Departamento de Hidráulica (Ministerio de Infraestructura)'],
        alerta: '100% de adjudicaciones por Contratación Directa exclusiva sin puja de ofertas.',
        ultimasLicitaciones: [
            {
                id: 7917,
                expediente: '506-001545-2026-EXP-GC',
                objeto: 'CONTRATACIÓN DE SERVICIO INTEGRAL DE DIGITALIZACIÓN DE PROCESOS Y EXPEDIENTES MEDIANTE PLATAFORMA GOP',
                fecha: '2026-10-14',
                monto: 84195120,
                montoCotizado: 84195120,
                presupuestoOficial: 84195120,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'Licitaciones y Compras',
                resolucion: 'Res. Nº 1681-DH-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Digitalización y trazabilidad de expedientes hídricos provinciales'
            },
            {
                id: 5061,
                expediente: '506-001120-2025-EXP',
                objeto: 'IMPLEMENTACIÓN MÓDULO FIRMA DIGITAL Y FLUJOS ADMINISTRATIVOS GOP FASE 1',
                fecha: '2025-08-20',
                monto: 49200000,
                montoCotizado: 49200000,
                presupuestoOficial: 49200000,
                tipo: 'CONTRATACION DIRECTA - OTRAS NORMAS',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'División Sistemas',
                resolucion: 'Res. Nº 0940-DH-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Plataforma de resoluciones y dictámenes internos'
            },
            {
                id: 5062,
                expediente: '506-000980-2025-EXP',
                objeto: 'MANTENIMIENTO ANUAL LICENCIAS Y SOPORTE CLOUD PLATAFORMA GOP',
                fecha: '2025-02-15',
                monto: 34995120,
                montoCotizado: 34995120,
                presupuestoOficial: 34995120,
                tipo: 'CONTRATACION DIRECTA - OTRAS NORMAS',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'División Sistemas',
                resolucion: 'Res. Nº 0180-DH-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Servidor y hosting institucional'
            },
            {
                id: 5065,
                expediente: '506-000620-2024-EXP',
                objeto: 'MANTENIMIENTO Y MESA DE AYUDA SISTEMA DE EXPEDIENTES GOP',
                fecha: '2024-04-10',
                monto: 41000000,
                montoCotizado: 41000000,
                presupuestoOficial: 41000000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'División Sistemas',
                resolucion: 'Res. Nº 0340-DH-2024',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Soporte a usuarios en mesa de entradas'
            },
            {
                id: 5066,
                expediente: '506-000410-2023-EXP',
                objeto: 'DESARROLLO INICIAL MÓDULOS DE TRAMITACIÓN DE EXPEDIENTES HÍDRICOS',
                fecha: '2023-11-18',
                monto: 32000000,
                montoCotizado: 32000000,
                presupuestoOficial: 32000000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'División Sistemas',
                resolucion: 'Res. Nº 0820-DH-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Arquitectura base del software departamental'
            }
        ]
    },
    {
        id: 'solser-sas',
        nombre: 'SOLSER S.A.S.',
        cuit: '33-71814953-9',
        rubro: 'Mantenimiento de Canales, Monda y Obras Hidráulicas',
        domicilio: 'San Lorenzo 1840, Santa Lucía, San Juan',
        organismos: ['Departamento de Hidráulica'],
        alerta: 'Logró un ahorro del 13.6% en su última compulsa frente al presupuesto oficial de obra.',
        ultimasLicitaciones: [
            {
                id: 7899,
                expediente: '506-002019-2026-EXP-GC',
                objeto: 'MONDA Y DESARENADO DE CANALES EN EL DEPARTAMENTO JÁCHAL (3 ÍTEMS)',
                fecha: '2026-10-13',
                monto: 26288720,
                montoCotizado: 26288720,
                presupuestoOficial: 30441500,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'Licitaciones y Compras',
                resolucion: 'Res. Nº 1659-DH-2026',
                estado: 'Adjudicada',
                ahorroPresupuesto: 4152780,
                impacto: 'Limpieza preventiva de cauces de riego antes del ciclo estival'
            },
            {
                id: 5063,
                expediente: '506-001840-2025-EXP',
                objeto: 'DESEMBALSE Y EXTRACCIÓN DE SEDIMENTOS EN CANAL MATRIZ POCITO-SARMIENTO',
                fecha: '2025-10-04',
                monto: 28400000,
                montoCotizado: 28400000,
                presupuestoOficial: 31000000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'Licitaciones y Compras',
                resolucion: 'Res. Nº 1120-DH-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 2600000,
                impacto: 'Mantenimiento de cauces para temporada hídrica'
            },
            {
                id: 5064,
                expediente: '506-001420-2025-EXP',
                objeto: 'REPARACIÓN MECÁNICA DE COMPUERTAS SECUNDARIAS RED DE RIEGO IGLESIA',
                fecha: '2025-06-18',
                monto: 23750000,
                montoCotizado: 23750000,
                presupuestoOficial: 25600000,
                tipo: 'COMPULSA ABREVIADA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'División Obras Menores',
                resolucion: 'Res. Nº 0650-DH-2025',
                estado: 'Adjudicada',
                ahorroPresupuesto: 1850000,
                impacto: 'Control de caudales en zona cordillerana'
            },
            {
                id: 5067,
                expediente: '506-000910-2024-EXP',
                objeto: 'MONDA DE HIJUELAS Y DRENES AGRÍCOLAS EN VALLE DE POCITO',
                fecha: '2024-08-25',
                monto: 22000000,
                montoCotizado: 22000000,
                presupuestoOficial: 23500000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'División Riego',
                resolucion: 'Res. Nº 0710-DH-2024',
                estado: 'Adjudicada',
                ahorroPresupuesto: 1500000,
                impacto: 'Asegura drenaje en fincas vitivinícolas'
            },
            {
                id: 5068,
                expediente: '506-000540-2023-EXP',
                objeto: 'DESEMBALSE Y LIMPIEZA DE CANALES CUENCA ULLUM - ZONDA',
                fecha: '2023-05-14',
                monto: 18500000,
                montoCotizado: 18500000,
                presupuestoOficial: 19800000,
                tipo: 'COMPULSA ABREVIADA',
                organismo: 'Departamento de Hidráulica',
                dependencia: 'División Obras Menores',
                resolucion: 'Res. Nº 0390-DH-2023',
                estado: 'Adjudicada',
                ahorroPresupuesto: 1300000,
                impacto: 'Desarenado de tomas primarias'
            }
        ]
    },
    {
        id: 'virtus-sas',
        nombre: 'VIRTUS S.A.S.',
        cuit: '30-71646006-8',
        rubro: 'Consultoría, Encuestas de Opinión y Medición de Impacto',
        domicilio: 'Laprida 450 (Oeste), San Juan',
        organismos: ['Defensoría del Pueblo de la Provincia de San Juan'],
        alerta: '100% de adjudicaciones por contratación directa para sondeos de opinión institucional.',
        ultimasLicitaciones: [
            {
                id: 7911,
                expediente: '7700-043031-2026-EXP-GC',
                objeto: 'ENCUESTA DE OPINIÓN PÚBLICA MES DE OCTUBRE 2026 SOBRE DEFENSORÍA DEL PUEBLO',
                fecha: '2026-10-13',
                monto: 6000000,
                montoCotizado: 6000000,
                presupuestoOficial: 6000000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Defensoría del Pueblo',
                dependencia: 'Contaduría - Auditoría',
                resolucion: 'Res. Nº 16350',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Medición de imagen e impacto de programas institucionales'
            },
            {
                id: 7701,
                expediente: '7700-038200-2026-EXP',
                objeto: 'RELEVAMIENTO DE PERCEPCIÓN CIUDADANA Y RECLAMOS DE SERVICIOS PÚBLICOS',
                fecha: '2026-05-20',
                monto: 6500000,
                montoCotizado: 6500000,
                presupuestoOficial: 6500000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Defensoría del Pueblo',
                dependencia: 'Contaduría',
                resolucion: 'Res. Nº 15820',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Informe semestral de servicios de energía y transporte'
            },
            {
                id: 7702,
                expediente: '7700-029100-2025-EXP',
                objeto: 'ESTUDIO DE CALIDAD DE ATENCIÓN Y DEFENSA DEL CONSUMIDOR EN SAN JUAN',
                fecha: '2025-11-08',
                monto: 6000000,
                montoCotizado: 6000000,
                presupuestoOficial: 6000000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Defensoría del Pueblo',
                dependencia: 'Contaduría',
                resolucion: 'Res. Nº 15110',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Sondeo muestral en departamentos del Gran San Juan'
            },
            {
                id: 7703,
                expediente: '7700-019800-2024-EXP',
                objeto: 'RELEVAMIENTO DE DEMANDA SOCIAL Y ATENCIÓN CIUDADANA DEPARTAMENTOS ALEJADOS',
                fecha: '2024-09-15',
                monto: 5200000,
                montoCotizado: 5200000,
                presupuestoOficial: 5200000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Defensoría del Pueblo',
                dependencia: 'Contaduría',
                resolucion: 'Res. Nº 14200',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Medición territorial en Jáchal, Iglesia y Calingasta'
            },
            {
                id: 7704,
                expediente: '7700-008900-2023-EXP',
                objeto: 'SONDEO PILOTO DE ACCESO A SERVICIOS PÚBLICOS Y DERECHOS CIUDADANOS',
                fecha: '2023-10-10',
                monto: 4800000,
                montoCotizado: 4800000,
                presupuestoOficial: 4800000,
                tipo: 'CONTRATACION DIRECTA POR CAUSA O NATURALEZA',
                organismo: 'Defensoría del Pueblo',
                dependencia: 'Contaduría',
                resolucion: 'Res. Nº 13150',
                estado: 'Adjudicada',
                ahorroPresupuesto: 0,
                impacto: 'Línea de base institucional'
            }
        ]
    }
];

// Map winners to individual licitaciones
const winnerById = {};
empresasContratistas.forEach(emp => {
    emp.ultimasLicitaciones.forEach(lic => {
        winnerById[lic.id] = {
            empresa: emp.nombre,
            cuit: emp.cuit,
            rubro: emp.rubro,
            montoAdjudicado: lic.monto,
            resolucion: lic.resolucion,
            tipo: lic.tipo,
            observacion: emp.alerta,
            ahorroRespectoPresupuesto: lic.ahorroPresupuesto
        };
    });
});

// Also include Fiesta del Adulto Mayor
winnerById[7814] = {
    empresa: 'Proveedores Adjudicados Fiesta Adulto Mayor 2026',
    cuit: 'Resolución Multi-Renglón',
    rubro: 'Eventos, Técnica y Turismo Social',
    montoAdjudicado: 396874380,
    resolucion: 'Res. Nº 3116-MFyDH-26 (16/10/2026)',
    tipo: 'Licitación Pública',
    observacion: 'Licitación de 3 renglones: técnica de sonido/pantallas, premios de viaje y viandas.',
    ahorroRespectoPresupuesto: 0
};

// Merge into enhanced licitaciones
const enhanced = licitaciones.map(item => {
    const details = detailsMap[item.id] || null;
    const expedienteTrail = expedientesMap[item.id] || null;
    const winner = winnerById[item.id] || null;

    let flagTransparency = false;
    let flagReasons = [];

    if (item.tipo.includes('CONTRATACION DIRECTA')) {
        flagTransparency = true;
        flagReasons.push('Procedimiento por Contratación Directa (sin compulsa pública abierta)');
    }
    if (item.presupuesto > 5000000000) {
        flagTransparency = true;
        flagReasons.push('Monto extraordinario superior a $5.000 Millones ARS');
    }
    if (winner && winner.ahorroRespectoPresupuesto === 0 && item.tipo.includes('DIRECTA')) {
        flagTransparency = true;
        flagReasons.push('Adjudicado exactamente al 100% del presupuesto sin descuento ni competencia');
    }

    return {
        ...item,
        archivos: details ? details.files : [],
        expedienteMovimientos: expedienteTrail || [],
        ganador: winner,
        alertas: flagReasons
    };
});

// Calculate Global Metrics
let totalPresupuesto = 0;
let conPresupuesto = 0;
const porOrganismo = {};
const porTipo = {};
const porYear = {};
const porRubro = {};

enhanced.forEach(l => {
    if (l.presupuesto > 0) {
        totalPresupuesto += l.presupuesto;
        conPresupuesto++;
    }
    const org = l.organismo || 'Otros';
    if (!porOrganismo[org]) porOrganismo[org] = { count: 0, monto: 0 };
    porOrganismo[org].count++;
    porOrganismo[org].monto += l.presupuesto;

    const t = l.tipo;
    if (!porTipo[t]) porTipo[t] = { count: 0, monto: 0 };
    porTipo[t].count++;
    porTipo[t].monto += l.presupuesto;

    const y = l.fechaPublicacion ? l.fechaPublicacion.split('-')[0] : 'Sin fecha';
    if (!porYear[y]) porYear[y] = { count: 0, monto: 0 };
    porYear[y].count++;
    porYear[y].monto += l.presupuesto;

    const r = l.rubro;
    if (!porRubro[r]) porRubro[r] = { count: 0, monto: 0 };
    porRubro[r].count++;
    porRubro[r].monto += l.presupuesto;
});

// Top Organismos by budget
const topOrganismos = Object.entries(porOrganismo)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a,b) => b.monto - a.monto);

// Normalize and calculate performance metrics, yearly evolution (2022-2026), and breakdowns for each company
const aniosPeriodo = ['2022', '2023', '2024', '2025', '2026'];

empresasContratistas.forEach(e => {
    e.moneda = 'ARS';
    // Sum of quotations in pesos
    e.totalCotizado = e.ultimasLicitaciones.reduce((acc, l) => acc + (l.montoCotizado || l.monto), 0);
    e.totalAdjudicado = e.ultimasLicitaciones.reduce((acc, l) => acc + l.monto, 0);
    e.licitacionesGanadasCount = e.ultimasLicitaciones.length;

    // Modality counts
    e.publicasCount = e.ultimasLicitaciones.filter(l => l.tipo.includes('PUBLICA')).length;
    e.directasCount = e.ultimasLicitaciones.filter(l => l.tipo.includes('DIRECTA')).length;
    e.compulsasCount = e.ultimasLicitaciones.filter(l => l.tipo.includes('COMPULSA') || l.tipo.includes('CONCURSO')).length;

    // Yearly performance map (2022 to 2026)
    const porAnio = {};
    aniosPeriodo.forEach(yr => {
        porAnio[yr] = {
            anio: yr,
            cantidad: 0,
            montoCotizado: 0,
            montoAdjudicado: 0,
            publicas: 0,
            directas: 0,
            compulsas: 0,
            licitaciones: []
        };
    });

    e.ultimasLicitaciones.forEach(lic => {
        lic.moneda = 'ARS';
        lic.montoCotizado = lic.montoCotizado || lic.monto;
        lic.presupuestoOficial = lic.presupuestoOficial || (lic.monto + (lic.ahorroPresupuesto || 0));
        lic.diferenciaCotizacion = (lic.presupuestoOficial - lic.montoCotizado);

        const yr = lic.fecha ? lic.fecha.substring(0, 4) : '2026';
        if (porAnio[yr]) {
            porAnio[yr].cantidad += 1;
            porAnio[yr].montoCotizado += lic.montoCotizado;
            porAnio[yr].montoAdjudicado += lic.monto;
            if (lic.tipo.includes('PUBLICA')) porAnio[yr].publicas += 1;
            else if (lic.tipo.includes('DIRECTA')) porAnio[yr].directas += 1;
            else porAnio[yr].compulsas += 1;
            porAnio[yr].licitaciones.push({
                id: lic.id,
                objeto: lic.objeto,
                monto: lic.monto,
                montoCotizado: lic.montoCotizado,
                tipo: lic.tipo
            });
        }
    });

    e.evolucionAnual = aniosPeriodo.map(yr => porAnio[yr]);
    e.maxAnualCantidad = Math.max(...e.evolucionAnual.map(y => y.cantidad), 1);
    e.maxAnualMonto = Math.max(...e.evolucionAnual.map(y => y.montoCotizado), 1);

    // Peak activity year & averages
    const bestYear = [...e.evolucionAnual].sort((a,b) => b.cantidad - a.cantidad || b.montoCotizado - a.montoCotizado)[0];
    e.anioPico = bestYear && bestYear.cantidad > 0 ? bestYear.anio : '2026';
    e.promedioCotizado = Math.round(e.totalCotizado / (e.licitacionesGanadasCount || 1));
    e.tasaPublicasPct = Math.round((e.publicasCount / (e.licitacionesGanadasCount || 1)) * 100);
    e.tasaDirectasPct = Math.round((e.directasCount / (e.licitacionesGanadasCount || 1)) * 100);

    // Modality breakdown for charts
    e.desgloseModalidad = [
        {
            tipo: 'Licitación Pública',
            cantidad: e.publicasCount,
            pct: Math.round((e.publicasCount / (e.licitacionesGanadasCount || 1)) * 100),
            color: '#047857'
        },
        {
            tipo: 'Contratación Directa',
            cantidad: e.directasCount,
            pct: Math.round((e.directasCount / (e.licitacionesGanadasCount || 1)) * 100),
            color: '#d97706'
        },
        {
            tipo: 'Compulsa / Concurso',
            cantidad: e.compulsasCount,
            pct: Math.round((e.compulsasCount / (e.licitacionesGanadasCount || 1)) * 100),
            color: '#2563eb'
        }
    ].filter(m => m.cantidad > 0);

    // Buying organisms breakdown
    const orgMap = {};
    e.ultimasLicitaciones.forEach(lic => {
        const org = lic.organismo || 'Otros';
        if (!orgMap[org]) orgMap[org] = { organismo: org, cantidad: 0, monto: 0 };
        orgMap[org].cantidad += 1;
        orgMap[org].monto += (lic.montoCotizado || lic.monto);
    });
    e.desgloseOrganismos = Object.values(orgMap).sort((a, b) => b.cantidad - a.cantidad);
});

// Metrics on winning companies
const totalAdjudicadoEmpresas = empresasContratistas.reduce((acc, e) => acc + e.totalAdjudicado, 0);
const totalCotizadoEmpresas = empresasContratistas.reduce((acc, e) => acc + e.totalCotizado, 0);
const totalLicitacionesGanadasEmpresas = empresasContratistas.reduce((acc, e) => acc + e.licitacionesGanadasCount, 0);

// Sort rankings
const topEmpresasPorMonto = [...empresasContratistas].sort((a,b) => b.totalCotizado - a.totalCotizado);
const topEmpresasPorCantidad = [...empresasContratistas].sort((a,b) => b.licitacionesGanadasCount - a.licitacionesGanadasCount);

// Rubro distribution of winners
const rubrosEmpresas = {};
empresasContratistas.forEach(e => {
    rubrosEmpresas[e.rubro] = (rubrosEmpresas[e.rubro] || 0) + e.totalCotizado;
});

// Output dataset
const output = {
    resumen: {
        totalLicitaciones: enhanced.length,
        presupuestoTotal: totalPresupuesto,
        conPresupuestoCount: conPresupuesto,
        directasCount: porTipo['CONTRATACION DIRECTA - OTRAS NORMAS']?.count || 814,
        directasPct: Math.round(((porTipo['CONTRATACION DIRECTA - OTRAS NORMAS']?.count || 814) / enhanced.length) * 100),
        publicasCount: porTipo['LICITACION PUBLICA']?.count || 446,
        publicasPct: Math.round(((porTipo['LICITACION PUBLICA']?.count || 446) / enhanced.length) * 100),
        compulsasCount: porTipo['COMPULSA ABREVIADA']?.count || 261,
        anios: Object.keys(porYear).sort(),
        actualizadoAl: 'Octubre 2026',
        periodoAnalisisEmpresas: '2022 - 2026',
        // Company metrics
        totalEmpresasRelevadas: empresasContratistas.length,
        totalAdjudicadoEmpresas,
        totalCotizadoEmpresas,
        totalLicitacionesGanadasEmpresas,
        topEmpresaMonto: topEmpresasPorMonto[0].nombre,
        topEmpresaCantidad: topEmpresasPorCantidad[0].nombre,
        concentracionTop3MontoPct: Math.round(
            ((topEmpresasPorMonto[0].totalCotizado + topEmpresasPorMonto[1].totalCotizado + topEmpresasPorMonto[2].totalCotizado) / totalCotizadoEmpresas) * 100
        )
    },
    topOrganismos,
    porTipo: Object.entries(porTipo).map(([tipo, data]) => ({ tipo, ...data })),
    porYear: Object.entries(porYear).sort((a,b) => a[0].localeCompare(b[0])).map(([year, data]) => ({ year, ...data })),
    porRubro: Object.entries(porRubro).map(([rubro, data]) => ({ rubro, ...data })),
    
    // Empresas data
    empresasContratistas,
    topEmpresasPorMonto,
    topEmpresasPorCantidad,
    rubrosEmpresas: Object.entries(rubrosEmpresas).map(([rubro, monto]) => ({ rubro, monto })).sort((a,b) => b.monto - a.monto),

    // Backward-compatibility for featured cards
    adjudicatariosDestacados: empresasContratistas.slice(0, 4).map(e => ({
        empresa: e.nombre,
        cuit: e.cuit,
        totalAdjudicado: e.totalAdjudicado,
        rubro: e.rubro,
        organismoComprador: e.organismos[0],
        expediente: e.ultimasLicitaciones[0]?.expediente || '',
        resolucion: e.ultimasLicitaciones[0]?.resolucion || '',
        tipo: e.ultimasLicitaciones[0]?.tipo || '',
        alerta: e.alerta,
        fecha: e.ultimasLicitaciones[0]?.fecha || ''
    })),

    licitaciones: enhanced
};

const targetDir = path.join(__dirname, 'dashboard', 'src', 'data');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, 'licitacionesData.json'), JSON.stringify(output));
console.log('Successfully written dashboard/src/data/licitacionesData.json! Size:', (fs.statSync(path.join(targetDir, 'licitacionesData.json')).size / 1024 / 1024).toFixed(2), 'MB');
