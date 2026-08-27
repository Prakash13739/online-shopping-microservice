import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, ChevronRight, ShoppingBag } from 'lucide-react';
import { orderApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getOrders({ userId: user?.id || 2 });
        if (res?.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-400">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Your Orders</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Track your packages, shipment timeline, and delivery status</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-black text-white btn-primary shadow-lg self-start sm:self-auto hover:scale-105 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4" /> Explore Products
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-4xl p-16 text-center glass-card space-y-4 max-w-lg mx-auto">
          <Package className="w-16 h-16 text-slate-500 mx-auto" />
          <h3 className="text-xl font-black text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-400 font-medium">You haven't placed any orders yet. Start shopping now!</p>
          <Link to="/products" className="inline-block px-7 py-3 rounded-2xl text-xs font-black text-white btn-primary shadow-lg">
            Shop Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl p-6 glass-card space-y-4 hover:border-purple-500/40 transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-xs text-purple-300 px-3 py-1 rounded-xl glass">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white glass glass-hover px-3.5 py-1.5 rounded-xl transition-all"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-2.5 glass p-2 rounded-2xl flex-shrink-0">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-xl bg-slate-900 border border-white/10"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-white line-clamp-1 max-w-[160px]">{item.productName}</p>
                        <p className="text-slate-400 font-semibold">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 flex-shrink-0">
                  <span className="text-xs text-slate-400 block font-semibold">Total Paid</span>
                  <span className="text-xl font-black gradient-text">{formatCurrency(order.grandTotal || 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
