import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { CertificateOfAuthenticity } from './CertificateOfAuthenticity';
import {
  Search,
  ScanLine,
  KeyRound,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  AlertOctagon,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface VerifySectionProps {
  onOpenScanner: () => void;
  onOpenReportModal: () => void;
}

export const VerifySection: React.FC<VerifySectionProps> = ({
  onOpenScanner,
  onOpenReportModal,
}) => {
  const { verifyProduct, lastVerifiedResult, clearLastResult, products } = useVerification();
  const [serialInput, setSerialInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!serialInput.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      verifyProduct(serialInput.trim(), pinInput.trim() || undefined);
      setIsVerifying(false);
    }, 450);
  };

  const handleSelectSample = (serial: string, pin?: string) => {
    setSerialInput(serial);
    if (pin) {
      setPinInput(pin);
      setShowPinInput(true);
    } else {
      setPinInput('');
      setShowPinInput(false);
    }
    setIsVerifying(true);
    setTimeout(() => {
      verifyProduct(serial, pin);
      setIsVerifying(false);
    }, 300);
  };

  return (
    <div className="space-y-10">
      {/* Search & Verification Input Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl space-y-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Universal Product Authenticity Verification
          </h1>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Verify serial numbers, GS1 2D DataMatrix barcodes, NFC cryptographic tokens, and tamper scratch PINs
            against the decentralized brand master ledger.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Serial / Barcode Input */}
            <div className="md:col-span-7 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter Serial Number, Barcode, or GTIN (e.g. A9H87K34Z)"
                value={serialInput}
                onChange={e => setSerialInput(e.target.value.toUpperCase())}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-sky-500 rounded-xl text-white font-mono text-sm placeholder:font-sans placeholder:text-slate-500 focus:outline-none shadow-inner"
              />
            </div>

            {/* Scratch PIN Input if toggled */}
            {showPinInput ? (
              <div className="md:col-span-3 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Scratch PIN"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-sky-500 rounded-xl text-white font-mono text-sm placeholder:font-sans placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            ) : (
              <div className="md:col-span-2 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPinInput(true)}
                  className="w-full py-3 px-3 text-xs font-medium text-slate-400 hover:text-sky-400 border border-dashed border-slate-700 hover:border-sky-500/50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>+ Scratch PIN</span>
                </button>
              </div>
            )}

            {/* Primary Action Button */}
            <div className={showPinInput ? 'md:col-span-2' : 'md:col-span-3'}>
              <button
                type="submit"
                disabled={isVerifying || !serialInput.trim()}
                className="w-full py-3 px-4 text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Scanner & Sample Triggers */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Quick Test Samples:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectSample('A9H87K34Z', '8492')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-800 transition-colors"
                >
                  Swiss Watch
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('A1B2C3D4E5', '4109')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-800 transition-colors"
                >
                  Pharma Pack
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('AUR-IT-03829-1978', '6231')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-800 transition-colors"
                >
                  Luxury Handbag
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('WS230914G0087A', '9924')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-800 transition-colors"
                >
                  Flagship Phone
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('CLONE-ALERT-8831')}
                  className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 rounded-md border border-amber-800/60 transition-colors"
                >
                  Cloned Alert
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('RECALL-NB-9042')}
                  className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-md border border-rose-800/60 transition-colors"
                >
                  Recall Item
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenScanner}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1.5 font-medium transition-colors"
            >
              <ScanLine className="w-4 h-4" />
              <span>Launch Camera Scanner</span>
            </button>
          </div>
        </form>
      </div>

      {/* Verification Output Section */}
      {lastVerifiedResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verification Record</span>
            <button
              onClick={clearLastResult}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Clear Result
            </button>
          </div>

          {lastVerifiedResult.product ? (
            <CertificateOfAuthenticity
              product={lastVerifiedResult.product}
              status={lastVerifiedResult.status}
              message={lastVerifiedResult.message}
              onReportCounterfeit={onOpenReportModal}
            />
          ) : (
            /* Unregistered / Not Found State */
            <div className="bg-red-950/20 border border-red-900/60 rounded-2xl p-8 text-center space-y-4 shadow-xl">
              <AlertOctagon className="w-12 h-12 text-red-400 mx-auto" />
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-bold text-white">Unregistered Serial Number</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {lastVerifiedResult.message}
                </p>
                <p className="text-xs text-slate-400">
                  This unit has no corresponding cryptographic entry in the brand database. It could be an illegal reproduction, unauthorized grey market import, or invalid code.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onOpenReportModal}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                >
                  File Counterfeit Incident Report
                </button>
                <button
                  onClick={clearLastResult}
                  className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Try Another Code
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Anti-Counterfeit Safeguards Guide */}
      {!lastVerifiedResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Anti-Counterfeiting Security Protocols</h3>
            <span className="text-xs text-slate-400">GS1 & ISO 12931 Standards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Zero-Collision Serialization</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every unit receives an immutable, randomized SHA-256 identifier paired with high-entropy scratch-off PIN codes.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-sky-400" />
                <span>Velocity Fraud Detection</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Duplicate scans of the same serial across impossible geographic distances trigger automated clone alerts.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400" />
                <span>Tamper-Evident Substrates</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-layer optical holograms, microtext below 0.2mm, and void security adhesives reveal physical alteration.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
