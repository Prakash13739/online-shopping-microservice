import React, { useState, useEffect } from 'react';
import { X, Save, ImageIcon, Loader2, Sparkles, AlertTriangle, CheckCircle2, Boxes } from 'lucide-react';
import { productApi, inventoryApi } from '../api/api';

const IMAGE_PRESETS = [
  { name: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
  { name: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500' },
  { name: 'Smartphone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500' },
  { name: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
  { name: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
  { name: 'Coffee Maker', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500' },
  { name: 'Perfume', url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500' },
  { name: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500' },
];

export default function ProductEditModal({
  isOpen,
  onClose,
  product = null, // null for 'add', product object for 'edit'
  onSaved, // callback on success
}) {
  const isEditing = Boolean(product && product.id);

  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    discountPrice: '',
    categoryId: '1',
    imageUrl: '',
    sku: '',
    status: 'ACTIVE',
    rating: '4.8',
    reviewCount: '120',
    stockQuantity: '100',
  });

  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    productApi.getCategories().then((res) => {
      if (res?.data) setCategories(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (product) {
      // Fetch current inventory if available
      inventoryApi.getByProductId(product.id).then((invRes) => {
        const qty = invRes?.data?.quantityAvailable ?? 100;
        setForm({
          name: product.name || '',
          brand: product.brand || '',
          description: product.description || '',
          price: product.price ? product.price.toString() : '',
          discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
          categoryId: product.categoryId ? product.categoryId.toString() : '1',
          imageUrl: product.imageUrl || '',
          sku: product.sku || '',
          status: product.status || 'ACTIVE',
          rating: product.rating ? product.rating.toString() : '4.8',
          reviewCount: product.reviewCount ? product.reviewCount.toString() : '120',
          stockQuantity: qty.toString(),
        });
      }).catch(() => {
        setForm({
          name: product.name || '',
          brand: product.brand || '',
          description: product.description || '',
          price: product.price ? product.price.toString() : '',
          discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
          categoryId: product.categoryId ? product.categoryId.toString() : '1',
          imageUrl: product.imageUrl || '',
          sku: product.sku || '',
          status: product.status || 'ACTIVE',
          rating: product.rating ? product.rating.toString() : '4.8',
          reviewCount: product.reviewCount ? product.reviewCount.toString() : '120',
          stockQuantity: '100',
        });
      });
    } else {
      setForm({
        name: '',
        brand: '',
        description: '',
        price: '',
        discountPrice: '',
        categoryId: '1',
        imageUrl: IMAGE_PRESETS[0].url,
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        status: 'ACTIVE',
        rating: '4.9',
        reviewCount: '50',
        stockQuantity: '150',
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPreset = (url) => {
    setForm(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.categoryId) {
      setError('Please provide Product Name, Price, and Category.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const productPayload = {
        name: form.name.trim(),
        brand: form.brand.trim() || 'NexaMart',
        description: form.description.trim(),
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        categoryId: parseInt(form.categoryId, 10),
        imageUrl: form.imageUrl.trim() || IMAGE_PRESETS[0].url,
        sku: form.sku.trim() || `SKU-${Date.now()}`,
        status: form.status,
        rating: parseFloat(form.rating) || 4.8,
        reviewCount: parseInt(form.reviewCount, 10) || 120,
        slug: form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };

      const stockQty = parseInt(form.stockQuantity, 10) || 100;

      let savedProduct;
      if (isEditing) {
        // Update product in MySQL
        const res = await productApi.updateProduct(product.id, productPayload);
        savedProduct = res?.data;

        // Update inventory in MySQL
        try {
          await inventoryApi.updateStock(product.id, {
            quantityAvailable: stockQty,
            reorderLevel: 10,
          });
        } catch (_) {}
      } else {
        // Create product in MySQL
        const res = await productApi.createProduct(productPayload);
        savedProduct = res?.data;

        // Create inventory in MySQL
        if (savedProduct?.id) {
          try {
            await inventoryApi.createInventory({
              productId: savedProduct.id,
              sku: productPayload.sku,
              quantityAvailable: stockQty,
              quantityReserved: 0,
              reorderLevel: 10,
              status: stockQty > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
            });
          } catch (_) {}
        }
      }

      if (onSaved) onSaved(savedProduct);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to save product in database.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-4xl glass-card p-6 sm:p-8 space-y-6"
        style={{
          background: 'rgba(15,15,35,0.96)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 50px rgba(124,58,237,0.25)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              {isEditing ? `Edit Product: ${product.name}` : '➕ Add New Product to Catalog'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit all product details, pricing, inventory stock, and visuals. Updates MySQL database in real time.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl glass glass-hover text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2"
            style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Product Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Product Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. NexaSound Pro Wireless ANC"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Brand Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. NexaAudio / Apple / Nike"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Product Description
            </label>
            <textarea
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Key product features, material, battery life, specifications..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Pricing, Discount & Stock Inventory */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Regular Price ($) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 299.99"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Discount Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                placeholder="e.g. 249.99 (Optional)"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <Boxes className="w-3.5 h-3.5 text-purple-400" /> Stock Quantity (Inventory)
              </label>
              <input
                type="number"
                min="0"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                placeholder="e.g. 150"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Category, SKU, and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className={inputClass}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                SKU / Model Number
              </label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. ELEC-NEX-055"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Catalog Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="ACTIVE">ACTIVE (Visible in Store)</option>
                <option value="INACTIVE">INACTIVE (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Rating & Review Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Customer Rating (1.0 - 5.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="1.0"
                max="5.0"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="e.g. 4.9"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Review Count
              </label>
              <input
                type="number"
                min="0"
                name="reviewCount"
                value={form.reviewCount}
                onChange={handleChange}
                placeholder="e.g. 340"
                className={inputClass}
              />
            </div>
          </div>

          {/* Image URL with live preview and presets */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Product Image URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-xxx?w=500"
                className={`${inputClass} flex-1`}
                required
              />
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-2xl border border-white/20 flex-shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center glass flex-shrink-0">
                  <ImageIcon className="w-6 h-6 text-slate-500" />
                </div>
              )}
            </div>

            {/* Image Preset Quick Pick */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400">Quick High-Res Image Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {IMAGE_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectPreset(p.url)}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-300 glass glass-hover hover:text-white"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold glass btn-glass"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 rounded-2xl text-xs font-black text-white btn-primary flex items-center gap-2 shadow-xl disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Product Changes' : 'Add to Catalog (Live)'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
