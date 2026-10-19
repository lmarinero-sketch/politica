# Vigía San Juan — Observatorio de Contrataciones y Transparencia Pública

Plataforma cívica e independiente de auditoría, monitoreo y análisis de las compras, licitaciones y adjudicaciones del Gobierno de la Provincia de San Juan (período 2022 a 2026).

---

## 🏛️ Características Principales

- **Auditoría Masiva de Procesos**: Base de datos integral con más de **1.550 contrataciones públicas** extraídas, normalizadas y clasificadas.
- **Semáforo de Transparencia Interactivo**: Dossier de evidencias con acceso a expedientes, decretos y análisis de riesgo:
  1. *Predominio de Contratación Directa*: Listado navegable de más de 810 contrataciones directas con buscador, filtros y acceso a pliegos.
  2. *Oferente Único Invitado*: Registro de 23 resoluciones auditadas donde se cursó carta de invitación a una sola firma preseleccionada adjudicándole el 100% del presupuesto.
  3. *Barrera de Acceso (PDF Escaneado)*: Identificación de 29 resoluciones subidas en imágenes fotocopiadas sin texto indexable ni firma digital.
  4. *Alta Concentración Institucional*: Análisis presupuestario del Top 3 de reparticiones provinciales (Vialidad, Infraestructura y Salud) que concentran más del 67% de los fondos.
- **Módulo de Adjudicatarios y Empresas Contratistas**:
  - Métricas de empresas que más ganan licitaciones públicas.
  - Importes totales cotizados y adjudicados en Pesos Argentinos (**ARS**).
  - Desglose colapsable por empresa con gráficos de evolución anual (2022 en adelante), modalidades de contratación y organismos clientes.
- **Explorador y Seguimiento de Expedientes**: Búsqueda en tiempo real por número de expediente, objeto, organismo, tipo de contratación y rango presupuestario.
- **Estética Editorial WordPress / Observatorio Ciudadano**: Diseño sobrio, limpio y contrastado, libre de artefactos artificiales de IA, con tipografía institucional *Montserrat* y paleta verde bosque (`#134e2c`).
- **Integración con Supabase PostgreSQL**: Persistencia de datos en la nube con tablas relacionales (`gob_licitaciones`, `gob_empresas`, `gob_observatorio_resumen`), índices optimizados y políticas RLS de lectura pública.

---

## 📂 Estructura del Repositorio

```text
├── dashboard/                     # Aplicación web frontend (React + Vite + Tailwind/CSS)
│   ├── src/
│   │   ├── components/            # Componentes UI (Header, KPISection, TransparencyView, etc.)
│   │   ├── data/                  # Dataset principal (licitacionesData.json)
│   │   ├── lib/                   # Cliente Supabase (supabaseClient.js)
│   │   └── index.css              # Sistema de estilos WordPress / Gov Portal
│   └── package.json
├── build_dataset.js               # Pipeline de construcción y consolidación de datos
├── clean_data.js                  # Algoritmos de normalización y limpieza
├── migrate_to_supabase.js         # Script de migración automática a Supabase PostgreSQL
├── .env.example                   # Plantilla de variables de entorno
└── README.md
```

---

## 🚀 Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/lmarinero-sketch/politica.git
cd politica
```

### 2. Configurar variables de entorno
Copiar el archivo de ejemplo y configurar las credenciales de Supabase:
```bash
cp .env.example .env
cp .env.example dashboard/.env
```

### 3. Migrar base de datos a Supabase (opcional)
Para registrar o actualizar los 1.550 procesos en Supabase PostgreSQL:
```bash
npm install
node migrate_to_supabase.js
```

### 4. Ejecutar el Observatorio Localmente
```bash
cd dashboard
npm install
npm run dev
```

El portal estará disponible en `http://localhost:5173`.
