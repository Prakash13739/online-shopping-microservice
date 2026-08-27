import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Edit, RefreshCw, X, Check, Search, MapPin, Calendar, CreditCard, ChevronRight, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { orderApi } from '../../api/api';
import AdminSidebar from '../../components/AdminSidebar';
import StatusBadge from '../../components/StatusBadge';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('CONFIRMED');
  const [toast, setToast] = useState(null);
  const [updating, setUpdating] = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getOrders({});
      if (res?.data) setOrders(res.data);
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to load orders from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusModalOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await orderApi.updateOrderStatus(selectedOrder.id, newStatus);
      showToast('success', `Order ${selectedOrder.orderNumber} status changed to ${newStatus}!`);
      setStatusModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
      (o.shippingAddress && o.shippingAddress.toLowerCase().includes(q)) ||
      (o.paymentMethod && o.paymentMethod.toLowerCase().includes(q)) ||
      (o.status && o.status.toLowerCase().includes(q))
    );
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const confirmedCount = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PAID').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

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
              <ShoppingCart className="w-8 h-8 text-purple-400" /> Orders Received & Fulfillment
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Manage incoming customer orders, review delivery destinations, and trigger shipment status updates
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold glass glass-hover text-slate-300 hover:text-white transition-all self-start sm:self-auto shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Orders
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl p-5 glass-card space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Orders Received</span>
            <div className="text-3xl font-black text-white">{orders.length}</div>
            <span className="text-[11px] text-slate-400 font-semibold">{formatCurrency(totalRevenue)} total sales volume</span>
          </div>

          <div className="rounded-3xl p-5 glass-card space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">In Fulfillment / Processing</span>
            <div className="text-3xl font-black text-purple-400">{confirmedCount}</div>
            <span className="text-[11px] text-purple-300/80 font-semibold">Active orders awaiting dispatch</span>
          </div>

          <div className="rounded-3xl p-5 glass-card space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Successfully Delivered</span>
            <div className="text-3xl font-black text-emerald-400">{deliveredCount}</div>
            <span className="text-[11px] text-emerald-300/80 font-semibold">Completed customer shipments</span>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by order number, address, or payment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-11`}
          />
          <Search className="w-4 h-4 absolute left-4 top-3.5 pointer-events-none text-slate-400" />
        </div>

        {/* Orders Table */}
        <div className="rounded-4xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Order Number</th>
                  <th className="py-4 px-6">Customer & Address</th>
                  <th className="py-4 px-6">Items Purchased</th>
                  <th className="py-4 px-6">Grand Total</th>
                  <th className="py-4 px-6">Payment Mode</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Fulfillment</th>
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
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm font-semibold text-slate-500">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-white text-xs block">{o.orderNumber}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-4 px-6 max-w-xs">
                        <span className="text-xs font-bold text-white block">Customer #{o.userId}</span>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{o.shippingAddress}</p>
                      </td>

                      <td className="py-4 px-6 text-xs font-semibold text-slate-300">
                        {o.items?.length || 1} line item(s)
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-base font-black text-white">{formatCurrency(o.grandTotal)}</span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full glass text-slate-300">
                          {o.paymentMethod}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <StatusBadge status={o.status} />
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => openStatusModal(o)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold btn-primary inline-flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
                        >
                          <Edit className="w-3.5 h-3.5" /> Update Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Status Modal */}
        {statusModalOpen && selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setStatusModalOpen(false); }}
          >
            <div
              className="rounded-4xl max-w-md w-full p-8 space-y-6 glass-card"
              style={{
                background: 'rgba(15,15,35,0.98)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 50px rgba(124,58,237,0.2)',
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-black text-white">Update Order Status</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Change fulfillment stage for order</p>
                </div>
                <button onClick={() => setStatusModalOpen(false)} className="p-2 rounded-xl glass glass-hover text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs space-y-1.5 glass p-4 rounded-2xl">
                <p><strong className="text-slate-400">Order Reference:</strong> <span className="font-mono text-white font-bold">{selectedOrder.orderNumber}</span></p>
                <p><strong className="text-slate-400">Current Status:</strong> <StatusBadge status={selectedOrder.status} /></p>
                <p><strong className="text-slate-400">Total:</strong> <span className="text-white font-bold">{formatCurrency(selectedOrder.grandTotal)}</span></p>
              </div>

              <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-black uppercase tracking-wider text-slate-300 text-[11px]">
                    Select Next Fulfillment Stage
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className={inputClass}
                  >
                    <option value="CONFIRMED">CONFIRMED — Order Accepted</option>
                    <option value="PROCESSING">PROCESSING — Packing in Hub</option>
                    <option value="SHIPPED">SHIPPED — Handed to Logistics</option>
                    <option value="DELIVERED">DELIVERED — Package Received</option>
                    <option value="CANCELLED">CANCELLED — Order Voided</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setStatusModalOpen(false)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-bold glass btn-glass"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 rounded-2xl text-xs font-black text-white btn-primary flex items-center gap-2 shadow-lg disabled:opacity-60"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Apply Status Update</span>
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
