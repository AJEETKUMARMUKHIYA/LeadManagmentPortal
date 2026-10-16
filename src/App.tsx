import React, { useState, useEffect } from 'react';
import { initialLeads } from './data/initialLeads';
import { Lead, LeadStatus } from './types';
import { Navbar } from './components/Navbar';
import { LeadListTable } from './components/LeadListTable';
import { LeadExtractorModal } from './components/LeadExtractorModal';
import { LeadDetailsDrawer } from './components/LeadDetailsDrawer';
import { MarketingCampaignBuilder } from './components/MarketingCampaignBuilder';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { IntegrationsHubView } from './components/IntegrationsHubView';
import { CheckCircle, Sparkles, Download, ArrowRight, ShieldCheck, Database, Zap, Globe, MapPin } from 'lucide-react';

// Helper to detect any legacy hardcoded mock leads
function isHardcodedMockLead(l: Lead): boolean {
  if (!l || !l.id) return true;
  // Legacy mock IDs from original repo import were lead-1, lead-2, etc. (under 7 digits)
  if (/^lead-\d{1,6}$/.test(l.id)) return true;
  if (l.id.startsWith('mock-') || l.id.startsWith('dummy-') || l.id.startsWith('sample-') || l.id.startsWith('lead-10')) return true;
  return false;
}

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('movers_crm_leads');
    if (saved) {
      try {
        const parsed: Lead[] = JSON.parse(saved);
        // Strictly filter out all old hardcoded dummy/static leads
        const cleaned = parsed.filter(l => !isHardcodedMockLead(l));
        // Overwrite localStorage with sanitized list so mock leads never reappear
        localStorage.setItem('movers_crm_leads', JSON.stringify(cleaned));
        return cleaned;
      } catch (e) {
        console.error('Failed to parse saved leads:', e);
      }
    }
    return initialLeads.filter(l => !isHardcodedMockLead(l));
  });

  const [activeTab, setActiveTab] = useState<'directory' | 'extractor' | 'campaigns' | 'analytics' | 'integrations'>('directory');
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadForCampaign, setSelectedLeadForCampaign] = useState<Lead | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isFetchingCityLeads, setIsFetchingCityLeads] = useState<boolean>(false);

  // Directly fetch live city leads for Bangalore, Delhi, Mumbai, Hyderabad, Pune from directory
  const handleFetchCityLeadsDirectly = async (city: string) => {
    setIsFetchingCityLeads(true);
    showNotification(`Querying live Google & Web search leads for ${city}...`);
    try {
      const res = await fetch('/api/fetch-live-city-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          sourcePlatform: 'Google Search & Places',
          queryCategory: 'Recent Search Inquiries'
        })
      });
      const data = await res.json();
      if (data.success && data.leads?.length) {
        setLeads(prev => [...data.leads, ...prev]);
        showNotification(`Extracted & added ${data.leads.length} active leads for ${city} to CRM!`);
      } else {
        showNotification(`Could not fetch leads for ${city}. Please try again.`);
      }
    } catch (e) {
      console.error(e);
      showNotification(`Failed to connect to web search crawler for ${city}.`);
    } finally {
      setIsFetchingCityLeads(false);
    }
  };

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

  // Clear all leads from CRM (Reset to fresh state)
  const handleClearAllLeads = () => {
    setLeads([]);
    localStorage.removeItem('movers_crm_leads');
    if (selectedLead) setSelectedLead(null);
    if (selectedLeadForCampaign) setSelectedLeadForCampaign(null);
    showNotification('All leads cleared. AJSUM CRM is ready for new real-time inquiries.');
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
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* Top ambient luxury lighting glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-72 bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalLeads={leads.length}
        newLeadsCount={newLeadsCount}
        highIntentCount={highIntentCount}
        onOpenExtractor={() => setIsExtractorOpen(true)}
        onExportData={handleExportCSV}
        onClearAllLeads={handleClearAllLeads}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A]/95 border border-blue-500/40 text-white px-4 py-3 rounded-xl shadow-2xl shadow-blue-950/60 backdrop-blur-xl flex items-center space-x-2.5 animate-bounce ring-1 ring-white/10">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold">{notification}</span>
          </div>
        )}

        {/* Hero Quick Banner for Search Lead Extractor */}
        <div className="bg-gradient-to-r from-[#0C1322] via-[#101A2F] to-[#0C1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-black/40 ring-1 ring-white/5">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-blue-500/25 ring-1 ring-white/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                <span>Mover & Packer Google Search Lead Extractor</span>
                <span className="text-[10px] bg-blue-500/15 text-blue-300 font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/30 font-mono">
                  Gemini AI Powered
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-light">
                Paste or simulate live Google Chrome search queries (e.g. "2bhk packers movers Indiranagar to HSR Saturday quote") to auto-generate structured customer leads with move dates, routes, and lead scores.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('integrations')}
              className="flex-1 md:flex-initial bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-medium px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>City Web Radar (5 Metros)</span>
            </button>
            <button
              onClick={() => setIsExtractorOpen(true)}
              className="flex-1 md:flex-initial bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 border border-blue-400/30 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Search Query</span>
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
            onFetchCityLeads={handleFetchCityLeadsDirectly}
            isFetchingCityLeads={isFetchingCityLeads}
            onClearAllLeads={handleClearAllLeads}
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
            <div className="bg-[#0C1322] border border-slate-800/80 rounded-2xl p-8 space-y-5 shadow-xl shadow-black/40 ring-1 ring-white/5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/25 ring-1 ring-white/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Extract Search Queries into CRM Leads</h2>
                <p className="text-xs text-slate-400 font-light max-w-md mx-auto">
                  Run instant AI parsing on user Chrome search terms or paste web inquiry logs into structured customer profiles.
                </p>
              </div>
              <button
                onClick={() => setIsExtractorOpen(true)}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
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


    </div>
  );
}
