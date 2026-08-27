import React, { useState } from 'react';
import { Activity, Trash2, Filter, ArrowUpDown, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useApiActivity } from '../../context/ApiActivityContext';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminApiMonitor() {
  const { activities, clearActivities } = useApiActivity();
  const [methodFilter, setMethodFilter] = useState('ALL');

  const filteredActivities = activities.filter((act) => {
    if (methodFilter === 'ALL') return true;
    return act.method === methodFilter;
  });

  const getMethodBadge = (m) => {
    switch (m) {
      case 'GET':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'POST':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PUT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (code) => {
    if (code >= 200 && code < 300) {
      return 'bg-emerald-50 text-emerald-700';
    } else if (code >= 400 && code < 500) {
      return 'bg-amber-50 text-amber-700';
    } else {
      return 'bg-rose-50 text-rose-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-8 h-8 text-brand-600" /> Live API Activity Monitor
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Visual proof of API-First architecture: Streaming live REST requests, latency benchmarks, and response status codes
            </p>
          </div>

          <button
            onClick={clearActivities}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-300 rounded-xl text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" /> Clear Logs
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Method:
            </span>
            {['ALL', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  methodFilter === m
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <span className="text-slate-400 font-semibold">
            {filteredActivities.length} Requests Recorded
          </span>
        </div>

        {/* Activity Stream Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Time</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">REST Endpoint</th>
                  <th className="py-3.5 px-4">Service Domain</th>
                  <th className="py-3.5 px-4">HTTP Status</th>
                  <th className="py-3.5 px-4 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No API activity recorded yet. Browse the catalog, add products to cart, or checkout to see live requests streaming here.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50/80 transition-colors font-mono">
                      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {act.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getMethodBadge(
                            act.method
                          )}`}
                        >
                          {act.method}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 break-all">
                        {act.endpoint}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-600 text-xs whitespace-nowrap">
                        {act.service || 'API Gateway'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${getStatusBadge(
                            act.status
                          )}`}
                        >
                          {act.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        <span className="text-emerald-600">{act.duration} ms</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
