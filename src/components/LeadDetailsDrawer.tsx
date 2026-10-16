import React, { useState } from 'react';
import { 
  X, Phone, Mail, MapPin, Calendar, Clock, Sparkles, Send, 
  MessageSquare, Plus, Calculator, Check, Flame, Shield, ArrowRight, Tag
} from 'lucide-react';
import { Lead, LeadStatus, FollowUpNote } from '../types';

interface LeadDetailsDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onAddFollowUpNote: (leadId: string, noteText: string) => void;
  onOpenCampaignModal: (lead: Lead) => void;
}

export const LeadDetailsDrawer: React.FC<LeadDetailsDrawerProps> = ({
  lead,
  onClose,
  onUpdateStatus,
  onAddFollowUpNote,
  onOpenCampaignModal
}) => {
  const [newNote, setNewNote] = useState('');
  const [calculatedQuote, setCalculatedQuote] = useState<{
    min: number;
    max: number;
    breakdown: any;
  } | null>(null);
  const [isCalculatingQuote, setIsCalculatingQuote] = useState(false);

  if (!lead) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddFollowUpNote(lead.id, newNote);
    setNewNote('');
  };

  const handleCalculateQuote = async () => {
    setIsCalculatingQuote(true);
    try {
      const response = await fetch('/api/calculate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType: lead.propertyType,
          serviceType: lead.serviceType,
          packingQuality: 'Premium / Multi-layer'
        })
      });
      const data = await response.json();
      if (data.success) {
        setCalculatedQuote({
          min: data.estimatedPriceMin,
          max: data.estimatedPriceMax,
          breakdown: data.breakdown
        });
      }
    } catch (err) {
      console.error('Quote calculation error:', err);
    } finally {
      setIsCalculatingQuote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end">
      <div className="bg-[#0C1322] border-l border-slate-800/90 w-full max-w-xl h-full shadow-2xl shadow-black/80 overflow-y-auto text-slate-100 flex flex-col ring-1 ring-white/10">
        
        {/* Drawer Header */}
        <div className="bg-[#090F1C] px-6 py-4 border-b border-slate-800/90 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <div>
              <h2 className="text-base font-semibold text-white">{lead.customerName}</h2>
              <p className="text-xs text-slate-400 font-mono">ID: {lead.id} • {lead.source}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Quick Actions & Status */}
          <div className="bg-[#070D18] p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Pipeline Status</span>
              <select
                value={lead.status}
                onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                className="bg-[#0C1322] text-blue-300 font-semibold text-xs rounded-xl px-3 py-1.5 border border-slate-800 mt-1 focus:border-blue-500 cursor-pointer shadow-inner"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Quote Sent">Quote Sent</option>
                <option value="Won / Booked">Won / Booked</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <button
              onClick={() => onOpenCampaignModal(lead)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/30 transition-all border border-blue-400/25 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Send AI Marketing Copy</span>
            </button>
          </div>

          {/* Original Chrome Search Intent */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center">
              <span>Google Search Inquiry Intent</span>
            </h3>
            <div className="bg-[#070D18] p-3.5 rounded-xl border border-slate-800/80 space-y-2">
              <p className="text-xs text-indigo-300 italic font-mono bg-[#0C1322] p-2.5 rounded-xl border border-slate-800/80">
                "{lead.fullSearchQuery || 'Search Inquiry'}"
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(lead.searchKeywords || []).map((kw, i) => (
                  <span key={i} className="text-[10px] bg-indigo-500/15 text-indigo-300 font-medium px-2 py-0.5 rounded-md border border-indigo-500/30 font-mono">
                    #{kw}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-300 pt-1">
                <strong className="text-slate-400">AI Notes:</strong> {lead.extractedNotes}
              </p>
            </div>
          </div>

          {/* Moving Requirements */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#070D18] p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Service Type</span>
              <span className="font-semibold text-white text-sm mt-0.5 block">{lead.serviceType}</span>
              <span className="text-slate-400 text-[11px] block">{lead.propertyType}</span>
            </div>

            <div className="bg-[#070D18] p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Est. Budget</span>
              <span className="font-semibold text-emerald-400 text-sm mt-0.5 block font-mono">₹{lead.estimatedBudget.toLocaleString()}</span>
              <span className="text-slate-400 text-[11px] block font-mono">Move Date: {lead.moveDate || 'Flexible'}</span>
            </div>

            <div className="bg-[#070D18] p-3 rounded-xl border border-slate-800/80 col-span-2">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Relocation Route</span>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold text-slate-200 text-xs">{lead.originCity}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-200 text-xs">{lead.destinationCity}</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Contact Information</h3>
            <div className="bg-[#070D18] p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center"><Phone className="w-3.5 h-3.5 mr-2 text-blue-400" />Phone</span>
                <span className="font-mono text-blue-300 font-semibold">{lead.phone}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span className="text-slate-400 flex items-center"><Mail className="w-3.5 h-3.5 mr-2 text-blue-400" />Email</span>
                <span className="text-slate-300 font-mono text-[11px]">{lead.email}</span>
              </div>
            </div>
          </div>

          {/* AI Instant Cost Estimator Widget */}
          <div className="bg-[#070D18] p-4 rounded-xl border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-white">Instant AI Cost Estimator</span>
              </div>
              <button
                onClick={handleCalculateQuote}
                disabled={isCalculatingQuote}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-[11px] px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-blue-600/25 cursor-pointer"
              >
                {isCalculatingQuote ? 'Calculating...' : 'Generate Estimate'}
              </button>
            </div>

            {calculatedQuote && (
              <div className="space-y-2 bg-[#0C1322] p-3 rounded-xl border border-slate-800/80 text-xs animate-fadeIn font-mono">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400 font-sans">Estimated Price Range</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ₹{calculatedQuote.min.toLocaleString()} - ₹{calculatedQuote.max.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>Packing: ₹{calculatedQuote.breakdown.packingCharges}</div>
                  <div>Loading/Unloading: ₹{calculatedQuote.breakdown.loadingUnloading}</div>
                  <div>Transport: ₹{calculatedQuote.breakdown.transportationCost}</div>
                  <div>Insurance/GST: ₹{calculatedQuote.breakdown.insuranceAndTaxes}</div>
                </div>
              </div>
            )}
          </div>

          {/* Follow-up Notes & Activity Log */}
          <div className="space-y-3">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center justify-between">
              <span>Follow-up History & Sales Notes</span>
              <span className="text-[10px] text-slate-400 font-mono">{(lead.followUps || []).length} entries</span>
            </h3>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log follow-up call, customer response or quote details..."
                className="flex-1 bg-[#070D18] border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 shadow-inner"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shrink-0 shadow-md shadow-blue-600/25 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log Note</span>
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {(!lead.followUps || lead.followUps.length === 0) ? (
                <p className="text-xs text-slate-400 italic p-3 bg-[#070D18] rounded-xl text-center border border-slate-800/80">No notes logged yet.</p>
              ) : (
                (lead.followUps || []).map((item) => (
                  <div key={item.id} className="bg-[#070D18] p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="font-semibold text-blue-400">{item.createdBy}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-slate-200">{item.note}</p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
