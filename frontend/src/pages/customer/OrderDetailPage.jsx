import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { orderApi, paymentApi } from '../../api/api';
import OrderTimeline from '../../components/OrderTimeline';
import StatusBadge from '../../components/StatusBadge';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const [ordRes, payRes] = await Promise.all([
          orderApi.getOrderById(id),
          paymentApi.getByOrderId(id).catch(() => null),
        ]);

        if (ordRes?.data) setOrder(ordRes.data);
        if (payRes?.data) setPayment(payRes.data);
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      const res = await orderApi.updateOrderStatus(id, 'CANCELLED');
      if (res?.data) setOrder(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-400">Loading order receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <Link to="/orders" className="px-5 py-2.5 btn-primary text-white rounded-2xl text-xs font-bold inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Order {order.orderNumber}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-400">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'FAILED' && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="px-4 py-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 rounded-2xl text-xs font-bold transition-all self-start sm:self-auto"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {/* Visual Timeline */}
      <OrderTimeline status={order.status} createdAt={order.createdAt} />

      {/* Grid: Order Items & Delivery Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Purchased Items */}
        <div className="lg:col-span-2 rounded-4xl p-6 sm:p-8 glass-card space-y-6">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" /> Items in this Order ({order.items?.length || 0})
          </h3>

          <div className="divide-y divide-white/10">
            {order.items?.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <img
                    src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-2xl bg-slate-900 border border-white/10 flex-shrink-0"
                  />
                  <div>
                    <Link to={`/product/${item.productId}`} className="font-bold text-sm text-white hover:text-purple-300 transition-colors">
                      {item.productName}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5 font-semibold">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                  </div>
                </div>

                <span className="text-sm font-black text-white">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-6 border-t border-white/10 space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-bold text-white">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-white">
                {order.shippingAmount === 0 ? <strong className="text-emerald-400 font-bold">FREE</strong> : formatCurrency(order.shippingAmount)}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Discount</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10 flex justify-between text-base font-black text-white">
              <span>Grand Total</span>
              <span className="gradient-text text-xl font-black">{formatCurrency(order.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Destination & Payment Meta */}
        <div className="space-y-6">
          
          <div className="rounded-3xl p-6 glass-card space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" /> Delivery Address
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed glass p-4 rounded-2xl">
              {order.shippingAddress}
            </p>
          </div>

          <div className="rounded-3xl p-6 glass-card space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" /> Payment Information
            </h3>
            <div className="text-xs space-y-2 glass p-4 rounded-2xl">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode</span>
                <span className="font-bold text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-bold text-emerald-400">{payment?.status || 'SUCCESS'}</span>
              </div>
              {payment?.transactionId && (
                <div className="flex justify-between pt-1 border-t border-white/10">
                  <span className="text-slate-400">Reference ID</span>
                  <span className="font-mono text-[10px] text-purple-300">{payment.transactionId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
