import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, CreditCard, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';
import { orderApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Orders</h1>
          <p className="text-xs text-slate-500 mt-1">Track packages, view details, and review receipts</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold transition-colors self-start sm:self-auto hover:bg-slate-800"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4 max-w-lg mx-auto">
          <Package className="w-14 h-14 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800">No Orders Yet</h3>
          <p className="text-xs text-slate-500">You have not placed any orders yet.</p>
          <Link to="/products" className="inline-block px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-md transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
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
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-brand-600 bg-slate-100 px-3.5 py-1.5 rounded-xl transition-colors"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-2xl border border-slate-100 flex-shrink-0">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-xl bg-white border border-slate-100"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-slate-900 line-clamp-1 max-w-[160px]">{item.productName}</p>
                        <p className="text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 flex-shrink-0">
                  <span className="text-xs text-slate-400 block">Total</span>
                  <span className="text-xl font-extrabold text-slate-900">${order.grandTotal?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
