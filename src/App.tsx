import React, { useState, useEffect } from 'react';
import { initialLeads } from './data/initialLeads';
import { Lead, LeadStatus } from './types';
import { Navbar } from './components/Navbar';
import { LeadListTable } from './components/LeadListTable';
import { LeadExtractorModal } from './components/LeadExtractorModal';
import { LeadDetailsDrawer } from './components/LeadDetailsDrawer';
import { MarketingCampaignBuilder } from './components/MarketingCampaignBuilder';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { QuoteCalculatorView } from './components/QuoteCalculatorView';
import { IntegrationsHubView } from './components/IntegrationsHubView';
import { CheckCircle, Sparkles, Download, ArrowRight, ShieldCheck, Database, Zap } from 'lucide-react';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('movers_crm_leads');
    if (saved) {
      try {
        const parsed: Lead[] = JSON.parse(saved);
        // Remove old initial dummy static leads if present
        const filtered = parsed.filter(l => !l.id.startsWith('lead-10'));
        return filtered;
      } catch (e) {
        console.error('Failed to parse saved leads:', e);
      }
    }
    return initialLeads;
  });

  const [activeTab, setActiveTab] = useState<'directory' | 'extractor' | 'campaigns' | 'analytics' | 'calculator' | 'integrations'>('directory');
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadForCampaign, setSelectedLeadForCampaign] = useState<Lead | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('movers_crm_leads', JSON.stringify(leads));
  }, [leads]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Add Extracted Lead
  const handleLeadsExtracted = (newLeads: Lead[]) => {
    setLeads(prev => [...newLeads, ...prev]);
    showNotification(`Successfully extracted & saved ${newLeads.length} lead(s) to CRM list!`);
  };

  // Update Status
  const handleUpdateStatus = (leadId: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const updated = { ...l, status };
        if (selectedLead?.id === leadId) setSelectedLead(updated);
        return updated;
      }
      return l;
    }));
    showNotification(`Lead status updated to '${status}'`);
  };

  // Delete Lead
  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (selectedLead?.id === leadId) setSelectedLead(null);
    showNotification('Lead removed from CRM list');
  };

  // Add Follow-up note
  const handleAddFollowUpNote = (leadId: string, noteText: string) => {
    const newNoteObj = {
      id: `note-${Date.now()}`,
      date: new Date().toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      note: noteText,
      createdBy: 'Sales Admin'
    };

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const updated = {
          ...l,
          followUps: [newNoteObj, ...(l.followUps || [])]
        };
        if (selectedLead?.id === leadId) setSelectedLead(updated);
        return updated;
      }
      return l;
    }));
    showNotification('Follow-up note logged!');
  };

  // Open Campaign Modal
  const handleOpenCampaignModal = (lead: Lead) => {
    setSelectedLeadForCampaign(lead);
    setActiveTab('campaigns');
  };

  // Log Campaign Sent
  const handleLogCampaignSent = (leadId: string, channel: 'WhatsApp' | 'SMS' | 'Email', content: string) => {
    const campObj = {
      id: `camp-${Date.now()}`,
      date: new Date().toLocaleString(),
      channel,
      content,
      status: 'Sent' as const
    };

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          status: l.status === 'New' ? 'Contacted' : l.status,
          campaigns: [campObj, ...(l.campaigns || [])]
        };
      }
      return l;
    }));
    showNotification(`Logged ${channel} campaign sent to lead!`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Customer Name', 'Phone', 'Email', 'Service Type', 'Property', 'Origin', 'Destination', 'Move Date', 'Budget', 'Status', 'Lead Score', 'Search Query'];
    const rows = leads.map(l => [
      l.id,
      `"${l.customerName || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.serviceType || ''}"`,
      `"${l.propertyType || ''}"`,
      `"${l.originCity || ''}"`,
      `"${l.destinationCity || ''}"`,
      `"${l.moveDate || ''}"`,
      l.estimatedBudget || 0,
      `"${l.status || ''}"`,
      l.leadScore || 0,
      `"${(l.fullSearchQuery || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `movers_packers_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported lead list to CSV file!');
  };

  // Calculations for Navbar metrics
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const highIntentCount = leads.filter(l => l.leadScore >= 85).length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalLeads={leads.length}
        newLeadsCount={newLeadsCount}
        highIntentCount={highIntentCount}
        onOpenExtractor={() => setIsExtractorOpen(true)}
        onExportData={handleExportCSV}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-blue-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold">{notification}</span>
          </div>
        )}

        {/* Hero Quick Banner for Search Lead Extractor */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                <span>Mover & Packer Google Search Lead Extractor</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 font-medium px-2 py-0.5 rounded-full border border-blue-500/20">
                  Gemini AI Powered
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-light">
                Paste or simulate user Google Chrome search queries (e.g. "2bhk packers movers Indiranagar to HSR Saturday quote") to auto-generate structured customer leads with move dates, routes, and lead scores.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsExtractorOpen(true)}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate & Extract Search Query</span>
            </button>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'directory' && (
          <LeadListTable
            leads={leads}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onUpdateStatus={handleUpdateStatus}
            onDeleteLead={handleDeleteLead}
            onOpenCampaignModal={handleOpenCampaignModal}
            onOpenExtractor={() => setIsExtractorOpen(true)}
          />
        )}

        {activeTab === 'integrations' && (
          <IntegrationsHubView
            onAddLeads={handleLeadsExtracted}
            onShowNotification={showNotification}
          />
        )}

        {activeTab === 'extractor' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="text-center space-y-1">
                <h2 className="text-base font-semibold text-white">Extract Search Queries into CRM Leads</h2>
                <p className="text-xs text-slate-400 font-light">Run instant AI parsing on user Chrome search terms or paste web inquiry logs.</p>
              </div>
              <button
                onClick={() => setIsExtractorOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Interactive Search Extractor Tool</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <MarketingCampaignBuilder
            leads={leads}
            selectedLeadForCampaign={selectedLeadForCampaign}
            onLogCampaignSent={handleLogCampaignSent}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard leads={leads} />
        )}

        {activeTab === 'calculator' && (
          <QuoteCalculatorView
            onSaveQuoteAsLead={(newLead) => {
              setLeads(prev => [newLead, ...prev]);
              setActiveTab('directory');
              showNotification('Quote saved as new CRM lead!');
            }}
          />
        )}

      </main>

      {/* Extractor Modal */}
      <LeadExtractorModal
        isOpen={isExtractorOpen}
        onClose={() => setIsExtractorOpen(false)}
        onLeadExtracted={handleLeadsExtracted}
      />

      {/* Lead Details Drawer */}
      <LeadDetailsDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={handleUpdateStatus}
        onAddFollowUpNote={handleAddFollowUpNote}
        onOpenCampaignModal={handleOpenCampaignModal}
      />

      {/* Simple Footer */}
      <footer className="border-t border-white/5 bg-[#0A0A0A] py-4 text-center text-xs text-slate-600 mt-auto">
        <p>Movers & Packers Search Lead CRM • Powered by Gemini AI & Google AI Studio</p>
      </footer>

    </div>
  );
}
