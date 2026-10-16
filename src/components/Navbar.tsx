import React from 'react';
import { Search, Sparkles, Send, BarChart2, Download, Plus, Zap, Table, Trash2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  activeTab: 'directory' | 'extractor' | 'campaigns' | 'analytics' | 'integrations';
  setActiveTab: (tab: 'directory' | 'extractor' | 'campaigns' | 'analytics' | 'integrations') => void;
  totalLeads: number;
  newLeadsCount: number;
  highIntentCount: number;
  onOpenExtractor: () => void;
  onExportData: () => void;
  onClearAllLeads?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalLeads,
  newLeadsCount,
  highIntentCount,
  onOpenExtractor,
  onExportData,
  onClearAllLeads
}) => {
  return (
    <header className="bg-[#0B1120]/95 text-slate-100 border-b border-slate-800/80 sticky top-0 z-30 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center cursor-pointer transition-opacity hover:opacity-95" onClick={() => setActiveTab('directory')}>
            <BrandLogo size="md" showText={true} subtitle="Search Lead Extractor & Marketing Automation" />
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#060A13]/90 p-1.5 rounded-xl border border-slate-800/90 shadow-inner">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'directory'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/25 ring-1 ring-white/15'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Lead Directory</span>
              <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'directory' ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}>
                {totalLeads}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('integrations')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'integrations'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/25 ring-1 ring-white/15'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Real Integrations</span>
            </button>

            <button
              onClick={() => setActiveTab('extractor')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'extractor'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/25 ring-1 ring-white/15'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Extractor</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/25 ring-1 ring-white/15'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>AI Marketing</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/25 ring-1 ring-white/15'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Keywords</span>
            </button>
          </nav>

          {/* Quick Metrics & CTA */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-4 text-xs border-r border-slate-800/80 pr-4">
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">New Inquiries</span>
                <span className="font-semibold text-blue-400 font-mono">{newLeadsCount} Leads</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">High Intent</span>
                <span className="font-semibold text-emerald-400 font-mono">{highIntentCount} High Score</span>
              </div>
            </div>

            <button
              onClick={onOpenExtractor}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 border border-blue-400/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Extract Query</span>
            </button>

            <button
              onClick={onExportData}
              title="Export Lead List CSV"
              className="p-2 rounded-xl bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
            </button>

            {totalLeads > 0 && onClearAllLeads && (
              <button
                onClick={onClearAllLeads}
                title="Clear All Leads from AJSUM CRM"
                className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors border border-rose-500/30 cursor-pointer shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Mobile Tab Strip */}
        <div className="md:hidden flex items-center space-x-1.5 py-2.5 overflow-x-auto text-xs no-scrollbar border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all ${activeTab === 'directory' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 bg-slate-800/50'}`}
          >
            Leads ({totalLeads})
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all ${activeTab === 'integrations' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 bg-slate-800/50'}`}
          >
            Integrations
          </button>
          <button
            onClick={() => setActiveTab('extractor')}
            className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all ${activeTab === 'extractor' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 bg-slate-800/50'}`}
          >
            Extractor
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all ${activeTab === 'campaigns' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 bg-slate-800/50'}`}
          >
            Marketing
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all ${activeTab === 'analytics' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 bg-slate-800/50'}`}
          >
            Keywords
          </button>
        </div>

      </div>
    </header>
  );
};
