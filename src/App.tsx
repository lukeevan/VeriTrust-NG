import React, { useState } from 'react';
import { VerificationProvider, useVerification } from './context/VerificationContext';
import { Header } from './components/Header';
import { VerifySection } from './components/VerifySection';
import { AiPackagingInspector } from './components/AiPackagingInspector';
import { ScanTelemetryView } from './components/ScanTelemetryView';
import { BrandRegistryView } from './components/BrandRegistryView';
import { CounterfeitReportsView } from './components/CounterfeitReportsView';
import { CameraScannerModal } from './components/CameraScannerModal';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, verifyProduct } = useVerification();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScanCodeSelected = (code: string, pin?: string) => {
    verifyProduct(code, pin);
    setActiveTab('verify');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1-Row 3-Zone Header */}
      <Header onOpenScanner={() => setIsScannerOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'verify' && (
          <VerifySection
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenReportModal={() => setActiveTab('reports')}
          />
        )}

        {activeTab === 'ai-audit' && <AiPackagingInspector />}

        {activeTab === 'telemetry' && <ScanTelemetryView />}

        {activeTab === 'registry' && <BrandRegistryView />}

        {activeTab === 'reports' && <CounterfeitReportsView />}
      </main>

      {/* Scanner Modal */}
      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectCode={handleScanCodeSelected}
      />

      {/* Clean Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">VeriTrust Anti-Counterfeit Platform</span>
            <span aria-hidden="true">·</span>
            <span>GS1 General Specifications & ISO 12931 Compliant</span>
          </div>
          <div className="flex items-center gap-6">
            <span>SHA-256 Ledger Provenance</span>
            <span>EU FMD Serial Verification</span>
            <span>Digital Warranty Attestation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <VerificationProvider>
      <MainAppContent />
    </VerificationProvider>
  );
}
