import React, { useState } from 'react';
import { Product, ProductStatus } from '../types/verification';
import { useVerification } from '../context/VerificationContext';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Copy,
  Printer,
  Calendar,
  MapPin,
  Building2,
  Check,
  ExternalLink,
  Sparkles,
  QrCode,
  Fingerprint
} from 'lucide-react';

interface CertificateProps {
  product: Product;
  status: ProductStatus | 'NOT_FOUND';
  message: string;
  onReportCounterfeit: () => void;
}

export const CertificateOfAuthenticity: React.FC<CertificateProps> = ({
  product,
  status,
  message,
  onReportCounterfeit,
}) => {
  const { registerWarranty } = useVerification();
  const [copiedHash, setCopiedHash] = useState(false);
  const [warrantyName, setWarrantyName] = useState('');
  const [warrantyEmail, setWarrantyEmail] = useState('');
  const [warrantySubmitted, setWarrantySubmitted] = useState(product.warrantyRegistered);

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleRegisterWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warrantyName || !warrantyEmail) return;
    registerWarranty(product.id, warrantyName, warrantyEmail);
    setWarrantySubmitted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const isAuthentic = status === 'AUTHENTIC';
  const isDuplicate = status === 'SUSPICIOUS_DUPLICATE';
  const isRecalled = status === 'RECALLED';
  const isCounterfeit = status === 'COUNTERFEIT' || status === 'REVOKED' || status === 'NOT_FOUND';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Status Header Banner */}
      <div
        className={`px-6 py-4 flex items-center justify-between border-b ${
          isAuthentic
            ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300'
            : isDuplicate
            ? 'bg-amber-950/40 border-amber-900/60 text-amber-300'
            : isRecalled
            ? 'bg-rose-950/40 border-rose-900/60 text-rose-300'
            : 'bg-red-950/50 border-red-900/60 text-red-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {isAuthentic && <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />}
          {isDuplicate && <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />}
          {isRecalled && <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />}
          {isCounterfeit && <XCircle className="w-6 h-6 text-red-400 shrink-0" />}

          <div>
            <div className="text-xs uppercase tracking-wider font-semibold">
              {isAuthentic
                ? 'Official Certificate of Authenticity'
                : isDuplicate
                ? 'Duplicate Scan Anomaly · Cloned Serial Warning'
                : isRecalled
                ? 'Active Manufacturer Product Recall'
                : 'Counterfeit Suspect · Unverified Product'}
            </div>
            <div className="text-sm font-medium text-slate-200 mt-0.5">{message}</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-8">
        {/* Main Product Showcase Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Product Image Frame */}
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-4/3 flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-slate-600 flex flex-col items-center">
                <QrCode className="w-12 h-12 mb-2" />
                <span className="text-xs">No media preview available</span>
              </div>
            )}

            {/* Subtle holographic watermark overlay */}
            <div className="absolute inset-0 pointer-events-none hologram-shimmer opacity-20" />

            {/* Serial badge pill-free tag */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Unique Unit Serial</span>
              <span className="font-mono font-semibold text-sky-400">{product.serialNumber}</span>
            </div>
          </div>

          {/* Product Dossier Details */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>Model {product.modelNumber}</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{product.name}</h2>
            </div>

            {/* Unboxed Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800 text-xs">
              <div>
                <div className="text-slate-400">Batch / Lot</div>
                <div className="font-mono font-medium text-slate-200 mt-0.5">{product.batchNumber}</div>
              </div>
              <div>
                <div className="text-slate-400">Manufacture Date</div>
                <div className="font-medium text-slate-200 mt-0.5">{product.manufactureDate}</div>
              </div>
              <div>
                <div className="text-slate-400">Country of Origin</div>
                <div className="font-medium text-slate-200 mt-0.5">{product.countryOfOrigin}</div>
              </div>
              <div>
                <div className="text-slate-400">Production Facility</div>
                <div className="font-medium text-slate-200 mt-0.5 truncate">{product.facilityLocation}</div>
              </div>
              <div>
                <div className="text-slate-400">Security Hologram ID</div>
                <div className="font-mono font-medium text-slate-200 mt-0.5">{product.securitySealDetails.hologramId}</div>
              </div>
              <div>
                <div className="text-slate-400">Scan Frequency</div>
                <div className="font-mono font-medium text-slate-200 mt-0.5 tabular-nums">
                  {product.scanCount} {product.scanCount === 1 ? 'scan (Fresh)' : 'scans'}
                </div>
              </div>
            </div>

            {/* Cryptographic Hash Verification Box */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Fingerprint className="w-3.5 h-3.5 text-sky-400" />
                  SHA-256 Tamper-Evident Cryptographic Hash
                </span>
                <button
                  onClick={() => copyHash(product.cryptographicHash)}
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-slate-300 break-all bg-slate-900/60 p-2 rounded border border-slate-800">
                {product.cryptographicHash}
              </div>
            </div>

            {/* Notice if not authentic */}
            {!isAuthentic && (
              <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl space-y-2">
                <div className="text-xs font-semibold text-red-400">Consumer Advisory</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If you purchased this item from an unaccredited vendor or believe you were sold a counterfeit,
                  please report it to safeguard other consumers.
                </p>
                <button
                  onClick={onReportCounterfeit}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                >
                  Report Counterfeit Incident
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Packaging Forensic Checkpoints */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-semibold text-white">Physical Packaging Security Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {product.packagingFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  {feat.verified ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{feat.title}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Authorized Distribution & Retail Verification */}
        {product.authorizedRetailers.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-white">Certified Retailer & Distribution Channel</h3>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              {product.authorizedRetailers.map((ret, i) => (
                <div key={i} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg">
                  {ret}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Warranty Registration for Authentic Goods */}
        {isAuthentic && product.warrantyMonths > 0 && (
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  Manufacturer {product.warrantyMonths}-Month Digital Warranty Protection
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Register your unit directly with the brand to bind serial ownership and prevent future cloning.
                </p>
              </div>
              <div className="text-xs font-medium text-slate-300 font-mono">
                {warrantySubmitted ? 'Status: Active' : 'Status: Unclaimed'}
              </div>
            </div>

            {warrantySubmitted ? (
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs text-slate-200">
                  Warranty successfully activated for{' '}
                  <span className="font-semibold text-white">
                    {product.warrantyRegisteredTo?.name || warrantyName || 'Verified Owner'}
                  </span>{' '}
                  ({product.warrantyRegisteredTo?.email || warrantyEmail}). Protected until{' '}
                  <span className="font-mono text-emerald-300">
                    {new Date(Date.now() + product.warrantyMonths * 30 * 24 * 3600 * 1000)
                      .toISOString()
                      .split('T')[0]}
                  </span>
                  .
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterWarranty} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name / Owner"
                  value={warrantyName}
                  onChange={e => setWarrantyName(e.target.value)}
                  required
                  className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                />
                <input
                  type="email"
                  placeholder="Owner Email Address"
                  value={warrantyEmail}
                  onChange={e => setWarrantyEmail(e.target.value)}
                  required
                  className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap"
                >
                  Activate Warranty
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
