import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star, ShoppingCart, Zap, ShieldCheck, Truck, RotateCcw,
  Boxes, ChevronRight, Check, Edit2, Sparkles
} from 'lucide-react';
import { productApi, inventoryApi } from '../../api/api';
import { useCart } from '../../context/CartContext';
import StatusBadge from '../../components/StatusBadge';
import ProductEditModal from '../../components/ProductEditModal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const [prodRes, invRes] = await Promise.all([
        productApi.getProductById(id),
        inventoryApi.getByProductId(id).catch(() => null),
      ]);

      if (prodRes?.data) setProduct(prodRes.data);
      if (invRes?.data) setInventory(invRes.data);
    } catch (err) {
      console.error('Failed to load product details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-400">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <Link to="/products" className="px-5 py-2.5 btn-primary text-white text-xs font-bold rounded-2xl inline-block">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const availableQty = inventory ? inventory.quantityAvailable : 100;
  const isOutOfStock = availableQty <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header / Breadcrumb + Quick Edit CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {product.categoryName && (
            <>
              <Link to={`/products?categoryId=${product.categoryId}`} className="hover:text-white transition-colors">
                {product.categoryName}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="text-white truncate max-w-xs">{product.name}</span>
        </nav>

        {/* ✏️ Direct Edit Button right in the UI */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black text-white btn-primary shadow-lg self-start sm:self-auto hover:scale-105 active:scale-95 transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit Product Details (Live in UI)
        </button>
      </div>

      {/* Main Product Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 rounded-4xl p-6 sm:p-10 glass-card">
        
        {/* Left: Image Showcase */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden glass relative group">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {hasDiscount && (
              <span className="absolute top-5 left-5 px-4 py-1.5 text-xs font-black text-white rounded-full shadow-xl"
                style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)' }}>
                SAVE ${Math.round(product.price - product.discountPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
            <span>SKU: {product.sku || 'ELEC-001'}</span>
            <span>Category: {product.categoryName || 'General'}</span>
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            
            <div className="flex items-center justify-between gap-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-purple-300 glass">
                {product.brand}
              </span>
              <StatusBadge status={inventory?.status || (availableQty > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK')} />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Real-time Stock */}
            <div className="flex flex-wrap items-center gap-5 text-sm pb-5 border-b border-white/10">
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-xl glass text-amber-300">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-black">{product.rating || 4.8}</span>
                <span className="text-xs text-slate-400">({product.reviewCount || 120} reviews)</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <Boxes className="w-4 h-4 text-emerald-400" />
                <span>{availableQty} units available in stock</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  ${hasDiscount ? product.discountPrice : product.price}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-slate-400 line-through">
                    ${product.price}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-400 font-semibold">
                Free express shipping on all orders over $100
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Quantity Stepper */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-2xl glass p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-xl glass flex items-center justify-center text-white font-bold hover:bg-white/10 disabled:opacity-30 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-black text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(availableQty, quantity + 1))}
                    disabled={quantity >= availableQty}
                    className="w-8 h-8 rounded-xl glass flex items-center justify-center text-white font-bold hover:bg-white/10 disabled:opacity-30 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  Total: <strong className="text-white font-black">${((hasDiscount ? product.discountPrice : product.price) * quantity).toFixed(2)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding || isOutOfStock}
                className={`py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : isOutOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                {added ? 'Added to Cart' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-4 px-6 rounded-2xl font-black text-sm bg-white text-slate-950 hover:bg-slate-100 flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-30"
              >
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Buy Now
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-3 text-center text-xs">
              <div className="p-3 rounded-2xl glass flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white">Express Delivery</span>
                <span className="text-[10px] text-slate-400">2-4 Days</span>
              </div>
              <div className="p-3 rounded-2xl glass flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">1-Year Warranty</span>
                <span className="text-[10px] text-slate-400">Covered</span>
              </div>
              <div className="p-3 rounded-2xl glass flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">30-Day Returns</span>
                <span className="text-[10px] text-slate-400">Hassle-free</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✏️ Reusable Live Product Edit Modal */}
      <ProductEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
        onSaved={(updated) => {
          setProduct(updated);
          fetchDetails();
        }}
      />
    </div>
  );
}
