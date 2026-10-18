import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { Product, ProductCategory, ProductStatus } from '../types/verification';
import { SecurityTagPreviewModal } from './SecurityTagPreviewModal';
import {
  Layers,
  Plus,
  Search,
  Tag,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  Printer,
  ChevronDown,
  Building,
  Sparkles
} from 'lucide-react';

export const BrandRegistryView: React.FC = () => {
  const { products, addNewBatch, updateProductStatus, quickSelectSample } = useVerification();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedProductForTag, setSelectedProductForTag] = useState<Product | null>(null);

  // New batch form state
  const [batchBrand, setBatchBrand] = useState('Helios Optical Instruments');
  const [batchName, setBatchName] = useState('Monocular Rangefinder 1200x');
  const [batchCategory, setBatchCategory] = useState<ProductCategory>('Consumer Electronics');
  const [batchModel, setBatchModel] = useState('HLS-RF-1200');
  const [batchPrefix, setBatchPrefix] = useState('HLS');
  const [batchCount, setBatchCount] = useState(5);
  const [batchFacility, setBatchFacility] = useState('Helios Precision Works, Munich, Germany');
  const [batchCountry, setBatchCountry] = useState('Germany');
  const [batchWarranty, setBatchWarranty] = useState(36);
  const [batchScratch, setBatchScratch] = useState(true);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    addNewBatch({
      brand: batchBrand,
      name: batchName,
      category: batchCategory,
      modelNumber: batchModel,
      serialPrefix: batchPrefix,
      count: batchCount,
      facility: batchFacility,
      country: batchCountry,
      warrantyMonths: batchWarranty,
      scratchPins: batchScratch,
    });
    setShowBatchModal(false);
  };

  const handleToggleRecall = (product: Product) => {
    if (product.status === 'RECALLED') {
      updateProductStatus(product.id, 'AUTHENTIC');
    } else {
      const notice = window.prompt(
        'Enter reason or instructions for voluntary product safety recall:',
        'Mandatory recall: component quality inspection underway. Return to authorized distributor for replacement.'
      );
      if (notice) {
        updateProductStatus(product.id, 'RECALLED', notice);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      p.serialNumber.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.batchNumber.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>Enterprise Ledger Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Brand Anti-Counterfeit Master Registry
          </h1>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Provision cryptographically secured production batches, print GS1-standard tamper security labels,
            and manage active safety recalls.
          </p>
        </div>

        <button
          onClick={() => setShowBatchModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-xl transition-colors whitespace-nowrap shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Batch</span>
        </button>
      </div>

      {/* Registry Controls & Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by serial, brand, model, batch..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Luxury Goods">Luxury Goods</option>
              <option value="Pharmaceuticals">Pharmaceuticals</option>
              <option value="Consumer Electronics">Consumer Electronics</option>
              <option value="Cosmetics & Fragrance">Cosmetics & Fragrance</option>
              <option value="Automotive & Industrial">Automotive & Industrial</option>
            </select>
          </div>
        </div>

        {/* Master Registry Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Serial Identifier</th>
                <th className="py-3 px-4 font-semibold">Product Description</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Lot / Batch</th>
                <th className="py-3 px-4 font-semibold">Scans</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Label & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-sky-400 whitespace-nowrap">
                    {p.serialNumber}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-200">
                    <div className="font-medium truncate max-w-xs">{p.name}</div>
                    <div className="text-[11px] text-slate-500">{p.brand}</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-300 whitespace-nowrap">
                    {p.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {p.batchNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 tabular-nums whitespace-nowrap">
                    {p.scanCount}
                  </td>
                  <td className="py-3.5 px-4 font-sans whitespace-nowrap">
                    {p.status === 'AUTHENTIC' ? (
                      <span className="text-emerald-400 font-medium">Active Genuine</span>
                    ) : p.status === 'SUSPICIOUS_DUPLICATE' ? (
                      <span className="text-amber-400 font-medium">Cloned Alert</span>
                    ) : p.status === 'RECALLED' ? (
                      <span className="text-rose-400 font-medium">Recalled</span>
                    ) : (
                      <span className="text-red-400 font-medium">Counterfeit</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedProductForTag(p)}
                        className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded transition-colors"
                        title="View Physical Security Tag"
                      >
                        <Tag className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleRecall(p)}
                        className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                          p.status === 'RECALLED'
                            ? 'bg-rose-950 text-rose-300 hover:bg-rose-900'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {p.status === 'RECALLED' ? 'Clear Recall' : 'Recall Lot'}
                      </button>

                      <button
                        onClick={() => quickSelectSample(p.serialNumber)}
                        className="px-2 py-1 text-[11px] font-medium bg-sky-950 text-sky-400 hover:bg-sky-900 rounded transition-colors"
                      >
                        Verify
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Provisioning Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <span>Provision Cryptographic Serial Batch</span>
              </h2>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={batchBrand}
                    onChange={e => setBatchBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={batchName}
                    onChange={e => setBatchName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Industry Category</label>
                  <select
                    value={batchCategory}
                    onChange={e => setBatchCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Luxury Goods">Luxury Goods</option>
                    <option value="Pharmaceuticals">Pharmaceuticals</option>
                    <option value="Consumer Electronics">Consumer Electronics</option>
                    <option value="Cosmetics & Fragrance">Cosmetics & Fragrance</option>
                    <option value="Automotive & Industrial">Automotive & Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Model / SKU Number</label>
                  <input
                    type="text"
                    required
                    value={batchModel}
                    onChange={e => setBatchModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Serial Prefix</label>
                  <input
                    type="text"
                    required
                    value={batchPrefix}
                    onChange={e => setBatchPrefix(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={batchCount}
                    onChange={e => setBatchCount(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Warranty (Months)</label>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={batchWarranty}
                    onChange={e => setBatchWarranty(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Manufacturing Facility</label>
                  <input
                    type="text"
                    required
                    value={batchFacility}
                    onChange={e => setBatchFacility(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Country of Origin</label>
                  <input
                    type="text"
                    required
                    value={batchCountry}
                    onChange={e => setBatchCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="scratchPins"
                  checked={batchScratch}
                  onChange={e => setBatchScratch(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-sky-500"
                />
                <label htmlFor="scratchPins" className="text-slate-300">
                  Generate 4-Digit Scratch-Off Tamper PIN for each unit
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shadow-sm"
                >
                  Generate {batchCount} Serialized Units
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Tag Preview Modal */}
      {selectedProductForTag && (
        <SecurityTagPreviewModal
          product={selectedProductForTag}
          isOpen={Boolean(selectedProductForTag)}
          onClose={() => setSelectedProductForTag(null)}
        />
      )}
    </div>
  );
};
