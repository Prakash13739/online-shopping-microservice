import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Truck, RotateCcw, Plus, Minus, ArrowLeft, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const items = cart.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const freeShippingThreshold = 100;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const discount = subtotal > 200 ? 20 : 0;
  const grandTotal = subtotal + shipping - discount;

  // Currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-xl glass"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))' }}>
          <ShoppingCart className="w-12 h-12 text-purple-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Your Shopping Bag is Empty</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">
            You haven't added any products to your cart yet. Explore our curated collection to start shopping.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-black text-white btn-primary shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Review your {cart.totalItems || items.length} selected items and proceed to secure checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-5 sm:p-6 glass-card flex flex-col sm:flex-row items-center gap-5 justify-between hover:border-purple-500/30 transition-all"
            >
              {/* Product Thumbnail & Name */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-2xl bg-slate-900 border border-white/10 flex-shrink-0"
                />
                <div>
                  <Link
                    to={`/product/${item.productId}`}
                    className="font-bold text-sm sm:text-base text-white hover:text-purple-300 transition-colors line-clamp-2"
                  >
                    {item.productName}
                  </Link>
                  <span className="text-xs text-slate-400 block mt-1 font-semibold">
                    {formatCurrency(item.unitPrice)} each
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <div className="flex items-center rounded-2xl glass p-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-black text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="text-base sm:text-lg font-black text-white block">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white pt-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-3xl p-6 glass-card space-y-6 sticky top-24">
            <h3 className="text-base font-black text-white">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Estimated Shipping</span>
                <span className="font-bold text-white">
                  {shipping === 0 ? <strong className="text-emerald-400 font-black">FREE</strong> : formatCurrency(shipping)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>Special Promo Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex items-baseline justify-between text-white">
                <span className="text-base font-bold">Total Amount</span>
                <span className="text-2xl font-black gradient-text">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {subtotal < freeShippingThreshold && (
              <div className="p-3.5 rounded-2xl glass text-xs text-slate-300 font-medium">
                Add <strong className="text-white">{formatCurrency(freeShippingThreshold - subtotal)}</strong> more to unlock <strong className="text-emerald-400">Free Express Shipping</strong>!
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl text-sm font-black text-white btn-primary flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-1 text-center text-xs text-slate-400">
              <p className="flex items-center justify-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Guaranteed Safe & Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
