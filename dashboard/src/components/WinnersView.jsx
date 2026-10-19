import React, { useState, useMemo } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Building2, 
  ShieldAlert, 
  ArrowRight, 
  Search, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Layers, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  DollarSign,
  Briefcase,
  AlertCircle,
  Calendar,
  Zap,
  Filter,
  X
} from 'lucide-react';

export const WinnersView = ({ 
  empresas = [], 
  topPorMonto = [], 
  topPorCantidad = [], 
  rubrosEmpresas = [], 
  resumen = {},
  onSelectLicitacionById 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRubro, setSelectedRubro] = useState('todos');
  const [sortBy, setSortBy] = useState('monto'); // 'monto', 'cantidad', 'directas'
  const [activeChartTab, setActiveChartTab] = useState('monto'); // 'monto', 'cantidad', 'rubros'
  const [expandedCompanyId, setExpandedCompanyId] = useState(null);
  
  // Interactive year filter per company: { [companyId]: '2024' | null }
  const [selectedYearByCompany, setSelectedYearByCompany] = useState({});

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

  // Filter & Sort companies
  const filteredEmpresas = useMemo(() => {
    return empresas
      .filter((emp) => {
        const matchesSearch = 
          emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.cuit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.rubro.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (emp.ultimasLicitaciones && emp.ultimasLicitaciones.some(lic => lic.objeto.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesRubro = selectedRubro === 'todos' || emp.rubro.toLowerCase().includes(selectedRubro.toLowerCase());

        return matchesSearch && matchesRubro;
      })
      .sort((a, b) => {
        if (sortBy === 'monto') return (b.totalCotizado || b.totalAdjudicado) - (a.totalCotizado || a.totalAdjudicado);
        if (sortBy === 'cantidad') return b.licitacionesGanadasCount - a.licitacionesGanadasCount;
        if (sortBy === 'directas') {
          const pctA = a.directasCount / (a.licitacionesGanadasCount || 1);
          const pctB = b.directasCount / (b.licitacionesGanadasCount || 1);
          return pctB - pctA;
        }
        return 0;
      });
  }, [empresas, searchTerm, selectedRubro, sortBy]);

  // Max values for relative chart bars
  const maxMonto = Math.max(...empresas.map(e => e.totalCotizado || e.totalAdjudicado), 1);
  const maxCantidad = Math.max(...empresas.map(e => e.licitacionesGanadasCount), 1);
  const totalMontoEmpresas = empresas.reduce((acc, e) => acc + (e.totalCotizado || e.totalAdjudicado), 0);

  const toggleExpand = (id) => {
    setExpandedCompanyId(prev => (prev === id ? null : id));
  };

  const handleYearFilter = (companyId, year) => {
    setSelectedYearByCompany(prev => ({
      ...prev,
      [companyId]: prev[companyId] === year ? null : year
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in font-display">
      
      {/* 1. Header & Overview Banner */}
      <div className="glass-panel p-6 border-emerald-300 bg-gradient-to-r from-emerald-50 via-white to-white relative overflow-hidden shadow-sm">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-[#064e3b] text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-[#047857]" />
            Módulo de Inteligencia de Proveedores & Adjudicaciones
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#064e3b] mb-2">
            Ranking y Rendimiento de Empresas Ganadoras en San Juan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Panel interactivo de auditoría cívica sobre los principales contratistas del Estado provincial. Monitorea la <strong>evolución histórica de licitaciones ganadas (período 2022 en adelante)</strong>, importes cotizados en pesos argentinos (ARS), y despliega en cada empresa gráficos dedicados de desempeño anual y concurrencia.
          </p>
        </div>
      </div>

      {/* 2. Key Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="glass-panel p-4 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Cotizado en Pesos
          </span>
          <div className="my-1.5">
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#064e3b]">
              ${(totalMontoEmpresas / 1e9).toFixed(2)}B <span className="text-xs font-bold text-[#047857]">ARS</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono font-medium truncate">
              {formatMoney(totalMontoEmpresas)} ARS
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#047857]" />
            {empresas.length} contratistas auditados (2022-2026)
          </div>
        </div>

        <div className="glass-panel p-4 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Mayor Cotización Individual
          </span>
          <div className="my-1.5">
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#064e3b]">
              $84.942 M <span className="text-xs font-bold text-[#047857]">ARS</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate">UT Vial RN40 (Autovía)</div>
          </div>
          <div className="text-[11px] text-slate-600 font-medium">Licitación Pública Nacional</div>
        </div>

        <div className="glass-panel p-4 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Más Licitaciones Ganadas
          </span>
          <div className="my-1.5">
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#047857]">
              7 Procesos
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate">Distribuidora Cuyo Médica S.A.</div>
          </div>
          <div className="text-[11px] text-slate-600 font-medium">Salud & Insumos Biomédicos</div>
        </div>

        <div className="glass-panel p-4 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Concentración Top 3
          </span>
          <div className="my-1.5">
            <div className="text-xl sm:text-2xl font-mono font-bold text-amber-700">
              {resumen.concentracionTop3MontoPct || 80.7}%
            </div>
            <div className="text-[10px] text-slate-400 font-medium">del monto total cotizado</div>
          </div>
          <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Alta concentración fiscal
          </div>
        </div>

        <div className="glass-panel p-4 bg-white border border-slate-200 shadow-sm flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Período Analizado
          </span>
          <div className="my-1.5">
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#064e3b]">
              2022 - 2026
            </div>
            <div className="text-[10px] text-slate-400 font-medium">5 años de adjudicaciones</div>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#047857]" />
            Series temporales completas
          </div>
        </div>
      </div>

      {/* 3. Global Comparative Charts Section */}
      <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#064e3b] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#047857]" />
              Gráficos Comparativos Globales de Proveedores (2022 - 2026)
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Comparativa visual general de firmas comerciales, importes cotizados en pesos y cantidad de procesos adjudicados
            </p>
          </div>

          {/* Chart View Toggle Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveChartTab('monto')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeChartTab === 'monto' 
                  ? 'bg-white text-[#064e3b] shadow-sm font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Importe Cotizado ($ ARS)
            </button>
            <button
              onClick={() => setActiveChartTab('cantidad')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeChartTab === 'cantidad' 
                  ? 'bg-white text-[#064e3b] shadow-sm font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Licitaciones Ganadas
            </button>
            <button
              onClick={() => setActiveChartTab('rubros')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeChartTab === 'rubros' 
                  ? 'bg-white text-[#064e3b] shadow-sm font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Rubros
            </button>
          </div>
        </div>

        {/* Tab 1: Ranking por Monto Total */}
        {activeChartTab === 'monto' && (
          <div className="pt-5 space-y-3.5">
            <div className="flex justify-between text-xs text-slate-400 font-semibold px-2">
              <span>EMPRESA / PROVEEDOR (HAZ CLIC PARA ABRIR GRÁFICOS)</span>
              <span>IMPORTE TOTAL COTIZADO EN PESOS ($ ARS)</span>
            </div>
            {topPorMonto.map((emp, index) => {
              const cotizadoVal = emp.totalCotizado || emp.totalAdjudicado;
              const pctOfMax = Math.round((cotizadoVal / maxMonto) * 100);
              const pctOfTotal = ((cotizadoVal / totalMontoEmpresas) * 100).toFixed(1);
              const isSelected = expandedCompanyId === emp.id;

              return (
                <div 
                  key={emp.id}
                  onClick={() => toggleExpand(emp.id)}
                  className={`group cursor-pointer p-2.5 rounded-xl border transition-all ${
                    isSelected ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400/30' : 'bg-slate-50/60 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                        index === 0 ? 'bg-amber-400 text-amber-950' : 
                        index === 1 ? 'bg-slate-300 text-slate-900' : 
                        index === 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-900 group-hover:text-[#064e3b] truncate max-w-[200px] sm:max-w-md">
                        {emp.nombre}
                      </span>
                      <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
                        ({emp.cuit})
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-[11px] text-slate-500 font-medium">{pctOfTotal}%</span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#064e3b]">
                        {formatMoney(cotizadoVal)} <span className="text-[11px] text-[#047857]">ARS</span>
                      </span>
                    </div>
                  </div>

                  {/* Relative bar with gradient */}
                  <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#10b981] rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(pctOfMax, 4)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Ranking por Cantidad de Licitaciones */}
        {activeChartTab === 'cantidad' && (
          <div className="pt-5 space-y-3.5">
            <div className="flex justify-between text-xs text-slate-400 font-semibold px-2">
              <span>EMPRESA Y DESGLOSE (PÚBLICA / DIRECTA / COMPULSA)</span>
              <span>TOTAL GANADAS (2022-2026)</span>
            </div>
            {topPorCantidad.map((emp, index) => {
              const isSelected = expandedCompanyId === emp.id;

              return (
                <div 
                  key={emp.id}
                  onClick={() => toggleExpand(emp.id)}
                  className={`group cursor-pointer p-2.5 rounded-xl border transition-all ${
                    isSelected ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400/30' : 'bg-slate-50/60 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100 text-[#064e3b] text-[10px] font-bold">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-900 group-hover:text-[#064e3b] truncate max-w-[200px] sm:max-w-md">
                        {emp.nombre}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium mr-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[#064e3b] font-bold">
                          {emp.publicasCount} Púb.
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                          {emp.directasCount} Dir.
                        </span>
                        {emp.compulsasCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold">
                            {emp.compulsasCount} Comp.
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#064e3b]">
                        {emp.licitacionesGanadasCount} licitaciones
                      </span>
                    </div>
                  </div>

                  {/* Relative bar */}
                  <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-[#064e3b]" 
                      style={{ width: `${(emp.publicasCount / maxCantidad) * 100}%` }}
                      title={`${emp.publicasCount} Licitaciones Públicas`}
                    ></div>
                    <div 
                      className="h-full bg-amber-500" 
                      style={{ width: `${(emp.directasCount / maxCantidad) * 100}%` }}
                      title={`${emp.directasCount} Contrataciones Directas`}
                    ></div>
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${(emp.compulsasCount / maxCantidad) * 100}%` }}
                      title={`${emp.compulsasCount} Compulsas Abreviadas`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Distribución por Rubros */}
        {activeChartTab === 'rubros' && (
          <div className="pt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rubrosEmpresas.map((item, idx) => {
                const pct = ((item.monto / totalMontoEmpresas) * 100).toFixed(1);
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800">{item.rubro}</span>
                      <span className="font-mono font-bold text-[#064e3b]">{formatMillions(item.monto)}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-1">
                      <div 
                        className="h-full bg-gradient-to-r from-[#064e3b] to-[#10b981]" 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium text-right">
                      Representa el {pct}% del total adjudicado
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Filter, Search & Sorting Controls */}
      <div className="glass-panel p-4 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Buscar empresa, CUIT o licitación ganada..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#047857] focus:bg-white text-slate-800 font-medium transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedRubro}
            onChange={(e) => setSelectedRubro(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-[#047857]"
          >
            <option value="todos">Todos los Rubros</option>
            <option value="Infraestructura">Infraestructura & Obra Vial</option>
            <option value="Salud">Salud & Insumos Médicos</option>
            <option value="Telecomunicaciones">Telecomunicaciones & TI</option>
            <option value="Hidráulicas">Hidráulica & Canales</option>
            <option value="Servicios">Servicios Generales & Vigilancia</option>
            <option value="Consultoría">Consultoría & Encuestas</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-[#047857]"
          >
            <option value="monto">Ordenar por Mayor Monto Total</option>
            <option value="cantidad">Ordenar por Más Licitaciones Ganadas</option>
            <option value="directas">Ordenar por % Contratación Directa</option>
          </select>
        </div>
      </div>

      {/* 5. Collapsible Company Cards with Dedicated Performance Charts (2022-2026) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>Mostrando <strong>{filteredEmpresas.length}</strong> empresas contratistas auditadas</span>
          <span className="text-[11px] text-[#047857] font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#047857]" />
            Toca o haz clic en cualquier empresa para ver sus <strong>gráficos de rendimiento (2022 en adelante)</strong>
          </span>
        </div>

        {filteredEmpresas.map((emp, index) => {
          const isExpanded = expandedCompanyId === emp.id;
          const directPct = emp.tasaDirectasPct ?? Math.round((emp.directasCount / (emp.licitacionesGanadasCount || 1)) * 100);
          const selectedYear = selectedYearByCompany[emp.id] || null;

          // Safe fallback for yearly evolution (2022 to 2026)
          const aniosPeriodo = ['2022', '2023', '2024', '2025', '2026'];
          const evolucion = emp.evolucionAnual && emp.evolucionAnual.length > 0 
            ? emp.evolucionAnual 
            : aniosPeriodo.map(yr => ({
                anio: yr,
                cantidad: emp.ultimasLicitaciones.filter(l => l.fecha && l.fecha.startsWith(yr)).length,
                montoCotizado: emp.ultimasLicitaciones.filter(l => l.fecha && l.fecha.startsWith(yr)).reduce((acc, l) => acc + (l.montoCotizado || l.monto), 0),
                publicas: emp.ultimasLicitaciones.filter(l => l.fecha && l.fecha.startsWith(yr) && l.tipo.includes('PUBLICA')).length,
                directas: emp.ultimasLicitaciones.filter(l => l.fecha && l.fecha.startsWith(yr) && l.tipo.includes('DIRECTA')).length,
                compulsas: emp.ultimasLicitaciones.filter(l => l.fecha && l.fecha.startsWith(yr) && !l.tipo.includes('PUBLICA') && !l.tipo.includes('DIRECTA')).length
              }));

          const maxYearCount = Math.max(...evolucion.map(y => y.cantidad), 1);
          const totalCotizadoVal = emp.totalCotizado || emp.totalAdjudicado;

          // Filter tenders for this company if a specific year is clicked in the chart
          const displayedTenders = selectedYear 
            ? emp.ultimasLicitaciones.filter(l => l.fecha && l.fecha.startsWith(selectedYear))
            : emp.ultimasLicitaciones;

          return (
            <div 
              key={emp.id} 
              className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                isExpanded 
                  ? 'border-[#047857] shadow-lg bg-white ring-2 ring-[#047857]/20' 
                  : 'border-slate-200 hover:border-emerald-300 bg-white shadow-sm'
              }`}
            >
              {/* Card Header (Accordion Collapsible Trigger) */}
              <div 
                onClick={() => toggleExpand(emp.id)}
                className={`p-5 sm:p-6 cursor-pointer select-none transition-colors border-b ${
                  isExpanded ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white hover:bg-slate-50/70 border-slate-100'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Identity */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge badge-success text-[10px]">
                        Contratista Verificado
                      </span>
                      <span className="font-mono text-xs text-slate-400 font-semibold">
                        CUIT: <strong className="text-slate-700">{emp.cuit}</strong>
                      </span>
                      {directPct >= 50 && (
                        <span className="badge badge-directa text-[10px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          {directPct}% Adjudicación Directa
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-[#047857] bg-emerald-100/70 px-2 py-0.5 rounded-full font-mono">
                        Período: 2022 - 2026
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#064e3b] transition flex items-center gap-2">
                      <span>{emp.nombre}</span>
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                      <span><strong className="text-slate-700">Rubro:</strong> {emp.rubro}</span>
                      <span className="text-slate-300">•</span>
                      <span><strong className="text-slate-700">Sede:</strong> {emp.domicilio}</span>
                    </div>
                  </div>

                  {/* Right: Aggregated Totals & Toggle Button */}
                  <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right font-mono">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                        Importe Total Cotizado en Pesos
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#064e3b]">
                        {formatMoney(totalCotizadoVal)} <span className="text-xs sm:text-sm font-bold text-[#047857]">ARS</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {emp.licitacionesGanadasCount} licitaciones ({emp.publicasCount} públicas, {emp.directasCount} directas)
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(emp.id);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs ${
                        isExpanded 
                          ? 'bg-[#064e3b] text-white hover:bg-[#047857]' 
                          : 'bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-200'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>{isExpanded ? 'Ocultar Gráficos' : 'Ver Gráficos y Licitaciones'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 ml-0.5" /> : <ChevronDown className="w-4 h-4 ml-0.5" />}
                    </button>
                  </div>

                </div>

                {/* Audit Observation */}
                {emp.alerta && (
                  <div className="mt-3.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span><strong>Observación de Transparencia:</strong> {emp.alerta}</span>
                  </div>
                )}
              </div>

              {/* Expandable Section: Dedicated Performance Charts (2022-2026) & Tenders */}
              {isExpanded && (
                <div className="p-5 sm:p-7 bg-slate-50/80 border-t border-slate-200 space-y-6 animate-fade-in">
                  
                  {/* SECTION A: PERFORMANCE CHARTS (PRIORITIZED) */}
                  <div className="space-y-4">
                    
                    {/* Panel Title & Scope */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-lg bg-[#064e3b] text-white">
                            <BarChart3 className="w-4 h-4" />
                          </span>
                          <h4 className="text-sm sm:text-base font-extrabold text-[#064e3b]">
                            Panel de Rendimiento & Métricas de Adjudicación (2022 - 2026)
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Análisis temporal de victorias por año, competitividad de pliegos y organismos compradores
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="badge badge-success text-[10px] font-mono">
                          Periodo: 2022 en adelante
                        </span>
                        {selectedYear && (
                          <button
                            onClick={() => handleYearFilter(emp.id, selectedYear)}
                            className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded-full flex items-center gap-1 hover:bg-amber-200"
                          >
                            <span>Filtro Año {selectedYear}</span>
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 4 Summary Performance KPIs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Total Licitaciones (2022-2026)
                        </span>
                        <div className="text-lg sm:text-xl font-bold font-mono text-[#064e3b] mt-0.5">
                          {emp.licitacionesGanadasCount} <span className="text-xs font-semibold text-[#047857]">procesos</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          100% adjudicadas
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Año Pico de Victorias
                        </span>
                        <div className="text-lg sm:text-xl font-bold font-mono text-amber-700 mt-0.5 flex items-center gap-1">
                          <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                          <span>{emp.anioPico || '2026'}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Mayor concentración anual
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Promedio por Licitación
                        </span>
                        <div className="text-base sm:text-lg font-bold font-mono text-[#064e3b] mt-0.5 truncate">
                          {formatMoney(emp.promedioCotizado || Math.round(totalCotizadoVal / (emp.licitacionesGanadasCount || 1)))}
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Pesos argentinos (ARS)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Competitividad Pública
                        </span>
                        <div className="text-lg sm:text-xl font-bold font-mono text-[#047857] mt-0.5">
                          {emp.tasaPublicasPct ?? (100 - directPct)}%
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Por Licitación Pública abierta
                        </span>
                      </div>
                    </div>

                    {/* PRIMARY CHART: Annual Evolution in Tender Count (2022 to 2026) */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#047857]" />
                          <h5 className="text-xs sm:text-sm font-bold text-[#064e3b]">
                            Evolución Anual en Cantidad de Licitaciones Ganadas (2022 en adelante)
                          </h5>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Haz clic en cualquier año para filtrar las licitaciones correspondientes
                        </span>
                      </div>

                      {/* 5-Column Vertical Bar Chart */}
                      <div className="pt-5 pb-1">
                        {/* Bars Area with Baseline */}
                        <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end h-36 sm:h-44 px-2 sm:px-4 border-b-2 border-slate-200">
                          {evolucion.map((yData) => {
                            const isPeak = yData.anio === emp.anioPico && yData.cantidad > 0;
                            const isSelectedYear = selectedYear === yData.anio;
                            const heightRatio = maxYearCount > 0 ? (yData.cantidad / maxYearCount) : 0;
                            const barHeightPercent = Math.max(Math.round(heightRatio * 100), yData.cantidad > 0 ? 20 : 6);

                            return (
                              <div 
                                key={yData.anio}
                                onClick={() => handleYearFilter(emp.id, yData.anio)}
                                className={`flex flex-col items-center h-full justify-end group cursor-pointer transition-all ${
                                  isSelectedYear ? 'scale-105' : 'hover:scale-102'
                                }`}
                                title={`${yData.anio}: ${yData.cantidad} licitaciones ganadas. Monto cotizado: ${formatMoney(yData.montoCotizado)} ARS`}
                              >
                                {/* Top Badge with Count */}
                                <div className="mb-2 text-center">
                                  {yData.cantidad > 0 ? (
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold transition shadow-xs ${
                                      isSelectedYear 
                                        ? 'bg-[#064e3b] text-white ring-2 ring-emerald-400' 
                                        : isPeak 
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                        : 'bg-emerald-100 text-[#064e3b] group-hover:bg-emerald-200'
                                    }`}>
                                      {yData.cantidad} {yData.cantidad === 1 ? 'lic.' : 'lic.'}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300 font-mono text-[10px]">0 lic.</span>
                                  )}
                                </div>

                                {/* Vertical Column Bar */}
                                <div className="w-full max-w-[50px] sm:max-w-[65px] h-full flex items-end justify-center">
                                  {yData.cantidad > 0 ? (
                                    <div 
                                      className={`w-full rounded-t-xl transition-all duration-500 shadow-xs relative ${
                                        isSelectedYear 
                                          ? 'ring-2 ring-[#064e3b] ring-offset-2' 
                                          : 'group-hover:brightness-95'
                                      }`}
                                      style={{ 
                                        height: `${barHeightPercent}%`,
                                        background: isPeak
                                          ? 'linear-gradient(180deg, #10b981 0%, #047857 60%, #064e3b 100%)'
                                          : 'linear-gradient(180deg, #34d399 0%, #059669 65%, #064e3b 100%)'
                                      }}
                                    >
                                      {isPeak && (
                                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-500 text-amber-950 font-bold text-[8px] sm:text-[9px] px-1 py-0.2 rounded shadow-xs uppercase tracking-wider">
                                          Pico
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <div 
                                      className="w-full rounded-t-md bg-slate-100 border-t-2 border-dashed border-slate-300"
                                      style={{ height: '6%' }}
                                    ></div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Labels Row Below Baseline */}
                        <div className="grid grid-cols-5 gap-2 sm:gap-4 px-2 sm:px-4 pt-2.5">
                          {evolucion.map((yData) => {
                            const isSelectedYear = selectedYear === yData.anio;
                            return (
                              <div 
                                key={yData.anio}
                                onClick={() => handleYearFilter(emp.id, yData.anio)}
                                className="text-center cursor-pointer group"
                              >
                                <div className={`text-xs sm:text-sm font-bold ${
                                  isSelectedYear ? 'text-[#064e3b] font-extrabold underline' : 'text-slate-800 group-hover:text-[#064e3b]'
                                }`}>
                                  {yData.anio}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono font-medium truncate mt-0.5">
                                  {yData.montoCotizado > 0 ? `${formatMillions(yData.montoCotizado)} ARS` : 'Sin compras'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Chart Footer Indicator */}
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 px-1">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#064e3b]"></span>
                            Licitaciones regulares
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-emerald-500 to-[#064e3b]"></span>
                            Año pico de victorias
                          </span>
                        </div>
                        <div className="font-medium text-[#047857]">
                          {selectedYear 
                            ? `Mostrando únicamente licitaciones del año ${selectedYear}`
                            : 'Mostrando todo el período (2022 - 2026)'
                          }
                        </div>
                      </div>
                    </div>

                    {/* SECONDARY CHARTS: Modalities & Buying Organisms Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Sub-Chart 1: Modality Breakdown */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <PieChart className="w-4 h-4 text-[#047857]" />
                            <h6 className="text-xs font-bold text-[#064e3b] uppercase tracking-wider">
                              Distribución por Modalidad de Compra
                            </h6>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {emp.licitacionesGanadasCount} adjudicaciones
                          </span>
                        </div>

                        {/* Segmented Bar */}
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                          <div 
                            className="h-full bg-[#047857]" 
                            style={{ width: `${(emp.publicasCount / (emp.licitacionesGanadasCount || 1)) * 100}%` }}
                            title={`${emp.publicasCount} Licitaciones Públicas`}
                          ></div>
                          <div 
                            className="h-full bg-amber-500" 
                            style={{ width: `${(emp.directasCount / (emp.licitacionesGanadasCount || 1)) * 100}%` }}
                            title={`${emp.directasCount} Contrataciones Directas`}
                          ></div>
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${(emp.compulsasCount / (emp.licitacionesGanadasCount || 1)) * 100}%` }}
                            title={`${emp.compulsasCount} Compulsas Abreviadas`}
                          ></div>
                        </div>

                        {/* Legend items with counts and percentages */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#047857]"></span>
                              Licitación Pública
                            </span>
                            <div className="font-mono text-right">
                              <span className="font-bold text-[#064e3b]">{emp.publicasCount} procesos</span>
                              <span className="text-slate-400 text-[10px] ml-1.5">
                                ({Math.round((emp.publicasCount / (emp.licitacionesGanadasCount || 1)) * 100)}%)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                              Contratación Directa
                            </span>
                            <div className="font-mono text-right">
                              <span className="font-bold text-amber-700">{emp.directasCount} procesos</span>
                              <span className="text-slate-400 text-[10px] ml-1.5">
                                ({Math.round((emp.directasCount / (emp.licitacionesGanadasCount || 1)) * 100)}%)
                              </span>
                            </div>
                          </div>

                          {emp.compulsasCount > 0 && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                Compulsa Abreviada / Concurso
                              </span>
                              <div className="font-mono text-right">
                                <span className="font-bold text-blue-700">{emp.compulsasCount} procesos</span>
                                <span className="text-slate-400 text-[10px] ml-1.5">
                                  ({Math.round((emp.compulsasCount / (emp.licitacionesGanadasCount || 1)) * 100)}%)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sub-Chart 2: Top Buying Organisms */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-[#047857]" />
                            <h6 className="text-xs font-bold text-[#064e3b] uppercase tracking-wider">
                              Organismos Contratantes Principales
                            </h6>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {emp.organismos ? emp.organismos.length : 1} entidades
                          </span>
                        </div>

                        <div className="space-y-2.5 pt-1">
                          {(emp.desgloseOrganismos || emp.organismos.map(org => ({ organismo: org, cantidad: 1, monto: totalCotizadoVal / emp.organismos.length }))).slice(0, 3).map((item, orgIdx) => {
                            const pct = Math.round((item.cantidad / (emp.licitacionesGanadasCount || 1)) * 100);
                            return (
                              <div key={orgIdx} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-slate-800 truncate max-w-[220px] sm:max-w-[280px]">
                                    {item.organismo}
                                  </span>
                                  <span className="font-mono text-[11px] font-bold text-[#064e3b]">
                                    {item.cantidad} lic. ({pct}%)
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-[#064e3b] to-[#10b981] rounded-full"
                                    style={{ width: `${Math.max(pct, 8)}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* SECTION B: DETAILED CHRONOLOGICAL TENDERS LIST */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#047857]" />
                        <h4 className="text-xs sm:text-sm font-bold text-[#064e3b] uppercase tracking-wider">
                          Historial Cronológico de Licitaciones Ganadas
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-bold">
                          {displayedTenders.length} de {emp.ultimasLicitaciones.length}
                        </span>
                      </div>

                      {selectedYear && (
                        <button
                          onClick={() => handleYearFilter(emp.id, selectedYear)}
                          className="text-xs text-[#047857] hover:underline font-bold flex items-center gap-1"
                        >
                          <span>Mostrar todos los años</span>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {displayedTenders.map((lic, licIdx) => {
                        const isDirect = lic.tipo.includes('DIRECTA');
                        return (
                          <div 
                            key={lic.id || licIdx}
                            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 shadow-sm transition space-y-3"
                          >
                            {/* Row 1: Badges & Amount */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="badge badge-neutral text-[10px] font-mono font-semibold">
                                  {lic.fecha}
                                </span>
                                <span className={`badge text-[10px] ${isDirect ? 'badge-directa' : 'badge-publica'}`}>
                                  {lic.tipo}
                                </span>
                                <span className="text-xs font-mono text-[#064e3b] font-bold">
                                  {lic.expediente}
                                </span>
                              </div>

                              <div className="font-mono text-right">
                                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Importe Cotizado</span>
                                <span className="text-base font-extrabold text-[#064e3b]">
                                  {formatMoney(lic.montoCotizado || lic.monto)} <span className="text-xs font-bold text-[#047857]">ARS</span>
                                </span>
                              </div>
                            </div>

                            {/* Row 2: Tender Object */}
                            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                              {lic.objeto}
                            </p>

                            {/* Row 3: Prominent Financial Quote Box in Pesos */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                              <div>
                                <span className="text-[10px] font-bold uppercase text-emerald-900 tracking-wider block">
                                  Importe Cotizado por la Empresa
                                </span>
                                <span className="font-mono text-base font-extrabold text-[#064e3b] block mt-0.5">
                                  {formatMoney(lic.montoCotizado || lic.monto)} <span className="text-xs font-bold text-[#047857]">ARS</span>
                                </span>
                                <span className="text-[10px] text-emerald-700 font-medium">Oferta económica en pesos</span>
                              </div>

                              <div>
                                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                                  Presupuesto Oficial Estimado
                                </span>
                                <span className="font-mono text-sm font-bold text-slate-700 block mt-0.5">
                                  {formatMoney(lic.presupuestoOficial || lic.monto)} ARS
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">Base de pliego oficial</span>
                              </div>

                              <div>
                                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                                  Monto Final Adjudicado
                                </span>
                                <span className="font-mono text-sm font-bold text-[#064e3b] block mt-0.5">
                                  {formatMoney(lic.monto)} ARS
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-1 mt-0.5">
                                  <CheckCircle2 className="w-3 h-3 text-[#047857]" />
                                  {lic.ahorroPresupuesto > 0 
                                    ? `Ahorro de ${formatMoney(lic.ahorroPresupuesto)} ARS`
                                    : 'Adjudicado al 100% de la cotización'
                                  }
                                </span>
                              </div>
                            </div>

                            {/* Row 4: Meta details & Resolution */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium">
                              <div>
                                <span className="text-slate-400 block text-[10px]">ORGANISMO COMPRADOR</span>
                                <span className="text-slate-800 font-semibold">{lic.organismo}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">ACTO ADMINISTRATIVO / RESOLUCIÓN</span>
                                <span className="font-mono text-[#064e3b] font-bold">{lic.resolucion}</span>
                              </div>
                            </div>

                            {/* Row 5: Action button */}
                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => onSelectLicitacionById(lic.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#064e3b] text-[#047857] hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
                              >
                                <span>Ver Pliego y Trazabilidad del Expediente</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* 6. Methodology & Scalability Card */}
      <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-[#064e3b] mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#047857]" />
          Metodología de Extracción Documental & Vinculación Oficial
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4 font-medium">
          En la Provincia de San Juan, el portal oficial no cuenta con una API abierta de adjudicatarios (OCDS). La información aquí expuesta se obtiene mediante el pipeline de extracción automatizada y auditoría cívica:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-[#064e3b] mb-1">1. Descarga Continua de Resoluciones</div>
            <p className="text-slate-600 font-medium">
              Extracción periódica de decretos de adjudicación (<code>RES.*ADJUDICACION.pdf</code>) desde los servidores de San Juan.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-[#047857] mb-1">2. OCR & Extracción de Cláusulas</div>
            <p className="text-slate-600 font-medium">
              Análisis óptico de firmas manuscritas y artículos de adjudicación para extraer CUITs, razones sociales y montos cotizados en pesos.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-[#065f46] mb-1">3. Trazabilidad en Tiempo Real</div>
            <p className="text-slate-600 font-medium">
              Vinculación directa con el sistema oficial de consulta de expedientes de San Juan para verificar despachos ministeriales.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
