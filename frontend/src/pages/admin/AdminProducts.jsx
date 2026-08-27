import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Boxes, Loader2 } from 'lucide-react';
import { productApi } from '../../api/api';
import AdminSidebar from '../../components/AdminSidebar';
import ProductEditModal from '../../components/ProductEditModal';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

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
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (e) {
      showToast('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedProduct(p);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await productApi.deleteProduct(id);
      showToast('success', 'Product removed from catalog and MySQL database.');
      setConfirmDelete(null);
      fetchProducts();
    } catch (err) {
      showToast('error', 'Could not delete product.');
    } finally {
      setDeleting(null);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all focus:outline-none";

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a1a' }}>
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold animate-slide-up`}
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
            <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-3">
              <Package className="w-8 h-8 text-purple-400" /> Products Management
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Total {totalElements} products in catalog. Add, edit, or delete products live in MySQL.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-black text-white btn-primary shadow-xl hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> ➕ Add New Product
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by product name, brand, or SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className={`${inputClass} pl-11`}
          />
          <Search className="w-4 h-4 absolute left-4 top-3.5 pointer-events-none text-slate-400" />
        </div>

        {/* Products Table */}
        <div className="rounded-4xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-black uppercase tracking-wider text-slate-400">
                  {['Product & SKU', 'Brand', 'Category', 'Price ($)', 'Rating', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5, 6, 7].map(j => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 rounded-lg bg-white/5 animate-pulse" style={{ width: j === 1 ? '70%' : '50%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-sm font-semibold text-slate-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-xl border border-white/10 flex-shrink-0"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'; }}
                          />
                          <div>
                            <p className="font-black text-white text-xs line-clamp-1 max-w-[200px]">{p.name}</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{p.sku || 'SKU-001'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-300">{p.brand}</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full glass text-purple-300">
                          {p.categoryName || 'General'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <span className="text-sm font-black text-white">${p.discountPrice || p.price}</span>
                          {p.discountPrice && p.discountPrice < p.price && (
                            <span className="text-[11px] line-through text-slate-500 ml-2">${p.price}</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-amber-300">★ {p.rating || 4.8}</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${p.status === 'ACTIVE' ? 'badge-in-stock' : 'badge-out-of-stock'}`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 rounded-xl text-xs font-bold glass glass-hover text-purple-300"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(p.id)}
                            className="p-2 rounded-xl text-xs font-bold glass glass-hover text-rose-400"
                            title="Delete Product"
                          >
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <span className="text-xs font-bold text-slate-400">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-xl transition-all disabled:opacity-30 glass glass-hover text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-xl transition-all disabled:opacity-30 glass glass-hover text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ➕ / ✏️ Full Product Edit & Add Modal */}
      <ProductEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSaved={() => {
          showToast('success', selectedProduct ? 'Product details updated!' : 'New product added to catalog!');
          fetchProducts();
        }}
      />

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
        >
          <div className="w-full max-w-sm rounded-4xl p-8 space-y-5 text-center glass-card"
            style={{ background: 'rgba(15,15,35,0.98)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-rose-500/10 border border-rose-500/30">
              <Trash2 className="w-7 h-7 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Delete Product?</h3>
              <p className="text-xs mt-2 text-slate-400">
                This will permanently delete this product and its inventory from the MySQL database.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-2xl text-xs font-bold glass btn-glass"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={!!deleting}
                className="flex-1 py-3 rounded-2xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-2xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
