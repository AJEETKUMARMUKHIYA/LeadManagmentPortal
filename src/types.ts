export type ServiceType = 
  | 'Local Shifting' 
  | 'Inter-city Moving' 
  | 'Office Relocation' 
  | 'Vehicle Transport' 
  | 'Warehouse Storage';

export type PropertyType = 
  | '1BHK' 
  | '2BHK' 
  | '3BHK+' 
  | 'Villa' 
  | 'Commercial Office' 
  | 'Single Items / Bike';

export type LeadStatus = 
  | 'New' 
  | 'Contacted' 
  | 'In Progress' 
  | 'Quote Sent' 
  | 'Won / Booked' 
  | 'Lost';

export type UrgencyLevel = 'High' | 'Medium' | 'Low';

export interface FollowUpNote {
  id: string;
  date: string;
  note: string;
  createdBy: string;
}

export interface CampaignMessage {
  id: string;
  date: string;
  channel: 'SMS' | 'WhatsApp' | 'Email';
  content: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
}

export interface Lead {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  originCity: string;
  destinationCity: string;
  serviceType: ServiceType;
  propertyType: PropertyType;
  moveDate: string;
  estimatedBudget: number;
  status: LeadStatus;
  urgency: UrgencyLevel;
  leadScore: number; // 0-100
  source: string; // e.g. "Google Search Inquiry", "Chrome Extension Auto-Extract", "Web Inquiry Form"
  searchKeywords: string[];
  fullSearchQuery: string;
  extractedNotes: string;
  createdDate: string;
  webSources?: Array<{ title: string; uri: string }>;
  followUps: FollowUpNote[];
  campaigns: CampaignMessage[];
}

export interface ExtractionRequest {
  searchQuery?: string;
  rawText?: string;
  source?: string;
}

export interface ExtractionResponse {
  success: boolean;
  leads: Partial<Lead>[];
  aiSummary: string;
  error?: string;
}

export interface CampaignGenerateRequest {
  leadIds: string[];
  channel: 'SMS' | 'WhatsApp' | 'Email';
  tone: 'Professional' | 'Urgent Offer' | 'Friendly Value';
  promotionalOffer?: string;
}

export interface CampaignGenerateResponse {
  success: boolean;
  messages: {
    leadId: string;
    customerName: string;
    content: string;
  }[];
  error?: string;
}

export interface QuoteEstimateRequest {
  originCity: string;
  destinationCity: string;
  serviceType: ServiceType;
  propertyType: PropertyType;
  hasElevatorOrigin?: boolean;
  hasElevatorDestination?: boolean;
  packingQuality?: 'Standard' | 'Premium / Multi-layer';
}

export interface QuoteEstimateResponse {
  success: boolean;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  breakdown: {
    packingCharges: number;
    loadingUnloading: number;
    transportationCost: number;
    insuranceAndTaxes: number;
  };
  recommendations: string[];
}
