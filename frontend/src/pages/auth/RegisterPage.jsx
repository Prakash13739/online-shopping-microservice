import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gem, Mail, Lock, User, Phone, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'ROLE_CUSTOMER',
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none -top-10 -right-10" />
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none -bottom-10 -left-10" />

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
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Join NexaMart for exclusive deals and fast checkout</p>
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
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
            {loading ? 'Creating Account...' : 'Register'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-purple-400 hover:text-purple-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
