import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Plus, RefreshCw, X, Search, CheckCircle2, Save, Loader2 } from 'lucide-react';
import { inventoryApi, productApi } from '../../api/api';
import AdminSidebar from '../../components/AdminSidebar';
import StatusBadge from '../../components/StatusBadge';

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockQty, setRestockQty] = useState(20);
  const [reorderLvl, setReorderLvl] = useState(10);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAll();
      if (res?.data) {
        setInventory(res.data);
      }
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to fetch inventory from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openRestock = (item) => {
    setSelectedItem(item);
    setRestockQty(item.quantityAvailable);
    setReorderLvl(item.reorderLevel || 10);
    setRestockModalOpen(true);
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setSaving(true);
    try {
      await inventoryApi.updateStock(selectedItem.productId, {
        quantityAvailable: parseInt(restockQty, 10),
        reorderLevel: parseInt(reorderLvl, 10),
      });
      showToast('success', `Stock updated for SKU ${selectedItem.sku}!`);
      setRestockModalOpen(false);
      fetchInventory();
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to update inventory.');
    } finally {
      setSaving(false);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const q = search.toLowerCase();
    return (
      (item.sku && item.sku.toLowerCase().includes(q)) ||
      (item.productId && item.productId.toString().includes(q)) ||
      (item.status && item.status.toLowerCase().includes(q))
    );
  });

  const totalStockUnits = inventory.reduce((acc, i) => acc + (i.quantityAvailable || 0), 0);
  const lowStockItems = inventory.filter((i) => i.status === 'LOW_STOCK' || i.quantityAvailable < 20).length;
  const outOfStockItems = inventory.filter((i) => i.status === 'OUT_OF_STOCK' || i.quantityAvailable === 0).length;

  const inputClass = "w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all focus:outline-none";

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a1a' }}>
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold animate-slide-up`}
            style={{
              background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
              backdropFilter: 'blur(20px)',
              color: toast.type === 'success' ? '#6ee7b7' : '#fca5a5',
            }}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Boxes className="w-8 h-8 text-cyan-400" /> Stocks & Inventory Control
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Real-time warehouse inventory monitoring and live quantity adjustments in MySQL database
            </p>
          </div>

          <button
            onClick={fetchInventory}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold glass glass-hover text-slate-300 hover:text-white transition-all self-start sm:self-auto shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Stocks
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl p-5 glass-card space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Units Stocked</span>
            <div className="text-3xl font-black text-white">{totalStockUnits}</div>
            <span className="text-[11px] text-slate-400 font-semibold">{inventory.length} distinct product SKUs</span>
          </div>

          <div className="rounded-3xl p-5 glass-card space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Low Stock Alert</span>
            <div className="text-3xl font-black text-amber-400">{lowStockItems}</div>
            <span className="text-[11px] text-amber-300/80 font-semibold">SKUs near reorder threshold</span>
          </div>

          <div className="rounded-3xl p-5 glass-card space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Out of Stock</span>
            <div className="text-3xl font-black text-rose-400">{outOfStockItems}</div>
            <span className="text-[11px] text-rose-300/80 font-semibold">SKUs needing urgent replenishment</span>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search stock by SKU, Product ID, or Status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-11`}
          />
          <Search className="w-4 h-4 absolute left-4 top-3.5 pointer-events-none text-slate-400" />
        </div>

        {/* Inventory Table */}
        <div className="rounded-4xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">SKU Code</th>
                  <th className="py-4 px-6">Product ID</th>
                  <th className="py-4 px-6">Available Stock</th>
                  <th className="py-4 px-6">Reserved (Saga)</th>
                  <th className="py-4 px-6">Reorder Threshold</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5, 6, 7].map(j => (
                        <td key={j} className="py-4 px-6">
                          <div className="h-4 rounded-lg bg-white/5 animate-pulse" style={{ width: '60%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm font-semibold text-slate-500">
                      No matching inventory records found.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-white text-xs">{item.sku}</td>
                      <td className="py-4 px-6 font-mono text-xs text-purple-300">#{item.productId}</td>
                      <td className="py-4 px-6">
                        <span className="text-base font-black text-white">{item.quantityAvailable}</span>
                        <span className="text-xs text-slate-400 ml-1.5">units</span>
                      </td>
                      <td className="py-4 px-6 text-xs font-semibold text-slate-400">
                        {item.quantityReserved || 0} units
                      </td>
                      <td className="py-4 px-6 text-xs font-semibold text-slate-400">
                        {item.reorderLevel || 10} units
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => openRestock(item)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold btn-primary inline-flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Adjust Stock Modal */}
        {restockModalOpen && selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setRestockModalOpen(false); }}
          >
            <div
              className="rounded-4xl max-w-md w-full p-8 space-y-6 glass-card"
              style={{
                background: 'rgba(15,15,35,0.98)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 50px rgba(6,182,212,0.2)',
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-black text-white">Adjust Stock Level</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Live inventory update for MySQL database</p>
                </div>
                <button onClick={() => setRestockModalOpen(false)} className="p-2 rounded-xl glass glass-hover text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs space-y-1.5 glass p-4 rounded-2xl">
                <p><strong className="text-slate-400">SKU Code:</strong> <span className="font-mono text-white font-bold">{selectedItem.sku}</span></p>
                <p><strong className="text-slate-400">Product ID:</strong> <span className="font-mono text-purple-300">#{selectedItem.productId}</span></p>
                <p><strong className="text-slate-400">Current Stock:</strong> <span className="text-emerald-400 font-bold">{selectedItem.quantityAvailable} units</span></p>
              </div>

              <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-black uppercase tracking-wider text-slate-300 text-[11px]">
                    New Available Quantity (Units) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={restockQty}
                    onChange={(e) => setRestockQty(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-black uppercase tracking-wider text-slate-300 text-[11px]">
                    Reorder Threshold (Units)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={reorderLvl}
                    onChange={(e) => setReorderLvl(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setRestockModalOpen(false)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-bold glass btn-glass"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-2xl text-xs font-black text-white btn-primary flex items-center gap-2 shadow-lg disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Stock Update</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
