import React, { useState } from 'react';
import { Search, Sparkles, X, Check, Globe, RefreshCw, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Lead } from '../types';

interface LeadExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadExtracted: (newLeads: Lead[]) => void;
}

export const LeadExtractorModal: React.FC<LeadExtractorModalProps> = ({
  isOpen,
  onClose,
  onLeadExtracted
}) => {
  const [activeMode, setActiveMode] = useState<'chrome' | 'bulk'>('chrome');
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [source, setSource] = useState('Google Chrome Search Query');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<{
    leads: Partial<Lead>[];
    aiSummary: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const sampleSearchQueries = [
    'best packers and movers for 2bhk household shifting from Indiranagar to Whitefield Bangalore this Saturday with fragile item bubble wrap',
    'interstate car transport quotes from Delhi to Mumbai with door pickup and closed carrier container insurance',
    'commercial office packers movers Gurgaon to Noida 30 workstations IT desk shifting GST bill',
    'urgent 1bhk house shifting near Kothrud Pune with bike transport',
    'household luggage storage warehouse Pune for 3 months rental price'
  ];

  const handleExtract = async () => {
    const inputContent = activeMode === 'chrome' ? searchQuery : bulkText;
    if (!inputContent.trim()) {
      setErrorMessage('Please enter or select a search query or text log to extract.');
      return;
    }

    setErrorMessage('');
    setIsExtracting(true);
    setExtractionResult(null);

    try {
      const response = await fetch('/api/extract-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchQuery: activeMode === 'chrome' ? searchQuery : undefined,
          rawText: activeMode === 'bulk' ? bulkText : undefined,
          source
        })
      });

      const data = await response.json();

      if (data.success && data.leads) {
        setExtractionResult({
          leads: data.leads,
          aiSummary: data.aiSummary || 'Lead details successfully extracted from user search query.'
        });
      } else {
        setErrorMessage(data.error || 'Failed to extract lead data from query.');
      }
    } catch (err: any) {
      console.error('Extraction error:', err);
      setErrorMessage('Server connection error while running AI extraction.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveToCRM = () => {
    if (extractionResult && extractionResult.leads.length > 0) {
      onLeadExtracted(extractionResult.leads as Lead[]);
      onClose();
      // Reset state
      setExtractionResult(null);
      setSearchQuery('');
      setBulkText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Header */}
        <div className="bg-[#141414] px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Google Search Lead Extractor</h2>
              <p className="text-xs text-slate-400 font-light">Extract mover & packer search inquiries into actionable CRM leads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Mode Switcher */}
          <div className="flex items-center justify-between bg-[#0A0A0A] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => { setActiveMode('chrome'); setErrorMessage(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-medium transition-all ${
                activeMode === 'chrome'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Chrome Search Query Simulator</span>
            </button>
            <button
              onClick={() => { setActiveMode('bulk'); setErrorMessage(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-medium transition-all ${
                activeMode === 'bulk'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Bulk Inquiry Paste Log</span>
            </button>
          </div>

          {activeMode === 'chrome' ? (
            <div className="space-y-4">
              {/* Simulated Google Chrome Search Address Bar */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Simulate User Search in Google Chrome:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., best movers packers 2bhk Indiranagar to HSR Bangalore this Saturday with packing..."
                    className="w-full bg-[#0A0A0A] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-28 py-3 text-xs text-white placeholder-slate-500 transition-all font-mono"
                  />
                  <div className="absolute inset-y-1 right-1 flex items-center">
                    <button
                      onClick={handleExtract}
                      disabled={isExtracting}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50 shadow-md"
                    >
                      {isExtracting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>AI Parsing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Extract Lead</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sample Preset Queries */}
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">
                  Try Sample Mover & Packer Search Inquiries:
                </span>
                <div className="space-y-1.5">
                  {sampleSearchQueries.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(sample)}
                      className="w-full text-left bg-[#0A0A0A] hover:bg-white/[0.03] border border-white/5 hover:border-blue-500/30 rounded-lg p-2.5 text-xs text-slate-300 transition-all flex items-start justify-between group"
                    >
                      <span className="line-clamp-1 pr-2 font-mono text-[11px] text-blue-400">"{sample}"</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-white font-medium shrink-0">Use Query</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Paste Customer Inquiry Logs / Multi-line Web Inquiries:
              </label>
              <textarea
                rows={5}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`Paste search logs or customer inquiry messages here, e.g.:\n"Customer Rajesh looking for 3BHK intercity moving from Delhi to Mumbai on 15th August, budget around 35k. Has bike transport requirement as well."`}
                className="w-full bg-[#0A0A0A] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 transition-all font-mono"
              />
              <button
                onClick={handleExtract}
                disabled={isExtracting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Structured Lead Profiles via Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Lead Data Now</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* AI Extraction Preview Card */}
          {extractionResult && extractionResult.leads.length > 0 && (
            <div className="bg-[#0A0A0A] border border-blue-500/30 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Extracted Search Lead Result</span>
                </div>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-medium border border-blue-500/20">
                  Lead Score: {extractionResult.leads[0]?.leadScore || 90}/100
                </span>
              </div>

              <p className="text-xs text-slate-300 italic bg-[#141414] p-2.5 rounded-lg border border-white/5 font-mono">
                "{extractionResult.aiSummary}"
              </p>

              {/* Extracted Fields Summary */}
              {extractionResult.leads.map((lead, idx) => (
                <div key={idx} className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300 bg-[#141414] p-3 rounded-lg border border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Name</span>
                    <span className="font-semibold text-white">{lead.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Service Needed</span>
                    <span className="font-medium text-blue-400">{lead.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Property Size</span>
                    <span className="font-semibold text-white">{lead.propertyType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Route</span>
                    <span className="font-medium text-slate-200">{lead.originCity} → {lead.destinationCity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Est. Budget</span>
                    <span className="font-medium text-emerald-400 font-mono">₹{lead.estimatedBudget?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Urgency</span>
                    <span className={`font-bold ${lead.urgency === 'High' ? 'text-rose-400' : 'text-blue-400'}`}>{lead.urgency}</span>
                  </div>
                </div>
              ))}

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setExtractionResult(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveToCRM}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Lead to CRM List</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
