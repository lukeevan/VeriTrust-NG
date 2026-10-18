import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ScanLog, CounterfeitReport, ProductStatus, ProductCategory } from '../types/verification';
import { INITIAL_PRODUCTS, INITIAL_SCAN_LOGS, INITIAL_COUNTERFEIT_REPORTS } from '../data/seedProducts';
import confetti from 'canvas-confetti';

interface VerifyResult {
  success: boolean;
  product?: Product;
  status: ProductStatus | 'NOT_FOUND';
  message: string;
}

interface NewBatchInput {
  brand: string;
  name: string;
  category: ProductCategory;
  modelNumber: string;
  serialPrefix: string;
  count: number;
  facility: string;
  country: string;
  warrantyMonths: number;
  scratchPins: boolean;
  gtinBarcode?: string;
}

interface VerificationContextType {
  products: Product[];
  scanLogs: ScanLog[];
  counterfeitReports: CounterfeitReport[];
  activeTab: 'verify' | 'ai-audit' | 'telemetry' | 'registry' | 'reports';
  setActiveTab: (tab: 'verify' | 'ai-audit' | 'telemetry' | 'registry' | 'reports') => void;
  lastVerifiedResult: VerifyResult | null;
  verifyProduct: (codeOrSerial: string, pin?: string, location?: string) => VerifyResult;
  clearLastResult: () => void;
  registerWarranty: (productId: string, name: string, email: string) => boolean;
  reportCounterfeit: (reportData: Omit<CounterfeitReport, 'id' | 'incidentCode' | 'timestamp' | 'status'>) => CounterfeitReport;
  updateReportStatus: (reportId: string, status: CounterfeitReport['status']) => void;
  addNewBatch: (batchData: NewBatchInput) => Product[];
  updateProductStatus: (productId: string, status: ProductStatus, recallNotice?: string) => void;
  quickSelectSample: (serial: string) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('veritrust_products_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [scanLogs, setScanLogs] = useState<ScanLog[]>(() => {
    try {
      const saved = localStorage.getItem('veritrust_scan_logs_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading scan logs from localStorage', e);
    }
    return INITIAL_SCAN_LOGS;
  });

  const [counterfeitReports, setCounterfeitReports] = useState<CounterfeitReport[]>(() => {
    try {
      const saved = localStorage.getItem('veritrust_cf_reports_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading cf reports from localStorage', e);
    }
    return INITIAL_COUNTERFEIT_REPORTS;
  });

  const [activeTab, setActiveTab] = useState<'verify' | 'ai-audit' | 'telemetry' | 'registry' | 'reports'>('verify');
  const [lastVerifiedResult, setLastVerifiedResult] = useState<VerifyResult | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('veritrust_products_v1', JSON.stringify(products));
    } catch (e) {
      console.error('Failed saving products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('veritrust_scan_logs_v1', JSON.stringify(scanLogs));
    } catch (e) {
      console.error('Failed saving scan logs to localStorage', e);
    }
  }, [scanLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('veritrust_cf_reports_v1', JSON.stringify(counterfeitReports));
    } catch (e) {
      console.error('Failed saving reports to localStorage', e);
    }
  }, [counterfeitReports]);

  const verifyProduct = (codeOrSerial: string, pin?: string, location: string = 'Current Device Location'): VerifyResult => {
    const query = codeOrSerial.trim().toUpperCase();
    if (!query) {
      const result: VerifyResult = {
        success: false,
        status: 'NOT_FOUND',
        message: 'Please enter or scan a valid serial number, barcode, or tag ID.',
      };
      setLastVerifiedResult(result);
      return result;
    }

    // Match by exact serial number, GTIN barcode, or embedded payload
    const foundProduct = products.find(p => {
      const s = p.serialNumber.toUpperCase();
      const b = p.gtinBarcode.toUpperCase();
      const h = p.securitySealDetails.hologramId.toUpperCase();
      const nfc = p.securitySealDetails.nfcUid?.toUpperCase() || '';
      return (
        s === query ||
        b === query ||
        h === query ||
        nfc === query ||
        query.includes(s) ||
        (query.length >= 6 && s.includes(query))
      );
    });

    const nowIso = new Date().toISOString();
    const cleanLocation = location || 'Authorized Terminal';

    if (!foundProduct) {
      // Log unverified scan
      const unknownLog: ScanLog = {
        id: `scan-${Date.now()}`,
        timestamp: nowIso,
        serialNumber: query,
        productName: 'Unrecognized SKU / Identifier',
        brand: 'Unknown Origin',
        status: 'COUNTERFEIT',
        location: cleanLocation,
        ipCountry: 'LOCAL',
        deviceType: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser',
        flagReason: 'Identifier does not exist in master manufacturer cryptographic registry',
      };
      setScanLogs(prev => [unknownLog, ...prev]);

      const result: VerifyResult = {
        success: false,
        status: 'NOT_FOUND',
        message: `Serial / Barcode "${query}" is NOT recognized in the certified master database. Exercise high caution: potential imitation or unregistered goods.`,
      };
      setLastVerifiedResult(result);
      return result;
    }

    // Check PIN if provided and product has a scratch PIN
    if (foundProduct.scratchPin && pin) {
      if (foundProduct.scratchPin !== pin.trim()) {
        const pinMismatchLog: ScanLog = {
          id: `scan-${Date.now()}`,
          timestamp: nowIso,
          serialNumber: foundProduct.serialNumber,
          productName: foundProduct.name,
          brand: foundProduct.brand,
          status: 'COUNTERFEIT',
          location: cleanLocation,
          ipCountry: 'LOCAL',
          deviceType: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser',
          flagReason: `Invalid Scratch-Off Security PIN entered (${pin}) for serial ${foundProduct.serialNumber}`,
        };
        setScanLogs(prev => [pinMismatchLog, ...prev]);

        const result: VerifyResult = {
          success: false,
          product: foundProduct,
          status: 'COUNTERFEIT',
          message: `The security scratch PIN entered does not match the tamper-proof record for this serial number.`,
        };
        setLastVerifiedResult(result);
        return result;
      }
    }

    // Determine current status
    let currentStatus = foundProduct.status;
    let flagReason: string | undefined;

    // Check for excessive duplicate scans (cloned code detection)
    const newScanCount = (foundProduct.scanCount || 0) + 1;
    if (foundProduct.status === 'AUTHENTIC' && newScanCount > 4) {
      // If scanned repeatedly in short succession
      currentStatus = 'SUSPICIOUS_DUPLICATE';
      flagReason = `Multiple scan events (${newScanCount}) detected for single-unit serial. Possible label replication.`;
    }

    // Update product telemetry
    const updatedProduct: Product = {
      ...foundProduct,
      scanCount: newScanCount,
      lastScannedAt: nowIso,
      firstScannedAt: foundProduct.firstScannedAt || nowIso,
      lastScannedLocation: cleanLocation,
      status: currentStatus,
    };

    setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));

    // Append to scan logs
    const newLog: ScanLog = {
      id: `scan-${Date.now()}`,
      timestamp: nowIso,
      serialNumber: foundProduct.serialNumber,
      productName: foundProduct.name,
      brand: foundProduct.brand,
      status: currentStatus,
      location: cleanLocation,
      ipCountry: 'LOCAL',
      deviceType: navigator.userAgent.includes('Mobile') ? 'Mobile Scanner' : 'Web Terminal',
      flagReason,
    };
    setScanLogs(prev => [newLog, ...prev]);

    let message = 'Certificate of Authenticity Verified. This product is registered and genuine.';
    if (currentStatus === 'SUSPICIOUS_DUPLICATE') {
      message = 'High-frequency duplicate scans detected. Barcode may have been duplicated or photographed without permission.';
    } else if (currentStatus === 'RECALLED') {
      message = foundProduct.recallNotice || 'This item is subject to an active safety recall. Do not distribute or consume.';
    } else if (currentStatus === 'COUNTERFEIT' || currentStatus === 'REVOKED') {
      message = 'This serial number has been revoked or identified as counterfeit by manufacturer enforcement.';
    } else {
      // Trigger celebratory confetti on authentic match!
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#38bdf8', '#34d399', '#facc15'],
        });
      } catch (err) {
        // ignore in non-browser context
      }
    }

    const result: VerifyResult = {
      success: currentStatus === 'AUTHENTIC',
      product: updatedProduct,
      status: currentStatus,
      message,
    };

    setLastVerifiedResult(result);
    return result;
  };

  const clearLastResult = () => {
    setLastVerifiedResult(null);
  };

  const quickSelectSample = (serial: string) => {
    verifyProduct(serial);
    setActiveTab('verify');
  };

  const registerWarranty = (productId: string, name: string, email: string): boolean => {
    const product = products.find(p => p.id === productId);
    if (!product || product.status !== 'AUTHENTIC') return false;

    const updated: Product = {
      ...product,
      warrantyRegistered: true,
      warrantyRegisteredTo: {
        name,
        email,
        date: new Date().toISOString().split('T')[0],
      },
    };

    setProducts(prev => prev.map(p => (p.id === productId ? updated : p)));
    if (lastVerifiedResult?.product?.id === productId) {
      setLastVerifiedResult({
        ...lastVerifiedResult,
        product: updated,
      });
    }
    return true;
  };

  const reportCounterfeit = (reportData: Omit<CounterfeitReport, 'id' | 'incidentCode' | 'timestamp' | 'status'>): CounterfeitReport => {
    const newReport: CounterfeitReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      incidentCode: `CF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      status: 'OPEN_INVESTIGATION',
    };

    setCounterfeitReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const updateReportStatus = (reportId: string, status: CounterfeitReport['status']) => {
    setCounterfeitReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status } : r))
    );
  };

  const addNewBatch = (batchData: NewBatchInput): Product[] => {
    const newProducts: Product[] = [];
    const timestamp = Date.now();
    const batchCode = `LOT-${batchData.category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    for (let i = 1; i <= batchData.count; i++) {
      const serialNum = `${batchData.serialPrefix.toUpperCase()}-${String(i).padStart(4, '0')}`;
      const scratch = batchData.scratchPins ? String(Math.floor(1000 + Math.random() * 9000)) : undefined;
      const fakeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const prod: Product = {
        id: `prod-batch-${timestamp}-${i}`,
        name: batchData.name,
        brand: batchData.brand,
        category: batchData.category,
        modelNumber: batchData.modelNumber,
        serialNumber: serialNum,
        batchNumber: batchCode,
        scratchPin: scratch,
        cryptographicHash: fakeHash,
        manufactureDate: new Date().toISOString().split('T')[0],
        facilityLocation: batchData.facility,
        countryOfOrigin: batchData.country,
        authorizedRetailers: ['Official Global Authorized Distributor Network'],
        status: 'AUTHENTIC',
        scanCount: 0,
        warrantyMonths: batchData.warrantyMonths,
        warrantyRegistered: false,
        packagingFeatures: [
          {
            title: 'Tamper Holographic Security Ribbon',
            description: 'Micro-prism film displaying brand insignia under incandescent light.',
            verified: true,
          },
          {
            title: 'GS1 Registered Serial Hash',
            description: 'Indexed in GS1 cloud global registry with unique cryptographic digital signature.',
            verified: true,
          },
        ],
        imageUrl: '/src/assets/images/pharma_secure_package_1792344554331.jpg',
        gtinBarcode: batchData.gtinBarcode || `080${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        securitySealDetails: {
          hologramId: `HOL-${serialNum}`,
          microtextPattern: `${batchData.brand.toUpperCase()}·AUTHENTIC·GENUINE·CERTIFIED`,
          qrSignature: `${batchData.brand.toLowerCase()}:serial:${serialNum}:hash:${fakeHash.slice(0, 12)}`,
        },
      };

      newProducts.push(prod);
    }

    setProducts(prev => [...newProducts, ...prev]);
    return newProducts;
  };

  const updateProductStatus = (productId: string, status: ProductStatus, recallNotice?: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          status,
          recallNotice: recallNotice || p.recallNotice,
        };
      })
    );
  };

  return (
    <VerificationContext.Provider
      value={{
        products,
        scanLogs,
        counterfeitReports,
        activeTab,
        setActiveTab,
        lastVerifiedResult,
        verifyProduct,
        clearLastResult,
        registerWarranty,
        reportCounterfeit,
        updateReportStatus,
        addNewBatch,
        updateProductStatus,
        quickSelectSample,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};
