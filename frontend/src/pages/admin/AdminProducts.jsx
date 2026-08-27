import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Package, AlertTriangle, CheckCircle2, ImageIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { productApi, inventoryApi } from '../../api/api';
import AdminSidebar from '../../components/AdminSidebar';

const EMPTY_FORM = {
  name: '',
  brand: '',
  description: '',
  price: '',
  discountPrice: '',
  categoryId: '',
  imageUrl: '',
  sku: '',
  status: 'ACTIVE',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
  const [confirmDelete, setConfirmDelete] = useState(null); // product id

  const PAGE_SIZE = 12;

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.getProducts({ page, size: PAGE_SIZE, search: search || undefined });
      if (res?.data) {
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (e) {
      showToast('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await productApi.getCategories();
      if (res?.data) setCategories(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [page, search]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModal('add');
  };

  const openEdit = (product) => {
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      description: product.description || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      categoryId: product.categoryId || '',
      imageUrl: product.imageUrl || '',
      sku: product.sku || '',
      status: product.status || 'ACTIVE',
    });
    setEditingId(product.id);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      showToast('error', 'Name, Price, and Category are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        categoryId: parseInt(form.categoryId),
        imageUrl: form.imageUrl.trim(),
        sku: form.sku.trim() || `SKU-${Date.now()}`,
        status: form.status,
        slug: form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        rating: 4.5,
        reviewCount: 0,
      };

      if (modal === 'add') {
        const res = await productApi.createProduct(payload);
        if (res?.data) {
          // Auto-create inventory record
          try {
            await inventoryApi.createInventory({
              productId: res.data.id,
              sku: payload.sku,
              quantityAvailable: 100,
              quantityReserved: 0,
              reorderLevel: 10,
              status: 'IN_STOCK',
            });
          } catch (_) { /* inventory creation is best-effort */ }
          showToast('success', `"${payload.name}" added to catalog!`);
        }
      } else {
        await productApi.updateProduct(editingId, payload);
        showToast('success', `"${payload.name}" updated successfully!`);
      }

      closeModal();
      fetchProducts();
    } catch (err) {
      showToast('error', err?.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await productApi.deleteProduct(id);
      showToast('success', 'Product removed from catalog.');
      setConfirmDelete(null);
      fetchProducts();
    } catch (err) {
      showToast('error', 'Could not delete product.');
    } finally {
      setDeleting(null);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all focus:outline-none";

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a1a' }}>
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold transition-all animate-slide-up`}
            style={{
              background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
              backdropFilter: 'blur(20px)',
              color: toast.type === 'success' ? '#6ee7b7' : '#fca5a5',
            }}>
            {toast.type === 'success'
              ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Package className="w-7 h-7" style={{ color: '#a855f7' }} /> Product Catalog
            </h1>
            <p className="text-xs font-medium mt-1" style={{ color: 'rgba(148,163,184,0.7)' }}>
              {products.length} products shown — Add, edit, or remove items. Changes save to MySQL instantly.
            </p>
          </div>

          <button onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black text-white transition-all btn-primary self-start sm:self-auto">
            <Plus className="w-5 h-5" /> Add New Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name, brand, or SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className={`${inputClass} pl-11`}
          />
          <Search className="w-4 h-4 absolute left-4 top-3.5 pointer-events-none" style={{ color: 'rgba(148,163,184,0.5)' }} />
        </div>

        {/* Products Table */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Product', 'Brand', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-xs font-black uppercase tracking-wider"
                      style={{ color: 'rgba(148,163,184,0.5)' }}>{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {[1, 2, 3, 4, 5, 6].map(j => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', width: j === 1 ? '70%' : '50%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-sm font-semibold" style={{ color: 'rgba(148,163,184,0.4)' }}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="transition-all group"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.name}
                            className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                            onError={e => e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'} />
                          <div>
                            <p className="font-bold text-white text-xs line-clamp-1 max-w-[180px]">{p.name}</p>
                            <p className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(148,163,184,0.5)' }}>{p.sku}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold" style={{ color: 'rgba(148,163,184,0.8)' }}>{p.brand}</span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold" style={{ color: 'rgba(148,163,184,0.8)' }}>{p.categoryName}</span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <span className="text-sm font-black text-white">${p.discountPrice || p.price}</span>
                          {p.discountPrice && p.discountPrice < p.price && (
                            <span className="text-[11px] line-through ml-2" style={{ color: 'rgba(148,163,184,0.4)' }}>${p.price}</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${p.status === 'ACTIVE' ? 'badge-in-stock' : 'badge-out-of-stock'}`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p)}
                            className="p-2 rounded-xl text-xs font-bold transition-all"
                            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd' }}
                            title="Edit product">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmDelete(p.id)}
                            className="p-2 rounded-xl text-xs font-bold transition-all"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
                            title="Delete product">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-xs font-semibold" style={{ color: 'rgba(148,163,184,0.5)' }}>
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-xl transition-all disabled:opacity-30 glass glass-hover">
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-xl transition-all disabled:opacity-30 glass glass-hover">
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ══════════════════ Add / Edit Modal ══════════════════ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>

          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-4xl"
            style={{
              background: 'rgba(15,15,35,0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(124,58,237,0.15)',
            }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <h2 className="text-xl font-black text-white">
                  {modal === 'add' ? '➕ Add New Product' : '✏️ Edit Product'}
                </h2>
                <p className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.6)' }}>
                  {modal === 'add' ? 'Fill details and click Save. Product goes live in catalog instantly.' : 'Make changes and click Save to update the catalog.'}
                </p>
              </div>
              <button onClick={closeModal}
                className="p-2 rounded-xl transition-all glass glass-hover text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="px-8 py-6 space-y-5">

              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.7)' }}>
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input name="name" value={form.name} onChange={handleFormChange}
                  placeholder="e.g. NexaPhone Pro 15 Ultra" required
                  className={inputClass} />
              </div>

              {/* Brand + SKU */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.7)' }}>Brand</label>
                  <input name="brand" value={form.brand} onChange={handleFormChange}
                    placeholder="e.g. NexaMobile"
                    className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.7)' }}>SKU (auto-generated if blank)</label>
                  <input name="sku" value={form.sku} onChange={handleFormChange}
                    placeholder="e.g. ELEC-NXP-001"
                    className={inputClass} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.7)' }}>Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange}
                  rows={3} placeholder="Describe the product features and highlights..."
                  className={`${inputClass} resize-none`} />
              </div>

              {/* Price + Discount Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    Price ($) <span className="text-red-400">*</span>
                  </label>
                  <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleFormChange}
                    placeholder="e.g. 999.00" required
                    className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.7)' }}>Discount Price ($)</label>
                  <input name="discountPrice" type="number" step="0.01" min="0" value={form.discountPrice} onChange={handleFormChange}
                    placeholder="e.g. 849.00 (leave blank if none)"
                    className={inputClass} />
                </div>
              </div>

              {/* Category + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select name="categoryId" value={form.categoryId} onChange={handleFormChange} required
                    className={inputClass}>
                    <option value="">— Select Category —</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.7)' }}>Status</label>
                  <select name="status" value={form.status} onChange={handleFormChange}
                    className={inputClass}>
                    <option value="ACTIVE">ACTIVE — Visible in store</option>
                    <option value="INACTIVE">INACTIVE — Hidden from store</option>
                  </select>
                </div>
              </div>

              {/* Image URL + Preview */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.7)' }}>Product Image URL</label>
                <div className="flex gap-3">
                  <input name="imageUrl" value={form.imageUrl} onChange={handleFormChange}
                    placeholder="https://images.unsplash.com/photo-xxx?w=500"
                    className={`${inputClass} flex-1`} />
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="preview"
                      className="w-16 h-16 object-cover rounded-2xl flex-shrink-0"
                      style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                      onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center glass">
                      <ImageIcon className="w-6 h-6" style={{ color: 'rgba(148,163,184,0.3)' }} />
                    </div>
                  )}
                </div>
                <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>
                  Tip: Use <strong>https://images.unsplash.com/photo-[ID]?w=500</strong> for free product images
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button type="button" onClick={closeModal}
                  className="px-5 py-3 rounded-2xl text-sm font-bold transition-all glass btn-glass">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-8 py-3 rounded-2xl text-sm font-black text-white transition-all btn-primary flex items-center gap-2 disabled:opacity-60">
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving to Database...</>
                    : <><Save className="w-4 h-4" /> {modal === 'add' ? 'Add to Catalog' : 'Save Changes'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════ Delete Confirm Dialog ══════════════════ */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm rounded-4xl p-8 space-y-5 text-center"
            style={{
              background: 'rgba(15,15,35,0.97)',
              border: '1px solid rgba(239,68,68,0.3)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(239,68,68,0.1)',
            }}>
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <Trash2 className="w-7 h-7" style={{ color: '#fca5a5' }} />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Remove Product?</h3>
              <p className="text-xs mt-2" style={{ color: 'rgba(148,163,184,0.6)' }}>
                This will permanently delete the product from the catalog and MySQL database. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold glass btn-glass">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={!!deleting}
                className="flex-1 py-3 rounded-2xl text-sm font-black text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 20px rgba(239,68,68,0.3)' }}>
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
