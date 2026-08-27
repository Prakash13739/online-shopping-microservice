import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Plus, Edit2, Trash2, CheckCircle2, ShieldCheck, X, Save, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/api';

const EMPTY_ADDRESS_FORM = {
  fullName: '',
  phone: '',
  street: '',
  landmark: '',
  district: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  addressType: 'HOME',
  isDefault: false,
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_ADDRESS_FORM);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfileAndAddresses = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [profRes, addrRes] = await Promise.all([
        userApi.getProfile(user.id).catch(() => null),
        userApi.getAddresses(user.id).catch(() => null),
      ]);

      if (profRes?.data) setProfile(profRes.data);
      if (addrRes?.data) setAddresses(addrRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndAddresses();
  }, [user?.id]);

  const openAdd = () => {
    setForm({
      ...EMPTY_ADDRESS_FORM,
      fullName: user?.name || '',
      phone: user?.phone || '',
    });
    setEditingId(null);
    setModal('add');
  };

  const openEdit = (addr) => {
    setForm({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      street: addr.street || '',
      landmark: addr.landmark || '',
      district: addr.district || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'India',
      addressType: addr.addressType || 'HOME',
      isDefault: Boolean(addr.isDefault),
    });
    setEditingId(addr.id);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setForm(EMPTY_ADDRESS_FORM);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.street || !form.city || !form.state || !form.postalCode) {
      showToast('error', 'Please fill in all mandatory address fields.');
      return;
    }

    setSaving(true);
    try {
      if (modal === 'add') {
        await userApi.addAddress(user.id, form);
        showToast('success', 'New delivery address added!');
      } else {
        await userApi.updateAddress(user.id, editingId, form);
        showToast('success', 'Delivery address updated!');
      }
      closeModal();
      fetchProfileAndAddresses();
    } catch (err) {
      showToast('error', 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this delivery address?')) return;
    try {
      await userApi.deleteAddress(user.id, addressId);
      showToast('success', 'Address deleted.');
      fetchProfileAndAddresses();
    } catch (err) {
      showToast('error', 'Failed to delete address.');
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all focus:outline-none";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold animate-slide-up`}
          style={{
            background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
            backdropFilter: 'blur(20px)',
            color: toast.type === 'success' ? '#6ee7b7' : '#fca5a5',
          }}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Account & Addresses</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Manage your personal details and custom shipping destinations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: User Profile Info */}
        <div className="space-y-6">
          <div className="rounded-3xl p-6 glass-card space-y-6 text-center">
            
            <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-3xl font-black text-white shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                boxShadow: '0 0 30px rgba(124, 58, 237, 0.5)',
              }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">{user?.name || 'Customer'}</h2>
              <p className="text-xs text-slate-400 font-semibold">{user?.email || 'customer@shopsphere.com'}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-purple-300 glass">
                {user?.role || 'ROLE_CUSTOMER'}
              </span>
            </div>

            <div className="pt-4 border-t border-white/10 text-left space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>{user?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>{user?.email || 'customer@shopsphere.com'}</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Active Verified Customer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Address Book */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 glass-card space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" /> Saved Delivery Addresses
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add multiple addresses with State, District, Landmark, and PIN Code
                </p>
              </div>

              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black text-white btn-primary self-start sm:self-auto shadow-md"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>

            {/* Address Cards List */}
            {addresses.length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl p-6 space-y-3">
                <MapPin className="w-12 h-12 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Addresses Saved Yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Add your home, office, or secondary delivery address for instant 1-click checkout.
                </p>
                <button
                  onClick={openAdd}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white btn-primary inline-block"
                >
                  Add Address Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-3xl glass space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-white">{addr.fullName}</span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                          {addr.addressType || 'HOME'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {addr.street}
                        {addr.landmark && <span className="block text-slate-400 mt-0.5">Landmark: {addr.landmark}</span>}
                        {addr.district && <span className="block text-slate-400">District: {addr.district}</span>}
                        <span className="block font-medium text-white mt-1">
                          {addr.city}, {addr.state} - <strong>{addr.postalCode}</strong>
                        </span>
                        <span className="block text-slate-400">{addr.country}</span>
                      </p>

                      <p className="text-xs font-mono text-slate-400 pt-1">
                        Ph: <strong className="text-white">{addr.phone}</strong>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      {addr.isDefault ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Default Address
                        </span>
                      ) : <span />}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(addr)}
                          className="p-2 rounded-xl text-xs font-bold glass glass-hover text-purple-300"
                          title="Edit Address"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-2 rounded-xl text-xs font-bold glass glass-hover text-rose-400"
                          title="Delete Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════ Add / Edit Address Modal ════════════ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-4xl glass-card p-6 sm:p-8 space-y-6"
            style={{
              background: 'rgba(15,15,35,0.95)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 50px rgba(124,58,237,0.2)',
            }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-black text-white">
                  {modal === 'add' ? '📍 Add Delivery Address' : '✏️ Edit Delivery Address'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter recipient name, phone, full street, landmark, district, state, and PIN
                </p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl glass glass-hover text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address Form */}
            <form onSubmit={handleSaveAddress} className="space-y-4">
              
              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    Recipient Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleFormChange}
                    placeholder="e.g. Jane Doe / Rajesh Kumar"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    Phone Number (Ph No) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="e.g. +91 98765 43210"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Street Address / Flat / House No <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleFormChange}
                  placeholder="e.g. Flat 402, Highline Towers, 12th Main Road, Sector 4"
                  className={inputClass}
                  required
                />
              </div>

              {/* Landmark */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={form.landmark}
                  onChange={handleFormChange}
                  placeholder="e.g. Opposite Apollo Hospital / Near Metro Station"
                  className={inputClass}
                />
              </div>

              {/* City & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    City / Town <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                    placeholder="e.g. Bengaluru / Mumbai"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={form.district}
                    onChange={handleFormChange}
                    placeholder="e.g. Bengaluru Urban / Thane"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* State & PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    State / Province <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleFormChange}
                    placeholder="e.g. Karnataka / Maharashtra"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    PIN Code / Postal Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleFormChange}
                    placeholder="e.g. 560001 / 400001"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Country & Address Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    Country <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleFormChange}
                    placeholder="e.g. India"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    Address Type
                  </label>
                  <select
                    name="addressType"
                    value={form.addressType}
                    onChange={handleFormChange}
                    className={inputClass}
                  >
                    <option value="HOME">🏠 Home</option>
                    <option value="WORK">🏢 Work / Office</option>
                    <option value="OTHER">📍 Other</option>
                  </select>
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleFormChange}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Set as default shipping address</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold glass btn-glass"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-2xl text-xs font-black text-white btn-primary flex items-center gap-2 shadow-lg disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {modal === 'add' ? 'Save Address' : 'Update Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
