import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Filter,
  Search,
  Globe,
  Radio,
  ArrowUpRight
} from 'lucide-react';

export const ScanTelemetryView: React.FC = () => {
  const { scanLogs, products, quickSelectSample } = useVerification();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate quantitative metrics
  const totalScans = scanLogs.length;
  const authenticScans = scanLogs.filter(s => s.status === 'AUTHENTIC').length;
  const duplicateScans = scanLogs.filter(s => s.status === 'SUSPICIOUS_DUPLICATE').length;
  const recalledScans = scanLogs.filter(s => s.status === 'RECALLED').length;
  const authenticRate = totalScans > 0 ? ((authenticScans / totalScans) * 100).toFixed(1) : '100.0';

  // Filter logs
  const filteredLogs = scanLogs.filter(log => {
    const matchesFilter = filterStatus === 'ALL' || log.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      log.serialNumber.toLowerCase().includes(query) ||
      log.productName.toLowerCase().includes(query) ||
      log.location.toLowerCase().includes(query) ||
      log.brand.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
            <Radio className="w-4 h-4" />
            <span>Global Scan & Fraud Intelligence Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Security Scan Telemetry & Threat Surveillance
          </h1>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Monitor real-time verification scans, detect impossible geo-velocity travel anomalies, and safeguard
            brand supply chains from unauthorized barcode replication.
          </p>
        </div>
      </div>

      {/* Quantitative Metric Strip with Tabular Numerals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
          <div className="text-xs text-slate-400">Total Scans Audited</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{totalScans}</div>
          <div className="text-[11px] text-slate-500">Across consumer & inspector nodes</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
          <div className="text-xs text-slate-400">Authentic Pass Rate</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{authenticRate}%</div>
          <div className="text-[11px] text-slate-500">{authenticScans} certified genuine items</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
          <div className="text-xs text-slate-400">Cloned Serial Alerts</div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">{duplicateScans}</div>
          <div className="text-[11px] text-slate-500">Velocity geo-anomalies flagged</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
          <div className="text-xs text-slate-400">Active Ledger SKUs</div>
          <div className="text-2xl font-bold text-sky-400 font-mono tabular-nums">{products.length}</div>
          <div className="text-[11px] text-slate-500">Cryptographically anchored</div>
        </div>
      </div>

      {/* Real-time Threat Spotlight */}
      {duplicateScans > 0 && (
        <div className="p-4 bg-amber-950/30 border border-amber-900/50 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs space-y-1">
            <div className="font-semibold text-amber-300">
              Active Counterfeit Interception: Serial CLONE-ALERT-8831
            </div>
            <p className="text-slate-300 leading-relaxed">
              Automated tripwire triggered: this unique audio headphone identifier was queried simultaneously
              from IP nodes in São Paulo and London within a 90-minute window, violating physical transport
              invariants. Batch investigation ticket CF-2026-8910 opened.
            </p>
          </div>
          <button
            onClick={() => quickSelectSample('CLONE-ALERT-8831')}
            className="px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg whitespace-nowrap shrink-0 transition-colors"
          >
            Inspect Serial
          </button>
        </div>
      )}

      {/* Telemetry Filter & Table Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search serial, product, or location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterStatus('AUTHENTIC')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'AUTHENTIC'
                  ? 'bg-emerald-950 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Authentic
            </button>
            <button
              onClick={() => setFilterStatus('SUSPICIOUS_DUPLICATE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'SUSPICIOUS_DUPLICATE'
                  ? 'bg-amber-950 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Duplicate Anomaly
            </button>
            <button
              onClick={() => setFilterStatus('RECALLED')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'RECALLED'
                  ? 'bg-rose-950 text-rose-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Recalled
            </button>
          </div>
        </div>

        {/* High-density Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp (UTC)</th>
                <th className="py-3 px-4 font-semibold">Serial Number</th>
                <th className="py-3 px-4 font-semibold">Product Dossier</th>
                <th className="py-3 px-4 font-semibold">Location / Node</th>
                <th className="py-3 px-4 font-semibold">Scanner Client</th>
                <th className="py-3 px-4 font-semibold text-right">Authenticity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 tabular-nums whitespace-nowrap">
                      {log.timestamp.replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-sky-400 whitespace-nowrap">
                      <button
                        onClick={() => quickSelectSample(log.serialNumber)}
                        className="hover:underline flex items-center gap-1 text-sky-400"
                      >
                        <span>{log.serialNumber}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-60" />
                      </button>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-200">
                      <div className="font-medium truncate max-w-xs">{log.productName}</div>
                      <div className="text-[11px] text-slate-500">{log.brand}</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{log.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-400 whitespace-nowrap">
                      {log.deviceType}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap font-sans">
                      {log.status === 'AUTHENTIC' ? (
                        <span className="text-emerald-400 font-medium">Genuine Verified</span>
                      ) : log.status === 'SUSPICIOUS_DUPLICATE' ? (
                        <span className="text-amber-400 font-medium">Cloned Duplicate</span>
                      ) : log.status === 'RECALLED' ? (
                        <span className="text-rose-400 font-medium">Safety Recall</span>
                      ) : (
                        <span className="text-red-400 font-medium">Counterfeit Suspect</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                    No scan logs matching the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
