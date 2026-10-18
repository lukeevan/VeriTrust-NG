import React, { useState } from 'react';
import { Product } from '../types/verification';
import { generateQrMatrix, generateBarcodeSvg } from '../utils/qrHelper';
import { X, Printer, Shield, Sparkles, Eye, EyeOff } from 'lucide-react';

interface SecurityTagPreviewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityTagPreviewModal: React.FC<SecurityTagPreviewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [scratchRevealed, setScratchRevealed] = useState(false);

  if (!isOpen) return null;

  const qrMatrix = generateQrMatrix(product.securitySealDetails.qrSignature, 21);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">Physical Tamper-Evident Security Label</h2>
            <p className="text-xs text-slate-400">GS1 / ISO 12931 Compliant Holographic Security Tag</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Security Tag Visual Canvas */}
        <div className="p-6 bg-slate-950 flex flex-col items-center justify-center">
          {/* Physical Security Label Simulation */}
          <div className="w-80 bg-white text-slate-950 rounded-xl p-4 shadow-2xl border-2 border-slate-300 relative overflow-hidden select-none">
            {/* Holographic Security Ribbon */}
            <div className="h-4 -mx-4 -mt-4 mb-3 hologram-shimmer flex items-center justify-between px-3 border-b border-slate-200">
              <span className="text-[8px] font-mono font-bold tracking-widest text-slate-800 uppercase">
                {product.brand} · AUTHENTIC
              </span>
              <span className="text-[8px] font-mono text-slate-700">VOID IF REMOVED</span>
            </div>

            <div className="flex items-start gap-3">
              {/* SVG 2D QR Code Matrix */}
              <div className="w-24 h-24 bg-white p-1 border border-slate-300 rounded shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 21 21" className="w-full h-full text-slate-950">
                  {qrMatrix.map((row, rIdx) =>
                    row.map((cell, cIdx) =>
                      cell ? (
                        <rect key={`${rIdx}-${cIdx}`} x={cIdx} y={rIdx} width="1" height="1" fill="currentColor" />
                      ) : null
                    )
                  )}
                </svg>
              </div>

              {/* Tag Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Official Security Seal
                </div>
                <div className="text-xs font-bold leading-tight truncate">{product.brand}</div>
                <div className="text-[10px] text-slate-600 truncate">{product.name}</div>
                <div className="text-[9px] font-mono text-slate-500">
                  SN: <span className="font-bold text-slate-900">{product.serialNumber}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-500">LOT: {product.batchNumber}</div>
              </div>
            </div>

            {/* Microtext Border simulation */}
            <div className="mt-3 pt-1 border-t border-dashed border-slate-300 text-[6.5px] font-mono text-slate-400 tracking-wider text-center uppercase truncate">
              {product.securitySealDetails.microtextPattern}
            </div>

            {/* Interactive Scratch-off PIN Strip */}
            {product.scratchPin && (
              <div className="mt-2.5 p-2 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[8px] uppercase tracking-wider font-bold text-slate-500">
                    Security Scratch-Off PIN
                  </div>
                  <div className="text-[9px] text-slate-400">Rub foil to reveal code</div>
                </div>

                <button
                  type="button"
                  onClick={() => setScratchRevealed(!scratchRevealed)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    scratchRevealed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 text-slate-700 shadow-inner'
                  }`}
                >
                  {scratchRevealed ? product.scratchPin : 'SCRATCH FOIL'}
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center max-w-xs">
            Labels feature tamper-destructive adhesive. Peeling leaves an indelible VOID checkerboard matrix.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Label Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
