export type ProductStatus = 'AUTHENTIC' | 'SUSPICIOUS_DUPLICATE' | 'RECALLED' | 'COUNTERFEIT' | 'REVOKED';

export type ProductCategory = 
  | 'Luxury Goods'
  | 'Pharmaceuticals'
  | 'Consumer Electronics'
  | 'Cosmetics & Fragrance'
  | 'Automotive & Industrial'
  | 'Fine Spirits & Wine';

export interface PackagingFeature {
  title: string;
  description: string;
  verified: boolean;
}

export interface SecuritySealDetails {
  hologramId: string;
  microtextPattern: string;
  nfcUid?: string;
  qrSignature: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  modelNumber: string;
  serialNumber: string;
  batchNumber: string;
  scratchPin?: string;
  cryptographicHash: string;
  manufactureDate: string;
  expiryDate?: string;
  facilityLocation: string;
  countryOfOrigin: string;
  authorizedRetailers: string[];
  status: ProductStatus;
  scanCount: number;
  firstScannedAt?: string;
  lastScannedAt?: string;
  lastScannedLocation?: string;
  warrantyMonths: number;
  warrantyRegistered: boolean;
  warrantyRegisteredTo?: {
    name: string;
    email: string;
    date: string;
  };
  packagingFeatures: PackagingFeature[];
  imageUrl: string;
  gtinBarcode: string;
  recallNotice?: string;
  securitySealDetails: SecuritySealDetails;
}

export interface ScanLog {
  id: string;
  timestamp: string;
  serialNumber: string;
  productName: string;
  brand: string;
  status: ProductStatus;
  location: string;
  ipCountry: string;
  deviceType: string;
  flagReason?: string;
}

export interface CounterfeitReport {
  id: string;
  incidentCode: string;
  timestamp: string;
  productName: string;
  brand: string;
  serialNumber: string;
  storeName: string;
  storeLocation: string;
  description: string;
  reporterEmail: string;
  status: 'OPEN_INVESTIGATION' | 'CONFIRMED_FAKE' | 'RESOLVED';
  imageEvidenceUrl?: string;
}

export interface AiPackagingResult {
  authenticityAssessment: 'GENUINE_LIKELY' | 'SUSPICIOUS_ANOMALY' | 'COUNTERFEIT_DETECTED' | 'INCONCLUSIVE';
  confidenceScore: number;
  forensicSummary: string;
  detectedText: string[];
  observations: string[];
  redFlags: string[];
  tamperSealIntact: boolean;
  recommendations: string[];
}
