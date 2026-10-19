import React, { useEffect } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  FileText, 
  Building2, 
  Calendar, 
  DollarSign, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Award,
  AlertTriangle,
  FileCheck2
} from 'lucide-react';

export const TenderModal = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const formatCurrency = (val) => {
    if (!val || val === 0) return 'Sin monto informado';
    return `$${val.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const isDirecta = item.tipo.includes('DIRECTA');
  const isPublica = item.tipo.includes('PUBLICA');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border-slate-300 bg-white shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`badge ${
                isDirecta ? 'badge-directa' : isPublica ? 'badge-publica' : 'badge-compulsa'
              }`}>
                {item.tipo}
              </span>
              <span className="badge badge-success text-[10px]">
                {item.estado}
              </span>
              <span className="font-mono text-xs text-slate-500 font-semibold">
                Pub. {item.numPub}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#064e3b] leading-snug">
              {item.objeto}
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-300 transition flex-shrink-0"
            title="Cerrar modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Winner Banner if available */}
          {item.ganador && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold flex items-center gap-1.5 text-sm text-[#064e3b]">
                  <Award className="w-4 h-4 text-[#047857]" />
                  Adjudicación Aprobada a: {item.ganador.empresa}
                </span>
                <span className="font-mono font-bold text-[#064e3b] text-base">
                  {formatCurrency(item.ganador.montoAdjudicado)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 mt-2 font-medium">
                <div><strong>CUIT:</strong> <span className="font-mono text-[#047857] font-bold">{item.ganador.cuit}</span></div>
                <div><strong>Resolución Oficial:</strong> <span className="font-mono text-[#047857] font-bold">{item.ganador.resolucion}</span></div>
                <div className="sm:col-span-2"><strong>Observaciones:</strong> {item.ganador.observacion}</div>
              </div>
            </div>
          )}

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 mb-1 font-semibold">Presupuesto Oficial</div>
              <div className="font-mono font-bold text-base text-[#064e3b]">
                {formatCurrency(item.presupuesto)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 mb-1 font-semibold">Expediente Administrativo</div>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {item.expediente}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 mb-1 font-semibold">Costo de Pliego</div>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {item.costoPliego > 0 ? `$${item.costoPliego.toLocaleString('es-AR')}` : 'Gratuito'}
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 font-bold text-[#064e3b] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#047857]" />
              Datos Institucionales & Cronograma
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <div className="text-slate-500 font-semibold">Organismo Contratante:</div>
                <div className="font-bold text-slate-900 mt-0.5">{item.organismo}</div>
                {item.dependencia && (
                  <div className="text-slate-500 text-[11px] mt-0.5">{item.dependencia}</div>
                )}
              </div>

              <div>
                <div className="text-slate-500 font-semibold">Rubro / Categoría:</div>
                <div className="text-slate-900 mt-0.5">{item.rubro}</div>
              </div>

              <div>
                <div className="text-slate-500 font-semibold">Fecha y Hora de Apertura:</div>
                <div className="text-slate-900 mt-0.5">
                  {item.fechaApertura || 'No informada'} {item.horaApertura && `(${item.horaApertura})`}
                </div>
              </div>

              <div>
                <div className="text-slate-500 font-semibold">Fecha de Publicación:</div>
                <div className="text-slate-900 mt-0.5">{item.fechaPublicacion || 'No informada'}</div>
              </div>

              {item.domicilio && (
                <div className="sm:col-span-2">
                  <div className="text-slate-500 font-semibold">Lugar de Apertura y Presentación:</div>
                  <div className="text-slate-700 mt-0.5">{item.domicilio}</div>
                </div>
              )}

              {(item.email || item.telefono) && (
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2 border-t border-slate-200">
                  {item.email && (
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-[#047857]" />
                      <a href={`mailto:${item.email}`} className="hover:underline">{item.email}</a>
                    </div>
                  )}
                  {item.telefono && (
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-[#047857]" />
                      <span>{item.telefono}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Attached Files List */}
          <div>
            <div className="font-bold text-[#064e3b] mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#047857]" />
                Archivos Oficiales Asociados ({item.archivos?.length || 0})
              </span>
              <span className="text-[11px] text-slate-400 font-mono">licitacionesarchivos.sanjuan.gob.ar</span>
            </div>

            {item.archivos && item.archivos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.archivos.map((file, i) => {
                  const isResolucion = file.nombre.toLowerCase().includes('res') || file.nombre.toLowerCase().includes('adjudic');
                  return (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition group shadow-sm ${
                        isResolucion 
                          ? 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100 text-[#064e3b]' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck2 className={`w-4 h-4 flex-shrink-0 ${isResolucion ? 'text-[#064e3b]' : 'text-[#047857]'}`} />
                        <span className="truncate font-semibold text-xs group-hover:text-[#064e3b] transition">
                          {file.nombre}
                        </span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#064e3b] flex-shrink-0" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-center font-medium">
                Este proceso no registra pliegos adjuntos descargables en la vista principal o corresponden a compras directas menores.
              </div>
            )}
          </div>

          {/* Expediente Movements if available */}
          {item.expedienteMovimientos && item.expedienteMovimientos.length > 0 && (
            <div className="border-t border-slate-200 pt-4">
              <div className="font-bold text-[#064e3b] mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#047857]" />
                Ruta Cronológica del Expediente ({item.expedienteMovimientos.length} movimientos registrados)
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {item.expedienteMovimientos.slice(0, 6).map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{m.OFICINA}</span>
                      {m.JURISDICCION && <span className="text-slate-500 block text-[11px]">{m.JURISDICCION}</span>}
                    </div>
                    <span className="font-mono text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold">
                      {m.DESDE}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <a
            href={`https://licitaciones.sanjuan.gob.ar`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#047857] hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <span>Ver en Portal de Compras de San Juan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold shadow-sm transition"
          >
            Cerrar Ficha
          </button>
        </div>

      </div>
    </div>
  );
};
