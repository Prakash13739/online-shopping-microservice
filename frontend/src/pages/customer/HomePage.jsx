import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Zap, ShieldCheck, Truck, RotateCcw, Star, ChevronRight, Gem } from 'lucide-react';
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
      <section className="relative overflow-hidden rounded-4xl glass-card text-white p-8 sm:p-14 lg:p-20 border border-white/10 shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-6"
        style={{
          background: 'linear-gradient(135deg, rgba(15,15,35,0.9), rgba(10,10,26,0.95))',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 50px rgba(124,58,237,0.15)',
        }}>
        
        {/* Ambient Gradient Glows */}
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/15 text-slate-200 text-xs font-bold">
            <Gem className="w-3.5 h-3.5 text-purple-400" /> NexaMart Luxury Collection 2026
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Curated Essentials. <br />
            <span className="gradient-text">
              Elevated Living.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg font-medium">
            Discover precision-engineered electronics, luxury fashion apparel, smart home systems, and lifestyle essentials.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm text-white btn-primary shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Shop All Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products?categoryId=1"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm text-white glass glass-hover transition-all"
            >
              Explore Electronics
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Featured Departments</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Browse our curated collection of shopping categories</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
          >
            All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="group p-4 rounded-3xl glass-card hover:border-purple-500/40 hover:scale-105 transition-all text-center flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-slate-900 p-0.5 border border-white/15 group-hover:scale-110 transition-transform shadow-md">
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {cat.productCount || 4} Items
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Top Rated Products</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Customer favorites and bestselling items in stock</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
          >
            View All ({featuredProducts.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl p-5 glass-card animate-pulse space-y-4">
                <div className="aspect-square bg-white/5 rounded-2xl" />
                <div className="h-4 bg-white/10 rounded-full w-3/4" />
                <div className="h-4 bg-white/10 rounded-full w-1/2" />
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
        <div className="rounded-4xl p-8 sm:p-12 glass-card text-white border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.15))' }}>
          <div className="space-y-3 max-w-lg text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-purple-300">Seasonal Privilege</span>
            <h3 className="text-2xl sm:text-4xl font-black text-white">Save Up to 20% on Flagship Electronics</h3>
            <p className="text-xs text-slate-300 font-medium">
              Upgrade your workstation, audio gear, and wearables with exclusive deals on select NexaMart models.
            </p>
          </div>
          <Link
            to="/products?categoryId=1"
            className="px-8 py-4 rounded-2xl text-white font-black text-sm btn-primary shadow-xl hover:scale-105 active:scale-95 transition-all flex-shrink-0"
          >
            Explore Deals <ArrowRight className="w-4 h-4 inline ml-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
