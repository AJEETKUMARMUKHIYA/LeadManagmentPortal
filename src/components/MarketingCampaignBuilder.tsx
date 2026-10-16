import React, { useState } from 'react';
import { Send, Sparkles, Copy, Check, MessageSquare, Phone, Mail, ShieldAlert, Tag, Layers, RefreshCw } from 'lucide-react';
import { Lead } from '../types';

interface MarketingCampaignBuilderProps {
  leads: Lead[];
  selectedLeadForCampaign?: Lead | null;
  onLogCampaignSent: (leadId: string, channel: 'WhatsApp' | 'SMS' | 'Email', content: string) => void;
}

export const MarketingCampaignBuilder: React.FC<MarketingCampaignBuilderProps> = ({
  leads,
  selectedLeadForCampaign,
  onLogCampaignSent
}) => {
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');
  const [tone, setTone] = useState<'Professional' | 'Urgent Offer' | 'Friendly Value'>('Professional');
  const [promotionalOffer, setPromotionalOffer] = useState('10% Flat Discount + Free Bubble Wrap Packing');
  const [targetSegment, setTargetSegment] = useState<'selected' | 'hot' | 'new' | 'all'>(
    selectedLeadForCampaign ? 'selected' : 'hot'
  );
  
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    selectedLeadForCampaign ? selectedLeadForCampaign.id : (leads[0]?.id || '')
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessages, setGeneratedMessages] = useState<{
    leadId: string;
    customerName: string;
    content: string;
  }[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Target Leads Calculation
  const getTargetLeads = () => {
    if (targetSegment === 'selected') {
      const match = leads.find(l => l.id === selectedLeadId);
      return match ? [match] : [];
    }
    if (targetSegment === 'hot') {
      return leads.filter(l => l.leadScore >= 85);
    }
    if (targetSegment === 'new') {
      return leads.filter(l => l.status === 'New');
    }
    return leads;
  };

  const targetLeadsList = getTargetLeads();

  const handleGenerateCampaign = async () => {
    if (targetLeadsList.length === 0) return;

    setIsGenerating(true);
    setGeneratedMessages([]);

    try {
      const response = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads: targetLeadsList,
          channel,
          tone,
          promotionalOffer
        })
      });

      const data = await response.json();
      if (data.success && data.messages) {
        setGeneratedMessages(data.messages);
      }
    } catch (err) {
      console.error('Error generating marketing messages:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSendAndLog = (leadId: string, content: string) => {
    onLogCampaignSent(leadId, channel, content);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Intro */}
      <div className="bg-gradient-to-r from-[#0C1322] via-[#101A2F] to-[#0C1322] p-6 rounded-2xl border border-slate-800/80 shadow-xl shadow-black/40 ring-1 ring-white/5">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-blue-500/25 ring-1 ring-white/20">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">AI Follow-up & Marketing Automation</h1>
            <p className="text-xs text-slate-400 font-light">
              Generate personalized WhatsApp, SMS, and Email follow-up messages targeted specifically to each lead's search inquiry.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Campaign Settings Panel */}
        <div className="bg-[#0C1322] border border-slate-800/80 rounded-2xl p-5 space-y-5 shadow-xl h-fit ring-1 ring-white/5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <span>Campaign Parameters</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </h2>

          {/* Channel Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Marketing Channel</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('WhatsApp')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  channel === 'WhatsApp'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/20 font-semibold'
                    : 'bg-[#070D18] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <MessageSquare className="w-4 h-4 mb-1" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  channel === 'SMS'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/20 font-semibold'
                    : 'bg-[#070D18] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Phone className="w-4 h-4 mb-1" />
                <span>SMS</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('Email')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  channel === 'Email'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/20 font-semibold'
                    : 'bg-[#070D18] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Mail className="w-4 h-4 mb-1" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Target Audience Segment */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Target Audience Segment</label>
            <select
              value={targetSegment}
              onChange={(e) => setTargetSegment(e.target.value as any)}
              className="w-full bg-[#070D18] border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-blue-500 shadow-inner"
            >
              <option value="selected">Single Selected Lead</option>
              <option value="hot">Hot Intent Leads (Score ≥ 85)</option>
              <option value="new">New Uncontacted Inquiries</option>
              <option value="all">All Extracted Leads in CRM ({leads.length})</option>
            </select>

            {targetSegment === 'selected' && (
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full bg-[#070D18] border border-slate-800 text-blue-300 font-semibold text-xs rounded-xl p-2.5 mt-2 focus:border-blue-500 shadow-inner"
              >
                {leads.length === 0 && (
                  <option value="">No leads in AJSUM directory (fetch new leads first)</option>
                )}
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.customerName} - {l.serviceType} ({l.originCity})</option>
                ))}
              </select>
            )}
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Message Tone & Hook</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full bg-[#070D18] border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-blue-500 shadow-inner"
            >
              <option value="Professional">Professional & Trustworthy</option>
              <option value="Urgent Offer">Limited Time Discount Hook</option>
              <option value="Friendly Value">Friendly Relocation Assistant</option>
            </select>
          </div>

          {/* Promotional Offer */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Special Promotional Offer</label>
            <input
              type="text"
              value={promotionalOffer}
              onChange={(e) => setPromotionalOffer(e.target.value)}
              placeholder="e.g., 10% Discount + Free Bubble Wrap"
              className="w-full bg-[#070D18] border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 text-xs text-white shadow-inner"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerateCampaign}
            disabled={isGenerating || targetLeadsList.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Personalized Copy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Campaign Copy ({targetLeadsList.length} Leads)</span>
              </>
            )}
          </button>

        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
              <span>Generated Marketing Copy</span>
              <span className="text-xs font-semibold text-slate-300 bg-[#0C1322] border border-slate-800 px-3 py-1 rounded-full font-mono shadow-sm">
                {generatedMessages.length} Messages Ready
              </span>
            </h2>
          </div>

          {generatedMessages.length === 0 ? (
            <div className="bg-[#0C1322] border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 ring-1 ring-white/5">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">No marketing messages generated yet.</p>
              <p className="text-xs mt-1 text-slate-400 font-light">Configure parameters on the left and click "Generate Campaign Copy".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {generatedMessages.map((msg, idx) => {
                const leadData = leads.find(l => l.id === msg.leadId);
                return (
                  <div key={idx} className="bg-[#0C1322] border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-lg hover:border-blue-500/30 transition-all ring-1 ring-white/5">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <div>
                        <span className="font-semibold text-white text-sm">{msg.customerName}</span>
                        {leadData && (
                          <span className="text-xs text-blue-300 ml-2 font-medium">
                            • {leadData.serviceType} ({leadData.originCity} → {leadData.destinationCity})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono font-semibold bg-[#070D18] text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                        {channel}
                      </span>
                    </div>

                    {/* Message Box */}
                    <div className="bg-[#070D18] p-3.5 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                      {msg.content}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                        Search: "{leadData?.fullSearchQuery || 'Inquiry'}"
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopy(msg.content, idx)}
                          className="flex items-center space-x-1.5 bg-[#070D18] hover:bg-slate-800 text-slate-200 font-medium px-3.5 py-1.5 rounded-xl border border-slate-800 transition-colors cursor-pointer shadow-sm"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSendAndLog(msg.leadId, msg.content)}
                          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-1.5 rounded-xl transition-colors shadow-md shadow-emerald-600/25 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Log Sent to CRM</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
