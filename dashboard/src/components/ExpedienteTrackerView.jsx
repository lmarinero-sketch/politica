import React, { useState } from 'react';
import { Clock, MapPin, Building, ArrowDown, ExternalLink, Search, CheckCircle, FileText } from 'lucide-react';

export const ExpedienteTrackerView = ({ licitaciones, onSelectLicitacion }) => {
  const trackedItems = licitaciones.filter(l => l.expedienteMovimientos && l.expedienteMovimientos.length > 0);
  const [selectedId, setSelectedId] = useState(trackedItems[0]?.id || null);

  const currentItem = trackedItems.find(l => l.id === selectedId) || trackedItems[0];
  const movements = currentItem?.expedienteMovimientos || [];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Overview Banner */}
      <div className="glass-panel p-6 border-emerald-300 bg-gradient-to-r from-emerald-50 via-white to-white shadow-sm">
        <div className="flex items-center gap-2 text-[#064e3b] text-xs font-bold uppercase tracking-wider mb-2">
          <Clock className="w-4 h-4 text-[#047857]" />
          Trazabilidad en Vivo de Expedientes Provinciales
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#064e3b] font-display mb-2">
          Ruta Burocrática & Seguimiento de Oficinas
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl font-medium">
          Conexión directa con la API de seguimiento de trámites del Gobierno de San Juan. Visualiza cada paso del expediente desde la Mesa de Entrada hasta la adjudicación final, con sellos de tiempo y dependencias responsables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Selectable Expedientes list */}
        <div className="glass-panel p-4 lg:col-span-1 space-y-2.5 max-h-[700px] overflow-y-auto bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-[#064e3b] px-2 py-1">
            Expedientes Monitoreados ({trackedItems.length})
          </div>

          {trackedItems.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-3 rounded-xl cursor-pointer transition border text-xs ${
                  isSelected 
                    ? 'bg-emerald-50/80 border-[#047857] shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-[#064e3b] text-[11px]">
                    {item.expediente}
                  </span>
                  <span className="badge badge-success text-[9px] py-0.5">
                    {item.expedienteMovimientos.length} pasos
                  </span>
                </div>
                
                <div className="font-medium line-clamp-2 text-slate-800 mb-1.5 leading-snug">
                  {item.objeto}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono font-medium">
                  <span>{item.organismo.slice(0, 24)}...</span>
                  <span className="text-[#064e3b] font-bold">
                    ${item.presupuesto > 0 ? (item.presupuesto / 1e6).toFixed(1) + 'M' : 'S/M'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Timeline Detail */}
        <div className="glass-panel p-6 lg:col-span-2 bg-white border border-slate-200 shadow-sm">
          {currentItem ? (
            <div>
              
              {/* Expediente Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 mb-6">
                <div>
                  <span className="text-xs font-mono text-[#047857] font-bold uppercase tracking-wider">
                    Expediente Oficial: {currentItem.expediente}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 leading-snug">
                    {currentItem.objeto}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2 font-medium">
                    <span>Organismo: <strong className="text-slate-800">{currentItem.organismo}</strong></span>
                    <span>•</span>
                    <span>Presupuesto: <strong className="text-[#064e3b]">${currentItem.presupuesto.toLocaleString('es-AR')}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectLicitacion(currentItem)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] text-xs font-bold border border-emerald-300 transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ver Pliegos & Ficha</span>
                </button>
              </div>

              {/* Timeline nodes */}
              <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#064e3b] before:via-[#047857] before:to-emerald-200">
                {movements.map((mov, idx) => {
                  const isLatest = idx === 0;
                  return (
                    <div key={idx} className="relative group">
                      
                      {/* Node circle */}
                      <div className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isLatest 
                          ? 'bg-[#064e3b] border-white shadow-md shadow-emerald-950/30' 
                          : 'bg-white border-slate-400'
                      }`}>
                        {isLatest && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>

                      {/* Content Box */}
                      <div className={`p-4 rounded-xl border text-xs transition ${
                        isLatest 
                          ? 'bg-emerald-50/70 border-emerald-300 text-slate-800 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <span className={`font-bold text-sm ${isLatest ? 'text-[#064e3b]' : 'text-slate-900'}`}>
                            {mov.OFICINA || 'Movimiento Administrativo'}
                          </span>
                          <span className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold">
                            {mov.DESDE || 'Fecha no informada'}
                          </span>
                        </div>
                        {mov.JURISDICCION && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>{mov.JURISDICCION}</span>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm font-medium">
              Selecciona un expediente para ver su historial cronológico.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
