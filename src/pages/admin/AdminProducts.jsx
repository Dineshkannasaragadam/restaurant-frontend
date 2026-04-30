import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Search, Upload, X, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useProducts';
import { productAPI } from '../../services/api';

function ProductModal({ product, categories, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category?._id || product?.category || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    type: product?.type || 'veg',
    spiceLevel: product?.spiceLevel || 'none',
    preparationTime: product?.preparationTime || 20,
    isAvailable: product?.isAvailable ?? true,
    isFeatured: product?.isFeatured ?? false,
    isPopular: product?.isPopular ?? false,
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.category || !form.price) {
      toast.error('Please fill in required fields'); return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append('images', img));

      if (isEdit) { await productAPI.update(product._id, fd); toast.success('Product updated!'); }
      else { await productAPI.create(fd); toast.success('Product created!'); }

      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scroll"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            {/* Existing images */}
            {isEdit && product.images?.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {product.images.map((img, i) => (
                  <div key={i} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 relative group">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={async () => {
                        try { await productAPI.deleteImage(product._id, img._id); onSaved(); toast.success('Image deleted'); }
                        catch (e) { toast.error('Delete failed'); }
                      }}
                      className="absolute inset-0 bg-red-500/70 hidden group-hover:flex items-center justify-center text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* New previews */}
            {previews.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {previews.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setImages((p) => p.filter((_, j) => j !== i)); setPreviews((p) => p.filter((_, j) => j !== i)); }}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 w-full flex items-center justify-center gap-2 text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors text-sm">
              <ImagePlus size={18} /> Add Images
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Butter Chicken" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea rows={3} className="input-field resize-none" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe the dish..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type *</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                {['veg', 'non-veg', 'vegan', 'egg'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
              <input type="number" min="0" className="input-field" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="299" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Price (₹)</label>
              <input type="number" min="0" className="input-field" value={form.discountPrice} onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))} placeholder="249" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Spice Level</label>
              <select className="input-field" value={form.spiceLevel} onChange={(e) => setForm((f) => ({ ...f, spiceLevel: e.target.value }))}>
                {['none', 'mild', 'medium', 'hot', 'extra-hot'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prep Time (min)</label>
              <input type="number" min="5" className="input-field" value={form.preparationTime} onChange={(e) => setForm((f) => ({ ...f, preparationTime: e.target.value }))} />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'isAvailable', label: 'Available' },
              { key: 'isFeatured', label: 'Featured' },
              { key: 'isPopular', label: 'Popular' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                  className={`w-10 h-5.5 rounded-full relative transition-colors cursor-pointer ${form[key] ? 'bg-brand-600' : 'bg-gray-200'}`}
                  style={{ height: '22px' }}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : null}
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | 'create' | product object
  const { products, isLoading, meta, refetch } = useProducts({ search, page, limit: 15, active: 'all' });
  const { categories } = useCategories();

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await productAPI.delete(id); toast.success('Product deleted'); refetch(); }
    catch (e) { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{meta.total} total items</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2 self-start">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9 !py-2 text-sm" placeholder="Search products..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array(8).fill(0).map((_, i) => <div key={i} className="loading-skeleton h-64 rounded-2xl" />)
          : products.map((product) => {
            const img = product.images?.find((i) => i.isMain)?.url || product.images?.[0]?.url;
            return (
              <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden group">
                <div className="aspect-video bg-gray-100 overflow-hidden relative">
                  {img
                    ? <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                  }
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">Unavailable</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{product.category?.name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="font-bold text-brand-600">₹{product.discountPrice || product.price}</span>
                      {product.discountPrice && <span className="text-xs text-gray-400 line-through ml-1">₹{product.price}</span>}
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => setModal(product)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(product._id, product.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${p === page ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {p}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <ProductModal
            product={modal === 'create' ? null : modal}
            categories={categories}
            onClose={() => setModal(null)}
            onSaved={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
