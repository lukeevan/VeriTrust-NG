import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { CounterfeitReport } from '../types/verification';
import {
  ShieldAlert,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Store,
  FileText,
  AlertTriangle,
  Building,
  Check
} from 'lucide-react';

export const CounterfeitReportsView: React.FC = () => {
  const { counterfeitReports, reportCounterfeit, updateReportStatus } = useVerification();
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [description, setDescription] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [submittedCase, setSubmittedCase] = useState<CounterfeitReport | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = reportCounterfeit({
      productName,
      brand,
      serialNumber,
      storeName,
      storeLocation,
      description,
      reporterEmail,
    });
    setSubmittedCase(created);
    setShowReportForm(false);
    // Reset form
    setProductName('');
    setBrand('');
    setSerialNumber('');
    setStoreName('');
    setStoreLocation('');
    setDescription('');
    setReporterEmail('');
  };

  const filteredReports = counterfeitReports.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      r.incidentCode.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.brand.toLowerCase().includes(q) ||
      r.storeName.toLowerCase().includes(q) ||
      r.storeLocation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Counterfeit Incident Docket</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Counterfeit Product Incident Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Report suspicious imitation goods, unauthorized marketplace vendors, or tampered packaging. Brand
            legal and quality teams triage incoming submissions.
          </p>
        </div>

        <button
          onClick={() => {
            setShowReportForm(true);
            setSubmittedCase(null);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors whitespace-nowrap shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report Counterfeit Item</span>
        </button>
      </div>

      {/* Confirmation of submission */}
      {submittedCase && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-300">
                Case Ticket Generated: {submittedCase.incidentCode}
              </div>
              <p className="text-xs text-slate-300">
                Your report has been logged and assigned to brand brand protection investigators. Thank you for
                safeguarding consumer safety.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubmittedCase(null)}
            className="text-xs text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Report Modal */}
      {showReportForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <span>Submit Counterfeit Incident Dossier</span>
              </h2>
              <button
                onClick={() => setShowReportForm(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vanguard or PharmaMed"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tourbillon Chronograph"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Serial Number or Code on Item (If visible)
                </label>
                <input
                  type="text"
                  placeholder="e.g. FAKE-VH-9900"
                  value={serialNumber}
                  onChange={e => setSerialNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Retailer / Store Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Market Stall #4 / Online URL"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Physical Location / Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. London, UK or Web Domain"
                    value={storeLocation}
                    onChange={e => setStoreLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Incident Description & Flaws Noticed *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe why you suspect counterfeit (e.g. packaging glue peeling, misspelled manufacturer, missing hologram, price significantly below retail)..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Your Contact Email *</label>
                <input
                  type="email"
                  required
                  placeholder="investigator@agency.org or buyer@gmail.com"
                  value={reporterEmail}
                  onChange={e => setReporterEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-sm"
                >
                  Submit Investigation Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reports Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by case code, brand, store..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            {filteredReports.length} {filteredReports.length === 1 ? 'case docket' : 'case dockets'} active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map(report => (
            <div
              key={report.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-400">
                    {report.incidentCode}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    {report.status === 'OPEN_INVESTIGATION' ? (
                      <span className="text-amber-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Under Investigation</span>
                      </span>
                    ) : report.status === 'CONFIRMED_FAKE' ? (
                      <span className="text-red-400 flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Confirmed Counterfeit</span>
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolved / Actioned</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">{report.brand}</div>
                  <h3 className="text-sm font-semibold text-white">{report.productName}</h3>
                </div>

                {report.serialNumber && (
                  <div className="text-xs font-mono text-slate-400">
                    Serial Claimed: <span className="text-slate-200">{report.serialNumber}</span>
                  </div>
                )}

                <div className="text-xs text-slate-300 flex items-center gap-2 pt-1 border-t border-slate-800/80">
                  <Store className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-medium text-slate-200">{report.storeName}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 truncate">{report.storeLocation}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                  "{report.description}"
                </p>
              </div>

              {/* Status Actions */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span className="tabular-nums font-mono">{report.timestamp.split('T')[0]}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateReportStatus(report.id, 'CONFIRMED_FAKE')}
                    className="px-2 py-1 text-[11px] font-medium bg-red-950 hover:bg-red-900 text-red-300 rounded transition-colors"
                  >
                    Confirm Fake
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, 'RESOLVED')}
                    className="px-2 py-1 text-[11px] font-medium bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
