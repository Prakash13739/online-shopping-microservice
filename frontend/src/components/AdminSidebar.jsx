import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, Boxes, ShoppingCart,
  Users, BarChart3, ArrowLeft, Gem
} from 'lucide-react';

export default function AdminSidebar() {
  const links = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/users', label: 'Customers', icon: Users },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-60 min-h-screen flex flex-col justify-between flex-shrink-0"
      style={{
        background: 'rgba(10,10,26,0.97)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
      }}>
      <div className="space-y-6 p-5">

        {/* Brand */}
        <div className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '20px' }}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
            <Gem className="w-5 h-5 text-white" />
          </div>
          <div className="leading-none">
            <h2 className="font-black text-base text-white">NexaMart</h2>
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(148,163,184,0.5)' }}>
              Admin Panel
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.1))',
                border: '1px solid rgba(124,58,237,0.3)',
                boxShadow: '0 4px 16px rgba(124,58,237,0.15)',
              } : {
                background: 'transparent',
                border: '1px solid transparent',
              }}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Back to Store */}
      <div className="p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/"
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all"
          style={{ color: 'rgba(148,163,184,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(148,163,184,0.5)'; e.currentTarget.style.background = 'transparent'; }}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
