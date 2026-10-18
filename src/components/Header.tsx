import React from 'react';
import { useVerification } from '../context/VerificationContext';
import { ShieldCheck, ScanLine } from 'lucide-react';

interface HeaderProps {
  onOpenScanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenScanner }) => {
  const { activeTab, setActiveTab } = useVerification();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => setActiveTab('verify')}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
        >
          <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0" />
          <span>VeriTrust</span>
        </button>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('verify')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'verify'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Verify Product
          </button>
          <button
            onClick={() => setActiveTab('ai-audit')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'ai-audit'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            AI Packaging Audit
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'telemetry'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Scan Telemetry
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'registry'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Brand Registry
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'reports'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Counterfeit Reports
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan Security Tag</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row for small screens */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-2 overflow-x-auto text-xs font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('verify')}
          className={`px-2.5 py-1.5 whitespace-nowrap ${activeTab === 'verify' ? 'text-sky-400 font-bold' : ''}`}
        >
          Verify
        </button>
        <button
          onClick={() => setActiveTab('ai-audit')}
          className={`px-2.5 py-1.5 whitespace-nowrap ${activeTab === 'ai-audit' ? 'text-sky-400 font-bold' : ''}`}
        >
          AI Audit
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`px-2.5 py-1.5 whitespace-nowrap ${activeTab === 'telemetry' ? 'text-sky-400 font-bold' : ''}`}
        >
          Telemetry
        </button>
        <button
          onClick={() => setActiveTab('registry')}
          className={`px-2.5 py-1.5 whitespace-nowrap ${activeTab === 'registry' ? 'text-sky-400 font-bold' : ''}`}
        >
          Registry
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-2.5 py-1.5 whitespace-nowrap ${activeTab === 'reports' ? 'text-sky-400 font-bold' : ''}`}
        >
          Reports
        </button>
      </div>
    </header>
  );
};
