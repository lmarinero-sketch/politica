import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  HelpCircle, 
  FileWarning, 
  EyeOff, 
  Scale, 
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  ArrowRight,
  Download,
  FileText,
  Building2,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';

export const TransparencyView = ({ 
  resumen = {}, 
  licitaciones = [], 
  empresas = [],
  onSelectLicitacionById,
  onNavigateToExplorer
}) => {
  // Expanded alert ID: 'cd-ratio' | 'single-invitation' | 'format-barrier' | 'concentration' | null
  const [expandedAlertId, setExpandedAlertId] = useState('cd-ratio');
  
  // Search & Filter state for the active alert dossier
  const [alertSearchTerm, setAlertSearchTerm] = useState('');
  const [selectedYearFilter, setSelectedYearFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const formatMoney = (val) => {
    if (!val && val !== 0) return '$0';
    return `$${val.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;
  };

  const formatMillions = (val) => {
    if (!val) return '$0';
    if (val >= 1e9) {
      return `$${(val / 1e9).toFixed(2)}B`;
    }
    return `$${(val / 1e6).toFixed(1)}M`;
  };

  // 1. Direct Contracting processes (814+ items)
  const directContracts = useMemo(() => {
    return licitaciones.filter(l => l.tipo && l.tipo.includes('CONTRATACION DIRECTA'));
  }, [licitaciones]);

  // Filtered direct contracts
  const filteredDirectContracts = useMemo(() => {
    return directContracts.filter(l => {
      const matchesSearch = 
        !alertSearchTerm ||
        (l.objeto && l.objeto.toLowerCase().includes(alertSearchTerm.toLowerCase())) ||
        (l.expediente && l.expediente.toLowerCase().includes(alertSearchTerm.toLowerCase())) ||
        (l.organismo && l.organismo.toLowerCase().includes(alertSearchTerm.toLowerCase()));

      const year = l.fechaPublicacion ? l.fechaPublicacion.substring(0, 4) : '';
      const matchesYear = selectedYearFilter === 'todos' || year === selectedYearFilter;

      return matchesSearch && matchesYear;
    });
  }, [directContracts, alertSearchTerm, selectedYearFilter]);

  // Pagination for Direct Contracts table
  const totalDirectPages = Math.ceil(filteredDirectContracts.length / pageSize) || 1;
  const pagedDirectContracts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDirectContracts.slice(start, start + pageSize);
  }, [filteredDirectContracts, currentPage]);

  // 2. Verified Single Invitation Cases (Oferente único)
  const singleInvitationCases = useMemo(() => {
    const list = [];
    empresas.forEach(emp => {
      emp.ultimasLicitaciones.forEach(lic => {
        if (lic.tipo.includes('DIRECTA') || emp.alerta.includes('100% de adjudicaciones') || lic.ahorroPresupuesto === 0) {
          list.push({
            ...lic,
            empresa: emp.nombre,
            cuit: emp.cuit,
            rubro: emp.rubro,
            motivo: emp.alerta
          });
        }
      });
    });
    return list;
  }, [empresas]);

  // 3. Processes with Official Scanned PDFs Attached
  const scannedPdfCases = useMemo(() => {
    return licitaciones.filter(l => l.archivos && l.archivos.length > 0);
  }, [licitaciones]);

  // 4. Institutional Concentration (Top 3)
  const topOrganismos = useMemo(() => {
    const orgs = {};
    licitaciones.forEach(l => {
      const name = l.organismo || 'Otros';
      if (!orgs[name]) orgs[name] = { name, count: 0, monto: 0, items: [] };
      orgs[name].count++;
      orgs[name].monto += (l.presupuesto || 0);
      orgs[name].items.push(l);
    });
    return Object.values(orgs).sort((a,b) => b.monto - a.monto).slice(0, 3);
  }, [licitaciones]);

  const totalPresupuestoProvincial = licitaciones.reduce((acc, l) => acc + (l.presupuesto || 0), 0);

  const toggleAlert = (id) => {
    setExpandedAlertId(prev => (prev === id ? null : id));
    setCurrentPage(1);
    setAlertSearchTerm('');
    setSelectedYearFilter('todos');
  };

  const flags = [
    {
      id: 'cd-ratio',
      severity: 'high',
      title: 'Predominio de Contratación Directa (52,5%)',
      metric: `${directContracts.length} de ${licitaciones.length} procesos`,
      countNumber: directContracts.length,
      badgeColor: 'border-l-[#d63638]',
      badgeBg: 'bg-[#fdf2f2] text-[#9b1c1c] border-[#f8b4b4]',
      summary: 'El 52,5% de las compras y contrataciones del Estado de San Juan se canalizan mediante la figura de "Contratación Directa - Otras Normas", superando ampliamente los estándares de compras públicas de la OCDE y CIPPEC (que recomiendan un tope máximo del 15% al 20%).',
      impact: 'Riesgo de sobreprecios, desincentivo a la competencia y menor participación de pequeñas y medianas empresas locales.',
      remediation: 'Exigir licitaciones públicas abiertas con pliegos gratuitos para todo gasto que supere los montos de compras menores.',
      ctaText: `Ver los ${directContracts.length} procesos de contratación directa`
    },
    {
      id: 'single-invitation',
      severity: 'high',
      title: 'Contrataciones con Oferente Único Invitado',
      metric: `${singleInvitationCases.length} Casos Auditados con Resolución`,
      countNumber: singleInvitationCases.length,
      badgeColor: 'border-l-[#d63638]',
      badgeBg: 'bg-[#fdf2f2] text-[#9b1c1c] border-[#f8b4b4]',
      summary: 'Tal como se evidencia en los actos administrativos provinciales (ej. Res. Nº 1681-DH-2026, Exp. 506-001545-2026, Res. Nº 16350, entre otros), se cursa "Carta de Invitación" a una única firma comercial preseleccionada, adjudicándole el contrato por el 100% del presupuesto sin puja de ofertas.',
      impact: 'Elimina de facto la competencia comercial y fija el precio final en el tope del presupuesto oficial estimado.',
      remediation: 'Implementar obligatoriedad de al menos 3 cotizaciones válidas e independientes previo a cualquier adjudicación directa.',
      ctaText: `Ver los ${singleInvitationCases.length} decretos con oferente único`
    },
    {
      id: 'format-barrier',
      severity: 'medium',
      title: 'Barrera de Acceso: Resoluciones en PDF Escaneado',
      metric: `${scannedPdfCases.length} Procesos con Resoluciones Extraídas`,
      countNumber: scannedPdfCases.length,
      badgeColor: 'border-l-[#dba617]',
      badgeBg: 'bg-[#fcf9e8] text-[#713f12] border-[#f1e29c]',
      summary: 'El portal provincial publica las resoluciones de adjudicación en formato de imagen/foto escaneada (mediante escáner o fotocopiadora) en lugar de PDFs nativos con capa de texto OCR y firma digital verificable.',
      impact: 'Impide que los ciudadanos, periodistas y órganos de control auditen masivamente a los ganadores mediante búsquedas algorítmicas.',
      remediation: 'Adoptar el Estándar de Datos para las Contrataciones Abiertas (OCDS / EDCA) que ya usan Mendoza, CABA y el Estado Nacional.',
      ctaText: `Ver los ${scannedPdfCases.length} expedientes con resoluciones escaneadas`
    },
    {
      id: 'concentration',
      severity: 'medium',
      title: 'Alta Concentración Institucional',
      metric: 'Top 3 = 67% del Presupuesto',
      countNumber: topOrganismos.length,
      badgeColor: 'border-l-[#dba617]',
      badgeBg: 'bg-[#fcf9e8] text-[#713f12] border-[#f1e29c]',
      summary: 'Tres reparticiones (Vialidad Provincial, Ministerio de Infraestructura y Hospital Rawson / Ministerio de Salud) absorben más de dos tercios de todos los fondos presupuestados en la provincia.',
      impact: 'Focaliza el riesgo fiscal en pocas unidades operativas de compras.',
      remediation: 'Mayor supervisión de las Delegaciones Fiscales del Tribunal de Cuentas en las obras viales y programas hospitalarios.',
      ctaText: 'Ver desglose presupuestario de los 3 organismos'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-display">
      
      {/* 1. Header Box (WordPress Editorial Callout Style) */}
      <div className="bg-white border border-[#c3c4c7] border-l-4 border-l-[#134e2c] p-5 rounded shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#134e2c] text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-[#134e2c]" />
              Auditoría Cívica & Banderas Rojas (Red Flags)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1d2327]">
              Semáforo de Transparencia de San Juan
            </h2>
            <p className="text-xs sm:text-sm text-[#50575e] leading-relaxed max-w-3xl mt-1">
              Análisis automatizado de riesgos de integridad basado en los estándares internacionales de la OCDE y la Alianza para el Gobierno Abierto (OGP). <strong>Haz clic en cualquiera de las 4 alertas para desplegar el expediente y listado completo de procesos relacionados.</strong>
            </p>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#f0f0f1] text-[#2c3338] border border-[#c3c4c7] font-mono">
              Auditoría Octubre 2026
            </span>
          </div>
        </div>
      </div>

      {/* 2. Four Red Flag Dossier Cards */}
      <div className="space-y-4">
        {flags.map((flag) => {
          const isHigh = flag.severity === 'high';
          const isExpanded = expandedAlertId === flag.id;

          return (
            <div 
              key={flag.id}
              className={`bg-white border transition-all rounded shadow-xs overflow-hidden ${
                isExpanded 
                  ? 'border-[#134e2c] ring-1 ring-[#134e2c]' 
                  : 'border-[#c3c4c7] hover:border-[#8c8f94]'
              }`}
            >
              {/* Card Header (Accordion Clickable) */}
              <div 
                onClick={() => toggleAlert(flag.id)}
                className={`p-5 cursor-pointer select-none border-l-4 ${flag.badgeColor} ${
                  isExpanded ? 'bg-[#fcfdfc]' : 'bg-white hover:bg-[#fafafa]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Left: Indicator & Title */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${flag.badgeBg}`}>
                        Alerta {isHigh ? 'Crítica' : 'Media'}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#50575e] bg-[#f0f0f1] px-2 py-0.5 rounded border border-[#dcdcde]">
                        {flag.metric}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1d2327]">
                      {flag.title}
                    </h3>
                    
                    <p className="text-xs text-[#2c3338] leading-relaxed max-w-4xl">
                      {flag.summary}
                    </p>
                  </div>

                  {/* Right: Expand Button */}
                  <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#f0f0f1] flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAlert(flag.id);
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition border ${
                        isExpanded
                          ? 'bg-[#134e2c] text-white border-[#0f3d23]'
                          : 'bg-[#f6f7f7] text-[#2c3338] border-[#c3c4c7] hover:bg-[#f0f0f1] hover:border-[#134e2c]'
                      }`}
                    >
                      <span>{isExpanded ? 'Ocultar Casos' : flag.ctaText}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                </div>

                {/* Impact & Remediation Callouts (WordPress Notice Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-[#fdf2f2] border border-[#f8b4b4] rounded text-[#2c3338]">
                    <strong className="text-[#9b1c1c] block mb-0.5">Impacto en Transparencia:</strong>
                    <span>{flag.impact}</span>
                  </div>
                  <div className="p-3 bg-[#edf7ed] border border-[#c8e6c9] rounded text-[#2c3338]">
                    <strong className="text-[#134e2c] block mb-0.5">Propuesta de Mejora Institucional:</strong>
                    <span>{flag.remediation}</span>
                  </div>
                </div>
              </div>

              {/* 3. EXPANDABLE SECTION: DETAILED CASE DOSSIER */}
              {isExpanded && (
                <div className="p-5 bg-[#f6f7f7] border-t border-[#c3c4c7] space-y-4 animate-fade-in">
                  
                  {/* CASE 1: CONTRATACIONES DIRECTAS (814 PROCESOS) */}
                  {flag.id === 'cd-ratio' && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 border border-[#c3c4c7] rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1d2327]">
                            Listado Auditado de Contrataciones Directas
                          </span>
                          <span className="badge badge-neutral text-[10px]">
                            {filteredDirectContracts.length} encontrados
                          </span>
                        </div>

                        {/* Search & Year Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-[#8c8f94] absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Filtrar por objeto o expediente..."
                              value={alertSearchTerm}
                              onChange={(e) => {
                                setAlertSearchTerm(e.target.value);
                                setCurrentPage(1);
                              }}
                              className="pl-8 pr-3 py-1 text-xs bg-white border border-[#c3c4c7] rounded text-[#2c3338] w-48 sm:w-64 focus:outline-none"
                            />
                          </div>

                          <select
                            value={selectedYearFilter}
                            onChange={(e) => {
                              setSelectedYearFilter(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="px-2 py-1 text-xs bg-white border border-[#c3c4c7] rounded text-[#2c3338]"
                          >
                            <option value="todos">Todos los Años</option>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                          </select>
                        </div>
                      </div>

                      {/* WordPress List Table */}
                      <div className="overflow-x-auto border border-[#c3c4c7] rounded bg-white">
                        <table className="wp-table">
                          <thead>
                            <tr>
                              <th style={{ width: '100px' }}>Fecha</th>
                              <th style={{ width: '160px' }}>Expediente</th>
                              <th>Objeto de la Contratación Directa</th>
                              <th style={{ width: '220px' }}>Organismo Comprador</th>
                              <th style={{ width: '140px' }} className="text-right">Monto ($ ARS)</th>
                              <th style={{ width: '110px' }} className="text-center">Acción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pagedDirectContracts.map((item) => (
                              <tr key={item.id}>
                                <td className="font-mono text-xs text-[#50575e] whitespace-nowrap">
                                  {item.fechaPublicacion || 'S/D'}
                                </td>
                                <td className="font-mono text-xs font-semibold text-[#134e2c] whitespace-nowrap">
                                  {item.expediente || `ID-${item.id}`}
                                </td>
                                <td className="text-xs font-medium text-[#1d2327]">
                                  <div className="line-clamp-2" title={item.objeto}>
                                    {item.objeto}
                                  </div>
                                  <span className="text-[10px] text-[#646970]">
                                    Modalidad: {item.tipo}
                                  </span>
                                </td>
                                <td className="text-xs text-[#3c434a]">
                                  {item.organismo}
                                </td>
                                <td className="font-mono text-xs font-bold text-[#134e2c] text-right whitespace-nowrap">
                                  {item.presupuesto > 0 ? formatMoney(item.presupuesto) : 'A cotizar'}
                                </td>
                                <td className="text-center">
                                  <button
                                    onClick={() => onSelectLicitacionById && onSelectLicitacionById(item.id)}
                                    className="px-2 py-1 rounded text-[11px] font-semibold bg-[#edf7ed] hover:bg-[#134e2c] text-[#134e2c] hover:text-white border border-[#c8e6c9] transition"
                                  >
                                    Ver Pliego
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {pagedDirectContracts.length === 0 && (
                              <tr>
                                <td colSpan="6" className="text-center py-6 text-xs text-[#646970]">
                                  No se encontraron contrataciones directas para el criterio seleccionado.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#50575e] bg-white p-3 border border-[#c3c4c7] rounded">
                        <div>
                          Mostrando página <strong>{currentPage}</strong> de <strong>{totalDirectPages}</strong> ({filteredDirectContracts.length} contrataciones directas filtradas)
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            className="px-2.5 py-1 rounded bg-[#f6f7f7] border border-[#c3c4c7] disabled:opacity-50 text-[#2c3338] font-semibold"
                          >
                            ← Anterior
                          </button>
                          <span className="px-2 font-mono text-xs">{currentPage}</span>
                          <button
                            disabled={currentPage >= totalDirectPages}
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalDirectPages))}
                            className="px-2.5 py-1 rounded bg-[#f6f7f7] border border-[#c3c4c7] disabled:opacity-50 text-[#2c3338] font-semibold"
                          >
                            Siguiente →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CASE 2: CONTRATACIONES CON OFERENTE ÚNICO INVITADO */}
                  {flag.id === 'single-invitation' && (
                    <div className="space-y-3">
                      <div className="bg-white p-3 border border-[#c3c4c7] rounded flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1d2327]">
                          Evidencia Documental de Contrataciones con Invitación Única (Sin Puja de Precios)
                        </span>
                        <span className="text-[11px] text-[#50575e]">
                          {singleInvitationCases.length} resoluciones auditadas
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {singleInvitationCases.map((c, idx) => (
                          <div key={idx} className="bg-white border border-[#c3c4c7] rounded p-4 space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="badge badge-directa text-[10px]">
                                Oferente Único Invitado
                              </span>
                              <span className="font-mono text-xs font-bold text-[#134e2c]">
                                {formatMoney(c.montoCotizado || c.monto)} ARS
                              </span>
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-[#1d2327]">
                                {c.empresa}
                              </h4>
                              <span className="text-[11px] text-[#646970] font-mono">
                                CUIT: {c.cuit} • {c.rubro}
                              </span>
                            </div>

                            <p className="text-xs text-[#2c3338] bg-[#fcf9e8] p-2.5 rounded border border-[#f1e29c] font-medium leading-snug">
                              <strong>Objeto:</strong> {c.objeto}
                            </p>

                            <div className="text-[11px] text-[#50575e] space-y-1 pt-1 border-t border-[#f0f0f1]">
                              <div className="flex justify-between">
                                <span>Acto Administrativo:</span>
                                <strong className="text-[#134e2c] font-mono">{c.resolucion}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Expediente:</span>
                                <span className="font-mono text-[#2c3338]">{c.expediente}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Observación:</span>
                                <span className="text-[#78350f] font-semibold">{c.motivo || 'Cotización adjudicada al 100%'}</span>
                              </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => onSelectLicitacionById && onSelectLicitacionById(c.id)}
                                className="px-2.5 py-1 text-xs font-semibold rounded bg-[#edf7ed] hover:bg-[#134e2c] text-[#134e2c] hover:text-white border border-[#c8e6c9] transition"
                              >
                                Ver Expediente y Trazabilidad →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CASE 3: RESOLUCIONES EN PDF ESCANEADO */}
                  {flag.id === 'format-barrier' && (
                    <div className="space-y-3">
                      <div className="bg-white p-3 border border-[#c3c4c7] rounded flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1d2327]">
                          Expedientes Auditados con Resoluciones en Formato Imagen/Escáner
                        </span>
                        <span className="text-[11px] text-[#50575e]">
                          {scannedPdfCases.length} archivos indexados
                        </span>
                      </div>

                      <div className="space-y-2">
                        {scannedPdfCases.map((item) => (
                          <div key={item.id} className="bg-white border border-[#c3c4c7] rounded p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#134e2c]">
                                  {item.expediente || `ID-${item.id}`}
                                </span>
                                <span className="badge badge-neutral text-[10px]">
                                  PDF Escaneado (Raster)
                                </span>
                              </div>
                              <p className="font-medium text-[#2c3338] truncate">
                                {item.objeto}
                              </p>
                              <div className="text-[11px] text-[#646970]">
                                Archivo: <code className="font-mono text-[#134e2c]">{item.archivos[0]?.name || 'RES. ADJUDICACION.pdf'}</code> • Organismo: {item.organismo}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {item.archivos && item.archivos[0]?.url && (
                                <a
                                  href={item.archivos[0].url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2c3338] border border-[#c3c4c7] text-xs font-semibold flex items-center gap-1"
                                >
                                  <Download className="w-3 h-3 text-[#134e2c]" />
                                  <span>Descargar PDF</span>
                                </a>
                              )}
                              <button
                                onClick={() => onSelectLicitacionById && onSelectLicitacionById(item.id)}
                                className="px-2.5 py-1 rounded bg-[#edf7ed] hover:bg-[#134e2c] text-[#134e2c] hover:text-white border border-[#c8e6c9] text-xs font-semibold"
                              >
                                Ver Detalle
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CASE 4: ALTA CONCENTRACIÓN INSTITUCIONAL */}
                  {flag.id === 'concentration' && (
                    <div className="space-y-3">
                      <div className="bg-white p-3 border border-[#c3c4c7] rounded text-xs font-bold text-[#1d2327]">
                        Concentración Presupuestaria en los 3 Principales Compradores Provinciales
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {topOrganismos.map((org, idx) => {
                          const pct = ((org.monto / (totalPresupuestoProvincial || 1)) * 100).toFixed(1);
                          return (
                            <div key={idx} className="bg-white border border-[#c3c4c7] rounded p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold bg-[#edf7ed] text-[#134e2c] px-2 py-0.5 rounded border border-[#c8e6c9]">
                                  Puesto #{idx + 1}
                                </span>
                                <span className="font-mono text-xs font-bold text-[#713f12]">
                                  {pct}% del total
                                </span>
                              </div>

                              <div>
                                <h4 className="text-sm font-bold text-[#1d2327] line-clamp-2">
                                  {org.name}
                                </h4>
                                <div className="text-lg font-bold font-mono text-[#134e2c] mt-1">
                                  {formatMillions(org.monto)} <span className="text-xs text-[#50575e]">ARS</span>
                                </div>
                                <span className="text-xs text-[#646970]">
                                  {org.count} licitaciones registradas
                                </span>
                              </div>

                              <div className="w-full h-2 bg-[#dcdcde] rounded overflow-hidden">
                                <div 
                                  className="h-full bg-[#134e2c]" 
                                  style={{ width: `${Math.min(pct * 2, 100)}%` }}
                                ></div>
                              </div>

                              <div className="space-y-1.5 pt-1 border-t border-[#f0f0f1]">
                                <span className="text-[10px] uppercase font-bold text-[#646970] block">
                                  Mayores Procesos de esta Repartición:
                                </span>
                                {org.items.slice(0, 2).map((item, itIdx) => (
                                  <div key={itIdx} className="text-[11px] text-[#2c3338] truncate flex items-center justify-between">
                                    <span className="truncate max-w-[170px]">{item.objeto}</span>
                                    <span className="font-mono font-bold text-[#134e2c]">{formatMillions(item.presupuesto)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* 4. Scoring Index Table (WordPress Admin Metabox Style) */}
      <div className="bg-white border border-[#c3c4c7] rounded p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-[#dcdcde] mb-4">
          <Scale className="w-4 h-4 text-[#134e2c]" />
          <h3 className="text-sm sm:text-base font-bold text-[#1d2327]">
            Índice de Madurez de Datos Abiertos en Contrataciones de San Juan
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3.5 rounded bg-[#f6f7f7] border border-[#dcdcde] flex flex-col justify-between">
            <div>
              <div className="text-[#50575e] font-semibold mb-1">Publicación de Procesos</div>
              <div className="text-2xl font-bold font-mono text-[#134e2c]">90 / 100</div>
            </div>
            <p className="text-[11px] text-[#646970] mt-2">
              Se publican la totalidad de compras y pliegos de forma centralizada en el portal.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#f6f7f7] border border-[#dcdcde] flex flex-col justify-between">
            <div>
              <div className="text-[#50575e] font-semibold mb-1">Competitividad de Ofertas</div>
              <div className="text-2xl font-bold font-mono text-[#d63638]">42 / 100</div>
            </div>
            <p className="text-[11px] text-[#646970] mt-2">
              Baja, debido a que el 52.5% de los procesos se canaliza por contratación directa.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#f6f7f7] border border-[#dcdcde] flex flex-col justify-between">
            <div>
              <div className="text-[#50575e] font-semibold mb-1">Datos Abiertos Estructurados</div>
              <div className="text-2xl font-bold font-mono text-[#dba617]">35 / 100</div>
            </div>
            <p className="text-[11px] text-[#646970] mt-2">
              Falta adopción de OCDS; las resoluciones son PDFs escaneados sin texto digital.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#f6f7f7] border border-[#dcdcde] flex flex-col justify-between">
            <div>
              <div className="text-[#50575e] font-semibold mb-1">Trazabilidad de Trámite</div>
              <div className="text-2xl font-bold font-mono text-[#134e2c]">85 / 100</div>
            </div>
            <p className="text-[11px] text-[#646970] mt-2">
              API abierta disponible para verificar los movimientos y pases entre oficinas GOP.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
