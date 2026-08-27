import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Zap, ShieldCheck, Truck, RotateCcw, Star, ChevronRight } from 'lucide-react';
import { productApi } from '../../api/api';
import ProductCard from '../../components/ProductCard';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          productApi.getCategories(),
          productApi.getProducts({ page: 0, size: 8, sortBy: 'rating', sortDir: 'desc' }),
        ]);

        if (catsRes?.data) setCategories(catsRes.data);
        if (prodsRes?.data?.content) {
          setFeaturedProducts(prodsRes.data.content);
          setDeals(prodsRes.data.content.filter(p => p.discountPrice).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 sm:p-14 lg:p-20 border border-slate-900 shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        
        {/* Ambient Gradient Glows */}
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-brand-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> New Season Collection 2026
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Curated Essentials. <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Elevated Living.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg">
            Discover precision-engineered tech, designer apparel, and lifestyle products curated for quality and durability.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-lg active:scale-95"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products?categoryId=1"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition-all"
            >
              Browse Electronics
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Explore our wide selection of departments</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-slate-900 hover:text-brand-600 inline-flex items-center gap-1 transition-colors"
          >
            All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="group p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-slate-100 p-0.5 border border-slate-200 group-hover:scale-105 transition-transform">
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                {cat.productCount || 4} Items
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Top Rated Products</h2>
            <p className="text-sm text-slate-500 mt-1">Customer favorites and bestselling items</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-slate-900 hover:text-brand-600 inline-flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
                <div className="aspect-square bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Offer Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-lg text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Special Promo</span>
            <h3 className="text-2xl sm:text-4xl font-extrabold">Enjoy Up to 20% Off Electronics</h3>
            <p className="text-sm text-slate-400">
              Upgrade your workstation and audio gear with exclusive discounts on select premium models.
            </p>
          </div>
          <Link
            to="/products?categoryId=1"
            className="px-8 py-4 bg-white text-slate-950 font-bold text-sm rounded-2xl hover:bg-slate-100 transition-all shadow-md flex-shrink-0"
          >
            Explore Deals
          </Link>
        </div>
      </section>
    </div>
  );
}
