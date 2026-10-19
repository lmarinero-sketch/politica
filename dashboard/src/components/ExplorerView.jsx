import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ExternalLink, 
  FileText, 
  Calendar, 
  Building, 
  Eye, 
  ArrowUpDown, 
  AlertCircle,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';

export const ExplorerView = ({ licitaciones, onSelectLicitacion, initialOrganism = '' }) => {
  const [search, setSearch] = useState('');
  const [selectedOrganism, setSelectedOrganism] = useState(initialOrganism);
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedRubro, setSelectedRubro] = useState('');
  const [quickFilter, setQuickFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Extract unique organisms and tipos
  const organisms = useMemo(() => {
    const orgs = new Set(licitaciones.map(l => l.organismo).filter(Boolean));
    return Array.from(orgs).sort();
  }, [licitaciones]);

  const tipos = useMemo(() => {
    const ts = new Set(licitaciones.map(l => l.tipo).filter(Boolean));
    return Array.from(ts).sort();
  }, [licitaciones]);

  const rubros = useMemo(() => {
    const rs = new Set(licitaciones.map(l => l.rubro).filter(Boolean));
    return Array.from(rs).sort();
  }, [licitaciones]);

  // Filtering
  const filtered = useMemo(() => {
    return licitaciones.filter(item => {
      // Quick filter
      if (quickFilter === 'adjudicadas' && !item.adjudicacionEstado && item.estado !== 'Adjudicadas') return false;
      if (quickFilter === 'directas' && !item.tipo.includes('DIRECTA')) return false;
      if (quickFilter === 'mega' && item.presupuesto < 1000000000) return false;

      // Dropdown filters
      if (selectedOrganism && item.organismo !== selectedOrganism) return false;
      if (selectedTipo && item.tipo !== selectedTipo) return false;
      if (selectedRubro && item.rubro !== selectedRubro) return false;

      // Text search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchObj = item.objeto?.toLowerCase().includes(query);
        const matchExp = item.expediente?.toLowerCase().includes(query);
        const matchOrg = item.organismo?.toLowerCase().includes(query);
        const matchNum = item.numPub?.toLowerCase().includes(query);
        if (!matchObj && !matchExp && !matchOrg && !matchNum) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'presupuesto') {
        return sortOrder === 'desc' ? b.presupuesto - a.presupuesto : a.presupuesto - b.presupuesto;
      }
      const dateA = a.fechaPublicacion || '1970-01-01';
      const dateB = b.fechaPublicacion || '1970-01-01';
      return sortOrder === 'desc' ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB);
    });
  }, [licitaciones, quickFilter, selectedOrganism, selectedTipo, selectedRubro, search, sortBy, sortOrder]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const formatCurrency = (val) => {
    if (!val || val === 0) return 'Sin monto publicado';
    return `$${val.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Search and Filters Bar */}
      <div className="glass-panel p-5 space-y-4 bg-white border border-slate-200 shadow-sm">
        
        {/* Search input + Quick pills */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por objeto, número de expediente (ej. 600-003645), organismo o pliego..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'todas', label: 'Todas' },
              { id: 'adjudicadas', label: 'Con Adjudicación' },
              { id: 'directas', label: 'Contrataciones Directas' },
              { id: 'mega', label: 'Mega-Obras (>$1.000M)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setQuickFilter(tab.id); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  quickFilter === tab.id 
                    ? 'bg-[#064e3b] text-white shadow-sm' 
                    : 'bg-white text-slate-600 hover:text-[#064e3b] hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-200 text-xs">
          
          {/* Organismo Dropdown */}
          <div>
            <label className="text-slate-600 mb-1 block font-semibold">Organismo Contratante:</label>
            <select
              value={selectedOrganism}
              onChange={(e) => { setSelectedOrganism(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-700 font-medium focus:outline-none focus:border-[#047857] focus:bg-white"
            >
              <option value="">Todos los organismos ({organisms.length})</option>
              {organisms.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Tipo Dropdown */}
          <div>
            <label className="text-slate-600 mb-1 block font-semibold">Tipo de Procedimiento:</label>
            <select
              value={selectedTipo}
              onChange={(e) => { setSelectedTipo(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-700 font-medium focus:outline-none focus:border-[#047857] focus:bg-white"
            >
              <option value="">Todas las modalidades</option>
              {tipos.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Rubro Dropdown */}
          <div>
            <label className="text-slate-600 mb-1 block font-semibold">Rubro / Sector:</label>
            <select
              value={selectedRubro}
              onChange={(e) => { setSelectedRubro(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-700 font-medium focus:outline-none focus:border-[#047857] focus:bg-white"
            >
              <option value="">Todos los rubros</option>
              {rubros.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Ordenamiento */}
          <div>
            <label className="text-slate-600 mb-1 block font-semibold">Ordenar por:</label>
            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-700 font-medium focus:outline-none focus:border-[#047857] focus:bg-white"
              >
                <option value="fecha">Fecha de Publicación</option>
                <option value="presupuesto">Monto Presupuestado</option>
              </select>
              <button 
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-600"
                title={`Cambiar a ${sortOrder === 'desc' ? 'Ascendente' : 'Descendente'}`}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Results Count & Active Filters */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-600">
        <div>
          Mostrando <strong className="text-[#064e3b] font-bold">{filtered.length}</strong> procesos encontrados 
          {filtered.length !== licitaciones.length && ` (de un total de ${licitaciones.length})`}
        </div>
        {(selectedOrganism || selectedTipo || selectedRubro || search || quickFilter !== 'todas') && (
          <button 
            onClick={() => {
              setSearch('');
              setSelectedOrganism('');
              setSelectedTipo('');
              setSelectedRubro('');
              setQuickFilter('todas');
              setPage(1);
            }}
            className="text-[#047857] font-semibold hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="glass-panel overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Expediente / Pub</th>
                <th className="py-3.5 px-4">Objeto de la Contratación</th>
                <th className="py-3.5 px-4">Organismo Comprador</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4 text-right">Presupuesto Oficial</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((item) => {
                const isDirecta = item.tipo.includes('DIRECTA');
                const isPublica = item.tipo.includes('PUBLICA');
                const hasWinner = item.ganador || item.adjudicacionEstado || item.estado === 'Adjudicadas';
                const hasFiles = item.archivos && item.archivos.length > 0;
                const hasMovements = item.expedienteMovimientos && item.expedienteMovimientos.length > 0;

                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-emerald-50/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectLicitacion(item)}
                  >
                    
                    {/* Expediente & Pub */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-800 text-xs">
                        {item.expediente !== 'S/E' ? item.expediente : `ID #${item.id}`}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.fechaPublicacion || 'S/F'}</span>
                        <span className="text-slate-300">•</span>
                        <span>Pub. {item.numPub}</span>
                      </div>
                    </td>

                    {/* Objeto */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="text-slate-800 font-medium line-clamp-2 leading-relaxed group-hover:text-[#064e3b] transition">
                        {item.objeto}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.rubro}
                        </span>
                        {hasWinner && (
                          <span className="badge badge-success text-[9px] py-0.5">
                            Adjudicada
                          </span>
                        )}
                        {hasFiles && (
                          <span className="text-[10px] text-[#047857] font-semibold font-mono flex items-center gap-0.5">
                            <FileCheck2 className="w-3 h-3" /> {item.archivos.length} docs
                          </span>
                        )}
                        {hasMovements && (
                          <span className="text-[10px] text-[#065f46] font-semibold font-mono">
                            ⚡ En seguimiento
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Organismo */}
                    <td className="py-3.5 px-4 text-slate-700 max-w-[200px]">
                      <div className="font-semibold text-slate-800 truncate" title={item.organismo}>
                        {item.organismo}
                      </div>
                      {item.dependencia && (
                        <div className="text-[11px] text-slate-500 truncate" title={item.dependencia}>
                          {item.dependencia}
                        </div>
                      )}
                    </td>

                    {/* Tipo badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`badge ${
                        isDirecta ? 'badge-directa' : isPublica ? 'badge-publica' : 'badge-compulsa'
                      }`}>
                        {item.tipo}
                      </span>
                    </td>

                    {/* Presupuesto */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="font-mono font-bold text-[#064e3b] text-sm">
                        {formatCurrency(item.presupuesto)}
                      </div>
                      {item.costoPliego > 0 && (
                        <div className="text-[10px] text-slate-500 font-medium">
                          Pliego: ${item.costoPliego.toLocaleString('es-AR')}
                        </div>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectLicitacion(item); }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-200 text-xs font-semibold transition inline-flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ficha</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div>
            Página <strong className="text-slate-800">{page}</strong> de <strong className="text-slate-800">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-white border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-700">
              {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filtered.length)} de {filtered.length}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg bg-white border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
