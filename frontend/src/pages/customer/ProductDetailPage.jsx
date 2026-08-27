import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw, Boxes, ChevronRight, Check } from 'lucide-react';
import { productApi, inventoryApi } from '../../api/api';
import { useCart } from '../../context/CartContext';
import StatusBadge from '../../components/StatusBadge';

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

  useEffect(() => {
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
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <Link to="/products" className="mt-4 inline-block px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const availableQty = inventory ? inventory.quantityAvailable : 25;
  const isOutOfStock = availableQty <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-slate-900">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {product.categoryName && (
          <>
            <Link to={`/products?categoryId=${product.categoryId}`} className="hover:text-slate-900">
              {product.categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        
        {/* Left Image View */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 relative group">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {hasDiscount && (
              <span className="absolute top-5 left-5 px-3.5 py-1.5 text-xs font-extrabold text-white bg-rose-600 rounded-full shadow-md">
                SAVE ${Math.round(product.price - product.discountPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
            <span>SKU: {product.sku}</span>
            <span>Category: {product.categoryName || 'General'}</span>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            
            <div className="flex items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
                {product.brand}
              </span>
              <StatusBadge status={inventory?.status || 'IN_STOCK'} />
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Stock Status */}
            <div className="flex flex-wrap items-center gap-5 text-sm pb-5 border-b border-slate-100">
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-amber-900">{product.rating}</span>
                <span className="text-xs text-amber-700">({product.reviewCount} customer reviews)</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                <Boxes className="w-4 h-4 text-slate-700" />
                <span>{availableQty} units currently in stock</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  ${hasDiscount ? product.discountPrice : product.price}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-slate-400 line-through">
                    ${product.price}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-600 font-semibold">
                Free standard delivery on orders over $100
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 rounded-2xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-800 font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(availableQty, quantity + 1))}
                    disabled={quantity >= availableQty}
                    className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-800 font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Total: <strong className="text-slate-900">${((hasDiscount ? product.discountPrice : product.price) * quantity).toFixed(2)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding || isOutOfStock}
                className={`py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20 active:scale-95'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                {added ? 'Added to Cart' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-4 px-6 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-40"
              >
                <Zap className="w-4 h-4 text-amber-400" /> Buy Now
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 pt-3 text-center text-xs text-slate-500">
              <div className="p-3 rounded-2xl bg-slate-50 flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-800">Express Delivery</span>
                <span className="text-[10px]">2-4 Days</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-800">1-Year Warranty</span>
                <span className="text-[10px]">Included</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-800">30-Day Returns</span>
                <span className="text-[10px]">Free return</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
