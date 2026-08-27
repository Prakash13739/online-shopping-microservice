import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, RotateCcw, Plus, Minus, ArrowLeft } from 'lucide-react';
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

  if (items.length === 0 && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Shopping Bag is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven't added any products to your bag yet. Explore our curated collection to start shopping.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold shadow-md transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">Review your items and proceed to secure checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 self-start sm:self-auto"
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
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-5 justify-between"
            >
              {/* Product Thumbnail & Name */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-2xl bg-slate-100 border border-slate-100 flex-shrink-0"
                />
                <div>
                  <Link to={`/product/${item.productId}`} className="font-bold text-sm sm:text-base text-slate-900 hover:text-brand-600 line-clamp-2">
                    {item.productName}
                  </Link>
                  <span className="text-xs text-slate-400 block mt-1">${item.unitPrice} each</span>
                </div>
              </div>

              {/* Quantity Controls & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center border border-slate-300 rounded-2xl bg-slate-50 p-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <span className="text-base font-extrabold text-slate-900 block">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-brand-600 pt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-slate-900">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Special Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between text-slate-900">
                <span className="text-base font-bold">Total</span>
                <span className="text-2xl font-extrabold text-slate-900">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {subtotal < freeShippingThreshold && (
              <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-600">
                Add <strong>${(freeShippingThreshold - subtotal).toFixed(2)}</strong> more to get <strong>Free Shipping</strong>!
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              <p className="flex items-center justify-center gap-1 font-medium text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Guaranteed Safe & Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
