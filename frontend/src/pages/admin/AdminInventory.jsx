import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Plus, RefreshCw, X } from 'lucide-react';
import { inventoryApi } from '../../api/api';
import AdminSidebar from '../../components/AdminSidebar';
import StatusBadge from '../../components/StatusBadge';

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockQty, setRestockQty] = useState(20);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const [invRes, statsRes] = await Promise.all([
        inventoryApi.getAll(),
        inventoryApi.getStats().catch(() => null),
      ]);
      if (invRes?.data) setInventory(invRes.data);
      if (statsRes?.data) setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openRestock = (item) => {
    setSelectedItem(item);
    setRestockQty(item.quantityAvailable + 25);
    setRestockModalOpen(true);
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await inventoryApi.updateStock(selectedItem.productId, {
        quantityAvailable: restockQty,
        reorderLevel: selectedItem.reorderLevel,
      });
      setRestockModalOpen(false);
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert('Failed to update inventory');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Inventory & Stock Tracking</h1>
            <p className="text-xs text-slate-500 mt-1">
              Live warehouse stock monitoring managed by <strong className="text-slate-800">Inventory Service (:8084)</strong>
            </p>
          </div>

          <button
            onClick={fetchInventory}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Stock
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <span className="text-slate-500 font-bold">Total Stocked Lines</span>
            <span className="text-lg font-extrabold text-slate-900">{inventory.length}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <span className="text-slate-500 font-bold">Low Stock Warning</span>
            <span className="text-lg font-extrabold text-amber-600">
              {inventory.filter((i) => i.status === 'LOW_STOCK').length}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <span className="text-slate-500 font-bold">Out of Stock</span>
            <span className="text-lg font-extrabold text-rose-600">
              {inventory.filter((i) => i.status === 'OUT_OF_STOCK').length}
            </span>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">SKU / Item</th>
                  <th className="py-3.5 px-4">Product ID</th>
                  <th className="py-3.5 px-4">Available Stock</th>
                  <th className="py-3.5 px-4">Reserved (Saga)</th>
                  <th className="py-3.5 px-4">Reorder Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.sku}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">#{item.productId}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-extrabold text-slate-900">{item.quantityAvailable}</span> units
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-slate-700">{item.quantityReserved}</span> units
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{item.reorderLevel} units</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openRestock(item)}
                        className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-lg transition-colors text-xs inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Restock Modal */}
        {restockModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900">Adjust Warehouse Stock</h3>
                <button onClick={() => setRestockModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl">
                <p><strong>SKU:</strong> {selectedItem.sku}</p>
                <p><strong>Product ID:</strong> #{selectedItem.productId}</p>
                <p><strong>Current Available:</strong> {selectedItem.quantityAvailable} units</p>
              </div>

              <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Total Available Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={restockQty}
                    onChange={(e) => setRestockQty(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRestockModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md shadow-brand-600/20"
                  >
                    Save Stock
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
