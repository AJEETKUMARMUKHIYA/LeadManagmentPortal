import React from 'react';
import { Lead } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Search, Flame, TrendingUp, MapPin, Tag, Layers, DollarSign, Award } from 'lucide-react';

interface AnalyticsDashboardProps {
  leads: Lead[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ leads }) => {
  // Aggregate Metrics
  const totalLeads = leads.length;
  const highIntentLeads = leads.filter(l => l.leadScore >= 85).length;
  const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.estimatedBudget || 0), 0);
  const avgLeadScore = totalLeads > 0 ? Math.round(leads.reduce((acc, c) => acc + c.leadScore, 0) / totalLeads) : 0;

  // Service Type Distribution
  const serviceCounts: { [key: string]: number } = {};
  leads.forEach(l => {
    serviceCounts[l.serviceType] = (serviceCounts[l.serviceType] || 0) + 1;
  });

  const serviceData = Object.keys(serviceCounts).map(service => ({
    name: service,
    count: serviceCounts[service]
  }));

  const COLORS = ['#2563eb', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  // Status Pipeline Distribution
  const statusCounts: { [key: string]: number } = {
    'New': 0, 'Contacted': 0, 'In Progress': 0, 'Quote Sent': 0, 'Won / Booked': 0, 'Lost': 0
  };
  leads.forEach(l => {
    if (statusCounts[l.status] !== undefined) {
      statusCounts[l.status]++;
    }
  });

  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    count: statusCounts[status]
  }));

  // Extracted Keywords Frequency Analysis
  const keywordMap: { [key: string]: number } = {};
  leads.forEach(l => {
    (l.searchKeywords || []).forEach(kw => {
      const clean = (kw || '').toLowerCase().trim();
      if (clean) {
        keywordMap[clean] = (keywordMap[clean] || 0) + 1;
      }
    });
  });

  const sortedKeywords = Object.entries(keywordMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="space-y-6">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#141414] border border-white/5 p-4 rounded-2xl shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Total Extracted Leads</span>
            <span className="text-2xl font-bold text-white font-mono">{totalLeads}</span>
            <span className="text-[11px] text-blue-400 block mt-0.5">Google Chrome Inquiries</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/5 p-4 rounded-2xl shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Hot Intent Leads</span>
            <span className="text-2xl font-bold text-white font-mono">{highIntentLeads}</span>
            <span className="text-[11px] text-rose-400 block mt-0.5">Score ≥ 85/100</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/5 p-4 rounded-2xl shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Pipeline Revenue Value</span>
            <span className="text-2xl font-bold text-white font-mono">₹{totalPipelineValue.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-400 block mt-0.5">Est. Quote Value</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/5 p-4 rounded-2xl shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Avg Lead Quality Score</span>
            <span className="text-2xl font-bold text-white font-mono">{avgLeadScore} / 100</span>
            <span className="text-[11px] text-purple-400 block mt-0.5">High Conversion Fit</span>
          </div>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Service Demand Breakdown */}
        <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Service Demand Breakdown</span>
            </h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  label={({ name, count }) => `${name} (${count})`}
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Status Pipeline */}
        <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Lead Conversion Pipeline</span>
            </h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Extracted Google Search Keywords */}
      <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center space-x-2">
            <Tag className="w-4 h-4 text-blue-400" />
            <span>Top Searched Mover & Packer Keywords Extracted from Google Chrome</span>
          </h2>
          <span className="text-[10px] text-slate-500">High Frequency Terms</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {sortedKeywords.map(([keyword, count], idx) => (
            <div key={idx} className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-400 block capitalize">{keyword}</span>
                <span className="text-[10px] text-slate-500">Search Keyword</span>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                {count}x
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
