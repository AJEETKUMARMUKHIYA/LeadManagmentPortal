import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Puzzle, 
  Webhook, 
  MapPin, 
  Download, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  Search, 
  Terminal, 
  ExternalLink, 
  Code, 
  Building2, 
  ShieldCheck,
  Smartphone,
  Info
} from 'lucide-react';
import { Lead } from '../types';

interface IntegrationsHubProps {
  onAddLeads: (newLeads: Lead[]) => void;
  onShowNotification: (msg: string) => void;
}

export const IntegrationsHubView: React.FC<IntegrationsHubProps> = ({
  onAddLeads,
  onShowNotification
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'places' | 'extension' | 'webhooks'>('places');

  // Live City Search State
  const [selectedCity, setSelectedCity] = useState<string>('Bangalore');
  const [customCityInput, setCustomCityInput] = useState<string>('');
  const [queryCategory, setQueryCategory] = useState<string>('Movers & Packers Listings');
  const [isFetchingCity, setIsFetchingCity] = useState<boolean>(false);
  const [cityResultSummary, setCityResultSummary] = useState<string>('');

  // Chrome Extension State
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [simulatedUrl, setSimulatedUrl] = useState<string>('https://www.google.com/search?q=best+2bhk+packers+and+movers+in+Indiranagar+Bangalore+phone+number');
  const [simulatedText, setSimulatedText] = useState<string>('Selected page text: "Looking for Packers Movers for 2BHK shifting from Indiranagar to HSR Saturday morning. Quote required with GST bill."');
  const [isExtSyncing, setIsExtSyncing] = useState<boolean>(false);

  // Webhook State
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const [isSendingWebhook, setIsSendingWebhook] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [testPayload, setTestPayload] = useState({
    customerName: 'Siddharth Varma',
    phone: '+91 98450 11223',
    email: 'siddharth.varma@techcorp.in',
    city: 'Bangalore',
    originCity: 'Bangalore, Koramangala',
    destinationCity: 'Hyderabad, Hitech City',
    serviceType: 'Inter-city Moving',
    propertyType: '3BHK+',
    budget: 38000,
    source: 'Website Live Inquiry Form',
    notes: 'Urgent relocation required for IT transfer next weekend. Elevator available at origin.'
  });

  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const webhookEndpoint = `${appOrigin}/api/webhooks/inquire`;
  const extensionEndpoint = `${appOrigin}/api/webhooks/chrome-extension`;

  // Fetch recent logs
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/webhooks/logs');
      const data = await res.json();
      if (data.success) {
        setWebhookLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 1. Handle Live City Extraction
  const handleFetchCityLeads = async () => {
    const cityToUse = customCityInput.trim() || selectedCity;
    if (!cityToUse) return;

    setIsFetchingCity(true);
    setCityResultSummary('');

    try {
      const res = await fetch('/api/fetch-live-city-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: cityToUse,
          queryCategory
        })
      });

      const data = await res.json();
      if (data.success && data.leads?.length) {
        onAddLeads(data.leads);
        setCityResultSummary(data.summary || `Extracted ${data.leads.length} real location leads for ${cityToUse}.`);
        onShowNotification(`Extracted ${data.leads.length} live Google Places leads for ${cityToUse}!`);
      } else {
        onShowNotification('Failed to fetch city leads. Please try again.');
      }
    } catch (err) {
      console.error(err);
      onShowNotification('Error connecting to Google Places extractor API.');
    } finally {
      setIsFetchingCity(false);
    }
  };

  // 2. Handle Chrome Extension Simulation
  const handleSimulateExtensionCapture = async () => {
    if (!simulatedUrl && !simulatedText) return;

    setIsExtSyncing(true);

    try {
      const res = await fetch('/api/webhooks/chrome-extension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchQuery: simulatedUrl,
          selectedText: simulatedText,
          pageTitle: 'Google Search - Packers and Movers',
          pageUrl: simulatedUrl,
          capturedAt: new Date().toISOString()
        })
      });

      const data = await res.json();
      if (data.success && data.lead) {
        onAddLeads([data.lead]);
        onShowNotification(`Captured lead via Chrome Extension: "${data.lead.customerName}"!`);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
      onShowNotification('Failed to sync extension payload.');
    } finally {
      setIsExtSyncing(false);
    }
  };

  // 3. Handle Webhook Test Submission
  const handleSendWebhookTest = async () => {
    setIsSendingWebhook(true);

    try {
      const res = await fetch('/api/webhooks/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });

      const data = await res.json();
      if (data.success && data.lead) {
        onAddLeads([data.lead]);
        onShowNotification(`Inbound Webhook Received! New lead: "${data.lead.customerName}" added.`);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
      onShowNotification('Error posting test webhook.');
    } finally {
      setIsSendingWebhook(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    if (label === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedFile(label);
      setTimeout(() => setCopiedFile(null), 2000);
    }
    onShowNotification(`Copied ${label} to clipboard!`);
  };

  // Chrome extension file templates
  const manifestCode = `{
  "manifest_version": 3,
  "name": "Lead Warehouse - Mover Search Extractor",
  "version": "1.0.0",
  "description": "Extracts Google Chrome search queries & mover listings into Lead Warehouse CRM with 1-click.",
  "permissions": ["activeTab", "scripting", "storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "content_scripts": [
    {
      "matches": ["https://*.google.com/*", "https://*.google.co.in/*"],
      "js": ["content.js"]
    }
  ]
}`;

  const contentJsCode = `// Content script to detect search terms on Google Search
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  
  if (query && (query.toLowerCase().includes('packers') || query.toLowerCase().includes('movers') || query.toLowerCase().includes('shifting'))) {
    console.log('[Lead Warehouse Extractor] Detected mover search query:', query);
    
    // Inject floating badge
    const btn = document.createElement('button');
    btn.innerText = '⚡ Sync Search Lead to CRM';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:#2563eb;color:#fff;padding:10px 16px;border-radius:12px;font-weight:bold;border:none;cursor:pointer;box-shadow:0 10px 25px rgba(37,99,235,0.4);font-family:sans-serif;font-size:12px;';
    
    btn.onclick = async () => {
      btn.innerText = '⏳ Syncing...';
      try {
        const response = await fetch('${extensionEndpoint}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            searchQuery: query,
            pageTitle: document.title,
            pageUrl: window.location.href,
            capturedAt: new Date().toISOString()
          })
        });
        const result = await response.json();
        if (result.success) {
          btn.innerText = '✅ Synced to CRM Table!';
          btn.style.background = '#10b981';
        }
      } catch (e) {
        btn.innerText = '❌ Sync Failed';
      }
    };
    
    document.body.appendChild(btn);
  }
})();`;

  const popupJsCode = `document.getElementById('syncBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const status = document.getElementById('status');
  status.innerText = 'Capturing search data...';

  fetch('${extensionEndpoint}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      searchQuery: tab.title,
      pageUrl: tab.url,
      capturedAt: new Date().toISOString()
    })
  }).then(r => r.json()).then(data => {
    if (data.success) {
      status.innerText = '✅ Added Lead to CRM!';
    }
  }).catch(() => {
    status.innerText = 'Error connecting to CRM';
  });
});`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span>Production Real Data Integrations</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                Live Active Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Connect real Google Places city data, Chrome Browser Extensions, and live Inbound Webhooks directly into your CRM table.
            </p>
          </div>
        </div>

        {/* Integration Switcher */}
        <div className="flex items-center bg-[#0A0A0A] p-1 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('places')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeSubTab === 'places'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Places & City Extractor</span>
          </button>
          <button
            onClick={() => setActiveSubTab('extension')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeSubTab === 'extension'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>Google Chrome Extension</span>
          </button>
          <button
            onClick={() => setActiveSubTab('webhooks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeSubTab === 'webhooks'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Webhook className="w-3.5 h-3.5" />
            <span>Inbound Webhooks API</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: GOOGLE PLACES & CITY EXTRACTOR */}
      {activeSubTab === 'places' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Control Form */}
            <div className="md:col-span-1 bg-[#141414] border border-white/5 p-5 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Select Target City
                </h2>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Popular Indian Metro Cities
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setCustomCityInput('');
                  }}
                  className="w-full bg-[#0A0A0A] border border-white/10 text-slate-200 text-xs rounded-xl p-2.5 focus:border-blue-500"
                >
                  <option value="Bangalore">Bangalore (Indiranagar, Whitefield, HSR)</option>
                  <option value="Delhi NCR">Delhi NCR (Gurgaon, Noida, Dwarka)</option>
                  <option value="Mumbai">Mumbai (Andheri, Powai, Thane, Navi Mumbai)</option>
                  <option value="Hyderabad">Hyderabad (Gachibowli, Hitech City, Kondapur)</option>
                  <option value="Pune">Pune (Kharadi, Hinjewadi, Wakad, Baner)</option>
                  <option value="Chennai">Chennai (Velachery, OMR, Anna Nagar)</option>
                  <option value="Kolkata">Kolkata (Salt Lake, New Town, Park Street)</option>
                  <option value="Ahmedabad">Ahmedabad (SG Highway, Prahlad Nagar)</option>
                  <option value="Jaipur">Jaipur (Vaishali Nagar, Malviya Nagar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Or Type Custom City / Region
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chandigarh, Lucknow, Kochi..."
                  value={customCityInput}
                  onChange={(e) => setCustomCityInput(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Extraction Focus Category
                </label>
                <select
                  value={queryCategory}
                  onChange={(e) => setQueryCategory(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 text-slate-200 text-xs rounded-xl p-2.5 focus:border-blue-500"
                >
                  <option value="Movers & Packers Listings">Verified Movers & Packers Place Listings</option>
                  <option value="Recent Search Inquiries">Active Live Customer Move Queries</option>
                  <option value="Corporate Relocation Demands">Corporate & Commercial Office Relocations</option>
                  <option value="Vehicle Carrier Demands">Bike & Car Carrier Transport Inquiries</option>
                </select>
              </div>

              <button
                onClick={handleFetchCityLeads}
                disabled={isFetchingCity}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
              >
                {isFetchingCity ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Google Places for {customCityInput || selectedCity}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Live Leads for {customCityInput || selectedCity}</span>
                  </>
                )}
              </button>
            </div>

            {/* Information & Live Summary Box */}
            <div className="md:col-span-2 bg-[#141414] border border-white/5 p-5 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Live Google Places API & Geographic Grounding</span>
                  </h2>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
                    Real City Data
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs text-slate-300 font-light leading-relaxed">
                  <p>
                    Whenever a specific city is selected above, Lead Warehouse CRM connects with Google Places and geographic search indexes to extract active mover inquiries, local area rates, and verified location requests specific to that city.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">Local Neighborhoods</span>
                      <p className="text-slate-400 text-[11px]">
                        Captures sub-locality pickup origins (e.g., Whitefield, Indiranagar, Powai, Gurgaon CyberHub).
                      </p>
                    </div>
                    <div className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Instant Auto-Populate</span>
                      <p className="text-slate-400 text-[11px]">
                        Extracted city leads are immediately synced directly into your primary CRM lead table with full contact details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {cityResultSummary ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-300 text-xs flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Extraction Result for {customCityInput || selectedCity}:</span>
                    <p className="text-slate-300 mt-0.5">{cityResultSummary}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-xl text-slate-500 text-xs text-center italic">
                  Select a city and click "Extract Live Leads" to pull real geographical relocation data into your table.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 2: CHROME EXTENSION */}
      {activeSubTab === 'extension' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Download & Instructions */}
            <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                  <Puzzle className="w-4 h-4 text-blue-400" />
                  <span>Google Chrome Browser Extension Integration</span>
                </h2>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Manifest V3
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-300 font-light">
                <p>
                  Install the Lead Warehouse Chrome Extension in your Google Chrome browser to automatically capture search queries, selected page text, and mover listings with 1-click while browsing.
                </p>

                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5 space-y-2">
                  <h3 className="text-xs font-semibold text-white flex items-center space-x-1.5">
                    <span>How to Install in Google Chrome (3 Easy Steps)</span>
                  </h3>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px] font-mono">
                    <li>Copy the extension files below or save them into a folder named <code className="text-blue-400">lead-warehouse-extension</code>.</li>
                    <li>Open Chrome and navigate to <code className="text-blue-400">chrome://extensions/</code> in your address bar.</li>
                    <li>Enable <strong>"Developer mode"</strong> in top right, click <strong>"Load unpacked"</strong>, and select your folder!</li>
                  </ol>
                </div>

                {/* Code Tabs */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">manifest.json</span>
                    <button
                      onClick={() => copyToClipboard(manifestCode, 'manifest.json')}
                      className="text-[10px] bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-2.5 py-1 rounded-md border border-blue-500/30 flex items-center space-x-1"
                    >
                      {copiedFile === 'manifest.json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedFile === 'manifest.json' ? 'Copied' : 'Copy manifest.json'}</span>
                    </button>
                  </div>
                  <pre className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5 text-[10px] text-slate-300 font-mono overflow-x-auto max-h-36">
                    {manifestCode}
                  </pre>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-slate-400">content.js</span>
                    <button
                      onClick={() => copyToClipboard(contentJsCode, 'content.js')}
                      className="text-[10px] bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-2.5 py-1 rounded-md border border-blue-500/30 flex items-center space-x-1"
                    >
                      {copiedFile === 'content.js' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedFile === 'content.js' ? 'Copied' : 'Copy content.js'}</span>
                    </button>
                  </div>
                  <pre className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5 text-[10px] text-slate-300 font-mono overflow-x-auto max-h-36">
                    {contentJsCode}
                  </pre>
                </div>
              </div>
            </div>

            {/* Interactive Chrome Extension Simulator */}
            <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Live Chrome Extension Capture Simulator</span>
                  </h2>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live Testing
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <p className="text-xs text-slate-400 font-light">
                    Test how the Chrome extension captures live search queries or highlighted web text and posts directly into your CRM table in real time:
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Simulated Search Page URL / Query
                    </label>
                    <input
                      type="text"
                      value={simulatedUrl}
                      onChange={(e) => setSimulatedUrl(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2.5 text-xs text-blue-400 font-mono focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Highlighted Text or Captured Listing Snippet
                    </label>
                    <textarea
                      rows={3}
                      value={simulatedText}
                      onChange={(e) => setSimulatedText(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 font-mono"
                    />
                  </div>

                  <button
                    onClick={handleSimulateExtensionCapture}
                    disabled={isExtSyncing}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
                  >
                    {isExtSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Capturing & Syncing via Extension...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>Simulate Extension One-Click Capture</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5 space-y-1 text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Receiver Endpoint URL</span>
                <span className="text-blue-400 font-mono block text-[11px] truncate">{extensionEndpoint}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 3: INBOUND WEBHOOKS API */}
      {activeSubTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Endpoint Documentation */}
            <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                  <Webhook className="w-4 h-4 text-emerald-400" />
                  <span>Inbound Webhooks & Lead Form API</span>
                </h2>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/20">
                  HTTP POST
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-300 font-light">
                <p>
                  Connect your live website inquiry form, Google Lead Form Ads, or WhatsApp Business API via this webhook. Incoming leads land inside your table automatically.
                </p>

                {/* Endpoint URL Box */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                    Your Live Webhook Endpoint URL
                  </label>
                  <div className="flex items-center space-x-2 bg-[#0A0A0A] p-2.5 rounded-xl border border-white/10">
                    <input
                      type="text"
                      readOnly
                      value={webhookEndpoint}
                      className="w-full bg-transparent text-xs text-blue-400 font-mono outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(webhookEndpoint, 'url')}
                      className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 p-1.5 rounded-lg border border-blue-500/30 shrink-0"
                    >
                      {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sample cURL Snippet */}
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                    Sample cURL Request
                  </span>
                  <pre className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5 text-[10px] text-slate-300 font-mono overflow-x-auto">
{`curl -X POST "${webhookEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerName": "Rohan Mehta",
    "phone": "+91 98123 45678",
    "email": "rohan@example.com",
    "originCity": "Bangalore",
    "destinationCity": "Delhi",
    "serviceType": "Inter-city Moving",
    "propertyType": "2BHK",
    "source": "Website Lead Form"
  }'`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Interactive Webhook Tester Console */}
            <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Interactive Webhook Tester Console</span>
                </h2>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded-full border border-blue-500/20">
                  Live Post Test
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-medium mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={testPayload.customerName}
                      onChange={(e) => setTestPayload({ ...testPayload, customerName: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={testPayload.phone}
                      onChange={(e) => setTestPayload({ ...testPayload, phone: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-medium mb-1">Pickup City</label>
                    <input
                      type="text"
                      value={testPayload.originCity}
                      onChange={(e) => setTestPayload({ ...testPayload, originCity: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-medium mb-1">Drop Destination</label>
                    <input
                      type="text"
                      value={testPayload.destinationCity}
                      onChange={(e) => setTestPayload({ ...testPayload, destinationCity: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-medium mb-1">Inquiry / Requirements Notes</label>
                  <textarea
                    rows={2}
                    value={testPayload.notes}
                    onChange={(e) => setTestPayload({ ...testPayload, notes: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2 text-xs text-white"
                  />
                </div>

                <button
                  onClick={handleSendWebhookTest}
                  disabled={isSendingWebhook}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                  {isSendingWebhook ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Posting Live Webhook Test...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Live Webhook Test Payload</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Webhook Activity Logs Table */}
          <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span>Live Webhook Activity Logs</span>
              </h2>
              <button
                onClick={fetchLogs}
                className="text-[10px] text-blue-400 hover:underline flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh Logs</span>
              </button>
            </div>

            {webhookLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No webhook payloads received yet. Trigger a test payload above to see live HTTP logs!</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {webhookLogs.map((log) => (
                  <div key={log.id} className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{log.source}</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded font-mono">{log.status}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block">Lead ID: {log.leadId}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
