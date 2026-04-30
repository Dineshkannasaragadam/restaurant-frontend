/**
 * MenuPage — Full menu with search, category filter, type filter
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useProducts';
import ProductCard from '../components/menu/ProductCard';

const typeFilters = [
  { value: '', label: 'All', icon: '🍽️' },
  { value: 'veg', label: 'Veg', icon: '🥦' },
  { value: 'non-veg', label: 'Non-Veg', icon: '🍗' },
  { value: 'vegan', label: 'Vegan', icon: '🌿' },
  { value: 'egg', label: 'Egg', icon: '🥚' },
];

const sortOptions = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-rating.average', label: 'Top Rated' },
  { value: '-totalOrders', label: 'Most Popular' },
];

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categorySlug = searchParams.get('category') || '';
  const type = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = parseInt(searchParams.get('page')) || 1;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { products, isLoading, meta } = useProducts({
    ...(categorySlug && { category: categorySlug }),
    ...(type && { type }),
    ...(debouncedSearch && { search: debouncedSearch }),
    sort,
    page,
    limit: 12,
  });

  const { categories } = useCategories();

  const updateFilter = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete('page');
      return next;
    });
  };

  return (
    <>
      <Helmet>
        <title>Menu — Athidhi Family Restaurant</title>
        <meta name="description" content="Explore our full menu with veg, non-veg, and drinks options." />
      </Helmet>

      <div className="pt-20">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-gray-950 to-gray-900 text-white py-16">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="section-title text-white mb-2">Our Menu</h1>
              <p className="text-gray-400">Fresh, handcrafted dishes made with premium ingredients</p>
            </motion.div>
          </div>
        </div>

        <div className="page-container py-8">
          {/* Search + Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes, ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 pr-10"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input-field pr-10 appearance-none min-w-[180px] cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="md:w-56 flex-shrink-0">
              {/* Type Filter */}
              <div className="card p-4 mb-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Food Type</h3>
                <div className="space-y-1">
                  {typeFilters.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => updateFilter('type', t.value)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        type === t.value ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="card p-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Category</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      !categorySlug ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    🍽️ All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateFilter('category', cat.slug)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                        categorySlug === cat.slug ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.icon || '🍴'} {cat.name}
                      {cat.productCount > 0 && (
                        <span className="ml-auto text-xs text-gray-400">{cat.productCount}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Active filters */}
              {(type || categorySlug || debouncedSearch) && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-sm text-gray-500">Filters:</span>
                  {debouncedSearch && (
                    <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-3 py-1 rounded-full font-medium">
                      Search: "{debouncedSearch}"
                      <button onClick={() => { setSearch(''); setDebouncedSearch(''); }}><X size={12} /></button>
                    </span>
                  )}
                  {type && (
                    <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-3 py-1 rounded-full font-medium">
                      Type: {type}
                      <button onClick={() => updateFilter('type', '')}><X size={12} /></button>
                    </span>
                  )}
                  {categorySlug && (
                    <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-3 py-1 rounded-full font-medium">
                      Category: {categories.find((c) => c.slug === categorySlug)?.name || categorySlug}
                      <button onClick={() => updateFilter('category', '')}><X size={12} /></button>
                    </span>
                  )}
                </div>
              )}

              {/* Result count */}
              <p className="text-sm text-gray-500 mb-4">
                {isLoading ? 'Loading...' : `${meta.total} items found`}
              </p>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(9).fill(0).map((_, i) => (
                    <div key={i} className="loading-skeleton h-72 rounded-2xl" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="font-display font-bold text-xl text-gray-900 mb-2">No dishes found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search term</p>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Pagination */}
              {meta.pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilter('page', p.toString())}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                        page === p ? 'bg-brand-600 text-white shadow-brand' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
