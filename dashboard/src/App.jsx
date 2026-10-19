import React, { useState } from 'react';
import data from './data/licitacionesData.json';
import { Header } from './components/Header';
import { KPISection } from './components/KPISection';
import { MetricsView } from './components/MetricsView';
import { ExplorerView } from './components/ExplorerView';
import { WinnersView } from './components/WinnersView';
import { TransparencyView } from './components/TransparencyView';
import { ExpedienteTrackerView } from './components/ExpedienteTrackerView';
import { TenderModal } from './components/TenderModal';
import { 
  Search, 
  BarChart3, 
  Award, 
  ShieldAlert, 
  Clock, 
  HelpCircle,
  FileSpreadsheet,
  Building,
  CheckCircle2
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('transparency'); // Default to transparency or explorer
  const [selectedLicitacion, setSelectedLicitacion] = useState(null);
  const [filterOrganism, setFilterOrganism] = useState('');

  // Handle clicking on an organism in the metrics view to filter explorer
  const handleSelectOrganism = (orgName) => {
    setFilterOrganism(orgName);
    setActiveTab('explorer');
  };

  // CSV Exporter
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Numero_Publicacion',
      'Expediente',
      'Objeto',
      'Organismo',
      'Dependencia',
      'Tipo',
      'Presupuesto_ARS',
      'Fecha_Publicacion',
      'Fecha_Apertura',
      'Rubro',
      'Estado'
    ];

    const rows = data.licitaciones.map(l => [
      l.id,
      `"${(l.numPub || '').replace(/"/g, '""')}"`,
      `"${(l.expediente || '').replace(/"/g, '""')}"`,
      `"${(l.objeto || '').replace(/"/g, '""')}"`,
      `"${(l.organismo || '').replace(/"/g, '""')}"`,
      `"${(l.dependencia || '').replace(/"/g, '""')}"`,
      `"${(l.tipo || '').replace(/"/g, '""')}"`,
      l.presupuesto || 0,
      l.fechaPublicacion || '',
      l.fechaApertura || '',
      `"${(l.rubro || '').replace(/"/g, '""')}"`,
      `"${(l.estado || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `licitaciones_san_juan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Exporter
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data.licitaciones, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `licitaciones_san_juan_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navTabs = [
    { id: 'transparency', label: 'Semáforo de Transparencia', icon: ShieldAlert, badge: '52% Directas' },
    { id: 'explorer', label: 'Explorador de Licitaciones', icon: Search, badge: '1.550' },
    { id: 'winners', label: 'Empresas & Adjudicatarios', icon: Award, badge: 'Ranking' },
    { id: 'metrics', label: 'Métricas & Presupuesto', icon: BarChart3, badge: '$632.4B' },
    { id: 'tracking', label: 'Trazabilidad de Expedientes', icon: Clock, badge: 'En Vivo' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] text-[#2c3338] font-display">
      
      {/* Top Header */}
      <Header 
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        licitacionesCount={data.resumen.totalLicitaciones}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        
        {/* Top KPIs Banner */}
        <KPISection resumen={data.resumen} />

        {/* WordPress Classic Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0 mb-6 border-b border-[#c3c4c7]">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-b-[#134e2c] text-[#134e2c] bg-white border-t border-l border-r border-t-[#c3c4c7] border-l-[#c3c4c7] border-r-[#c3c4c7] rounded-t -mb-[1px] shadow-xs'
                    : 'border-b-transparent text-[#50575e] hover:text-[#134e2c] hover:bg-[#f6f7f7]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#134e2c]' : 'text-[#646970]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    isActive 
                      ? 'bg-[#edf7ed] text-[#134e2c] border-[#c8e6c9]' 
                      : 'bg-[#f0f0f1] text-[#646970] border-[#dcdcde]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active View Render */}
        <div className="min-h-[500px]">
          {activeTab === 'transparency' && (
            <TransparencyView 
              resumen={data.resumen}
              licitaciones={data.licitaciones}
              empresas={data.empresasContratistas}
              onSelectLicitacionById={(id) => {
                const found = data.licitaciones.find(l => l.id === id);
                if (found) setSelectedLicitacion(found);
              }}
              onNavigateToExplorer={(filter) => {
                setActiveTab('explorer');
              }}
            />
          )}

          {activeTab === 'explorer' && (
            <ExplorerView 
              licitaciones={data.licitaciones}
              onSelectLicitacion={(item) => setSelectedLicitacion(item)}
              initialOrganism={filterOrganism}
            />
          )}

          {activeTab === 'winners' && (
            <WinnersView 
              empresas={data.empresasContratistas}
              topPorMonto={data.topEmpresasPorMonto}
              topPorCantidad={data.topEmpresasPorCantidad}
              rubrosEmpresas={data.rubrosEmpresas}
              resumen={data.resumen}
              onSelectLicitacionById={(id) => {
                const found = data.licitaciones.find(l => l.id === id);
                if (found) setSelectedLicitacion(found);
              }}
            />
          )}

          {activeTab === 'metrics' && (
            <MetricsView 
              topOrganismos={data.topOrganismos}
              porTipo={data.porTipo}
              porYear={data.porYear}
              porRubro={data.porRubro}
              topEmpresasPorMonto={data.topEmpresasPorMonto}
              topEmpresasPorCantidad={data.topEmpresasPorCantidad}
              onSelectOrganism={handleSelectOrganism}
              onNavigateToWinners={() => setActiveTab('winners')}
            />
          )}

          {activeTab === 'tracking' && (
            <ExpedienteTrackerView 
              licitaciones={data.licitaciones}
              onSelectLicitacion={(item) => setSelectedLicitacion(item)}
            />
          )}
        </div>

      </main>

      {/* Tender Detail Modal */}
      {selectedLicitacion && (
        <TenderModal 
          item={selectedLicitacion} 
          onClose={() => setSelectedLicitacion(null)} 
        />
      )}

      {/* Footer (Classic WordPress Editorial Colophon) */}
      <footer className="border-t border-[#c3c4c7] bg-white py-6 px-6 mt-12 text-xs text-[#50575e] shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#134e2c]"></span>
            <span className="text-[#2c3338] font-medium">Vigía San Juan — Datos de fuentes públicas oficiales (Dirección Provincial de Informática & Contaduría General)</span>
          </div>
          <div className="text-[#50575e]">
            Expedientes y Resoluciones extraídas de <code className="font-mono text-[#134e2c] font-semibold">licitaciones.sanjuan.gob.ar</code>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
