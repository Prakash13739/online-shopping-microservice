import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin, CreditCard, ShieldCheck, ArrowRight, Loader2,
  CheckCircle2, AlertTriangle, Smartphone, Building2, Banknote,
  Plus, Check, Edit3, Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderApi, userApi } from '../../api/api';

const DEFAULT_ADDRESS_FORM = {
  fullName: 'Jane Doe',
  phone: '+91 98765 43210',
  street: 'Flat 402, Highline Residency, 12th Main Road',
  landmark: 'Near Central Park Metro Station',
  district: 'Bengaluru Urban',
  city: 'Bengaluru',
  state: 'Karnataka',
  postalCode: '560001',
  country: 'India',
  addressType: 'HOME',
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('custom');
  const [addressForm, setAddressForm] = useState(DEFAULT_ADDRESS_FORM);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveToAccount, setSaveToAccount] = useState(true);

  const items = cart.items || [];
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 15;
  const discount = subtotal > 200 ? 20 : 0;
  const grandTotal = subtotal + shipping - discount;

  // Load saved addresses for current user
  useEffect(() => {
    if (user?.id) {
      userApi.getAddresses(user.id).then((res) => {
        if (res?.data && res.data.length > 0) {
          setSavedAddresses(res.data);
          const def = res.data.find((a) => a.isDefault) || res.data[0];
          setSelectedAddressId(def.id.toString());
          setAddressForm({
            fullName: def.fullName || user.name || '',
            phone: def.phone || user.phone || '',
            street: def.street || '',
            landmark: def.landmark || '',
            district: def.district || '',
            city: def.city || '',
            state: def.state || '',
            postalCode: def.postalCode || '',
            country: def.country || 'India',
            addressType: def.addressType || 'HOME',
          });
        } else {
          // Pre-fill user name and phone if available
          setAddressForm((prev) => ({
            ...prev,
            fullName: user.name || prev.fullName,
            phone: user.phone || prev.phone,
          }));
        }
      }).catch(() => {});
    }
  }, [user?.id]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id.toString());
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      landmark: addr.landmark || '',
      district: addr.district || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      addressType: addr.addressType || 'HOME',
    });
  };

  const handleAddressFieldChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Validation
    if (!addressForm.fullName.trim() || !addressForm.phone.trim() || !addressForm.street.trim() || !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.postalCode.trim()) {
      setErrorMessage('Please fill in all mandatory delivery address fields (Name, Phone, Street, City, State, PIN Code).');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Construct rich formatted delivery address string for order receipt
      const formattedAddress = [
        addressForm.fullName,
        `Phone: ${addressForm.phone}`,
        addressForm.street,
        addressForm.landmark ? `Landmark: ${addressForm.landmark}` : null,
        addressForm.district ? `District: ${addressForm.district}` : null,
        `${addressForm.city}, ${addressForm.state} - ${addressForm.postalCode}`,
        addressForm.country,
        `[${addressForm.addressType}]`,
      ].filter(Boolean).join(', ');

      const orderPayload = {
        userId: user?.id || 2,
        shippingAddress: formattedAddress,
        paymentMethod,
        discountAmount: discount,
        simulateFailure: false,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          productImage: i.productImage,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
        })),
      };

      // Optionally save to user address book if new
      if (saveToAccount && user?.id && selectedAddressId === 'custom') {
        userApi.addAddress(user.id, {
          ...addressForm,
          isDefault: savedAddresses.length === 0,
        }).catch(() => {});
      }

      const res = await orderApi.createOrder(orderPayload);
      if (res?.data) {
        await clearCart();
        navigate(`/orders/${res.data.id}`);
      }
    } catch (err) {
      console.error('Order failed:', err);
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Your bag is empty</h2>
        <Link to="/products" className="px-6 py-3 rounded-2xl text-xs font-bold text-white btn-primary inline-block">
          Explore Products
        </Link>
      </div>
    );
  }

  const paymentOptions = [
    { id: 'UPI', label: 'UPI / Instant Pay', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm, QR' },
    { id: 'CARD', label: 'Credit or Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
    { id: 'NET_BANKING', label: 'Net Banking', icon: Building2, desc: 'All Indian & International Banks' },
    { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay cash when package arrives' },
  ];

  const inputClass = "w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all focus:outline-none";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Customize your delivery destination, recipient phone number, and select payment mode
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Sections (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ════════════ 1. DELIVERY ADDRESS FORM ════════════ */}
          <div className="rounded-3xl p-6 sm:p-8 glass-card space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">1. Shipping & Delivery Address</h3>
                  <span className="text-[11px] text-slate-400 font-medium">Enter your precise destination details</span>
                </div>
              </div>

              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedAddressId('custom')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedAddressId === 'custom'
                      ? 'btn-primary'
                      : 'text-slate-400 hover:text-white glass glass-hover'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> New Address
                </button>
              )}
            </div>

            {/* Saved Address Cards Carousel / Selector */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Select from Saved Addresses:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all text-xs space-y-1.5 ${
                        selectedAddressId === addr.id.toString()
                          ? 'border-2 border-purple-500 bg-purple-950/30 shadow-lg'
                          : 'glass glass-hover text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white">{addr.fullName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10">
                          {addr.addressType || 'HOME'}
                        </span>
                      </div>
                      <p className="text-slate-300 line-clamp-2">{addr.street}, {addr.city}</p>
                      <p className="text-[11px] text-slate-400 font-mono">Ph: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Structured Address Editable Form Fields */}
            <div className="space-y-4 pt-2">
              
              {/* Recipient Full Name + Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    Recipient Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={addressForm.fullName}
                    onChange={handleAddressFieldChange}
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
                    value={addressForm.phone}
                    onChange={handleAddressFieldChange}
                    placeholder="e.g. +91 98765 43210"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Flat / House No / Street Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Street Address / Flat / House No <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={addressForm.street}
                  onChange={handleAddressFieldChange}
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
                  value={addressForm.landmark}
                  onChange={handleAddressFieldChange}
                  placeholder="e.g. Opposite Apollo Hospital / Near Metro Pillar 145"
                  className={inputClass}
                />
              </div>

              {/* District & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    City / Town <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressFieldChange}
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
                    value={addressForm.district}
                    onChange={handleAddressFieldChange}
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
                    value={addressForm.state}
                    onChange={handleAddressFieldChange}
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
                    value={addressForm.postalCode}
                    onChange={handleAddressFieldChange}
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
                    value={addressForm.country}
                    onChange={handleAddressFieldChange}
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
                    value={addressForm.addressType}
                    onChange={handleAddressFieldChange}
                    className={inputClass}
                  >
                    <option value="HOME">🏠 Home (All-day delivery)</option>
                    <option value="WORK">🏢 Work / Office (10 AM - 6 PM)</option>
                    <option value="OTHER">📍 Other Destination</option>
                  </select>
                </div>
              </div>

              {/* Save Address Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveToAccount}
                    onChange={(e) => setSaveToAccount(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Save this delivery address to my address book for next orders</span>
                </label>
              </div>
            </div>
          </div>

          {/* ════════════ 2. PAYMENT OPTIONS ════════════ */}
          <div className="rounded-3xl p-6 sm:p-8 glass-card space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
              <div className="w-8 h-8 rounded-xl bg-cyan-600/30 text-cyan-300 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">2. Payment Method</h3>
                <span className="text-[11px] text-slate-400 font-medium">Select your preferred transaction mode</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-4 rounded-2xl text-left flex items-start gap-3.5 transition-all ${
                      isSelected
                        ? 'border-2 border-purple-500 bg-purple-950/40 shadow-lg'
                        : 'glass glass-hover text-slate-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${isSelected ? 'bg-purple-600 text-white' : 'glass text-slate-300'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">{opt.label}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{opt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl text-xs font-bold flex items-center gap-3"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
              }}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* ════════════ RIGHT COL: ORDER SUMMARY ════════════ */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-3xl p-6 glass-card space-y-6 sticky top-24">
            <h3 className="text-base font-black text-white">Order Summary ({items.length} items)</h3>

            {/* Quick item list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded-xl bg-slate-900 border border-white/10 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{item.productName}</p>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black text-white">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-white">
                  {shipping === 0 ? <strong className="text-emerald-400 font-bold">FREE</strong> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Special Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/10 flex justify-between text-base font-black text-white">
                <span>Total Due</span>
                <span className="gradient-text text-lg font-black">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl text-sm font-black text-white btn-primary shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order (${grandTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-1 text-center text-xs text-slate-400">
              <p className="flex items-center justify-center gap-1.5 font-semibold text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Secure & Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
