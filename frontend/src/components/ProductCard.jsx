import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative rounded-3xl overflow-hidden glass-card transition-all duration-300 flex flex-col justify-between hover:scale-[1.02]">
      
      {/* Product Image Container */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-900/50">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
          loading="lazy"
        />

        {/* Ambient Gradient Overlay on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-black text-white rounded-full shadow-lg"
            style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)' }}>
            -{discountPercent}% OFF
          </span>
        )}

        {/* Quick View Hover Icon */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full shadow-lg hover:bg-white hover:text-slate-950 transition-all transform translate-y-2 group-hover:translate-y-0">
            <Eye className="w-5 h-5" />
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          
          {/* Brand & Category */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-purple-400">{product.brand}</span>
            {product.categoryName && (
              <span className="truncate max-w-[120px] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-300 glass">
                {product.categoryName}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-black text-amber-300">{product.rating || 4.8}</span>
            <span className="text-[11px] text-slate-400">({product.reviewCount || 120})</span>
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-white">
                {formatINR(hasDiscount ? product.discountPrice : product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={adding}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
              added
                ? 'bg-emerald-500 text-white'
                : 'btn-primary'
            }`}
            title="Add to Cart"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
