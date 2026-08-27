import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, ShieldCheck, ArrowRight, Loader2, CheckCircle2, AlertTriangle, Smartphone, Building2, Banknote } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderApi } from '../../api/api';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield, OR 97477');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const items = cart.items || [];
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 15;
  const discount = subtotal > 200 ? 20 : 0;
  const grandTotal = subtotal + shipping - discount;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id || 2,
        shippingAddress: `${user?.name || 'Customer'}, ${address}`,
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
        <h2 className="text-2xl font-bold text-slate-900">Your bag is empty</h2>
        <Link to="/products" className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold inline-block">
          Explore Products
        </Link>
      </div>
    );
  }

  const paymentOptions = [
    { id: 'UPI', label: 'UPI / Instant Pay', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'CARD', label: 'Credit or Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
    { id: 'NET_BANKING', label: 'Net Banking', icon: Building2, desc: 'All major banks supported' },
    { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when delivered' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">Please confirm your shipping address and payment method</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Sections (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Shipping Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-900" /> 1. Delivery Address
            </h3>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">Street & Destination Details</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Full Street address, Apartment, City, State, ZIP code"
                required
              />
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-900" /> 2. Payment Options
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${isSelected ? 'bg-white/10 text-white' : 'bg-white text-slate-800 shadow-sm'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold block">{opt.label}</span>
                      <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{opt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right Col: Order Summary & Place Order */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-slate-900">Bag Summary ({items.length} items)</h3>

            {/* Quick item list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded-xl bg-slate-100 border border-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.productName}</p>
                    <p className="text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-slate-900">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Special Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Due</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>Complete Purchase (${grandTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              <p className="flex items-center justify-center gap-1 font-medium text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> SSL Encrypted & Protected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
