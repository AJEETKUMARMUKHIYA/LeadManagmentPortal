import React, { useState } from 'react';
import { Search, Sparkles, X, Check, Globe, RefreshCw, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Lead } from '../types';
import { BrandLogo } from './BrandLogo';

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
    '📍 Bangalore: urgent 2bhk household shifting Indiranagar to Whitefield this Saturday quote with fragile bubble wrap',
    '📍 Delhi NCR: packers movers 3bhk household items Dwarka to Gurgaon DLF Cyber City with 3 AC dismantle',
    '📍 Mumbai: best packers movers Andheri Lokhandwala to Powai Hiranandani 2bhk household goods shift',
    '📍 Hyderabad: household shifting Gachibowli to Hitech City Hyderabad 2bhk quote immediate weekend',
    '📍 Pune: packers and movers Pune Kothrud to Hinjewadi phase 1 2bhk household items with bike transport',
    '📍 Interstate: intercity household goods movers Bangalore to Mumbai with Hyundai i20 car carrier and transit insurance'
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0C1322] border border-slate-800/90 rounded-2xl max-w-2xl w-full shadow-2xl shadow-black/80 overflow-hidden text-slate-100 my-8 ring-1 ring-white/10">
        
        {/* Header */}
        <div className="bg-[#090F1C] px-6 py-4 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrandLogo size="sm" />
            <div>
              <h2 className="text-base font-semibold text-white">Google Search Lead Extractor</h2>
              <p className="text-xs text-slate-400 font-light">Extract mover & packer search inquiries into actionable CRM leads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Mode Switcher */}
          <div className="flex items-center justify-between bg-[#060A13] p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => { setActiveMode('chrome'); setErrorMessage(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeMode === 'chrome'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Chrome Search Query Simulator</span>
            </button>
            <button
              onClick={() => { setActiveMode('bulk'); setErrorMessage(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeMode === 'bulk'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-semibold'
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
                    className="w-full bg-[#070D18] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-32 py-3 text-xs text-white placeholder-slate-500 transition-all font-mono shadow-inner"
                  />
                  <div className="absolute inset-y-1.5 right-1.5 flex items-center">
                    <button
                      onClick={handleExtract}
                      disabled={isExtracting}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50 shadow-md cursor-pointer"
                    >
                      {isExtracting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Parsing...</span>
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
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">
                  Try Sample Mover & Packer Search Inquiries:
                </span>
                <div className="space-y-1.5">
                  {sampleSearchQueries.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(sample)}
                      className="w-full text-left bg-[#070D18] hover:bg-slate-800/50 border border-slate-800/80 hover:border-blue-500/30 rounded-xl p-2.5 text-xs text-slate-300 transition-all flex items-start justify-between group cursor-pointer"
                    >
                      <span className="line-clamp-1 pr-2 font-mono text-[11px] text-blue-300">"{sample}"</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-blue-400 font-medium shrink-0">Use Query</span>
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
                className="w-full bg-[#070D18] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 transition-all font-mono shadow-inner"
              />
              <button
                onClick={handleExtract}
                disabled={isExtracting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
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
            <div className="bg-[#070D18] border border-blue-500/30 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">Extracted Search Lead Result</span>
                </div>
                <span className="text-[10px] bg-blue-500/15 text-blue-300 px-2.5 py-0.5 rounded-full font-semibold border border-blue-500/30 font-mono">
                  Lead Score: {extractionResult.leads[0]?.leadScore || 90}/100
                </span>
              </div>

              <p className="text-xs text-slate-300 italic bg-[#0C1322] p-2.5 rounded-xl border border-slate-800/80 font-mono">
                "{extractionResult.aiSummary}"
              </p>

              {/* Extracted Fields Summary */}
              {extractionResult.leads.map((lead, idx) => (
                <div key={idx} className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300 bg-[#0C1322] p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Name</span>
                    <span className="font-semibold text-white">{lead.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Service Needed</span>
                    <span className="font-semibold text-blue-300">{lead.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Property Size</span>
                    <span className="font-semibold text-white">{lead.propertyType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Route</span>
                    <span className="font-medium text-slate-200">{lead.originCity} → {lead.destinationCity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Est. Budget</span>
                    <span className="font-semibold text-emerald-400 font-mono">₹{lead.estimatedBudget?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Urgency</span>
                    <span className={`font-bold ${lead.urgency === 'High' ? 'text-rose-400' : 'text-blue-400'}`}>{lead.urgency}</span>
                  </div>
                </div>
              ))}

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setExtractionResult(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveToCRM}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
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
