import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [savingAddr, setSavingAddr] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const [profRes, addrRes] = await Promise.all([
          axiosClient.get(`/api/users/${user?.id || 2}`).catch(() => null),
          axiosClient.get(`/api/users/${user?.id || 2}/addresses`).catch(() => null),
        ]);
        if (profRes?.data) setProfile(profRes.data);
        if (addrRes?.data) setAddresses(addrRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newStreet || !newCity) return;
    try {
      setSavingAddr(true);
      const res = await axiosClient.post(`/api/users/${user?.id || 2}/addresses`, {
        fullName: user?.name || 'Customer',
        phone: user?.phone || '+1 (555) 438-9210',
        street: newStreet,
        city: newCity,
        state: newState || 'CA',
        postalCode: newZip || '90210',
        country: 'United States',
        isDefault: addresses.length === 0,
      });
      if (res?.data) {
        setAddresses((prev) => [...prev, res.data]);
        setNewStreet('');
        setNewCity('');
        setNewState('');
        setNewZip('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingAddr(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    try {
      await axiosClient.delete(`/api/users/${user?.id || 2}/addresses/${addrId}`);
      setAddresses((prev) => prev.filter((a) => a.id !== addrId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">User Profile & Addresses</h1>
        <p className="text-xs text-slate-500 mt-1">
          Managed by <strong className="text-slate-800">User Service (:8082)</strong> on MySQL database <strong className="text-slate-800">shopsphere_user</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 font-extrabold text-2xl flex items-center justify-center border-2 border-brand-300">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{profile?.name || user?.name}</h3>
            <p className="text-xs text-brand-600 font-semibold">{user?.role || 'ROLE_CUSTOMER'}</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{profile?.email || user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{profile?.phone || user?.phone || '+1 (555) 438-9210'}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <Shield className="w-4 h-4" />
              <span>Account Status: Active</span>
            </div>
          </div>
        </div>

        {/* Saved Addresses List & Add Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" /> Saved Shipping Addresses
            </h3>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mt-1">
                      {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                    </p>
                    <p className="text-slate-400 mt-0.5">Phone: {addr.phone}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Address Form */}
            <form onSubmit={handleAddAddress} className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Add New Address</h4>
              <input
                type="text"
                placeholder="Street Address (e.g. 123 Main St)"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="ZIP"
                  value={newZip}
                  onChange={(e) => setNewZip(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={savingAddr}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                {savingAddr ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
