import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShieldCheck, RefreshCw, Search } from 'lucide-react';
import { authApi } from '../../api/api';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await authApi.getAllUsers();
      if (res?.data) setUsers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  const inputClass = "w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all focus:outline-none";

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a1a' }}>
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" /> Customer & Account Directory
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Registered customers, administrators, and account security profiles in MySQL database
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold glass glass-hover text-slate-300 hover:text-white transition-all self-start sm:self-auto shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Users
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search customers by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-11`}
          />
          <Search className="w-4 h-4 absolute left-4 top-3.5 pointer-events-none text-slate-400" />
        </div>

        {/* Users Table */}
        <div className="rounded-4xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Customer Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Contact Phone</th>
                  <th className="py-4 px-6">Account Role</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5].map(j => (
                        <td key={j} className="py-4 px-6">
                          <div className="h-4 rounded-lg bg-white/5 animate-pulse" style={{ width: '60%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm font-semibold text-slate-500">
                      No customer accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black text-white"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="font-bold text-white text-sm">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs font-semibold text-slate-300">{u.email}</td>
                      <td className="py-4 px-6 text-xs text-slate-400 font-mono">{u.phone || '+91 98765 43210'}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider ${
                            u.role === 'ROLE_ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {u.role === 'ROLE_ADMIN' ? '👑 Administrator' : '🛍️ Customer'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-black text-[10px]">
                          <ShieldCheck className="w-3.5 h-3.5" /> ACTIVE
                        </span>
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
