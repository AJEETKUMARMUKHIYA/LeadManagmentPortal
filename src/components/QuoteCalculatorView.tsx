import React, { useState } from 'react';
import { Calculator, Truck, ShieldCheck, Sparkles, Check, ArrowRight, DollarSign, Plus } from 'lucide-react';
import { Lead, PropertyType, ServiceType } from '../types';

interface QuoteCalculatorViewProps {
  onSaveQuoteAsLead: (lead: Lead) => void;
}

export const QuoteCalculatorView: React.FC<QuoteCalculatorViewProps> = ({ onSaveQuoteAsLead }) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [originCity, setOriginCity] = useState('Bangalore, Indiranagar');
  const [destinationCity, setDestinationCity] = useState('Bangalore, HSR Layout');
  const [serviceType, setServiceType] = useState<ServiceType>('Local Shifting');
  const [propertyType, setPropertyType] = useState<PropertyType>('2BHK');
  const [packingQuality, setPackingQuality] = useState<'Standard' | 'Premium / Multi-layer'>('Premium / Multi-layer');
  const [moveDate, setMoveDate] = useState(() => {
    const future = new Date(Date.now() + 7 * 86400000);
    return future.toISOString().split('T')[0];
  });

  const [calculation, setCalculation] = useState<{
    min: number;
    max: number;
    breakdown: {
      packingCharges: number;
      loadingUnloading: number;
      transportationCost: number;
      insuranceAndTaxes: number;
    };
  } | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      const response = await fetch('/api/calculate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType,
          serviceType,
          packingQuality
        })
      });

      const data = await response.json();
      if (data.success) {
        setCalculation({
          min: data.estimatedPriceMin,
          max: data.estimatedPriceMax,
          breakdown: data.breakdown
        });
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveAsLead = () => {
    if (!calculation) return;

    const newLead: Lead = {
      id: `quote-${Date.now()}`,
      customerName: customerName.trim() || 'Calculated Quote Customer',
      phone: phone.trim() || '+91 98765 00000',
      email: 'customer.quote@gmail.com',
      originCity,
      destinationCity,
      serviceType,
      propertyType,
      moveDate,
      estimatedBudget: calculation.min,
      status: 'Quote Sent',
      urgency: 'Medium',
      leadScore: 88,
      source: 'Quote Calculator Engine',
      searchKeywords: [serviceType.toLowerCase(), propertyType.toLowerCase(), 'instant quote'],
      fullSearchQuery: `Calculated instant quote for ${serviceType} (${propertyType}) from ${originCity} to ${destinationCity}`,
      extractedNotes: `Generated instant quote estimate ₹${calculation.min.toLocaleString()} - ₹${calculation.max.toLocaleString()} with ${packingQuality} packing.`,
      createdDate: new Date().toISOString().split('T')[0],
      followUps: [
        {
          id: `f-${Date.now()}`,
          date: new Date().toLocaleString(),
          note: `Quote generated via instant pricing calculator. Sent estimate range ₹${calculation.min.toLocaleString()} - ₹${calculation.max.toLocaleString()}.`,
          createdBy: 'Quote Engine'
        }
      ],
      campaigns: []
    };

    onSaveQuoteAsLead(newLead);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl shadow-md flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Mover & Packer Instant Quote Calculator</h1>
          <p className="text-xs text-slate-400 font-light">
            Generate precise cost estimates based on property size, service type, distance, and multi-layer packing specifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Form Inputs */}
        <form onSubmit={handleCalculate} className="bg-[#141414] border border-white/5 p-5 rounded-2xl space-y-4 shadow-lg">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">
            Move Specifications
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Gupta"
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 12345"
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Origin City / Area</label>
              <input
                type="text"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Destination City / Area</label>
              <input
                type="text"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as any)}
                className="w-full bg-[#0A0A0A] border border-white/10 text-slate-200 text-xs rounded-xl p-2.5 focus:border-blue-500"
              >
                <option value="Local Shifting">Local Shifting</option>
                <option value="Inter-city Moving">Inter-city Moving</option>
                <option value="Office Relocation">Office Relocation</option>
                <option value="Vehicle Transport">Vehicle Transport</option>
                <option value="Warehouse Storage">Warehouse Storage</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Property Size</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full bg-[#0A0A0A] border border-white/10 text-slate-200 text-xs rounded-xl p-2.5 focus:border-blue-500"
              >
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK+">3BHK+</option>
                <option value="Villa">Villa</option>
                <option value="Commercial Office">Commercial Office</option>
                <option value="Single Items / Bike">Single Items / Bike</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Packing Material Quality</label>
            <select
              value={packingQuality}
              onChange={(e) => setPackingQuality(e.target.value as any)}
              className="w-full bg-[#0A0A0A] border border-white/10 text-slate-200 text-xs rounded-xl p-2.5 focus:border-blue-500"
            >
              <option value="Standard">Standard Multi-layer Packaging</option>
              <option value="Premium / Multi-layer">Premium Bubble Wrap + Wooden Crating</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isCalculating}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
          >
            <Calculator className="w-4 h-4" />
            <span>Calculate Instant Estimate</span>
          </button>
        </form>

        {/* Calculation Result */}
        <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">
              Generated Quote Estimate
            </h2>

            {!calculation ? (
              <div className="py-16 text-center text-slate-500">
                <Truck className="w-10 h-10 mx-auto text-slate-700 mb-2" />
                <p className="text-xs font-light">Fill move specifications and click calculate to view quote breakdown.</p>
              </div>
            ) : (
              <div className="space-y-4 pt-3">
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-blue-500/30 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Estimated Cost Range</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono">
                    ₹{calculation.min.toLocaleString()} - ₹{calculation.max.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1 font-light">Includes Labour, Truck Freight, Packing & GST</span>
                </div>

                <div className="space-y-2 text-xs bg-[#0A0A0A] p-3 rounded-xl border border-white/5 font-mono">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block font-sans tracking-widest">Cost Breakdown</span>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400 font-sans">Packing Material & Labour:</span>
                    <span className="font-semibold text-slate-200">₹{calculation.breakdown.packingCharges.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400 font-sans">Loading & Unloading Crew:</span>
                    <span className="font-semibold text-slate-200">₹{calculation.breakdown.loadingUnloading.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400 font-sans">Transportation / Freight:</span>
                    <span className="font-semibold text-slate-200">₹{calculation.breakdown.transportationCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-sans">Transit Insurance & GST (18%):</span>
                    <span className="font-semibold text-slate-200">₹{calculation.breakdown.insuranceAndTaxes.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleSaveAsLead}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save as Quote Lead in CRM List</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
