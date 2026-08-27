import React from 'react';
import { Gem, ShieldCheck, Truck, RotateCcw, Headphones, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="glass-dark text-slate-400 mt-auto border-t border-white/10">
      
      {/* Value Propositions */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-3xl glass">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400">On all orders over $100</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-3xl glass">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Secure Payments</h4>
                <p className="text-xs text-slate-400">UPI, Cards, Net Banking & COD</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-3xl glass">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">30-Day Easy Returns</h4>
                <p className="text-xs text-slate-400">Hassle-free instant refund</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-3xl glass">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">24/7 Priority Support</h4>
                <p className="text-xs text-slate-400">Dedicated customer care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
                <Gem className="w-5 h-5" />
              </div>
              <span className="font-black text-2xl tracking-tight gradient-text">
                NexaMart
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              Discover curated luxury electronics, designer fashion apparel, smart home appliances, and lifestyle essentials.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">Explore Departments</h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link to="/products?categoryId=1" className="text-slate-400 hover:text-white transition-colors">Electronics & Audio</Link></li>
              <li><Link to="/products?categoryId=2" className="text-slate-400 hover:text-white transition-colors">Fashion & Apparel</Link></li>
              <li><Link to="/products?categoryId=3" className="text-slate-400 hover:text-white transition-colors">Home & Kitchen</Link></li>
              <li><Link to="/products?categoryId=5" className="text-slate-400 hover:text-white transition-colors">Sports & Fitness</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">Customer Care</h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link to="/orders" className="text-slate-400 hover:text-white transition-colors">Track Orders</Link></li>
              <li><Link to="/cart" className="text-slate-400 hover:text-white transition-colors">View Cart</Link></li>
              <li><Link to="/profile" className="text-slate-400 hover:text-white transition-colors">Account & Addresses</Link></li>
              <li><Link to="/notifications" className="text-slate-400 hover:text-white transition-colors">Notifications</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">Store Management</h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link to="/admin" className="text-slate-400 hover:text-white transition-colors">Admin Dashboard</Link></li>
              <li><Link to="/admin/products" className="text-slate-400 hover:text-white transition-colors">Products Catalog</Link></li>
              <li><Link to="/admin/inventory" className="text-slate-400 hover:text-white transition-colors">Inventory Control</Link></li>
              <li><Link to="/admin/orders" className="text-slate-400 hover:text-white transition-colors">Order Management</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 NexaMart Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
