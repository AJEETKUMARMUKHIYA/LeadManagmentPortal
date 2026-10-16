import React, { useState } from 'react';
import { 
  Search, Filter, MapPin, Calendar, Phone, Mail, Flame, Globe, ExternalLink,
  ChevronRight, MoreVertical, Sparkles, MessageSquare, Plus, Trash2, Tag, CheckCircle2
} from 'lucide-react';
import { Lead, LeadStatus, ServiceType, UrgencyLevel } from '../types';
import { BrandLogo } from './BrandLogo';

interface LeadListTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onDeleteLead: (leadId: string) => void;
  onOpenCampaignModal: (lead: Lead) => void;
  onOpenExtractor: () => void;
  onFetchCityLeads?: (city: string) => void;
  isFetchingCityLeads?: boolean;
  onClearAllLeads?: () => void;
}

export const LeadListTable: React.FC<LeadListTableProps> = ({
  leads,
  onSelectLead,
  onUpdateStatus,
  onDeleteLead,
  onOpenCampaignModal,
  onOpenExtractor,
  onFetchCityLeads,
  isFetchingCityLeads = false,
  onClearAllLeads
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'budget'>('score');

  // Filtering
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.fullSearchQuery || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.originCity || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.destinationCity || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').includes(searchTerm);

    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
    const matchesService = selectedService === 'All' || lead.serviceType === selectedService;
    const matchesUrgency = selectedUrgency === 'All' || lead.urgency === selectedUrgency;
    const matchesCity = selectedCityFilter === 'All' || 
      (lead.originCity || '').toLowerCase().includes(selectedCityFilter.toLowerCase()) ||
      (lead.destinationCity || '').toLowerCase().includes(selectedCityFilter.toLowerCase()) ||
      (lead.source || '').toLowerCase().includes(selectedCityFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesService && matchesUrgency && matchesCity;
  });

  // Sorting
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'score') return b.leadScore - a.leadScore;
    if (sortBy === 'budget') return b.estimatedBudget - a.estimatedBudget;
    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Contacted':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Quote Sent':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Won / Booked':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Lost':
        return 'bg-slate-700/30 text-slate-400 border-slate-700/50';
    }
  };

  const getLeadScoreBadge = (score: number) => {
    if (score >= 90) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500/20 to-orange-500/20 text-rose-300 border border-rose-500/30 shadow-sm font-mono">
          <Flame className="w-3 h-3 text-rose-400" />
          <span>{score} Hot</span>
        </span>
      );
    }
    if (score >= 75) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
          {score} Warm
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60 font-mono">
        {score} Standard
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Search, Filter & Action Bar */}
      <div className="bg-[#0C1322] border border-slate-800/90 rounded-2xl p-4 shadow-xl shadow-black/40 space-y-3 ring-1 ring-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, city, keyword or search query..."
              className="w-full bg-[#070D18] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 transition-all shadow-inner"
            />
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#070D18] border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:border-blue-500 shadow-inner"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Quote Sent">Quote Sent</option>
              <option value="Won / Booked">Won / Booked</option>
              <option value="Lost">Lost</option>
            </select>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="bg-[#070D18] border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:border-blue-500 shadow-inner"
            >
              <option value="All">All Services</option>
              <option value="Local Shifting">Local Shifting</option>
              <option value="Inter-city Moving">Inter-city Moving</option>
              <option value="Office Relocation">Office Relocation</option>
              <option value="Vehicle Transport">Vehicle Transport</option>
              <option value="Warehouse Storage">Warehouse Storage</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#070D18] border border-slate-800 text-blue-400 font-medium text-xs rounded-xl px-3 py-2 focus:border-blue-500 shadow-inner font-mono"
            >
              <option value="score">Sort by Lead Score</option>
              <option value="date">Sort by Recent</option>
              <option value="budget">Sort by Budget</option>
            </select>

            <button
              onClick={onOpenExtractor}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/25 transition-all ml-auto border border-blue-400/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Query</span>
            </button>

            {leads.length > 0 && onClearAllLeads && (
              <button
                onClick={onClearAllLeads}
                className="bg-rose-500/10 hover:bg-rose-600 hover:text-white text-rose-400 border border-rose-500/30 px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                title="Clear all leads from the table"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All ({leads.length})</span>
              </button>
            )}

          </div>

        </div>

        {/* City Radar Bar: Quick Filter & Live Fetch for 5 Major Metros */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5 pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> City Radar:
            </span>
            {['All', 'Bangalore', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune'].map((cityName) => (
              <button
                key={cityName}
                type="button"
                onClick={() => setSelectedCityFilter(cityName)}
                className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                  selectedCityFilter === cityName
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/25 ring-1 ring-blue-400/50'
                    : 'bg-[#070D18] hover:bg-slate-800/60 text-slate-300 border border-slate-800'
                }`}
              >
                {cityName === 'All' ? 'All Metros' : `📍 ${cityName}`}
              </button>
            ))}
          </div>

          {onFetchCityLeads && (
            <button
              type="button"
              onClick={() => onFetchCityLeads(selectedCityFilter === 'All' ? 'Bangalore' : selectedCityFilter)}
              disabled={isFetchingCityLeads}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 active:scale-95 cursor-pointer ml-auto sm:ml-0"
            >
              {isFetchingCityLeads ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  <span>Fetching Google Leads for {selectedCityFilter === 'All' ? 'Bangalore' : selectedCityFilter}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fetch Active Google Leads for {selectedCityFilter === 'All' ? 'Bangalore' : selectedCityFilter}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Lead List Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span>Showing <strong className="text-white font-bold">{sortedLeads.length}</strong> lead inquiries</span>
        <span className="text-[11px] font-sans text-slate-400">Click on any row to view activity timeline</span>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#0C1322] border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#080E1C] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800/90 font-bold">
              <tr>
                <th className="py-4 px-6">Business / Customer</th>
                <th className="py-4 px-6">Lead Source</th>
                <th className="py-4 px-6">Google Search Query</th>
                <th className="py-4 px-6">Service & Route</th>
                <th className="py-4 px-6">Move Date</th>
                <th className="py-4 px-6 text-center">Score</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 px-4 text-slate-500">
                    <div className="max-w-xl mx-auto space-y-4">
                      <div className="flex justify-center mx-auto">
                        <BrandLogo size="lg" />
                      </div>
                      
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>0 Hardcoded Leads • Clean Slate Ready for Fresh Leads</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-200">No Leads in AJSUM Directory Yet</h3>
                        <p className="text-xs text-slate-400 font-light mt-1 max-w-md mx-auto leading-relaxed">
                          All mock dummy leads have been removed. Fetch active relocation inquiries for your target city using the 1-click buttons below or parse new search queries:
                        </p>
                      </div>

                      {/* 1-Click Metro Lead Fetch Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 max-w-lg mx-auto">
                        {[
                          { name: 'Bangalore', emoji: '📍' },
                          { name: 'Delhi', emoji: '📍' },
                          { name: 'Mumbai', emoji: '📍' },
                          { name: 'Hyderabad', emoji: '📍' },
                          { name: 'Pune', emoji: '📍' }
                        ].map(({ name, emoji }) => (
                          <button
                            key={name}
                            type="button"
                            disabled={isFetchingCityLeads}
                            onClick={() => onFetchCityLeads && onFetchCityLeads(name)}
                            className="bg-[#070D18] hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white border border-slate-800 hover:border-blue-500/40 text-slate-300 font-medium px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                          >
                            <span>{emoji} Fetch {name}</span>
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={onOpenExtractor}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Parse Query</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-blue-600/[0.04] transition-colors group cursor-pointer"
                    onClick={() => onSelectLead(lead)}
                  >
                    {/* Customer & Contact */}
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors flex items-center space-x-2">
                          <span>{lead.customerName}</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5 font-mono">
                          <span className="flex items-center text-blue-400"><Phone className="w-3 h-3 mr-1 text-slate-500" />{lead.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Dedicated Lead Source Column */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-[11px] bg-blue-500/15 text-blue-300 font-medium px-2.5 py-1 rounded-lg border border-blue-500/30 whitespace-nowrap">
                          <Globe className="w-3 h-3 text-blue-400 shrink-0" />
                          {lead.source || 'Direct Search'}
                        </span>

                        {lead.webSources && lead.webSources.length > 0 && (
                          <div className="flex flex-col gap-0.5 pt-0.5">
                            {lead.webSources.slice(0, 1).map((src, i) => (
                              <a
                                key={i}
                                href={src.uri}
                                target="_blank"
                                rel="noreferrer noopener"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-300 transition-colors truncate max-w-[160px]"
                                title={src.title || src.uri}
                              >
                                <ExternalLink className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                                <span className="truncate">{src.title || 'Source Link'}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Google Search Query Intent */}
                    <td className="py-4 px-6 max-w-xs">
                      <div>
                        <p className="text-indigo-300 font-mono text-xs line-clamp-2 italic">
                          "{lead.fullSearchQuery || 'Search Inquiry'}"
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {(lead.searchKeywords || []).slice(0, 2).map((kw, i) => (
                            <span key={i} className="text-[9px] bg-indigo-500/15 text-indigo-300 font-medium px-2 py-0.5 rounded border border-indigo-500/30 font-mono">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Service & Route */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-semibold text-slate-100 block text-xs">{lead.serviceType} <span className="text-slate-400 font-normal">({lead.propertyType})</span></span>
                        <span className="text-[11px] text-slate-300 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500 mr-1 shrink-0" />
                          <span className="truncate">{lead.originCity} → {lead.destinationCity}</span>
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5 font-mono">
                          Est. Quote: ₹{(lead.estimatedBudget || 0).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Move Date */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center text-slate-300 text-xs font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                        <span>{lead.moveDate || 'Flexible'}</span>
                      </div>
                    </td>

                    {/* Score & Urgency */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center space-y-1">
                        {getLeadScoreBadge(lead.leadScore)}
                        <span className={`text-[10px] font-medium ${
                          lead.urgency === 'High' ? 'text-rose-400 font-semibold' : 'text-slate-400'
                        }`}>
                          {lead.urgency} Urgency
                        </span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-6 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-medium rounded-full px-2.5 py-1 border focus:outline-none transition-all cursor-pointer ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Quote Sent">Quote Sent</option>
                        <option value="Won / Booked">Won / Booked</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onOpenCampaignModal(lead)}
                          title="Generate AI Marketing Follow-up Message"
                          className="p-1.5 rounded-xl bg-blue-500/15 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors border border-blue-500/30 shadow-sm cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectLead(lead)}
                          title="View Details"
                          className="p-1.5 rounded-xl bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/60 shadow-sm cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          title="Delete Lead"
                          className="p-1.5 rounded-xl bg-slate-800/40 text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 transition-colors border border-transparent hover:border-rose-500/20 shadow-sm cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
