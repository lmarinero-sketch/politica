import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  Layers, 
  Calendar, 
  AlertOctagon, 
  TrendingUp, 
  Building2, 
  CheckCircle2,
  Award,
  ArrowRight
} from 'lucide-react';

export const MetricsView = ({ 
  topOrganismos = [], 
  porTipo = [], 
  porYear = [], 
  porRubro = [], 
  topEmpresasPorMonto = [],
  onSelectOrganism,
  onNavigateToWinners 
}) => {
  const formatBillions = (val) => {
    if (!val) return '$0';
    if (val >= 1e9) {
      return `$${(val / 1e9).toFixed(1)}B`;
    }
    return `$${(val / 1e6).toFixed(0)}M`;
  };

  const formatMoney = (val) => {
    if (!val && val !== 0) return '$0';
    return `$${val.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;
  };

  const maxOrgMonto = Math.max(...topOrganismos.slice(0, 8).map(o => o.monto), 1);
  const maxEmpMonto = Math.max(...(topEmpresasPorMonto || []).slice(0, 5).map(e => e.totalAdjudicado), 1);

  return (
    <div className="space-y-6 animate-fade-in font-display">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 border-emerald-300 bg-gradient-to-r from-emerald-50 via-white to-white relative overflow-hidden shadow-sm">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-[#064e3b] text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4 text-[#047857]" />
            Panel Integral de Estadísticas, Montos & Distribución
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#064e3b] mb-2">
            Radiografía Presupuestaria de las Compras Públicas de San Juan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Visualización analítica sobre los <strong>$632.405 Millones ARS</strong> cotizados en 1.550 procesos. Desglose por ministerios con mayor capacidad de gasto, distribución de modalidades de contratación, evolución histórica anual y concentración de empresas contratistas.
          </p>
        </div>
      </div>

      {/* Row 1: Organismos + Empresas Líderes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Top Organismos Compradores */}
        <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#047857]" />
                Mayores Organismos Compradores
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Distribución de fondos presupuestados por ministerio o ente
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono font-medium">Top 8</span>
          </div>

          <div className="space-y-3 mt-2">
            {topOrganismos.slice(0, 8).map((org, index) => {
              const pct = Math.round((org.monto / maxOrgMonto) * 100);
              return (
                <div 
                  key={org.name} 
                  onClick={() => onSelectOrganism(org.name)}
                  className="group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-800 group-hover:text-[#064e3b] transition truncate max-w-[260px] sm:max-w-xs font-semibold">
                      {index + 1}. {org.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{org.count} proc.</span>
                      <span className="font-mono text-[#064e3b] font-bold">{formatBillions(org.monto)}</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full bg-gradient-to-r from-[#064e3b] to-[#10b981] rounded-full transition-all duration-700" 
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Top Empresas por Monto Adjudicado */}
        <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#047857]" />
                  Empresas con Mayor Volumen Adjudicado
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Contratistas que concentran los mayores montos en resoluciones
                </p>
              </div>
              <button
                onClick={onNavigateToWinners}
                className="text-xs text-[#047857] hover:text-[#064e3b] font-bold inline-flex items-center gap-1"
              >
                <span>Ver ranking completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 mt-2">
              {(topEmpresasPorMonto || []).slice(0, 5).map((emp, index) => {
                const pct = Math.round((emp.totalAdjudicado / maxEmpMonto) * 100);
                return (
                  <div 
                    key={emp.id}
                    onClick={onNavigateToWinners}
                    className="group cursor-pointer hover:bg-emerald-50/50 p-2 rounded-lg transition"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <div className="flex items-center gap-1.5 truncate max-w-[240px] sm:max-w-xs">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#064e3b] font-bold text-[10px] flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-slate-800 group-hover:text-[#064e3b] font-semibold truncate">
                          {emp.nombre}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[10px]">{emp.licitacionesGanadasCount} ganadas</span>
                        <span className="font-mono text-[#064e3b] font-bold">{formatBillions(emp.totalAdjudicado)}</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className="h-full bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#10b981] rounded-full transition-all duration-700" 
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between font-medium">
            <span>Las 3 primeras firmas concentran el <strong>80.7%</strong> de los fondos relevados.</span>
            <button
              onClick={onNavigateToWinners}
              className="px-2.5 py-1 rounded bg-[#064e3b] text-white text-[11px] font-bold hover:bg-[#047857] transition"
            >
              Explorar Historial
            </button>
          </div>
        </div>

      </div>

      {/* Row 2: Modalidades de Contratación + Evolución Anual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 3: Modalidades de Contratación */}
        <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-amber-600" />
                  Modalidades de Contratación
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Porcentaje de procesos por tipo de procedimiento legal
                </p>
              </div>
              <span className="badge badge-directa text-[10px]">Alerta 52% Directas</span>
            </div>

            <div className="space-y-4 my-4">
              {porTipo.map((item) => {
                const totalProc = 1550;
                const pct = Math.round((item.count / totalProc) * 100);
                const isDirecta = item.tipo.includes('DIRECTA');
                const isPublica = item.tipo.includes('PUBLICA');

                return (
                  <div key={item.tipo} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-2 font-medium">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          isDirecta ? 'bg-amber-500' : isPublica ? 'bg-[#064e3b]' : 'bg-[#047857]'
                        }`}></span>
                        <span className="font-semibold text-slate-800">{item.tipo}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{item.count} procesos</span>
                        <span className="font-mono font-bold text-[#064e3b] text-sm">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          isDirecta 
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                            : isPublica 
                              ? 'bg-gradient-to-r from-[#064e3b] to-[#047857]' 
                              : 'bg-emerald-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 font-medium">
            <AlertOctagon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Alerta Cívica de Transparencia:</strong> Más del 52% de los expedientes corresponden a Contrataciones Directas, reduciendo la puja de precios frente a licitaciones abiertas.
            </div>
          </div>
        </div>

        {/* Chart 4: Evolución Histórica Anual */}
        <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#047857]" />
                  Evolución Histórica (2022 - 2026)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Volumen de licitaciones publicadas por año en el portal provincial
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 mt-6">
              {porYear.filter(y => y.year !== 'Sin fecha').map((y) => {
                const maxCount = Math.max(...porYear.map(x => x.count));
                const heightPct = Math.round((y.count / maxCount) * 100);

                return (
                  <div key={y.year} className="flex flex-col items-center gap-2">
                    <span className="text-xs font-mono text-[#064e3b] font-bold">{y.count}</span>
                    <div className="w-full h-40 bg-slate-100 rounded-xl flex items-end p-1 border border-slate-200">
                      <div 
                        className="w-full bg-gradient-to-t from-[#064e3b] to-[#10b981] rounded-lg transition-all duration-700 hover:opacity-90 shadow-sm"
                        style={{ height: `${Math.max(heightPct, 12)}%` }}
                        title={`${y.count} licitaciones en ${y.year}`}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{y.year}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            El año 2026 acumula más de 450 licitaciones activas e informatizadas en el nuevo catálogo provincial.
          </div>
        </div>

      </div>

      {/* Row 3: Distribución por Rubros */}
      <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#047857]" />
              Distribución por Rubro y Sector de Compras
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Categorización de los 1.550 procesos por área de impacto socioeconómico
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3">
          {porRubro.map((r) => {
            return (
              <div key={r.rubro} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition">
                <div className="text-xs font-semibold text-slate-600 mb-1 truncate">{r.rubro}</div>
                <div className="text-lg font-bold text-[#064e3b] font-mono">{r.count} procesos</div>
                <div className="text-xs text-[#047857] font-mono font-bold mt-1">
                  {formatBillions(r.monto)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
