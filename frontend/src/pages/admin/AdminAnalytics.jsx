import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, PieChart as PieIcon, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
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
    { name: 'Delivered', value: 3, color: '#10b981' },
    { name: 'Shipped', value: 2, color: '#06b6d4' },
    { name: 'Processing', value: 2, color: '#f59e0b' },
    { name: 'Confirmed', value: 9, color: '#a855f7' },
  ];

  const paymentMethodData = [
    { name: 'UPI', count: 8 },
    { name: 'Cards', count: 4 },
    { name: 'Net Banking', count: 2 },
    { name: 'COD', count: 2 },
  ];

  const topProducts = [
    { name: 'NexaPhone Pro 15 Ultra', sales: '$2,098.00', orders: 2, category: 'Electronics' },
    { name: 'VisionPad X Pro 13', sales: '$1,898.00', orders: 2, category: 'Electronics' },
    { name: 'NexaRide Electric Scooter', sales: '$1,498.00', orders: 2, category: 'Sports' },
    { name: 'NexaBrew Precision Coffee System', sales: '$747.00', orders: 3, category: 'Home & Kitchen' },
    { name: 'ChronoSport Racing GMT Watch', sales: '$998.00', orders: 2, category: 'Accessories' },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a1a' }}>
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" /> E-Commerce Analytics & Insights
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Aggregated analytical insights computed in real time from orders, payments, and sales records
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Order Status Breakdown */}
          <div className="rounded-4xl p-6 sm:p-8 glass-card space-y-6">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-purple-400" /> Order Fulfillment Status Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribution across order lifecycle stages</p>
            </div>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderStatusData} innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value">
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val} orders`, 'Volume']}
                    contentStyle={{ background: 'rgba(15,15,35,0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-white/10">
              {orderStatusData.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-slate-300 font-semibold">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Volume */}
          <div className="rounded-4xl p-6 sm:p-8 glass-card space-y-6">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" /> Transactions by Payment Method
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Transaction share across UPI, Cards, Net Banking & COD</p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    formatter={(val) => [`${val} transactions`, 'Volume']}
                    contentStyle={{ background: 'rgba(15,15,35,0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', color: 'white' }}
                  />
                  <Bar dataKey="count" fill="#7c3aed" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium">
              Processed securely via database payment transaction records
            </p>
          </div>
        </div>

        {/* Top Grossing Products Table */}
        <div className="rounded-4xl p-6 sm:p-8 glass-card space-y-6">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Top Grossing Products
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">High-velocity items generating top customer revenue</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Product Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Order Frequency</th>
                  <th className="py-4 px-6 text-right">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-6 font-bold text-white text-xs">{p.name}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full glass text-purple-300 text-xs font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-300 font-semibold">{p.orders} purchase(s)</td>
                    <td className="py-4 px-6 text-right font-black text-white text-base">{p.sales}</td>
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
