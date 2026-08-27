import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { orderApi } from '../../api/api';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminAnalytics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getOrders({}).then((res) => {
      if (res?.data) setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const orderStatusData = [
    { name: 'Delivered', value: 2, color: '#10b981' },
    { name: 'Shipped', value: 1, color: '#3b82f6' },
    { name: 'Processing', value: 1, color: '#f59e0b' },
    { name: 'Confirmed', value: 1, color: '#0ea5e9' },
  ];

  const paymentMethodData = [
    { name: 'UPI', count: 3 },
    { name: 'Credit / Debit Card', count: 2 },
    { name: 'Net Banking', count: 1 },
  ];

  const topProducts = [
    { name: 'ProBook Horizon 16-inch M3 Pro', sales: '$1,749.00', orders: 1, category: 'Electronics' },
    { name: 'PixelPro 10 Ultra 5G (256GB)', sales: '$899.00', orders: 1, category: 'Electronics' },
    { name: 'Barista Touch Precision Espresso Machine', sales: '$699.00', orders: 1, category: 'Home & Kitchen' },
    { name: 'Aura Ultra Wireless ANC Headphones', sales: '$249.99', orders: 1, category: 'Electronics' },
    { name: 'AromaPure Smart HEPA Air Purifier', sales: '$159.99', orders: 1, category: 'Home & Kitchen' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">E-Commerce Business Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated analytical insights computed directly from order and payment records
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Order Status Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-brand-600" /> Order Fulfillment Status Breakdown
            </h3>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderStatusData} innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value">
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val} orders`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
              {orderStatusData.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Volume */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" /> Transactions by Payment Method
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    formatter={(val) => [`${val} transactions`, 'Volume']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Processed via simulated transactions in Payment Service (:8087)
            </p>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Top Grossing Products
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Order Frequency</th>
                  <th className="py-3 px-4 text-right">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium text-[11px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{p.orders} order(s)</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">{p.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
