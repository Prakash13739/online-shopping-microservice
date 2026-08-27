import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, ChevronLeft, ChevronRight, X, Plus, Sparkles, Edit2 } from 'lucide-react';
import { productApi } from '../../api/api';
import ProductCard from '../../components/ProductCard';
import ProductEditModal from '../../components/ProductEditModal';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters state
  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  const selectedCategory = searchParams.get('categoryId') || '';
  const searchKeyword = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sortDir') || 'desc';
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const fetchCategories = async () => {
    try {
      const res = await productApi.getCategories();
      if (res?.data) setCategories(res.data);
    } catch (_) {}
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        size: 12,
        categoryId: selectedCategory || undefined,
        search: searchKeyword || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy,
        sortDir,
      };

      const res = await productApi.getProducts(params);
      if (res?.data) {
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, searchKeyword, sortBy, sortDir, searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === undefined || value === null) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '0');
    setSearchParams(next);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('minPrice', minPrice); else next.delete('minPrice');
    if (maxPrice) next.set('maxPrice', maxPrice); else next.delete('maxPrice');
    next.set('page', '0');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams(new URLSearchParams());
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedProduct(p);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {selectedCategory
              ? `${categories.find((c) => c.id.toString() === selectedCategory)?.name || 'Category'} Collection`
              : searchKeyword
              ? `Search Results for "${searchKeyword}"`
              : 'Explore All Products'}
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Showing <strong className="text-white">{products.length}</strong> of <strong className="text-white">{totalElements}</strong> curated items
          </p>
        </div>

        {/* Action Controls: Add Product + Sort By */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* ➕ Add Product Button right in Catalog Header */}
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black text-white btn-primary shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Product to Catalog
          </button>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400 whitespace-nowrap hidden sm:inline">Sort By:</label>
            <select
              value={`${sortBy}_${sortDir}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split('_');
                const next = new URLSearchParams(searchParams);
                next.set('sortBy', field);
                next.set('sortDir', dir);
                setSearchParams(next);
              }}
              className="text-xs font-bold rounded-2xl px-4 py-2.5 glass focus:outline-none"
            >
              <option value="createdAt_desc">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl p-6 glass-card space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-purple-400" /> Filter Options
              </h3>
              {(selectedCategory || searchKeyword || searchParams.get('minPrice') || searchParams.get('maxPrice')) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Categories</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam('categoryId', '')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    !selectedCategory
                      ? 'btn-primary'
                      : 'text-slate-400 hover:text-white glass glass-hover'
                  }`}
                >
                  All Categories ({totalElements})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateParam('categoryId', c.id.toString())}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                      selectedCategory === c.id.toString()
                        ? 'btn-primary'
                        : 'text-slate-400 hover:text-white glass glass-hover'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-70">({c.productCount || 4})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Price Range ($)</h4>
              <form onSubmit={handlePriceApply} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Min ($)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Max ($)</label>
                    <input
                      type="number"
                      placeholder="2000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl font-bold"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-black text-white transition-all btn-primary shadow-md"
                >
                  Apply Filter
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Products Grid */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl p-5 glass-card animate-pulse space-y-4">
                  <div className="aspect-square bg-white/5 rounded-2xl" />
                  <div className="h-4 bg-white/10 rounded-full w-3/4" />
                  <div className="h-4 bg-white/10 rounded-full w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 rounded-4xl glass-card p-8 space-y-4">
              <Search className="w-14 h-14 text-slate-500 mx-auto" />
              <h3 className="text-xl font-black text-white">No products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                Try adjusting your price range, search query, or add a new custom product.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold glass btn-glass"
                >
                  Clear Filters
                </button>
                <button
                  onClick={handleOpenAdd}
                  className="px-6 py-2.5 rounded-xl text-xs font-black text-white btn-primary inline-block"
                >
                  ➕ Add New Product
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="relative group">
                  <ProductCard product={p} />
                  
                  {/* Quick Edit Overlay Button */}
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="absolute top-3 right-3 p-2 rounded-xl text-xs font-bold glass glass-hover text-purple-300 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    title="Edit Product"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <span className="text-xs text-slate-400 font-bold">
                Page {currentPage + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 0}
                  onClick={() => updateParam('page', (currentPage - 1).toString())}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-white glass glass-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => updateParam('page', idx.toString())}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                      currentPage === idx
                        ? 'btn-primary shadow-lg'
                        : 'text-slate-400 hover:text-white glass glass-hover'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => updateParam('page', (currentPage + 1).toString())}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-white glass glass-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ➕ / ✏️ Live Product Add & Edit Modal */}
      <ProductEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSaved={() => {
          fetchProducts();
          fetchCategories();
        }}
      />
    </div>
  );
}
