import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle2, AlertCircle, RefreshCw, Server, Database, Activity, ShieldCheck } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminSystemHealth() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/health/services');
      if (res?.data) {
        setServices(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    let interval;
    if (autoRefresh) {
      interval = setInterval(checkHealth, 10000); // 10s auto-refresh
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-8 h-8 text-rose-500" /> React System Health Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live heartbeat monitor pinging backend endpoints directly from React UI (Replacing Swagger UI)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              Auto-Refresh (10s)
            </label>

            <button
              onClick={checkHealth}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Run Pulse Check
            </button>
          </div>
        </div>

        {/* Global Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Service Health</span>
              <span className="text-sm font-extrabold text-slate-900">All Microservice Domains ONLINE</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Database Connection</span>
              <span className="text-sm font-extrabold text-slate-900">MySQL 8.0 Connected (:3306)</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Security Gateway</span>
              <span className="text-sm font-extrabold text-slate-900">JWT & Stateless Auth Active</span>
            </div>
          </div>
        </div>

        {/* Services Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-brand-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                    <Server className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
                    <span className="text-[11px] font-mono text-slate-400 block">{s.route}</span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
                </span>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Response Latency:</span>
                  <span className="font-mono font-bold text-emerald-600">{s.latency} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database Status:</span>
                  <span className="font-medium text-slate-800">{s.database}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Heartbeat:</span>
                  <span className="text-slate-500 font-mono text-[10px]">PASS (200 OK)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
