import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gem, Mail, Lock, ArrowRight, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const user = await login(email, password);
      if (user?.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none -top-10 -left-10" />
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />

      <div className="w-full max-w-md rounded-4xl p-8 sm:p-10 relative z-10 glass-card"
        style={{
          background: 'rgba(15, 15, 35, 0.75)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(124, 58, 237, 0.2)',
        }}>
        
        {/* Logo & Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 25px rgba(124, 58, 237, 0.6)',
            }}>
            <Gem className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome to NexaMart</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Sign in to your account to continue</p>
          </div>
        </div>

        {/* 1-Click Fast Fill */}
        <div className="p-3.5 rounded-2xl mb-6 space-y-2 text-xs"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Fast Demo Logins:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillDemo('admin@shopsphere.com', 'admin123')}
              className="px-3 py-2 rounded-xl text-left font-bold text-xs transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(6, 182, 212, 0.2))',
                border: '1px solid rgba(124, 58, 237, 0.4)',
                color: '#c4b5fd',
              }}
            >
              👑 Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemo('customer@shopsphere.com', 'customer123')}
              className="px-3 py-2 rounded-xl text-left font-bold text-xs transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(124, 58, 237, 0.2))',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                color: '#67e8f9',
              }}
            >
              🛍️ Customer Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 mb-5 rounded-2xl text-xs font-bold flex items-center gap-2"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
            }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all btn-primary flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-60"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-purple-400 hover:text-purple-300 transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
