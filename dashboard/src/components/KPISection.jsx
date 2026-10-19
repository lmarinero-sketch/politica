import React from 'react';
import { DollarSign, FileStack, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const KPISection = ({ resumen }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      
      {/* Widget 1: Presupuesto Total */}
      <div className="bg-white border border-[#c3c4c7] border-t-[3px] border-t-[#134e2c] p-4 rounded shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
            Volumen Presupuestario
          </span>
          <span className="text-[#134e2c] font-mono text-xs font-bold bg-[#edf7ed] px-1.5 py-0.5 rounded border border-[#c8e6c9]">
            ARS
          </span>
        </div>
        <div className="text-2xl font-bold text-[#1d2327] tracking-tight mb-1 font-mono">
          $632.405 M
        </div>
        <p className="text-xs text-[#50575e] font-medium">
          <strong className="text-[#134e2c]">$632.405.330.294 ARS</strong> en 1.094 cotizadas
        </p>
      </div>

      {/* Widget 2: Total Procesos */}
      <div className="bg-white border border-[#c3c4c7] border-t-[3px] border-t-[#134e2c] p-4 rounded shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
            Procesos Registrados
          </span>
          <span className="text-[#134e2c] font-mono text-xs font-bold bg-[#edf7ed] px-1.5 py-0.5 rounded border border-[#c8e6c9]">
            Total
          </span>
        </div>
        <div className="text-2xl font-bold text-[#1d2327] tracking-tight mb-1 font-mono">
          {resumen.totalLicitaciones ? resumen.totalLicitaciones.toLocaleString('es-AR') : '1.550'}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#50575e] font-medium">
          <span className="text-[#134e2c] font-semibold">{resumen.publicasCount || 446} Licitaciones Públicas</span>
          <span>•</span>
          <span>{resumen.compulsasCount || 261} Compulsas</span>
        </div>
      </div>

      {/* Widget 3: Alerta Transparencia (Contrataciones Directas) */}
      <div className="bg-white border border-[#c3c4c7] border-t-[3px] border-t-[#dba617] p-4 rounded shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#78350f] flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-[#dba617] inline" />
            Contratación Directa
          </span>
          <span className="text-[#78350f] font-mono text-xs font-bold bg-[#fcf9e8] px-1.5 py-0.5 rounded border border-[#f1e29c]">
            52.5%
          </span>
        </div>
        <div className="text-2xl font-bold text-[#713f12] tracking-tight mb-1 font-mono">
          {resumen.directasCount || 814} Procesos
        </div>
        <p className="text-xs text-[#78350f] font-medium">
          Asignaciones directas sin licitación pública tradicional
        </p>
      </div>

      {/* Widget 4: Trazabilidad y Ganadores */}
      <div className="bg-white border border-[#c3c4c7] border-t-[3px] border-t-[#134e2c] p-4 rounded shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
            Trazabilidad y Pliegos
          </span>
          <span className="text-[#134e2c] font-mono text-xs font-bold bg-[#edf7ed] px-1.5 py-0.5 rounded border border-[#c8e6c9]">
            En Vivo
          </span>
        </div>
        <div className="text-2xl font-bold text-[#134e2c] tracking-tight mb-1 font-mono">
          100% Trazable
        </div>
        <p className="text-xs text-[#50575e] font-medium">
          Resoluciones oficiales + Consulta de expedientes GOP
        </p>
      </div>

    </div>
  );
};
