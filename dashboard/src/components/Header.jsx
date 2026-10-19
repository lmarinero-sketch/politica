import React from 'react';
import { 
  ShieldCheck, 
  Download, 
  ExternalLink,
  FileSpreadsheet,
  FileCode2,
  Calendar,
  Layers
} from 'lucide-react';

export const Header = ({ onExportCSV, onExportJSON, licitacionesCount }) => {
  return (
    <header className="border-b border-[#c3c4c7] bg-white sticky top-0 z-40 shadow-xs">
      
      {/* Top Institutional Bar (WordPress / Gov portal style) */}
      <div className="bg-[#134e2c] text-white text-[11px] font-semibold px-4 sm:px-6 py-1.5 flex items-center justify-between border-b border-[#0f3d23]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>GOBIERNO DE LA PROVINCIA DE SAN JUAN — OBSERVATORIO DE CONTRATACIONES PÚBLICAS</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-emerald-100 text-[10px] font-mono">
          <span>Sincronización Oficial: Octubre 2026</span>
          <span>•</span>
          <span>1.550 Procesos Auditados</span>
        </div>
      </div>

      {/* Main Masthead Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Brand & Crest */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#134e2c] border border-[#0f3d23] flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#1d2327]">
                Vigía San Juan
              </h1>
              <span className="badge badge-success text-[10px]">
                Auditoría Cívica
              </span>
              <span className="badge bg-[#f0f6fc] text-[#0969da] border border-[#d0d7de] text-[10px] flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Supabase PostgreSQL
              </span>
            </div>
            <p className="text-xs text-[#50575e] font-medium">
              Portal de Seguimiento de Licitaciones, Proveedores del Estado y Compras Públicas • Base de Datos Sincronizada
            </p>
          </div>
        </div>

        {/* Action Controls (WordPress Button Style) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <button 
            onClick={onExportCSV} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#f6f7f7] hover:bg-[#f0f0f1] text-xs font-semibold text-[#2c3338] border border-[#c3c4c7] transition"
            title="Descargar base de datos en formato CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#134e2c]" />
            <span>Descargar CSV</span>
          </button>

          <button 
            onClick={onExportJSON} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#f6f7f7] hover:bg-[#f0f0f1] text-xs font-semibold text-[#2c3338] border border-[#c3c4c7] transition"
            title="Descargar base de datos en formato JSON"
          >
            <FileCode2 className="w-3.5 h-3.5 text-[#134e2c]" />
            <span>JSON</span>
          </button>

          <a 
            href="https://licitaciones.sanjuan.gob.ar" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#134e2c] hover:bg-[#0f3d23] text-white text-xs font-semibold border border-[#0f3d23] transition"
          >
            <span>Portal Oficial San Juan</span>
            <ExternalLink className="w-3 h-3 text-emerald-200" />
          </a>
        </div>

      </div>
    </header>
  );
};
