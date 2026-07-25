import React from 'react';
import { Database, Search, Sparkles, Send, BarChart2, Calculator, Download, Plus, Zap, Table } from 'lucide-react';

interface NavbarProps {
  activeTab: 'directory' | 'extractor' | 'campaigns' | 'analytics' | 'calculator' | 'integrations';
  setActiveTab: (tab: 'directory' | 'extractor' | 'campaigns' | 'analytics' | 'calculator' | 'integrations') => void;
  totalLeads: number;
  newLeadsCount: number;
  highIntentCount: number;
  onOpenExtractor: () => void;
  onExportData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalLeads,
  newLeadsCount,
  highIntentCount,
  onOpenExtractor,
  onExportData
}) => {
  return (
    <header className="bg-[#141414] text-slate-200 border-b border-white/5 sticky top-0 z-30 shadow-2xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('directory')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 border border-white/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-base tracking-tight text-white">Lead Warehouse</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 font-medium px-2 py-0.5 rounded-full border border-blue-500/20 tracking-wide uppercase">
                  CRM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-light">Search Lead Extractor & Marketing Automation</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#0A0A0A]/80 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'directory'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Lead Directory</span>
              <span className="ml-1 bg-black/40 text-current text-[10px] px-1.5 py-0.2 rounded-full border border-white/10">
                {totalLeads}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('integrations')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'integrations'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Real Integrations</span>
            </button>

            <button
              onClick={() => setActiveTab('extractor')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'extractor'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Extractor</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>AI Marketing</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Keywords</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'calculator'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Quote Engine</span>
            </button>
          </nav>

          {/* Quick Metrics & CTA */}

          {/* Quick Metrics & CTA */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-3 text-xs border-r border-white/5 pr-3">
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">New Leads</span>
                <span className="font-semibold text-blue-400">{newLeadsCount} Leads</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Hot Intent</span>
                <span className="font-semibold text-emerald-400">{highIntentCount} High Score</span>
              </div>
            </div>

            <button
              onClick={onOpenExtractor}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-2 rounded-lg text-xs shadow-md transition-all active:scale-95 border border-blue-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Extract Search Query</span>
            </button>

            <button
              onClick={onExportData}
              title="Export Lead List CSV"
              className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Tab Strip */}
        <div className="md:hidden flex items-center space-x-1 py-2 overflow-x-auto text-xs no-scrollbar border-t border-white/5">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'directory' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 bg-white/5'}`}
          >
            Leads ({totalLeads})
          </button>
          <button
            onClick={() => setActiveTab('extractor')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'extractor' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 bg-white/5'}`}
          >
            Extractor
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'campaigns' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 bg-white/5'}`}
          >
            Marketing
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'analytics' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 bg-white/5'}`}
          >
            Keywords
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'calculator' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 bg-white/5'}`}
          >
            Quote Calculator
          </button>
        </div>

      </div>
    </header>
  );
};
