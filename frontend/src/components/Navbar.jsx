import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gem, Search, Bell, LogOut, LayoutDashboard, Menu, X, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar() {
  const { user, logout, switchDemoRole, isAdmin } = useAuth();
  const { cart } = useCart();
  const { unreadCount } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3 gap-6">

          {/* ── Brand Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
              <Gem className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </div>
            <div className="leading-none">
              <span className="font-black text-xl tracking-tight gradient-text">NexaMart</span>
              <span className="text-[10px] text-slate-500 font-semibold block -mt-0.5 tracking-widest uppercase">Premium Store</span>
            </div>
          </Link>

          {/* ── Nav Links (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'All Products' },
              { to: '/products?categoryId=1', label: 'Electronics' },
              { to: '/products?categoryId=2', label: 'Fashion' },
              { to: '/products?categoryId=3', label: 'Home & Living' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all">
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Search Bar ── */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl placeholder:text-slate-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          </form>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-2">

            {/* Role switcher */}
            <div className="hidden xl:flex items-center rounded-xl p-0.5 gap-0.5"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => switchDemoRole('ROLE_CUSTOMER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!isAdmin
                  ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                style={!isAdmin ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' } : {}}>
                Customer
              </button>
              <button onClick={() => switchDemoRole('ROLE_ADMIN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isAdmin
                  ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                style={isAdmin ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' } : {}}>
                Admin
              </button>
            </div>

            {/* Admin dashboard */}
            {isAdmin && (
              <Link to="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-300 transition-all glass glass-hover">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}

            {/* Notifications */}
            <Link to="/notifications"
              className="relative p-2.5 rounded-xl text-slate-400 hover:text-white transition-all glass glass-hover">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-black text-white rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart"
              className="relative p-2.5 rounded-xl text-slate-400 hover:text-white transition-all glass glass-hover">
              <ShoppingCart className="w-5 h-5" />
              {cart.totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-black text-white rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* User avatar / Sign In */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Link>
                <button onClick={logout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all btn-primary">
                Sign In
              </Link>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white glass glass-hover">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden border-t glass-dark px-4 py-5 space-y-4"
          style={{ borderTopColor: 'rgba(255,255,255,0.06)' }}>
          <form onSubmit={handleSearch} className="relative">
            <input type="text" placeholder="Search products..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl" />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          </form>
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            {[
              { to: '/products', label: 'All Products' },
              { to: '/orders', label: 'My Orders' },
              { to: '/profile', label: 'Profile' },
              { to: '/cart', label: 'Cart' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white glass glass-hover text-center text-xs font-bold">
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl text-xs font-bold text-center col-span-2"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))', border: '1px solid rgba(124,58,237,0.3)' }}>
                <span className="gradient-text">⚡ Admin Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
