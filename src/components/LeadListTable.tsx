import React, { useState } from 'react';
import { 
  Search, Filter, MapPin, Calendar, Phone, Mail, Flame, 
  ChevronRight, MoreVertical, Sparkles, MessageSquare, Plus, Trash2, Tag, CheckCircle2
} from 'lucide-react';
import { Lead, LeadStatus, ServiceType, UrgencyLevel } from '../types';

interface LeadListTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onDeleteLead: (leadId: string) => void;
  onOpenCampaignModal: (lead: Lead) => void;
  onOpenExtractor: () => void;
}

export const LeadListTable: React.FC<LeadListTableProps> = ({
  leads,
  onSelectLead,
  onUpdateStatus,
  onDeleteLead,
  onOpenCampaignModal,
  onOpenExtractor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
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

    return matchesSearch && matchesStatus && matchesService && matchesUrgency;
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
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Contacted':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Quote Sent':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Won / Booked':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Lost':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getLeadScoreBadge = (score: number) => {
    if (score >= 90) {
      return (
        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          <Flame className="w-3 h-3 text-rose-500" />
          <span>{score} (Hot)</span>
        </span>
      );
    }
    if (score >= 75) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          {score} (Warm)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
        {score} (Normal)
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Search, Filter & Action Bar */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, city, keyword or search query..."
              className="w-full bg-[#0A0A0A] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 transition-all"
            />
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0A0A0A] border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 focus:border-blue-500"
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
              className="bg-[#0A0A0A] border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 focus:border-blue-500"
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
              className="bg-[#0A0A0A] border border-white/10 text-blue-400 font-medium text-xs rounded-xl px-3 py-2 focus:border-blue-500"
            >
              <option value="score">Sort by Lead Score</option>
              <option value="date">Sort by Recent</option>
              <option value="budget">Sort by Budget</option>
            </select>

            <button
              onClick={onOpenExtractor}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1 shadow-md transition-all ml-auto border border-blue-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Query</span>
            </button>

          </div>

        </div>
      </div>

      {/* Lead List Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
        <span>Showing <strong className="text-slate-200">{sortedLeads.length}</strong> lead inquiries</span>
        <span className="text-[11px] font-sans">Click on any row to view activity timeline</span>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/[0.02] text-slate-500 uppercase text-[10px] tracking-wider border-b border-white/5 font-bold">
              <tr>
                <th className="py-4 px-6">Business / Customer</th>
                <th className="py-4 px-6">Google Search Query</th>
                <th className="py-4 px-6">Service & Route</th>
                <th className="py-4 px-6">Move Date</th>
                <th className="py-4 px-6 text-center">Score</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-500">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-300">No Live Leads in Warehouse Table Yet</p>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        Extract live relocation inquiries using Google Places city data, Chrome Extension sync, or custom search query parsing.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                          onClick={onOpenExtractor}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Parse Search Query</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-white/[0.01] transition-colors group cursor-pointer"
                    onClick={() => onSelectLead(lead)}
                  >
                    {/* Customer & Contact */}
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-white text-sm group-hover:text-blue-400 transition-colors flex items-center space-x-2">
                          <span>{lead.customerName}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5 font-mono">
                          <span className="flex items-center text-blue-400/90"><Phone className="w-3 h-3 mr-1 text-slate-600" />{lead.phone}</span>
                        </div>
                        <span className="inline-block mt-1 text-[9px] bg-white/5 text-slate-400 font-mono px-2 py-0.5 rounded border border-white/5">
                          {lead.source}
                        </span>
                      </div>
                    </td>

                    {/* Google Search Query Intent */}
                    <td className="py-4 px-6 max-w-xs">
                      <div>
                        <p className="text-blue-400 font-mono text-xs line-clamp-2 italic">
                          "{lead.fullSearchQuery || 'Search Inquiry'}"
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {(lead.searchKeywords || []).slice(0, 2).map((kw, i) => (
                            <span key={i} className="text-[9px] bg-blue-500/10 text-blue-400 font-medium px-1.5 py-0.2 rounded border border-blue-500/20">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Service & Route */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-medium text-slate-200 block text-xs">{lead.serviceType} <span className="text-slate-500 font-normal">({lead.propertyType})</span></span>
                        <span className="text-[11px] text-slate-400 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-600 mr-1 shrink-0" />
                          <span className="truncate">{lead.originCity} → {lead.destinationCity}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium block mt-0.5 font-mono">
                          Est. Quote: ₹{(lead.estimatedBudget || 0).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Move Date */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center text-slate-400 text-xs font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-600 mr-1.5" />
                        <span>{lead.moveDate || 'Flexible'}</span>
                      </div>
                    </td>

                    {/* Score & Urgency */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center space-y-1">
                        {getLeadScoreBadge(lead.leadScore)}
                        <span className={`text-[10px] font-medium ${
                          lead.urgency === 'High' ? 'text-rose-400' : 'text-slate-500'
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
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onOpenCampaignModal(lead)}
                          title="Generate AI Marketing Follow-up Message"
                          className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors border border-blue-500/20"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectLead(lead)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg bg-white/5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
